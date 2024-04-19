import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { CSSProperties, MouseEventHandler, useMemo } from 'react'
import { useContextMenu } from '../../hooks/useContextMenu.tsx'
import { FileTreeFile, FileTreeFolder, FileTreeItem } from '../../interfaces.ts'
import { documentStore } from '../../stores/DocumentStore.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.ts'
import { ListItem } from '../ListItem.tsx'
import { FileListItem } from './FileListItem.tsx'

const DIV_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '1em',
  width: '200px',
  userSelect: 'none',
  marginLeft: '0.5em',
  marginRight: '0.5em',
  overflowY: 'auto'
}

const FileTreeFolderComponent = observer(({ uuid, children }: Omit<FileTreeFolder, 'isFolder'>) => {
  const { openContextMenu } = useContextMenu()
  const fileName = fileTreeStore.foldersDetails.find(f => f.uuid === uuid)?.name ?? 'Folder name not found'
  const onClick = action(() => {fileTreeStore.collapseFolder(uuid)})
  const isOpen = fileTreeStore.foldersDetails.find(f => f.uuid === uuid)?.isOpen

  const contextMenuItems = useMemo(() => <>
    <ListItem>Rename</ListItem>
    <ListItem>Delete</ListItem>
  </>, [uuid])

  const onContextMenu: MouseEventHandler = (e) => {
    e.preventDefault()
    openContextMenu({ x: e.pageX, y: e.pageY, contextMenuItems })
  }

  return <>
    <FileListItem uuid={uuid} title={fileName} onClick={onClick} onContextMenu={onContextMenu} />
    {isOpen && children.map(child => {
      return <div key={child.uuid} style={{ paddingLeft: '0.25em', marginLeft: '0.75em', borderLeft: '1px solid var(--border-color)' }}>
        <FileTreeBaseItemComponent item={child} />
      </div>
    })}
  </>
})

const FileTreeFileComponent = observer(({ uuid }: Omit<FileTreeFile, 'isFolder'>) => {
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
    <FileListItem uuid={uuid} title={fileName} onClick={onClick} onContextMenu={onContextMenu} />
  </>
})

const FileTreeBaseItemComponent = observer(({ item }: { item: FileTreeItem }) => {
  return item.isFolder
    ? <FileTreeFolderComponent uuid={item.uuid}>{item.children}</FileTreeFolderComponent>
    : <FileTreeFileComponent uuid={item.uuid} />
})

export const FileSelectorList = observer(() => {
  return <div style={DIV_STYLE}>
    {
      fileTreeStore.fileTreeData.map(item => <FileTreeBaseItemComponent key={item.uuid} item={item} />)
    }
  </div>
})