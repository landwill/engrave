import React, { CSSProperties } from 'react'

interface PanelBoxProps {
  direction: 'horizontal' | 'vertical'
  children: React.ReactNode
  style?: CSSProperties
}

const PANEL_BOX_BORDER_STYLE = '1px solid var(--border-color)'
const getBorders = (direction: 'horizontal' | 'vertical') => {
  if (direction === 'horizontal') {
    return { borderRight: undefined, borderBottom: PANEL_BOX_BORDER_STYLE }
  } else {
    return { borderRight: PANEL_BOX_BORDER_STYLE, borderBottom: undefined }
  }
}

export const PanelBox = ({ direction, children, style }: PanelBoxProps) => {
  const { borderRight, borderBottom } = getBorders(direction)
  return <div className='panelBox' style={{
    borderRight,
    borderBottom,
    backgroundColor: 'var(--panel-background-color)',
    display: 'flex',
    flexDirection: direction === 'vertical' ? 'column' : 'row',
    ...style
  }}>
    {children}
  </div>
}