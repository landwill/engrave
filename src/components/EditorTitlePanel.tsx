import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { ChangeEventHandler } from 'react'
import { COMMON_BORDER_STYLE } from '../consts.ts'
import { documentStore } from '../stores/DocumentStore.ts'

interface EditorTitlePanelObserverProps {
  editorBodyRef: React.RefObject<HTMLDivElement>
}

const INPUT_STYLE = { padding: '1em', border: 'none', borderBottom: COMMON_BORDER_STYLE, outline: 'none', fontSize: '1.25em', fontWeight: 500, backgroundColor: 'var(--background-color)', color: 'var(--color)' }
export const EditorTitlePanel = observer(({ editorBodyRef }: EditorTitlePanelObserverProps) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    runInAction(() => {
      documentStore.renameCurrentDocument(event.target.value)
    })
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      editorBodyRef.current?.focus()
    }
  }

  if (!documentStore.selectedDocument) {
    return <div>E04</div>
  }

  return (
    <input
      key={documentStore.selectedDocument.documentUuid}
      contentEditable
      autoFocus
      onChange={handleChange}
      tabIndex={1}
      onKeyDown={handleKeyDown}
      suppressContentEditableWarning
      style={INPUT_STYLE}
      placeholder='Untitled'
      value={documentStore.selectedDocument.documentTitle}
    />
  )
})

