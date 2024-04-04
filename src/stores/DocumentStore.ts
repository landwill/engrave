import { makeAutoObservable, runInAction } from 'mobx'
import { getDocuments } from '../indexeddx/utils.ts'
import { lazyErrorHandler } from '../utils.ts'

export interface DocumentIdentifier {
  documentUuid: string
  documentTitle: string
  isNew: boolean
}

interface DocumentDetail {
  fileId: string
  filename: string
  body: string
}

export class DocumentStore {
  documentIdentifiers: DocumentIdentifier[] = []
  _selectedDocumentUuid: string | null = null

  get selectedDocumentUuid() {
    return this._selectedDocumentUuid
  }

  set selectedDocumentUuid(documentUuid: string | null) {
    this._selectedDocumentUuid = documentUuid
  }

  constructor(db: IDBDatabase) {
    this.loadDocuments(db).catch(lazyErrorHandler)
    makeAutoObservable(this)
  }

  async loadDocuments(db: IDBDatabase) {
    const documents: DocumentDetail[] = await getDocuments(db) as DocumentDetail[]
    runInAction(() => {
      this.documentIdentifiers = documents.map(document => ({
        documentUuid: document.fileId,
        documentTitle: document.filename,
        isNew: false
      } as DocumentIdentifier))
    })
  }
  renameCurrentDocument(documentTitle: string) {
    if (this.currentDocument) this.currentDocument.documentTitle = documentTitle
  }

  get currentDocument(): DocumentIdentifier | undefined {
    return this.documentIdentifiers.find(document => document.documentUuid === this._selectedDocumentUuid)
  }

  get isNoDocumentSelected(): boolean {
    return this._selectedDocumentUuid == null
  }
}