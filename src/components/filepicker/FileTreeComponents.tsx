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
import { fileSelectionStore } from '../../stores/FileSelectionStore.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.ts'
import { ListItemSpan } from '../ListItemSpan.tsx'
import { FileListFolderItem } from './FileListFolderItem.tsx'

interface FileTreeComponentProps {
  item: FileTreeItem
  uuid: string
  level?: number
  parentUuid?: string
}

const deleteFolder = (uuid: string) => {
  const deleteConfirmed = confirm('Are you sure you want to delete folder and all the files which it contains?\nThis cannot be undone!')
  if (deleteConfirmed) {
    const orphanedChildren: string[] = fileTreeStore.deleteFolderAndChildFolders(uuid)
    documentStore.deleteDocuments(orphanedChildren)
  }
}

const ContextMenuFolderItems = ({ uuid }: { uuid: string }) => <>
  <ListItemSpan>Rename</ListItemSpan>
  <ListItemSpan onClick={() => {deleteFolder(uuid)}}>Delete</ListItemSpan>
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

function customDroppable(element: HTMLDivElement, uuid: string | undefined, setIsDraggedOver: React.Dispatch<React.SetStateAction<boolean>>, isFolder: boolean) {
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
  <ListItemSpan>Rename</ListItemSpan>
  <ListItemSpan onClick={() => { documentStore.deleteDocument(uuid) }}>Delete</ListItemSpan>
</>

export const FileTreeComponent = observer(({ item, uuid, parentUuid, level = 0 }: FileTreeComponentProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<boolean>(false)
  const [isDraggedOver, setIsDraggedOver] = useState<boolean>(false)
  const { isFolder } = item

  const fileName = item.isFolder ? fileTreeStore.folderDetails.get(uuid)?.name ?? 'Folder name not found' : documentStore.documentIdentifiers.get(uuid)?.documentTitle ?? 'Filename not found'

  useEffect(() => {
    const element = ref.current
    if (element == null) throw new Error('null ref.current in draggable')
    return combine(
      customDraggable(element, uuid, setDragging, fileName, isFolder),
      customDroppable(element, isFolder ? uuid : parentUuid, setIsDraggedOver, true)
    )
  }, [fileName, isFolder, parentUuid, uuid])

  const { openContextMenu } = useContextMenu()
  const onClick = action<MouseEventHandler>((event) => {
    if (event.shiftKey && event.ctrlKey) {
      fileSelectionStore.shiftClickDocument(uuid, false)
    } else if (event.ctrlKey) {
      fileSelectionStore.controlClickDocument(uuid)
    } else if (event.shiftKey) {
      fileSelectionStore.shiftClickDocument(uuid, true)
    } else {
      item.isFolder ? fileTreeStore.collapseFolder(uuid) : fileSelectionStore.selectDocument(uuid)
    }
  })

  const onContextMenu: MouseEventHandler = (e) => {
    e.preventDefault()
    openContextMenu({ x: e.pageX, y: e.pageY, contextMenuItems: isFolder ? <ContextMenuFolderItems uuid={uuid} /> : <ContextMenuFileItems uuid={uuid} /> })
  }

  const style = isDraggedOver
    ? {
      border: '1px solid var(--dnd-hover-border)',
      backgroundColor: 'var(--dnd-hover-background)'
    }
    : {
      border: '1px solid transparent'
    }

  return <div ref={ref} style={style}>
    <FileListFolderItem uuid={uuid}
                        title={fileName}
                        onClick={onClick}
                        onContextMenu={onContextMenu}
                        isDragging={dragging}
                        isFolder={item.isFolder}
                        isDraggedOver={isDraggedOver}
                        level={level} />
  </div>
})