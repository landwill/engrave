import { documentStore } from '../../stores/DocumentStore.ts'

export const createV1Document = () => {
  const documentUuid = documentStore.createAndSelectNewDocument()
  documentStore.$TEST_createBrokenFile(documentUuid)
}