import { observer } from 'mobx-react-lite'
import React, { CSSProperties, MouseEventHandler } from 'react'
import { COMMON_BORDER_RADIUS } from '../../consts.ts'
import { documentStore } from '../../stores/DocumentStore.ts'

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
  uuid: string
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

export const FileListItem = observer(({ innerRef, onContextMenu, onClick, uuid, title }: ListItemProps) => {
  const isActive = documentStore.selectedDocumentUuid === uuid

  const style = { ...SPAN_STYLE }
  if (onClick == null) {
    style.pointerEvents = 'none'
    style.opacity = 0.5
  }

  const { effectiveTitle, className } = getTitleAndClassName(title, isActive)

  return <span ref={innerRef} className={className} style={style} onClick={onClick} onContextMenu={onContextMenu}>
    {effectiveTitle}
  </span>
})