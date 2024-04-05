import { makeAutoObservable, runInAction } from 'mobx'
import { v4 as uuid } from 'uuid'
import { getDocuments, putFileInStore } from '../indexeddx/utils.ts'
import { DocumentDetail, DocumentIdentifier } from '../interfaces.ts'
import { lazyErrorHandler } from '../utils.ts'

const NEW_FILE_NAME = 'Untitled'

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
    this.currentDocument.documentTitle = documentTitle
    putFileInStore(this.currentDocument.documentUuid, documentTitle, this.idb)
  }

  get currentDocument(): DocumentIdentifier {
    const document = this.documentIdentifiers.find(document => document.documentUuid === this._selectedDocumentUuid)
    if (document == null) throw new Error('Unexpected scenario; document was found to have a nullish name.')
    return document
  }

  get isNoDocumentSelected(): boolean {
    return this._selectedDocumentUuid == null
  }

  createAndSelectNewDocument() {
    const documentUuid = uuid()
    this.documentIdentifiers.push({ documentUuid: documentUuid, documentTitle: NEW_FILE_NAME, lastModified: Date.now() } as DocumentIdentifier)
    this.selectedDocumentUuid = documentUuid
  }
}

export const documentStore = new DocumentStore()