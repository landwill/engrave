import { configure } from 'mobx'
import { CSSProperties, useEffect, useState } from 'react'
import { DocumentSelectorAndEditor } from './components/DocumentSelectorAndEditor.tsx'
import { LeftPanel } from './components/LeftPanel.tsx'
import { IndexedDBContext } from './contexts/IndexedDBContext.tsx'
import { setupIndexedDB } from './indexeddx/utils.ts'
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
  const [db, setDb] = useState<IDBDatabase | null>(null)

  useEffect(() => {
    setupIndexedDB()
      .then(setDb)
      .catch(lazyErrorHandler)
  }, [])

  lazyDarkModeRetrieve()

  if (db == null) return <div>Loading...</div>
  documentStore.setup(db)

  return <IndexedDBContext.Provider value={db}>
    <div style={DIV_STYLE}>
      <LeftPanel />
      <DocumentSelectorAndEditor />
    </div>
  </IndexedDBContext.Provider>
}

export default App
