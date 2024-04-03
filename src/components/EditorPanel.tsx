import { useEffect, useState } from 'react'
import { useIndexedDB } from '../contexts/IndexedDBContext.tsx'
import { getDocument } from '../indexeddx/utils.ts'
import { WelcomePage } from '../WelcomePage.tsx'
import { EditorBodyPanel } from './EditorBodyPanel.tsx'
import { EditorTitlePanel } from './EditorTitlePanel.tsx'

const handleError = (error: unknown) => {
  console.error(error)
}

interface EditorBodyProps {
  selectedDocument: string
}

export function EditorPanel({ selectedDocument }: EditorBodyProps) {
  const db = useIndexedDB()
  const [title, setTitle] = useState<string | null>(null)
  const [body, setBody] = useState<string | null>(null)

  useEffect(() => {
    if (db == null || selectedDocument == '') return
    getDocument(selectedDocument, db).then(document => {
      setTitle(document?.filename ?? 'New file')
      setBody(document?.body ?? '')
    })
      .catch(handleError)
  }, [db, selectedDocument])

  if (selectedDocument === '') return <WelcomePage />

  return <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
    <EditorTitlePanel filename={title ?? '\xa0'} />
    <EditorBodyPanel body={body}/>
  </div>
}