import { action, makeAutoObservable, runInAction } from 'mobx'
import { v4 as uuid } from 'uuid'
import { deleteDocument, getDocumentBody, getDocuments, updateDocumentBody, updateDocumentTitle } from '../indexeddx/utils.ts'
import { DocumentDetail, DocumentIdentifier } from '../interfaces.ts'
import { lazyErrorHandler } from '../utils.ts'
import { contextMenuStore } from './ContextMenuStore.ts'

const NEW_FILE_NAME = ''

export class DocumentStore {
  documentIdentifiers: DocumentIdentifier[] = []
  selectedDocument: DocumentDetail | null = null
  idb: IDBDatabase | null = null

  selectDocument(documentUuid: string) {
    const document = this.documentIdentifiers.find(d => d.documentUuid === documentUuid)
    if (document == null) throw new Error('No document found for the given uuid.')
    this.selectedDocument = document
    if (this.idb == null) throw new Error('Couldn\'t retrieve document, as the database connection was null.')
    getDocumentBody(documentUuid, this.idb)
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

  setup(idb: IDBDatabase) {
    this.idb = idb
    this.loadDocuments(idb).catch(lazyErrorHandler)
  }

  async loadDocuments(db: IDBDatabase) {
    const documents: DocumentDetail[] = await getDocuments(db) as DocumentDetail[]
    runInAction(() => {
      this.documentIdentifiers = documents.map(document => ({
        documentUuid: document.documentUuid,
        documentTitle: document.documentTitle,
        lastModified: document.lastModified
      } as DocumentIdentifier))
    })
  }

  renameDocument(documentUuid: string, documentTitle: string) {
    if (this.idb == null) throw new Error('DocumentStore was not setup() properly.')
    const documentIdentifier = this.documentIdentifiers.find(d => d.documentUuid == documentUuid)
    if (documentIdentifier == null) throw new Error('renameDocument called but failed to find the documentIdentifier.')
    documentIdentifier.documentTitle = documentTitle
    updateDocumentTitle(documentUuid, documentTitle, this.idb)
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

    if (!this.idb) throw new Error('IDB is not initialized')
    updateDocumentBody(documentUuid, newBody, this.idb)
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
    if (this.idb == null) throw new Error('E07')
    contextMenuStore.setClosed()
    deleteDocument(documentUuid, this.idb)
      .catch(lazyErrorHandler)
  }

  verifySelectedDocument() {
    if (!this.documentIdentifiers.map(d => d.documentUuid).some(uuid => uuid === this.selectedDocument?.documentUuid)) {
      this.deselectDocument()
    }
  }
}

export const documentStore = new DocumentStore()