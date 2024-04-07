import { observer } from 'mobx-react-lite'
import React, { CSSProperties } from 'react'
import { documentStore } from '../stores/DocumentStore.ts'

interface EditorBodyPanelProps {
  editorBodyRef: React.RefObject<HTMLTextAreaElement>
}

const TEXTAREA_STYLE: CSSProperties = {
  padding: '1em',
  height: '100%',
  outline: 'none',
  border: 'none',
  backgroundColor: 'var(--background-color)',
  color: 'var(--color)',
  fontSize: '1.2em',
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  resize: 'none'
}

export const EditorBodyPanel = observer(({ editorBodyRef }: EditorBodyPanelProps): React.JSX.Element => {
  const document = documentStore.selectedDocument
  if (document == null) throw new Error('Body editor rendered for a null document')
  const documentUuid = document.documentUuid

  return <textarea ref={editorBodyRef}
                   style={TEXTAREA_STYLE}
                   key={documentUuid}
                   tabIndex={2}
                   onChange={e => {
                     documentStore.updateDocumentBody(documentUuid, e.target.value)
                   }}
                   value={document.body}
  />
})