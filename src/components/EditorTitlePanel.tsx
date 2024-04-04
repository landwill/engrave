import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { ChangeEventHandler } from 'react'
import { COMMON_BORDER_STYLE } from '../consts.ts'
import { DocumentDetail } from '../interfaces.ts'
import { DocumentStore } from '../stores/DocumentStore.ts'

interface EditorTitlePanelObserverProps {
  documentStore: DocumentStore
  editorBodyRef: React.RefObject<HTMLDivElement>
}

export const EditorTitlePanel = observer(({ documentStore, editorBodyRef }: EditorTitlePanelObserverProps) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    runInAction(() => {
      if (documentStore.currentDocument) {
        documentStore.renameCurrentDocument(event.target.value)
      } else {
        documentStore.createDocument({ documentUuid: documentStore.selectedDocumentUuid, documentTitle: event.target.value } as DocumentDetail)
      }
    })
  }
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      editorBodyRef.current?.focus()
    }
  }

  if (documentStore.currentDocument == null && !documentStore.selectedDocumentUuid) {
    return <div>E04</div>
  }

  return (
    <input
      key={documentStore.selectedDocumentUuid}
      contentEditable
      autoFocus
      onChange={handleChange}
      tabIndex={1}
      onKeyDown={handleKeyDown}
      suppressContentEditableWarning
      style={{ padding: '1em', border: 'none', borderBottom: COMMON_BORDER_STYLE, outline: 'none', fontSize: '1.25em', fontWeight: 500, backgroundColor: 'var(--background-color)', color: 'var(--color)' }}
      value={documentStore.currentDocument?.documentTitle ?? 'New file'}
    />
  )
})

