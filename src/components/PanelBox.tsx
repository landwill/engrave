import React, { CSSProperties } from 'react'

interface PanelBoxProps {
  children: React.ReactNode
  style?: CSSProperties
}

export const PanelBox = ({ children, style }: PanelBoxProps) => {
  return <div className="panelBox" style={{ borderRight: '1px solid var(--border-color)', backgroundColor: 'var(--panel-background-color)', display: 'flex', flexDirection: 'column',  ...style }}>{children}</div>
}