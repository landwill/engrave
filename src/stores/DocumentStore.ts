import { flow, flowResult, makeAutoObservable, runInAction } from 'mobx'
import { v4 as uuid } from 'uuid'
import { IndexedDB } from '../indexeddx/indexeddb.ts'
import { DocumentDetail, DocumentIdentifier } from '../interfaces.ts'
import { lazyErrorHandler } from '../utils.ts'
import { worker } from '../worker.ts'
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
    worker.onmessage = ({ data }) => {
      const { documentUuid: responseDocumentUuid, body } = data as DocumentDetail
      runInAction(() => {
        if (this.selectedDocument != null && this.selectedDocument.documentUuid === responseDocumentUuid) {
          this.selectedDocument.body = body
        }
      })
    }
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
    this.selectedDocument.body = undefined
    worker.postMessage(documentUuid)
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

  updateDocumentBody(documentUuid: string, newBody: string) {
    const document = this.documentIdentifiers.find(d => d.documentUuid === documentUuid)
    if (!document) throw new Error('Document not found.')

    runInAction(() => {
      if (this.selectedDocument && this.selectedDocument.documentUuid === documentUuid) {
        this.selectedDocument.body = newBody
      } else {
        console.error('E01')
      }
    })

    this.idb.updateDocumentBody(documentUuid, newBody)
      .catch(lazyErrorHandler)
  }

  createAndSelectNewDocument() {
    const documentUuid = uuid()
    this.documentIdentifiers.push({ documentUuid, documentTitle: NEW_FILE_NAME, lastModified: Date.now() } as DocumentIdentifier)
    this.selectDocument(documentUuid)
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
}

export const documentStore = new DocumentStore()