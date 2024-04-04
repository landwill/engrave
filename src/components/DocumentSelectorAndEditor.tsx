import { useIndexedDB } from '../contexts/IndexedDBContext.tsx'
import { DocumentStore } from '../stores/DocumentStore.ts'
import { DocumentSelectorPanel } from './DocumentSelectorPanel.tsx'
import { EditorPanel } from './EditorPanel.tsx'

export function DocumentSelectorAndEditor() {
  const db = useIndexedDB()
  if (db == null) return <></>
  const documentStore = new DocumentStore(db)

  return <>
    <DocumentSelectorPanel documentStore={documentStore} />
    <EditorPanel documentStore={documentStore} />
  </>
}