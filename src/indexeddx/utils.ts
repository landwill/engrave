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

export const getDocuments = (db: IDBDatabase) => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(INDEXEDDB_STORE_NAME_FILES, 'readwrite')
    const store = tx.objectStore(INDEXEDDB_STORE_NAME_FILES)
    const allDocuments = store.getAll()
    allDocuments.onsuccess = () => { resolve(allDocuments.result) }
    allDocuments.onerror = () => { reject(new Error(allDocuments.error?.message)) }
  })
}

export const updateDocumentTitle = (documentUuid: string, documentTitle: string, db: IDBDatabase) => {
  const tx = db.transaction(INDEXEDDB_STORE_NAME_FILES, 'readwrite')
  const store = tx.objectStore(INDEXEDDB_STORE_NAME_FILES)
  const request = store.get(documentUuid)
  request.onsuccess = () => {
    const document = request.result as DocumentDetail | null
    let putRequest
    if (document) {
      document.documentTitle = documentTitle
      document.lastModified = Date.now()
      putRequest = store.put(document)
    } else {
      putRequest = store.put({ documentUuid, documentTitle, lastModified: Date.now() } as DocumentDetail)
    }
    putRequest.onerror = () => { console.error(new Error(request.error?.message))}
  }
  request.onerror = () => {
    console.error(new Error(request.error?.message))
  }
}

export const getDocumentBody = (documentUuid: string, idb: IDBDatabase): Promise<string> => {
  return new Promise((resolve, reject) => {
    const tx = idb.transaction(INDEXEDDB_STORE_NAME_FILES, 'readonly')
    const store = tx.objectStore(INDEXEDDB_STORE_NAME_FILES)
    const request = store.get(documentUuid)
    request.onsuccess = () => {
      // Nullable in the case of new, unnamed & unmodified documents, which are present only in the DocumentStore but not IDB
      const result: DocumentDetail | null = request.result as (DocumentDetail | null)
      resolve(result?.body ?? '')
    }
    request.onerror = () => { reject(new Error(request.error?.message))}
  })
}

export function updateDocumentBody(documentUuid: string, body: string, db: IDBDatabase) {
  return new Promise(() => {
    const transaction = db.transaction([INDEXEDDB_STORE_NAME_FILES], 'readwrite')
    const store = transaction.objectStore(INDEXEDDB_STORE_NAME_FILES)
    const request = store.get(documentUuid)
    request.onsuccess = () => {
      const document = request.result as DocumentDetail | null
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

