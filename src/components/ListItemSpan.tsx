import { Property } from 'csstype'
import React, { CSSProperties, MouseEventHandler } from 'react'
import { COMMON_BORDER_RADIUS } from '../consts.ts'

const SPAN_STYLE: CSSProperties = {
  paddingBottom: '0.15em',
  paddingTop: '0.15em',
  textOverflow: 'ellipsis',
  textWrap: 'nowrap',
  overflow: 'hidden',
  paddingLeft: '6px',
  paddingRight: '6px',
  borderRadius: COMMON_BORDER_RADIUS,
  cursor: 'default',
  flexGrow: 1
}

interface ListItemProps {
  children: React.ReactNode
  onContextMenu?: MouseEventHandler
  onClick?: MouseEventHandler
  additionalClassName?: string
  marginY?: Property.Margin
  coloredHover?: boolean
  actionItem?: boolean
}

export const ListItemSpan = ({ children, onContextMenu, onClick, additionalClassName, marginY, coloredHover = true, actionItem = true }: ListItemProps) => {
  let className = coloredHover ? 'list-item' : ''
  if (additionalClassName) className += ' ' + additionalClassName

  const style: CSSProperties = { ...SPAN_STYLE }
  if (actionItem && onClick == null) {
    style.pointerEvents = 'none'
    style.opacity = 0.5
  }
  if (marginY) {
    style.marginTop = marginY
    style.marginBottom = marginY
  }

  return <span className={className} style={style} onClick={onClick} onContextMenu={onContextMenu}>{children}</span>
}