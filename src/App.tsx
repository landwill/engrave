import { configure } from 'mobx'
import { useEffect, useState } from 'react'
import { DocumentSelectorAndEditor } from './components/DocumentSelectorAndEditor.tsx'
import { LeftPanel } from './components/LeftPanel.tsx'
import { IndexedDBContext } from './contexts/IndexedDBContext.tsx'
import { setupIndexedDB } from './indexeddx/utils.ts'
import { lazyDarkModeRetrieve } from './utils.ts'

const handleSetupIndexedDBError = (error: unknown) => {
  console.error(error)
}

configure({
  enforceActions: 'always',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  disableErrorBoundaries: true
})

function App() {
  const [db, setDb] = useState<IDBDatabase | null>(null)

  useEffect(() => {
    setupIndexedDB()
      .then(setDb)
      .catch(handleSetupIndexedDBError)
  }, [])

  lazyDarkModeRetrieve()

  return <IndexedDBContext.Provider value={db}>
    <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
      <LeftPanel />
      <DocumentSelectorAndEditor />
    </div>
  </IndexedDBContext.Provider>
}

export default App
