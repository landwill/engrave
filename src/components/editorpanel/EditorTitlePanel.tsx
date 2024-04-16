import type { LexicalEditor } from 'lexical'
import { reaction, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { ChangeEventHandler, CSSProperties, useEffect } from 'react'
import { COMMON_BORDER_STYLE } from '../../consts.ts'
import { documentStore } from '../../stores/DocumentStore.ts'

interface EditorTitlePanelObserverProps {
  editorBodyRef: React.MutableRefObject<LexicalEditor | null>
}

const INPUT_STYLE: CSSProperties = {
  padding: '1em',
  border: 'none',
  borderBottom: COMMON_BORDER_STYLE,
  outline: 'none',
  fontSize: '1.25em',
  fontWeight: 500,
  backgroundColor: 'var(--background-color)',
  color: 'var(--color)',
  resize: 'none'
}

export const EditorTitlePanel = observer(({ editorBodyRef }: EditorTitlePanelObserverProps) => {
  const selectedDocumentUuid = documentStore.selectedDocumentUuid
  if (selectedDocumentUuid == null) throw new Error('Title Editor was rendered with no selected documentUuid.')

  const selectedDocument = documentStore.documentIdentifiers.find(d => d.documentUuid === selectedDocumentUuid)

  useEffect(() => {
    const dispose = reaction(
      () => selectedDocument?.documentTitle,
      (newTitle): void => {
        if (newTitle == null) return
        // todo debounce
        documentStore.renameDocument(selectedDocumentUuid, newTitle)
      }
    )
    return () => {dispose()}
  }, [selectedDocument, selectedDocumentUuid])

  if (!selectedDocument) {
    throw new Error('The title editor failed to identify the respective file, for the selected file ID.')
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    runInAction(() => {selectedDocument.documentTitle = event.target.value})
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      editorBodyRef.current?.focus()
    }
  }

  return (
    <input
      key={selectedDocumentUuid}
      autoFocus
      onChange={handleChange}
      tabIndex={1}
      onKeyDown={handleKeyDown}
      style={INPUT_STYLE}
      placeholder='Untitled'
      value={selectedDocument.documentTitle}
    />
  )
})

