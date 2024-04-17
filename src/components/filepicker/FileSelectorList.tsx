import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { CSSProperties } from 'react'
import { FileTreeItem } from '../../interfaces.ts'
import { documentStore } from '../../stores/DocumentStore.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.tsx'

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

const FileTreeItemComponent = observer(({ uuid, isFolder, onClick, isActive, children, level = 0 }: {
  uuid: string,
  isFolder: boolean,
  children: FileTreeItem[],
  isActive: boolean
  onClick: () => void
  level?: number
}) => {
  const selectedDocumentUuid = documentStore.selectedDocumentUuid
  const fileName = documentStore.documentIdentifiers.find(d => d.documentUuid === uuid)?.documentTitle ?? 'Filename not found'
  return <>
    <div style={{ backgroundColor: isActive ? 'lightseagreen' : 'palevioletred' }} onClick={onClick}>{'\u00A0'.repeat(4 * level)}{fileName} - {isFolder}</div>
    {children?.map(child => <FileTreeItemComponent
      key={child.uuid}
      isActive={selectedDocumentUuid === child.uuid}
      uuid={child.uuid}
      isFolder={child.isFolder}
      onClick={() => {runInAction(() => {documentStore.selectDocument(child.uuid)})}}
      children={'children' in child ? child?.children : []}
      level={level + 1} />)}
  </>
})

export const FileSelectorList = observer(() => {
  const selectedDocumentUuid = documentStore.selectedDocumentUuid

  return <div style={DIV_STYLE}>
    {
      fileTreeStore.fileTreeData.map(item => <FileTreeItemComponent
        key={item.uuid}
        uuid={item.uuid}
        isFolder={item.isFolder}
        isActive={selectedDocumentUuid === item.uuid}
        onClick={() => {runInAction(() => {documentStore.selectDocument(item.uuid)})}}
        children={'children' in item ? item.children : []} />)
    }
  </div>
  // return <div style={DIV_STYLE}>
  //   {
  //     documentIdentifiers.slice().sort((a, b) => b.lastModified - a.lastModified).map(document => {
  //       return <TreeItemFile key={document.documentUuid}
  //                            documentUuid={document.documentUuid}
  //                            isActive={selectedDocumentUuid === document.documentUuid}
  //                            title={document.documentTitle}
  //                            onClick={() => {runInAction(() => {documentStore.selectDocument(document.documentUuid)})}} />
  //     })
  //   }
  // </div>
})