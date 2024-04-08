import engraveLogo from '/engrave.svg'
import React from 'react'

interface CenteringDivProps {
  children: React.ReactNode
}

const CenteringDiv = ({ children }: CenteringDivProps) => {
  return <div style={{
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }}>{children}</div>
}

export function WelcomePage() {
  return <CenteringDiv>
    <img src={engraveLogo} className='logo' alt='Engrave logo' style={{ width: 'fit-content', alignSelf: 'center' }} />
    <h1 style={{ fontSize: '3.2em', lineHeight: '1.1' }}>Engrave</h1>
    <p>
      A reactive text editor (in the making).
    </p>
    <p style={{ position: 'fixed', bottom: '0px' }}>
      Being built with love, by Lanny.
    </p>
  </CenteringDiv>
}