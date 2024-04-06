import { observer } from 'mobx-react-lite'
import { useRef } from 'react'
import { documentStore } from '../stores/DocumentStore.ts'
import { WelcomePage } from '../WelcomePage.tsx'
import { EditorBodyPanel } from './EditorBodyPanel.tsx'
import { EditorTitlePanel } from './EditorTitlePanel.tsx'

export const EditorPanel = observer(() => {
  const editorBodyRef = useRef<HTMLTextAreaElement>(null)
  if (documentStore.selectedDocument == null) return <WelcomePage />

  return <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
    <EditorTitlePanel editorBodyRef={editorBodyRef} />
    <EditorBodyPanel editorBodyRef={editorBodyRef} />
  </div>
})