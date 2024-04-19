import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { MouseEventHandler, useMemo } from 'react'
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

const FileTreeFolderComponent = observer(({ uuid, children }: Omit<FileTreeFolder, 'isFolder'>) => {
  const { openContextMenu } = useContextMenu()
  const fileName = fileTreeStore.foldersDetails.find(f => f.uuid === uuid)?.name ?? 'Folder name not found'
  const onClick = action(() => {fileTreeStore.collapseFolder(uuid)})
  const isOpen = fileTreeStore.foldersDetails.find(f => f.uuid === uuid)?.isOpen

  const onContextMenu: MouseEventHandler = (e) => {
    e.preventDefault()
    openContextMenu({ x: e.pageX, y: e.pageY, contextMenuItems: folderContextMenuItems })
  }

  return <>
    <FileListFolderItem uuid={uuid} title={fileName} onClick={onClick} onContextMenu={onContextMenu} />
    {isOpen && children.map(child => {
      return <div key={child.uuid} style={{ paddingLeft: '0.25em', marginLeft: '0.45em', borderLeft: '1px solid var(--border-color)' }}>
        <FileTreeBaseItemComponent item={child} />
      </div>
    })}
  </>
})

export const FileTreeFileComponent = observer(({ uuid }: Omit<FileTreeFile, 'isFolder'>) => {
  const { openContextMenu } = useContextMenu()
  const fileName = documentStore.documentIdentifiers.find(d => d.documentUuid === uuid)?.documentTitle ?? 'Filename not found'
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
    <FileListFileItem uuid={uuid} title={fileName} onClick={onClick} onContextMenu={onContextMenu} />
  </>
})

export const FileTreeBaseItemComponent = observer(({ item }: { item: FileTreeItem }) => {
  return item.isFolder
    ? <FileTreeFolderComponent uuid={item.uuid}>{item.children}</FileTreeFolderComponent>
    : <FileTreeFileComponent uuid={item.uuid} />
})