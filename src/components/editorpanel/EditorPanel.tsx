import type { LexicalEditor } from 'lexical'
import { observer } from 'mobx-react-lite'
import { useRef } from 'react'
import { documentStore } from '../../stores/DocumentStore.ts'
import { CenteringDiv } from '../CenteringDiv.tsx'
import { ErrorBoundary } from '../ErrorBoundary.tsx'
import { WelcomePage } from '../WelcomePage.tsx'
import { EditorBodyPanel } from './EditorBodyPanel.tsx'
import { EditorTitlePanel } from './EditorTitlePanel.tsx'

const Fallback = () => <CenteringDiv>
  <h3>Something went wrong. 😅</h3>
  <p>Please consider selecting another file, or refreshing the page.</p>
</CenteringDiv>

export const EditorPanel = observer(() => {
  const editorBodyRef = useRef<LexicalEditor | null>(null)
  if (documentStore.selectedDocumentUuid == null) return <WelcomePage />

  return <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
    <ErrorBoundary fallback={<Fallback />}>
      <EditorTitlePanel editorBodyRef={editorBodyRef} />
      <EditorBodyPanel
        documentUuid={documentStore.selectedDocumentUuid}
        editorBodyRef={editorBodyRef}
      />
    </ErrorBoundary>
  </div>
})