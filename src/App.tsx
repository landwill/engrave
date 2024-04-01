import { useState } from 'react'
import { DocumentSelectorPanel } from './components/DocumentSelectorPanel.tsx'
import { EditorBody } from './components/EditorBody.tsx'
import { LeftPanel } from './components/LeftPanel.tsx'

function App() {
  const [selectedDocument, setSelectedDocument] = useState<string>('')

  return <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
    <LeftPanel />
    <DocumentSelectorPanel selectedDocument={selectedDocument} setSelectedDocument={setSelectedDocument}/>
    <EditorBody selectedDocument={selectedDocument}/>
  </div>
}

export default App
