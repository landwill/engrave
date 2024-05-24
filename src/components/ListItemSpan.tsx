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
  onClick?: MouseEventHandler
  additionalClassName?: string
  marginY?: Property.Margin
  coloredHover?: boolean
  actionItem?: boolean
}

export const ListItemSpan = ({ children, onClick, additionalClassName, marginY, coloredHover = true, actionItem = true }: ListItemProps) => {
  const classNames = coloredHover ? ['list-item'] : []
  if (additionalClassName) classNames.push(additionalClassName)
  const className = classNames.join(' ')

  const style: CSSProperties = { ...SPAN_STYLE }
  if (actionItem && onClick == null) {
    style.pointerEvents = 'none'
    style.opacity = 0.5
  }
  if (marginY) {
    style.marginTop = marginY
    style.marginBottom = marginY
  }

  return <span className={className} style={style} onClick={onClick}>{children}</span>
}