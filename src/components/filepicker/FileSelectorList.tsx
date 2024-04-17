import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { CSSProperties } from 'react'
import { FileTreeItem } from '../../interfaces.ts'
import { documentStore } from '../../stores/DocumentStore.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.tsx'
import { FileListItem } from '../FileListItem.tsx'

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

const FileTreeItemComponent = observer(({ uuid, isFolder, children, level = 0 }: {
  uuid: string,
  isFolder: boolean,
  children: FileTreeItem[],
  level?: number
}) => {
  const fileName = isFolder ? fileTreeStore.foldersDetails.find(f => f.uuid === uuid)?.name ?? 'Folder name not found' : documentStore.documentIdentifiers.find(d => d.documentUuid === uuid)?.documentTitle ?? 'Filename not found'
  const onClick = isFolder ? action(() => {fileTreeStore.collapseFolder(uuid)}) : action(() => {documentStore.selectDocument(uuid)})
  const isActive = documentStore.selectedDocumentUuid === uuid
  const isOpen = isFolder ? fileTreeStore.foldersDetails.find(f => f.uuid === uuid)?.isOpen : undefined

  return <>
    <FileListItem isActive={isActive} title={fileName} onClick={onClick} />
    {(isFolder && isOpen) && children.map(child => {
      return <div key={child.uuid} style={{ paddingLeft: '0.25em', marginLeft: '0.75em', borderLeft: '1px solid var(--border-color)' }}>
        <FileTreeItemComponent
          uuid={child.uuid}
          isFolder={child.isFolder}
          level={level + 1}>
          {'children' in child ? child.children : []}
        </FileTreeItemComponent>
      </div>
    })}
  </>
})

export const FileSelectorList = observer(() => {
  return <div style={DIV_STYLE}>
    {
      fileTreeStore.fileTreeData.map(item => {
        return <FileTreeItemComponent
          key={item.uuid}
          uuid={item.uuid}
          isFolder={item.isFolder}>
          {'children' in item ? item.children : []}
        </FileTreeItemComponent>
      })
    }
  </div>
})