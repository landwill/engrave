import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { MouseEventHandler, useEffect, useMemo, useRef } from 'react'
import { useContextMenu } from '../../hooks/useContextMenu.tsx'
import { documentStore } from '../../stores/DocumentStore.ts'
import { FileListItem } from './FileListItem.tsx'
import { ListItem } from '../ListItem.tsx'

interface DocumentSelectorItemProps {
  isActive: boolean
  documentUuid: string
  title: string
  onClick?: MouseEventHandler
}

export const Deprecated_TreeItemFile = ({ isActive, documentUuid, title, onClick }: DocumentSelectorItemProps) => {
  const ref = useRef<HTMLElement | null>(null)

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

  return <FileListItem title={title} isActive={isActive} innerRef={ref} onClick={onClick} onContextMenu={e => {
    e.preventDefault()
    openContextMenu({ x: e.pageX, y: e.pageY, contextMenuItems })
  }}/>
}