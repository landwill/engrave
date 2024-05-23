import React from 'react'

interface MainSiteWrapperProps {
  children: React.ReactNode | React.ReactNode[]
}

export const MainSiteWrapper = ({ children }: MainSiteWrapperProps) => {
  return <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
    {children}
  </div>
}