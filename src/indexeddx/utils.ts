import { DocumentDetail } from '../interfaces.ts'
import { INDEXEDDB_DATABASE_NAME, INDEXEDDB_STORE_NAME_FILES } from './consts.ts'

const initializeDatabase = (db: IDBDatabase) => {
  db.createObjectStore(INDEXEDDB_STORE_NAME_FILES, { keyPath: 'documentUuid' })
}

export const setupIndexedDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(INDEXEDDB_DATABASE_NAME, 1)
    request.onupgradeneeded = () => {initializeDatabase(request.result)}
    request.onsuccess = () => {resolve(request.result)}
    request.onerror = () => {
      console.error('IndexedDB setup failed: {}', request.error)
      reject(new Error(request.error?.message))
    }
  })
}

export const getDocument = (documentUuid: string, db: IDBDatabase): Promise<DocumentDetail | null> => {
  return new Promise((resolve, reject) => {

    const tx = db.transaction(INDEXEDDB_STORE_NAME_FILES, 'readonly')
    const store = tx.objectStore(INDEXEDDB_STORE_NAME_FILES)
    const request = store.get(documentUuid)
    request.onsuccess = () => {resolve(request.result as DocumentDetail)}
    request.onerror = () => {reject(new Error(request.error?.message))}
  })
}

export const getDocuments = (db: IDBDatabase) => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(INDEXEDDB_STORE_NAME_FILES, 'readwrite')
    const store = tx.objectStore(INDEXEDDB_STORE_NAME_FILES)
    const allDocuments = store.getAll()
    allDocuments.onsuccess = () => { resolve(allDocuments.result) }
    allDocuments.onerror = () => { reject(new Error(allDocuments.error?.message)) }
  })
}

export const putFileInStore = (documentUuid: string, documentTitle: string, db: IDBDatabase) => {
  const tx = db.transaction(INDEXEDDB_STORE_NAME_FILES, 'readwrite')
  const store = tx.objectStore(INDEXEDDB_STORE_NAME_FILES)
  store.put({ documentUuid, documentTitle, lastModified: Date.now() }).onerror = function (e) {console.error(e)}
}

