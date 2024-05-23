import React, { CSSProperties } from 'react'
import { COMMON_BORDER_STYLE } from '../consts.ts'

interface PanelBoxProps {
  direction: 'horizontal' | 'vertical'
  children: React.ReactNode
  style?: CSSProperties
}

export const PanelBox = ({ direction, style, children }: PanelBoxProps) => {
  const borderRight = direction === 'horizontal' ? undefined : COMMON_BORDER_STYLE

  return <div
    className='panelBox'
    onContextMenu={e => { e.preventDefault()}}
    style={{
      borderRight,
      backgroundColor: 'var(--panel-background-color)',
      display: 'flex',
      flexDirection: direction === 'vertical' ? 'column' : 'row',
      ...style
    }}>
    {children}
  </div>
}