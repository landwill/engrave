import { DocumentDetail } from '../interfaces.ts'
import { INDEXEDDB_DATABASE_NAME, INDEXEDDB_STORE_NAME_FILES } from './consts.ts'

export class IndexedDB {
  idb: IDBDatabase

  constructor(idb: IDBDatabase) {
    this.idb = idb
  }

  static async open(): Promise<IndexedDB> {
    return new Promise<IndexedDB>((resolve, reject) => {
      const request = indexedDB.open(INDEXEDDB_DATABASE_NAME, 1)
      request.onupgradeneeded = () => {this._initializeDatabase(request.result)}
      request.onsuccess = () => {resolve(new IndexedDB(request.result))}
      request.onerror = () => {reject(new Error(request.error?.message))}
    })
  }

  static _initializeDatabase = (idb: IDBDatabase) => {
    idb.createObjectStore(INDEXEDDB_STORE_NAME_FILES, { keyPath: 'documentUuid' })
  }

  private getStore(mode: IDBTransactionMode) {
    const tx = this.idb.transaction(INDEXEDDB_STORE_NAME_FILES, mode)
    return tx.objectStore(INDEXEDDB_STORE_NAME_FILES)
  }

  private getDocument = (documentUuid: string): Promise<DocumentDetail | undefined> => {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readonly')
      const request = store.get(documentUuid) as IDBRequest<DocumentDetail | undefined>
      request.onsuccess = () => {resolve(request.result)}
      request.onerror = () => {reject(new Error(request.error?.message))}
    })
  }

  getDocumentBody = async (documentUuid: string): Promise<string> => {
    const document = await this.getDocument(documentUuid)
    return document?.body ?? ''
  }

  getDocuments = (): Promise<DocumentDetail[]> => {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readonly')
      const allDocuments = store.getAll()
      allDocuments.onsuccess = () => { resolve(allDocuments.result) }
      allDocuments.onerror = () => { reject(new Error(allDocuments.error?.message)) }
    })
  }

  updateDocumentTitle = async (documentUuid: string, documentTitle: string): Promise<void> => {
    const document: DocumentDetail = await this.getDocument(documentUuid) ?? { documentUuid, documentTitle: '', lastModified: 0 }
    document.documentTitle = documentTitle
    document.lastModified = Date.now()

    const request = this.getStore('readwrite').put(document)
    return new Promise<void>((resolve, reject) => {
      request.onsuccess = () => {resolve()}
      request.onerror = () => {reject(new Error(request.error?.message))}
    })
  }

  updateDocumentBody = async (documentUuid: string, body: string) => {
    const document: DocumentDetail = await this.getDocument(documentUuid) ?? { documentUuid, documentTitle: '', lastModified: 0 }
    document.body = body
    document.lastModified = Date.now()

    return new Promise<void>((resolve, reject) => {
      const store = this.getStore('readwrite')
      const request = store.put(document)
      request.onsuccess = () => {resolve()}
      request.onerror = () => {reject(new Error(request.error?.message))}
    })
  }

  deleteDocument = (documentUuid: string) => {
    return new Promise((_resolve, reject) => {
      const store = this.getStore('readwrite')
      const request = store.delete(documentUuid)
      request.onerror = () => {reject(new Error(request.error?.message))}
    })
  }

}