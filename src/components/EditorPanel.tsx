import type { LexicalEditor } from 'lexical'
import { observer } from 'mobx-react-lite'
import { useRef } from 'react'
import { documentStore } from '../stores/DocumentStore.ts'
import { EditorBodyPanel } from './EditorBodyPanel.tsx'
import { EditorTitlePanel } from './EditorTitlePanel.tsx'
import { WelcomePage } from './WelcomePage.tsx'

export const EditorPanel = observer(() => {
  const editorBodyRef = useRef<LexicalEditor | null>(null)
  if (documentStore.selectedDocument == null) return <WelcomePage />

  return <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
    <EditorTitlePanel editorBodyRef={editorBodyRef} />
    <EditorBodyPanel
      documentUuid={documentStore.selectedDocument.documentUuid}
      editorBodyRef={editorBodyRef}
    />
  </div>
})