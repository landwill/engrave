import { makeAutoObservable, runInAction } from 'mobx'
import { v4 as uuid } from 'uuid'
import { getDocuments, putFileInStore } from '../indexeddx/utils.ts'
import { DocumentDetail, DocumentIdentifier } from '../interfaces.ts'
import { lazyErrorHandler } from '../utils.ts'

const NEW_FILE_NAME = ''

export class DocumentStore {
  documentIdentifiers: DocumentIdentifier[] = []
  selectedDocument: DocumentDetail | null = null
  idb: IDBDatabase | null = null

  selectDocument(documentUuid: string) {
    this.selectedDocument = this.documentIdentifiers.find(d => d.documentUuid === documentUuid) ?? null
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

  renameCurrentDocument(documentTitle: string) {
    if (this.idb == null) throw new Error('DocumentStore was not setup() properly.')
    if (this.selectedDocument == null) throw new Error('renameCurrentDocument called despite there being no selectedDocument.')
    this.selectedDocument.documentTitle = documentTitle
    putFileInStore(this.selectedDocument.documentUuid, documentTitle, this.idb)
  }

  createAndSelectNewDocument() {
    const documentUuid = uuid()
    this.documentIdentifiers.push({ documentUuid: documentUuid, documentTitle: NEW_FILE_NAME, lastModified: Date.now() } as DocumentIdentifier)
    this.selectDocument(documentUuid)
  }
}

export const documentStore = new DocumentStore()