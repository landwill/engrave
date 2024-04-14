import { SerializedEditorState } from 'lexical'
import { flow, flowResult, makeAutoObservable } from 'mobx'
import { v4 as uuid } from 'uuid'
import { IndexedDB } from '../indexeddx/indexeddb.ts'
import { DocumentDetail, DocumentIdentifier } from '../interfaces.ts'
import { lazyErrorHandler } from '../misc/utils.ts'
import { contextMenuStore } from './ContextMenuStore.ts'

const NEW_FILE_NAME = ''

export class DocumentStore {
  documentIdentifiers: DocumentIdentifier[] = []
  selectedDocument: DocumentDetail | null = null
  _idb: IndexedDB | null = null

  get idb() {
    if (this._idb == null) throw new Error('Tried accessing idb before setting it.')
    return this._idb
  }

  constructor() {
    makeAutoObservable(this, {
      loadDocuments: flow
    })
  }

  setup(idb: IndexedDB) {
    this._idb = idb
    flowResult(this.loadDocuments()).catch(lazyErrorHandler)
  }

  * loadDocuments(): Generator<Promise<DocumentDetail[]>, void, DocumentDetail[]> {
    const documents: DocumentDetail[] = yield this.idb.getDocuments()
    this.documentIdentifiers = documents.map(document => ({
      documentUuid: document.documentUuid,
      documentTitle: document.documentTitle,
      lastModified: document.lastModified
    } as DocumentIdentifier))
  }

  selectDocument(documentUuid: string) {
    const document = this.documentIdentifiers.find(d => d.documentUuid === documentUuid)
    if (document == null) throw new Error('No document found for the given uuid.')
    this.selectedDocument = document
  }

  deselectDocument() {
    this.selectedDocument = null
  }

  renameDocument(documentUuid: string, documentTitle: string) {
    const documentIdentifier = this.documentIdentifiers.find(d => d.documentUuid == documentUuid)
    if (documentIdentifier == null) throw new Error('renameDocument called but failed to find the documentIdentifier.')
    documentIdentifier.documentTitle = documentTitle
    this.idb.updateDocumentTitle(documentUuid, documentTitle)
      .catch(lazyErrorHandler)
  }

  updateDocumentBody(documentUuid: string, body: SerializedEditorState) {
    const document = this.documentIdentifiers.find(d => d.documentUuid === documentUuid)
    if (!document) throw new Error('Document not found.')
    this.idb.updateDocumentBody(documentUuid, body)
      .catch(lazyErrorHandler)
  }

  createAndSelectNewDocument(): string {
    const documentUuid = uuid()
    this.documentIdentifiers.push({ documentUuid, documentTitle: NEW_FILE_NAME, lastModified: Date.now() } as DocumentIdentifier)
    this.selectDocument(documentUuid)
    return documentUuid
  }

  deleteDocument(documentUuid: string) {
    const documentIndex = this.documentIdentifiers.findIndex(d => d.documentUuid === documentUuid)
    this.documentIdentifiers.splice(documentIndex, 1)
    this.verifySelectedDocument()
    contextMenuStore.setClosed()
    this.idb.deleteDocument(documentUuid)
      .catch(lazyErrorHandler)
  }

  verifySelectedDocument() {
    if (!this.documentIdentifiers.map(d => d.documentUuid).some(uuid => uuid === this.selectedDocument?.documentUuid)) {
      this.deselectDocument()
    }
  }

  $TEST_createBrokenFile(documentUuid: string) {
    this.idb.$TEST_createBrokenFile(documentUuid)
      .catch(lazyErrorHandler)
  }
}

export const documentStore = new DocumentStore()