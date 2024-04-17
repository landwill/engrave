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
  innerRef?: React.RefObject<HTMLSpanElement>
  onContextMenu?: MouseEventHandler
  onClick?: MouseEventHandler
  isActive: boolean
  title: string
}

function getTitleAndClassName(title: string, isActive: boolean) {
  const classNames = ['list-item']
  let effectiveTitle = title
  if (isActive) classNames.push('active')
  if (title.trim() == '') {
    classNames.push('untitled')
    effectiveTitle = 'Untitled'
  }
  return { effectiveTitle, className: classNames.join(' ') }
}

export const FileListItem = ({ innerRef, onContextMenu, onClick, isActive, title }: ListItemProps) => {
  const style = { ...SPAN_STYLE }
  if (onClick == null) {
    style.pointerEvents = 'none'
    style.opacity = 0.5
  }

  const { effectiveTitle, className } = getTitleAndClassName(title, isActive)

  return <span ref={innerRef} className={className} style={style} onClick={onClick} onContextMenu={onContextMenu}>
    {effectiveTitle}
  </span>
}