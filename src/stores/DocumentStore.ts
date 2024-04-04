import { makeAutoObservable, runInAction } from 'mobx'
import { getDocuments, putFileInStore } from '../indexeddx/utils.ts'
import { DocumentDetail, DocumentIdentifier } from '../interfaces.ts'
import { lazyErrorHandler } from '../utils.ts'

export class DocumentStore {
  documentIdentifiers: DocumentIdentifier[] = []
  _selectedDocumentUuid: string | null = null
  db: IDBDatabase

  get selectedDocumentUuid() {
    return this._selectedDocumentUuid
  }

  set selectedDocumentUuid(documentUuid: string | null) {
    this._selectedDocumentUuid = documentUuid
  }

  constructor(db: IDBDatabase) {
    this.db = db
    this.loadDocuments(db).catch(lazyErrorHandler)
    makeAutoObservable(this)
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
    if (this.currentDocument) {
      this.currentDocument.documentTitle = documentTitle
      putFileInStore(this.currentDocument.documentUuid, documentTitle, this.db)
    } else {
      throw new Error('E06')
    }
  }

  createDocument(document: DocumentDetail) {
    this.documentIdentifiers.push({ ...document, lastModified: Date.now() } satisfies DocumentDetail)
    putFileInStore(document.documentUuid, document.documentTitle, this.db)
  }

  get currentDocument(): DocumentIdentifier | undefined {
    return this.documentIdentifiers.find(document => document.documentUuid === this._selectedDocumentUuid)
  }

  get isNoDocumentSelected(): boolean {
    return this._selectedDocumentUuid == null
  }
}