import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { useIndexedDB } from '../contexts/IndexedDBContext.tsx'
import { getDocument } from '../indexeddx/utils.ts'
import { DocumentStore } from '../stores/DocumentStore.ts'
import { lazyErrorHandler } from '../utils.ts'

interface EditorBodyPanelProps {
  documentStore: DocumentStore
  editorBodyRef: React.RefObject<HTMLDivElement>
}

export const EditorBodyPanel = observer(({ documentStore, editorBodyRef }: EditorBodyPanelProps): React.JSX.Element => {
  const db = useIndexedDB()
  const [body, setBody] = useState<string>('')
  const selectedDocumentId = documentStore.selectedDocumentUuid


  useEffect(() => {
    const fetchDocumentBody = async () => {
      if (selectedDocumentId == null) {
        console.log('E01')
        return
      }
      if (db == null) {
        console.info('E02')
        return
      }

      try {
        const fullDocument = await getDocument(selectedDocumentId, db)
        setBody(fullDocument?.body ?? '')
      } catch (error) {
        console.error(error)
      }
    }

    fetchDocumentBody()
      .catch(lazyErrorHandler)
  }, [db, selectedDocumentId])

  return <div ref={editorBodyRef}
              style={{ padding: '1em', outline: 'none' }}
              tabIndex={2}
              contentEditable
              suppressContentEditableWarning
  >
    {body}
  </div>
})