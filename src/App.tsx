import engraveLogo from '/engrave.svg'
import './App.css'

function App() {

  return <>
    <div>
      <img src={engraveLogo} className='logo' alt='Engrave logo' />
    </div>
    <h1 style={{ fontSize: '3.2em', lineHeight: '1.1' }}>Engrave</h1>
    <div>
      <p>
        A reactive text editor.
      </p>
    </div>
  </>
}

export default App
