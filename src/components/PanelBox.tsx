import React, { CSSProperties } from 'react'
import { COMMON_BORDER_STYLE } from '../consts.ts'

interface PanelBoxProps {
  direction: 'horizontal' | 'vertical'
  children: React.ReactNode
  style?: CSSProperties
}

const getBorders = (direction: 'horizontal' | 'vertical') => {
  if (direction === 'horizontal') {
    return { borderRight: undefined, borderBottom: COMMON_BORDER_STYLE }
  } else {
    return { borderRight: COMMON_BORDER_STYLE, borderBottom: undefined }
  }
}

export const PanelBox = ({ direction, children, style }: PanelBoxProps) => {
  const { borderRight, borderBottom } = getBorders(direction)
  return <div
    className='panelBox'
    onContextMenu={e => { e.preventDefault()}}
    style={{
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