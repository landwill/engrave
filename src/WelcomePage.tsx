import engraveLogo from '/engrave.svg'
import { CenteringDiv } from './components/CenteringDiv.tsx'
import { documentStore } from './stores/DocumentStore.ts'

export function WelcomePage() {
  return <CenteringDiv>
    <img src={engraveLogo} className='logo' alt='Engrave logo' style={{ width: 'fit-content', alignSelf: 'center' }} />
    <h1 style={{ fontSize: '3.2em', lineHeight: '1.1', marginBottom: 0 }}>Engrave</h1>
    <p style={{ marginBottom: '2em' }}>
      A reactive note-taking app (in the making).
    </p>
    <h2 className='link pulse' style={{ paddingLeft: '0.5em', paddingRight: '0.5em' }} onClick={() => {documentStore.createAndSelectNewDocument()}}>
      New file
    </h2>
    <p style={{ position: 'fixed', bottom: '0px' }}>
      Being built with love, by Lanny.
    </p>
  </CenteringDiv>
}