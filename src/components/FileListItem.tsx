import React, { CSSProperties, MouseEventHandler } from 'react'
import { COMMON_BORDER_RADIUS } from '../consts.ts'

const SPAN_STYLE: CSSProperties = {
  marginBottom: '0.25em',
  textOverflow: 'ellipsis',
  textWrap: 'nowrap',
  overflow: 'hidden',
  paddingLeft: '0.5em',
  paddingRight: '0.5em',
  borderRadius: COMMON_BORDER_RADIUS,
  flexShrink: 0,
  cursor: 'default'
}

interface ListItemProps {
  children: React.ReactNode
  innerRef?: React.RefObject<HTMLSpanElement>
  onContextMenu?: MouseEventHandler
  onClick?: MouseEventHandler
  additionalClassName?: string
}

export const FileListItem = ({ children, innerRef, onContextMenu, onClick, additionalClassName }: ListItemProps) => {
  let className = 'list-item'
  if (additionalClassName) className += ' ' + additionalClassName
  const style = { ...SPAN_STYLE }
  if (onClick == null) {
    style.pointerEvents = 'none'
    style.opacity = 0.5
  }

  return <span ref={innerRef} className={className} style={style} onClick={onClick} onContextMenu={onContextMenu}>{children}</span>
}