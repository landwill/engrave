import { SerializedEditorState, SerializedLexicalNode } from 'lexical'
import { DocumentDetail, StoredDocument } from '../interfaces.ts'
import { INDEXEDDB_DATABASE_NAME, INDEXEDDB_STORE_NAME_FILES } from './consts.ts'

const hasChildren = (node: SerializedLexicalNode): node is { children: unknown[] } & SerializedLexicalNode => {
  return 'children' in node && Array.isArray(node.children)
}

export class IndexedDB {
  idb: IDBDatabase

  constructor(idb: IDBDatabase) {
    this.idb = idb
  }

  private putDocument(document: StoredDocument) {
    const store = this.getStore('readwrite')
    return store.put(document)
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

  private getDocument = (documentUuid: string): Promise<StoredDocument | undefined> => {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readonly')
      const request = store.get(documentUuid) as IDBRequest<StoredDocument | undefined>
      request.onsuccess = () => {resolve(request.result)}
      request.onerror = () => {reject(new Error(request.error?.message))}
    })
  }

  getDocumentBody = async (documentUuid: string): Promise<SerializedEditorState | ''> => {
    const document = await this.getDocument(documentUuid)
    return document?.body ?? ''
  }

  getDocuments = (): Promise<(DocumentDetail & { documentUuid: string })[]> => {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readonly')
      const allDocuments = store.getAll()
      allDocuments.onsuccess = () => { resolve(allDocuments.result) }
      allDocuments.onerror = () => { reject(new Error(allDocuments.error?.message)) }
    })
  }

  updateDocumentTitle = async (documentUuid: string, documentTitle: string): Promise<void> => {
    const documentInfo = await this.getDocument(documentUuid)
    const document: DocumentDetail & { documentUuid: string } = documentInfo == null ? { documentUuid, documentTitle: '', lastModified: 0 } : {
      ...documentInfo,
      documentUuid
    }
    document.documentTitle = documentTitle
    document.lastModified = Date.now()

    const request = this.getStore('readwrite').put(document)
    return new Promise<void>((resolve, reject) => {
      request.onsuccess = () => {resolve()}
      request.onerror = () => {reject(new Error(request.error?.message))}
    })
  }

  updateDocumentBody = async (documentUuid: string, body: SerializedEditorState) => {
    let document: StoredDocument | undefined = await this.getDocument(documentUuid)
    if (document == null) {
      if (body.root.children.length == 1
        && hasChildren(body.root.children[0])
        && body.root.children[0].children.length === 0) {
        return
      }
      document = { documentUuid, documentTitle: '', lastModified: 0 }
    }
    document.body = body
    document.lastModified = Date.now()

    return new Promise<void>((resolve, reject) => {
      const request = this.putDocument(document satisfies StoredDocument)
      request.onsuccess = () => {resolve()}
      request.onerror = () => {reject(new Error(request.error?.message))}
    })
  }

  $TEST_createBrokenFile = async (documentUuid: string) => {
    return new Promise<void>((resolve, reject) => {
      const store = this.getStore('readwrite')
      // @ts-expect-error This method is intentionally mischievous for chaos/debugging purposes.
      const request = store.put({ documentUuid, body: 'Hello, world!', documentTitle: 'Test file', lastModified: Date.now() } satisfies DocumentDetail)
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