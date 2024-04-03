import React from 'react'

interface EditorBodyPanelProps {
  body: string | null
  editorBodyRef: React.RefObject<HTMLDivElement>
}

export function EditorBodyPanel({ body, editorBodyRef }: EditorBodyPanelProps): React.JSX.Element {
  return <div ref={editorBodyRef}
              style={{ padding: '1em', outline: 'none' }}
              tabIndex={2}
              contentEditable
              suppressContentEditableWarning
  >
    {body ?? ''}
  </div>
}