import { observer } from 'mobx-react-lite'
import { CSSProperties } from 'react'
import { FileTreeItem } from '../../interfaces.ts'
import { documentStore } from '../../stores/DocumentStore.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.ts'
import { FileTreeBaseItemComponent, FileTreeFileComponent } from './FileTreeComponents.tsx'

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

const flattenFileTreeUuids = (fileTree: FileTreeItem[]) => {
  const uuids: string[] = []
  ;(function traverse(items: FileTreeItem[]) {
    for (const index in items) {
      const item = items[index]
      uuids.push(item.uuid)
      if ('children' in item) traverse(item.children)
    }
  })(fileTree)
  return uuids
}

export const FilePickerList = observer(() => {
  const fileTreeUuids = flattenFileTreeUuids(fileTreeStore.fileTreeData)

  return <div style={DIV_STYLE}>
    {
      fileTreeStore.fileTreeData.map(item => <FileTreeBaseItemComponent key={item.uuid} item={item} />)
    }
    {
      documentStore.documentIdentifiers
        .filter(f => !fileTreeUuids.includes(f.documentUuid))
        .map(f => <FileTreeFileComponent key={f.documentUuid} uuid={f.documentUuid} />)
    }
  </div>
})