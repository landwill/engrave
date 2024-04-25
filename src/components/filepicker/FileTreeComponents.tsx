import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview'
import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { useContextMenu } from '../../hooks/useContextMenu.tsx'
import { DraggableSource, DropTargetLocation, FileTreeItem } from '../../interfaces.ts'
import { documentStore } from '../../stores/DocumentStore.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.ts'
import { ListItem } from '../ListItem.tsx'
import { FileListFileItem } from './FileListFileItem.tsx'
import { FileListFolderItem } from './FileListFolderItem.tsx'

interface FileTreeComponentProps {
  item: FileTreeItem
}

const ContextMenuFolderItems = () => <>
  <ListItem>Rename</ListItem>
  <ListItem>Delete</ListItem>
</>

function customDraggable(
  element: HTMLDivElement,
  uuid: string,
  setDragging: React.Dispatch<React.SetStateAction<boolean>>,
  fileName: string,
  isFolder: boolean
): CleanupFn {
  return draggable({
    element,
    getInitialData: () => ({ source: { uuid, isFolder } as DraggableSource }),
    onDragStart: () => {setDragging(true)},
    onDrop: () => {setDragging(false)},
    onGenerateDragPreview: ({ nativeSetDragImage }) => {
      setCustomNativeDragPreview({
        getOffset: () => ({ x: -20, y: -8 }),
        nativeSetDragImage,
        render({ container }) {
          const root = ReactDOM.createRoot(container)
          root.render(<div>{fileName}</div>)
          return () => {root.unmount()}
        }
      })
    }
  })
}

function customDroppable(element: HTMLDivElement, uuid: string, setIsDraggedOver: React.Dispatch<React.SetStateAction<boolean>>, isFolder: boolean) {
  return dropTargetForElements({
    element,
    onDragEnter: () => {setIsDraggedOver(true)},
    onDragLeave: () => {setIsDraggedOver(false)},
    // onDropTargetChange: () => {console.log(element.)},
    onDrop: () => {
      setIsDraggedOver(false)
    },
    getData: () => ({ location: { uuid } as DropTargetLocation }),
    canDrop: () => isFolder
  })
}


const ContextMenuFileItems = ({ uuid }: { uuid: string }) => <>
  <ListItem>Rename</ListItem>
  <ListItem onClick={() => { documentStore.deleteDocument(uuid) }}>Delete</ListItem>
</>

export const FileTreeComponent = observer(({ item }: FileTreeComponentProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<boolean>(false)
  const [isDraggedOver, setIsDraggedOver] = useState<boolean>(false)
  const isOpen = item.isFolder && fileTreeStore.foldersDetails.find(f => f.uuid === item.uuid)?.isOpen

  const fileName = item.isFolder ? fileTreeStore.foldersDetails.find(f => f.uuid === item.uuid)?.name ?? 'Folder name not found' : documentStore.documentIdentifiers.find(d => d.documentUuid === item.uuid)?.documentTitle ?? 'Filename not found'

  useEffect(() => {
    const element = ref.current
    if (element == null) throw new Error('null ref.current in draggable')
    return combine(
      customDraggable(element, item.uuid, setDragging, fileName, item.isFolder),
      customDroppable(element, item.uuid, setIsDraggedOver, item.isFolder)
    )
  }, [fileName, item.isFolder, item.uuid])

  const { openContextMenu } = useContextMenu()
  const onClick = action(() => {item.isFolder ? fileTreeStore.collapseFolder(item.uuid) : documentStore.selectDocument(item.uuid)})

  const onContextMenu: MouseEventHandler = (e) => {
    e.preventDefault()
    openContextMenu({ x: e.pageX, y: e.pageY, contextMenuItems: item.isFolder ? <ContextMenuFolderItems /> : <ContextMenuFileItems uuid={item.uuid} /> })
  }

  return <div style={{
    border: isDraggedOver ? '1px solid var(--dnd-hover-border)' : '1px solid transparent',
    backgroundColor: isDraggedOver ? 'var(--dnd-hover-background)' : undefined
  }}
  ref={ref}>
    {
      item.isFolder
      ? <FileListFolderItem uuid={item.uuid} title={fileName} onClick={onClick} onContextMenu={onContextMenu} isDragging={dragging} />
      : <FileListFileItem uuid={item.uuid}
                          title={fileName}
                          onClick={onClick}
                          onContextMenu={onContextMenu}
                          isDragging={dragging} />
    }
    {isOpen && item.children.map(child => {
      return <div key={child.uuid} style={{ paddingLeft: '0.25em', marginLeft: '0.45em', borderLeft: '1px solid var(--border-color)' }}>
        <FileTreeComponent item={child} />
      </div>
    })}
  </div>
})