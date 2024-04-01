import { useState } from 'react'
import { DocumentSelectorPanel } from './components/DocumentSelectorPanel.tsx'
import { EditorBody } from './components/EditorBody.tsx'
import { LeftPanel } from './components/LeftPanel.tsx'
import { DARK_MODE_LOCALSTORAGE_KEY } from './consts.ts'
import { setRootTheme, Theme } from './utils.ts'

const lazyDarkModeRetrieve = () => {
  try {
    const darkMode = localStorage.getItem(DARK_MODE_LOCALSTORAGE_KEY)
    if (darkMode === 'true') setRootTheme(Theme.DARK)
  } catch (error) {
    console.warn('Failed to fetch your light/dark mode preferences.')
  }
}

function App() {
  const [selectedDocument, setSelectedDocument] = useState<string>('')

  lazyDarkModeRetrieve()

  return <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
    <LeftPanel />
    <DocumentSelectorPanel selectedDocument={selectedDocument} setSelectedDocument={setSelectedDocument}/>
    <EditorBody selectedDocument={selectedDocument}/>
  </div>
}

export default App
