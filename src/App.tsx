import { configure } from 'mobx'
import { CSSProperties, useEffect, useState } from 'react'
import { ContextMenu } from './components/ContextMenu.tsx'
import { DocumentSelectorAndEditor } from './components/DocumentSelectorAndEditor.tsx'
import { LeftPanel } from './components/LeftPanel.tsx'
import { IndexedDB } from './indexeddx/indexeddb.ts'
import { documentStore } from './stores/DocumentStore.ts'
import { lazyDarkModeRetrieve, lazyErrorHandler } from './utils.ts'

const DIV_STYLE: CSSProperties = { display: 'flex', flexDirection: 'row', height: '100%' }

configure({
  enforceActions: 'always',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  disableErrorBoundaries: true
})

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    IndexedDB.open()
      .then(db => {
        setIsLoading(false)
        documentStore.setup(db)
      })
      .catch(lazyErrorHandler)
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
