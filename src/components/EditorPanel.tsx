import { useEffect, useRef, useState } from 'react'
import { useIndexedDB } from '../contexts/IndexedDBContext.tsx'
import { getDocument } from '../indexeddx/utils.ts'
import { FileDetails } from '../interfaces.ts'
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
  const [localFile, setLocalFile] = useState<FileDetails | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const editorBodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsLoading(true)
    if (db == null || selectedDocument == '') return
    getDocument(selectedDocument, db)
      .then(document => {
        if (document == null) {
          setLocalFile({ fileId: selectedDocument, title: 'New file', body: null, isNewFile: true } satisfies FileDetails)
        } else {
          setLocalFile({ fileId: selectedDocument, title: document.filename, body: document.body, isNewFile: false } satisfies FileDetails)
        }
        setIsLoading(false)
      })
      .catch((error: unknown) => {
        handleError(error)
        setIsLoading(false)
      })
  }, [db, selectedDocument])

  if (selectedDocument === '' || localFile == null) return <WelcomePage />
  if (isLoading) {
    console.debug('EditorPanel loading...')
    return <div>Loading...</div>
  } else if (db == null) {
    console.debug('EditorPanel no db...')
    return
  }

  return <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
    <EditorTitlePanel fileId={selectedDocument} editorBodyRef={editorBodyRef} initialTitle={localFile.title} initialIsNewFile={localFile.isNewFile} />
    <EditorBodyPanel body={localFile.body} editorBodyRef={editorBodyRef} />
  </div>
}