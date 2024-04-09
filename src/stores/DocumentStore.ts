import { action, makeAutoObservable, runInAction } from 'mobx'
import { v4 as uuid } from 'uuid'
import { IndexedDB } from '../indexeddx/indexeddb.ts'
import { DocumentDetail, DocumentIdentifier } from '../interfaces.ts'
import { lazyErrorHandler } from '../utils.ts'
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

  selectDocument(documentUuid: string) {
    const document = this.documentIdentifiers.find(d => d.documentUuid === documentUuid)
    if (document == null) throw new Error('No document found for the given uuid.')
    this.selectedDocument = document
    this.idb.getDocumentBody(documentUuid)
      .then(
        action('retrieveDocumentBody', body => {
          if (this.selectedDocument == null) throw new Error('E06')
          if (this.selectedDocument.documentUuid !== document.documentUuid) throw new Error('E02')
          this.selectedDocument.body = body
        })
      )
      .catch(lazyErrorHandler)
  }

  deselectDocument() {
    this.selectedDocument = null
  }

  constructor() {
    makeAutoObservable(this)
  }

  setup(idb: IndexedDB) {
    this._idb = idb
    this.loadDocuments().catch(lazyErrorHandler)
  }

  async loadDocuments() {
    const documents: DocumentDetail[] = await this.idb.getDocuments() as DocumentDetail[]
    runInAction(() => {
      this.documentIdentifiers = documents.map(document => ({
        documentUuid: document.documentUuid,
        documentTitle: document.documentTitle,
        lastModified: document.lastModified
      } as DocumentIdentifier))
    })
  }

  renameDocument(documentUuid: string, documentTitle: string) {
    const documentIdentifier = this.documentIdentifiers.find(d => d.documentUuid == documentUuid)
    if (documentIdentifier == null) throw new Error('renameDocument called but failed to find the documentIdentifier.')
    documentIdentifier.documentTitle = documentTitle
    this.idb.updateDocumentTitle(documentUuid, documentTitle)
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
    this.idb.deleteDocument(documentUuid, )
      .catch(lazyErrorHandler)
  }

  verifySelectedDocument() {
    if (!this.documentIdentifiers.map(d => d.documentUuid).some(uuid => uuid === this.selectedDocument?.documentUuid)) {
      this.deselectDocument()
    }
  }
}

export const documentStore = new DocumentStore()