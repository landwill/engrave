import { DocumentDetail } from '../interfaces.ts'
import { INDEXEDDB_DATABASE_NAME, INDEXEDDB_STORE_NAME_FILES } from './consts.ts'

export class IndexedDB {
  idb: IDBDatabase

  constructor(idb: IDBDatabase) {
    this.idb = idb
  }

  static async open(): Promise<IndexedDB> {
    const idb = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(INDEXEDDB_DATABASE_NAME, 1)
      request.onupgradeneeded = () => {this._initializeDatabase(request.result)}
      request.onsuccess = () => {resolve(request.result)}
      request.onerror = () => {reject(new Error(request.error?.message))}
    })
    return new IndexedDB(idb)
  }

  static _initializeDatabase = (idb: IDBDatabase) => {
    idb.createObjectStore(INDEXEDDB_STORE_NAME_FILES, { keyPath: 'documentUuid' })
  }

  getDocumentBody = (documentUuid: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const tx = this.idb.transaction(INDEXEDDB_STORE_NAME_FILES, 'readonly')
      const store = tx.objectStore(INDEXEDDB_STORE_NAME_FILES)
      const request = store.get(documentUuid) as IDBRequest<DocumentDetail | undefined>
      request.onsuccess = () => {
        // Nullable in the case of new, unnamed & unmodified documents, which are present only in the DocumentStore but not IDB
        const result: DocumentDetail | undefined = request.result
        resolve(result?.body ?? '')
      }
      request.onerror = () => { reject(new Error(request.error?.message))}
    })
  }

  getDocuments = (): Promise<DocumentDetail[]> => {
    return new Promise((resolve, reject) => {
      const tx = this.idb.transaction(INDEXEDDB_STORE_NAME_FILES, 'readonly')
      const store = tx.objectStore(INDEXEDDB_STORE_NAME_FILES)
      const allDocuments = store.getAll()
      allDocuments.onsuccess = () => { resolve(allDocuments.result) }
      allDocuments.onerror = () => { reject(new Error(allDocuments.error?.message)) }
    })
  }

  updateDocumentTitle = (documentUuid: string, documentTitle: string) => {
    const tx = this.idb.transaction(INDEXEDDB_STORE_NAME_FILES, 'readwrite')
    const store = tx.objectStore(INDEXEDDB_STORE_NAME_FILES)
    const request = store.get(documentUuid) as IDBRequest<DocumentDetail | undefined>
    request.onsuccess = () => {
      const document: DocumentDetail = request.result ?? { documentUuid, documentTitle: '', lastModified: 0 }
      document.documentTitle = documentTitle
      document.lastModified = Date.now()
      const putRequest = store.put(document)
      putRequest.onerror = () => { console.error(new Error(request.error?.message))}
    }
    request.onerror = () => {
      console.error(new Error(request.error?.message))
    }
  }

  updateDocumentBody = (documentUuid: string, body: string) => {
    return new Promise(() => {
      const transaction = this.idb.transaction([INDEXEDDB_STORE_NAME_FILES], 'readwrite')
      const store = transaction.objectStore(INDEXEDDB_STORE_NAME_FILES)
      const request = store.get(documentUuid) as IDBRequest<DocumentDetail | undefined>
      request.onsuccess = () => {
        const document = request.result
        if (document) {
          document.body = body
          document.lastModified = Date.now()
          const request = store.put(document)
          request.onerror = () => { console.error(new Error(request.error?.message))}
        } else {
          const request = store.put({ documentUuid, documentTitle: '', body, lastModified: Date.now() } as DocumentDetail)
          request.onerror = () => { console.error(new Error(request.error?.message))}
        }
      }
      request.onerror = () => {
        console.error(new Error(request.error?.message))
      }
    })
  }

  deleteDocument = (documentUuid: string) => {
    return new Promise((_resolve, reject) => {
      const transaction = this.idb.transaction([INDEXEDDB_STORE_NAME_FILES], 'readwrite')
      const store = transaction.objectStore(INDEXEDDB_STORE_NAME_FILES)
      const request = store.delete(documentUuid)
      request.onerror = () => {reject(new Error(request.error?.message))}
    })
  }

}