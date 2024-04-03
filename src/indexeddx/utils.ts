import { EngraveDocument } from '../components/DocumentSelectorItem.tsx'
import { INDEXEDDB_DATABASE_NAME, INDEXEDDB_STORE_NAME_FILES } from './consts.ts'

const initializeDatabase = (db: IDBDatabase) => {
  db.createObjectStore('files', { keyPath: 'fileId' })
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


// noinspection JSUnusedLocalSymbols
const createDocument = (fileId: string, filename: string, db: IDBDatabase) => {
  const tx = db.transaction(INDEXEDDB_STORE_NAME_FILES, 'readwrite')
  const store = tx.objectStore(INDEXEDDB_STORE_NAME_FILES)
  store.put({ fileId, filename })
}

export const getDocument = (fileId: string, db: IDBDatabase): Promise<EngraveDocument | null> => {
  return new Promise((resolve, reject) => {

    const tx = db.transaction(INDEXEDDB_STORE_NAME_FILES, 'readonly')
    const store = tx.objectStore(INDEXEDDB_STORE_NAME_FILES)
    const request = store.get(fileId)
    request.onsuccess = () => {resolve(request.result as EngraveDocument)}
    request.onerror = () => {reject(new Error(request.error?.message))}
  })
}