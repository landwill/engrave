import { makeAutoObservable, runInAction } from 'mobx'
import { getDocuments, putFileInStore } from '../indexeddx/utils.ts'
import { DocumentDetail, DocumentIdentifier } from '../interfaces.ts'
import { lazyErrorHandler } from '../utils.ts'

export class DocumentStore {
  documentIdentifiers: DocumentIdentifier[] = []
  _selectedDocumentUuid: string | null = null
  idb: IDBDatabase | null = null

  get selectedDocumentUuid() {
    return this._selectedDocumentUuid
  }

  set selectedDocumentUuid(documentUuid: string | null) {
    this._selectedDocumentUuid = documentUuid
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

  renameCurrentDocument(documentTitle: string) {
    if (this.idb == null) throw new Error('DocumentStore was not setup() properly.')
    if (this.currentDocument) {
      this.currentDocument.documentTitle = documentTitle
      putFileInStore(this.currentDocument.documentUuid, documentTitle, this.idb)
    } else {
      throw new Error('E06')
    }
  }

  createDocument(document: DocumentDetail) {
    if (this.idb == null) throw new Error('DocumentStore was not setup() properly.')
    this.documentIdentifiers.push({ ...document, lastModified: Date.now() } satisfies DocumentDetail)
    putFileInStore(document.documentUuid, document.documentTitle, this.idb)
  }

  get currentDocument(): DocumentIdentifier | undefined {
    return this.documentIdentifiers.find(document => document.documentUuid === this._selectedDocumentUuid)
  }

  get isNoDocumentSelected(): boolean {
    return this._selectedDocumentUuid == null
  }
}

export const documentStore = new DocumentStore()