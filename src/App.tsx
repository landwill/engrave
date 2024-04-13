import { configure } from 'mobx'
import { CSSProperties, useEffect, useState } from 'react'
import { ContextMenu } from './components/ContextMenu.tsx'
import { DocumentSelectorAndEditor } from './components/DocumentSelectorAndEditor.tsx'
import { LeftPanel } from './components/LeftPanel.tsx'
import { IndexedDB } from './indexeddx/indexeddb.ts'
import { lazyDarkModeRetrieve, lazyErrorHandler } from './misc/utils.ts'
import { documentStore } from './stores/DocumentStore.ts'

const DIV_STYLE: CSSProperties = { display: 'flex', flexDirection: 'row', height: '100%' }

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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    IndexedDB.open()
      .then(db => {
        setIsLoading(false)
        documentStore.setup(db)
      })
      .catch(lazyErrorHandler)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  lazyDarkModeRetrieve()

  if (isLoading) return <div>Loading...</div>

  return <div style={DIV_STYLE}>
    <LeftPanel />
    <DocumentSelectorAndEditor />
    <ContextMenu />
  </div>
}

export default App
