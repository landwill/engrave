import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview'
import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { useContextMenu } from '../../hooks/useContextMenu.tsx'
import { DraggableSource, DropTargetLocation, FileTreeFile, FileTreeFolder, FileTreeItem } from '../../interfaces.ts'
import { documentStore } from '../../stores/DocumentStore.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.ts'
import { ListItem } from '../ListItem.tsx'
import { FileListFileItem } from './FileListFileItem.tsx'
import { FileListFolderItem } from './FileListFolderItem.tsx'

const folderContextMenuItems = <>
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

const FileTreeFolderComponent = observer(({ uuid, children }: Omit<FileTreeFolder, 'isFolder'>) => {
  const ref = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<boolean>(false)
  const [isDraggedOver, setIsDraggedOver] = useState<boolean>(false)

  const fileName = fileTreeStore.foldersDetails.find(f => f.uuid === uuid)?.name ?? 'Folder name not found'

  useEffect(() => {
    const element = ref.current
    if (element == null) throw new Error('null ref.current in draggable folder')
    return combine(
      customDraggable(element, uuid, setDragging, fileName, true),
      customDroppable(element, uuid, setIsDraggedOver, true)
    )
  }, [fileName, uuid])

  const { openContextMenu } = useContextMenu()
  const onClick = action(() => {fileTreeStore.collapseFolder(uuid)})
  const isOpen = fileTreeStore.foldersDetails.find(f => f.uuid === uuid)?.isOpen

  const onContextMenu: MouseEventHandler = (e) => {
    e.preventDefault()
    openContextMenu({ x: e.pageX, y: e.pageY, contextMenuItems: folderContextMenuItems })
  }

  return <div // todo extract following line; common with FileTreeFileComponent
    style={{
      border: isDraggedOver ? '1px solid var(--dnd-hover-border)' : '1px solid transparent',
      backgroundColor: isDraggedOver ? 'var(--dnd-hover-background)' : undefined
    }}
    ref={ref}>
    <FileListFolderItem uuid={uuid} title={fileName} onClick={onClick} onContextMenu={onContextMenu} isDragging={dragging} />
    {isOpen && children.map(child => {
      return <div key={child.uuid} style={{ paddingLeft: '0.25em', marginLeft: '0.45em', borderLeft: '1px solid var(--border-color)' }}>
        <FileTreeBaseItemComponent item={child} />
      </div>
    })}
  </div>
})

export const FileTreeFileComponent = observer(({ uuid }: Omit<FileTreeFile, 'isFolder'>) => {
  const ref = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<boolean>(false)
  const [isDraggedOver, setIsDraggedOver] = useState<boolean>(false)

  const fileName = documentStore.documentIdentifiers.find(d => d.documentUuid === uuid)?.documentTitle ?? 'Filename not found'

  useEffect(() => {
    const element = ref.current
    if (element == null) throw new Error('null ref.current in draggable')
    // todo: extract as much of this as possible, as it's common between folders and files. (Unlike droptarget which is folder-exclusive)
    return combine(customDraggable(element, uuid, setDragging, fileName, false), customDroppable(element, uuid, setIsDraggedOver, false))
  }, [fileName, uuid])

  const { openContextMenu } = useContextMenu()
  const onClick = action(() => {documentStore.selectDocument(uuid)})

  const contextMenuItems = useMemo(() => <>
    <ListItem>Rename</ListItem>
    <ListItem onClick={() => { documentStore.deleteDocument(uuid) }}>Delete</ListItem>
  </>, [uuid])

  const onContextMenu: MouseEventHandler = (e) => {
    e.preventDefault()
    openContextMenu({ x: e.pageX, y: e.pageY, contextMenuItems })
  }

  return <div style={{
    border: isDraggedOver ? '1px solid var(--dnd-hover-border)' : '1px solid transparent',
    backgroundColor: isDraggedOver ? 'var(--dnd-hover-background)' : undefined
  }}>
    <FileListFileItem uuid={uuid} title={fileName} onClick={onClick} onContextMenu={onContextMenu} innerRef={ref} isDragging={dragging} />
  </div>
})

export const FileTreeBaseItemComponent = observer(({ item }: { item: FileTreeItem }) => {
  return item.isFolder
    ? <FileTreeFolderComponent uuid={item.uuid}>{item.children}</FileTreeFolderComponent>
    : <FileTreeFileComponent uuid={item.uuid} />
})