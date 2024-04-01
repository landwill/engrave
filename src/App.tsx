import engraveLogo from '/engrave.svg'
import { DocumentSelectorPanel } from './components/DocumentSelectorPanel.tsx'
import { LeftPanel } from './components/LeftPanel.tsx'

function EditorBody() {
  return <div style={{
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <img src={engraveLogo} className='logo' alt='Engrave logo' style={{ width: 'fit-content', alignSelf: 'center' }} />
    <h1 style={{ fontSize: '3.2em', lineHeight: '1.1' }}>Engrave</h1>
    <div>
      <p>
        A reactive text editor (in the making).
      </p>
    </div>
    <p style={{ position: 'fixed', bottom: '0px' }}>
      Being built with love by Lanny.
    </p>
  </div>
}

function App() {

  return <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
  <LeftPanel />
    <DocumentSelectorPanel />
    <EditorBody />
  </div>
}

export default App
