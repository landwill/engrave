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
  const [db, setDb] = useState<IndexedDB | null>(null)

  useEffect(() => {
    IndexedDB.open()
      .then(setDb)
      .catch(lazyErrorHandler)
  }, [])

  lazyDarkModeRetrieve()

  if (db == null) return <div>Loading...</div>
  documentStore.setup(db)

  return <div style={DIV_STYLE}>
    <LeftPanel />
    <DocumentSelectorAndEditor />
    <ContextMenu />
  </div>
}

export default App
