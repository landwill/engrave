import { IndexedDB } from './indexeddx/indexeddb.ts'

let idb: IndexedDB
void (async () => {
  idb = await IndexedDB.open()
})()

self.onmessage = async (event) => {
  try {
    const documentUuid: string = event.data as string
    const body = await idb.getDocumentBody(documentUuid)
    self.postMessage({ documentUuid, body })
  } catch (error) {
    console.error('Failed to retrieve document:', error)
  }
}
