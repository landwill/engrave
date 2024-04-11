import React from 'react'

interface CenteringDivProps {
  children: React.ReactNode
}

export const CenteringDiv = ({ children }: CenteringDivProps) => {
  return <div style={{
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }}>{children}</div>
}