import { observer } from 'mobx-react-lite'
import { useRef } from 'react'
import { DocumentStore } from '../stores/DocumentStore.ts'
import { WelcomePage } from '../WelcomePage.tsx'
import { EditorBodyPanel } from './EditorBodyPanel.tsx'
import { EditorTitlePanel } from './EditorTitlePanel.tsx'

interface EditorPanelObserverProps {
  documentStore: DocumentStore
}

export const EditorPanel = observer(({ documentStore }: EditorPanelObserverProps) => {
  const editorBodyRef = useRef<HTMLDivElement>(null)
  if (documentStore.isNoDocumentSelected) return <WelcomePage />

  return <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
    <EditorTitlePanel documentStore={documentStore} editorBodyRef={editorBodyRef} />
    <EditorBodyPanel documentStore={documentStore} editorBodyRef={editorBodyRef} />
  </div>
})