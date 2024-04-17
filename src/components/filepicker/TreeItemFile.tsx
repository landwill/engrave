import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { MouseEventHandler, useEffect, useMemo, useRef } from 'react'
import { useContextMenu } from '../../hooks/useContextMenu.tsx'
import { documentStore } from '../../stores/DocumentStore.ts'
import { FileListItem } from '../FileListItem.tsx'
import { ListItem } from '../ListItem.tsx'

interface DocumentSelectorItemProps {
  isActive: boolean
  documentUuid: string
  title: string
  onClick?: MouseEventHandler
}

function getTitleAndClassName(title: string, isActive: boolean) {
  const classNames = []
  let effectiveTitle = title
  if (isActive) classNames.push('active')
  if (title.trim() == '') {
    classNames.push('untitled')
    effectiveTitle = 'Untitled'
  }
  return { effectiveTitle, className: classNames.join(' ') }
}

export const TreeItemFile = ({ isActive, documentUuid, title, onClick }: DocumentSelectorItemProps) => {
  const ref = useRef<HTMLElement | null>(null)

  const { effectiveTitle, className } = getTitleAndClassName(title, isActive)
  const { openContextMenu } = useContextMenu()

  useEffect(() => {
    const element = ref.current
    if (element == null) throw new Error()
    return draggable({
      element,
      canDrag: () => true,
      getInitialData: () => ({ itemId: 'itemId' })
    })
  }, [])

  const contextMenuItems = useMemo(() => <>
    <ListItem>Rename</ListItem>
    <ListItem onClick={() => { documentStore.deleteDocument(documentUuid) }}>Delete</ListItem>
  </>, [documentUuid])

  return <FileListItem innerRef={ref} additionalClassName={className} onClick={onClick} onContextMenu={e => {
    e.preventDefault()
    openContextMenu({ x: e.pageX, y: e.pageY, contextMenuItems })
  }}>
    {effectiveTitle}
  </FileListItem>
}