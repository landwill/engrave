import React from 'react'

interface EditorBodyPanelProps {
  body: string | null
}

export function EditorBodyPanel({ body }: EditorBodyPanelProps): React.JSX.Element {
  return <div style={{ margin: '1em' }}>{body ?? ''}</div>
}