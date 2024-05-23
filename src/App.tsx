import { configure } from 'mobx'
import { useEffect, useState } from 'react'
import { ContextMenu } from './components/ContextMenu.tsx'
import { EditorPanel } from './components/editorpanel/EditorPanel.tsx'
import { FilePickerPanel } from './components/filepicker/FilePickerPanel.tsx'
import { LeftActionsPanel } from './components/leftpanel/LeftActionsPanel.tsx'
import { MainSiteWrapper } from './components/MainSiteWrapper.tsx'
import { IndexedDB } from './indexeddx/indexeddb.ts'
import { lazyCheckAndSetDarkMode, logError } from './misc/utils.ts'
import { documentStore } from './stores/DocumentStore.ts'

// MobX strict rules
configure({
  enforceActions: 'always',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  disableErrorBoundaries: true
})

const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
  }
}

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    IndexedDB.open()
      .then(db => {
        setIsLoading(false)
        documentStore.setup(db)
      })
      .catch(logError)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  lazyCheckAndSetDarkMode()

  if (isLoading) return <div>Loading...</div>

  return <MainSiteWrapper>
    <LeftActionsPanel />
    <FilePickerPanel />
    <EditorPanel />
    <ContextMenu />
  </MainSiteWrapper>
}

export default App
