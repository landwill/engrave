import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview'
import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { COMMON_BORDER_RADIUS } from '../../consts.ts'
import { useContextMenu } from '../../hooks/useContextMenu.tsx'
import { FileTreeFile, FileTreeFolder, FileTreeItem } from '../../interfaces.ts'
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
    getInitialData: () => ({ source: { uuid, isFolder } }),
    onDragStart: () => {setDragging(true)},
    onDrop: () => {setDragging(false)},
    onGenerateDragPreview: ({ nativeSetDragImage }) => {
      setCustomNativeDragPreview({
        getOffset: () => ({ x: -20, y: -10 }),
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
      dropTargetForElements({
        element,
        onDragEnter: () => {setIsDraggedOver(true)},
        onDragLeave: () => {setIsDraggedOver(false)},
        onDrop: () => {
          setIsDraggedOver(false)
        },
        getData: () => ({ location: uuid })
      })
    )
  }, [fileName, uuid])

  const { openContextMenu } = useContextMenu()
  const onClick = action(() => {fileTreeStore.collapseFolder(uuid)})
  const isOpen = fileTreeStore.foldersDetails.find(f => f.uuid === uuid)?.isOpen

  const onContextMenu: MouseEventHandler = (e) => {
    e.preventDefault()
    openContextMenu({ x: e.pageX, y: e.pageY, contextMenuItems: folderContextMenuItems })
  }

  return <div
    style={{ borderRadius: COMMON_BORDER_RADIUS, color: isDraggedOver ? 'black' : 'unset', backgroundColor: isDraggedOver ? 'var(--light-pink)' : 'unset' }}>
    <FileListFolderItem uuid={uuid} title={fileName} onClick={onClick} onContextMenu={onContextMenu} innerRef={ref} isDragging={dragging} />
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

  const fileName = documentStore.documentIdentifiers.find(d => d.documentUuid === uuid)?.documentTitle ?? 'Filename not found'
  useEffect(() => {
    const element = ref.current
    if (element == null) throw new Error('null ref.current in draggable')
    // todo: extract as much of this as possible, as it's common between folders and files. (Unlike droptarget which is folder-exclusive)
    return customDraggable(element, uuid, setDragging, fileName, false)
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

  return <>
    <FileListFileItem uuid={uuid} title={fileName} onClick={onClick} onContextMenu={onContextMenu} innerRef={ref} isDragging={dragging} />
  </>
})

export const FileTreeBaseItemComponent = observer(({ item }: { item: FileTreeItem }) => {
  return item.isFolder
    ? <FileTreeFolderComponent uuid={item.uuid}>{item.children}</FileTreeFolderComponent>
    : <FileTreeFileComponent uuid={item.uuid} />
})