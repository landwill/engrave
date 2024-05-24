import React, { LegacyRef } from 'react'

interface FilePickerListWrapperProps {
  children: React.ReactNode | React.ReactNode[]
  innerRef: LegacyRef<HTMLDivElement> | undefined
}

export const FilePickerListWrapper = ({ innerRef, children }: FilePickerListWrapperProps) => {
  return <div style={{
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '1em',
    width: '240px',
    userSelect: 'none',
    overflowY: 'auto',
    height: '100%'
  }} id='file-picker-list' ref={innerRef}>
    {children}
  </div>
}