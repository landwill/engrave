import React from 'react'
import { COMMON_BORDER_STYLE } from '../consts.ts'

interface EditorTitlePanelProps {
  filename: string
}

export function EditorTitlePanel({ filename }: EditorTitlePanelProps): React.JSX.Element {
  return <div style={{ padding: '1em', borderBottom: COMMON_BORDER_STYLE, width: '100%', fontSize: '1.25em', fontWeight: 500 }}>{filename}</div>
}