import { Property } from 'csstype'
import React, { CSSProperties, MouseEventHandler } from 'react'
import { COMMON_BORDER_RADIUS } from '../consts.ts'

const SPAN_STYLE: CSSProperties = {
  marginBottom: '0.15em',
  marginTop: '0.15em',
  textOverflow: 'ellipsis',
  textWrap: 'nowrap',
  overflow: 'hidden',
  paddingLeft: '0.5em',
  paddingRight: '0.5em',
  borderRadius: COMMON_BORDER_RADIUS,
  cursor: 'default'
}

interface ListItemProps {
  children: React.ReactNode
  onContextMenu?: MouseEventHandler
  onClick?: MouseEventHandler
  additionalClassName?: string
  marginY?: Property.Margin
}

export const ListItem = ({ children, onContextMenu, onClick, additionalClassName, marginY }: ListItemProps) => {
  let className = 'list-item'
  if (additionalClassName) className += ' ' + additionalClassName

  const style: CSSProperties = { ...SPAN_STYLE }
  if (onClick == null) {
    style.pointerEvents = 'none'
    style.opacity = 0.5
  }
  if (marginY) {
    style.marginTop = marginY
    style.marginBottom = marginY
  }

  return <span className={className} style={style} onClick={onClick} onContextMenu={onContextMenu}>{children}</span>
}