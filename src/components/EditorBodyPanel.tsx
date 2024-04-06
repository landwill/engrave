import { observer } from 'mobx-react-lite'
import React from 'react'
import { documentStore } from '../stores/DocumentStore.ts'

interface EditorBodyPanelProps {
  editorBodyRef: React.RefObject<HTMLDivElement>
}

export const EditorBodyPanel = observer(({ editorBodyRef }: EditorBodyPanelProps): React.JSX.Element => {
  if (documentStore.selectedDocument == null) throw new Error("EditorBodyPanel called for a null document.")
  return <div ref={editorBodyRef}
              style={{ padding: '1em', outline: 'none' }}
              tabIndex={2}
              contentEditable
              suppressContentEditableWarning
  >
    {documentStore.selectedDocument.body}
  </div>
})