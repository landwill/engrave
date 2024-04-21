import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { CSSProperties, useEffect } from 'react'
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
    for (const item of items) {
      uuids.push(item.uuid)
      if ('children' in item) traverse(item.children)
    }
  })(fileTree)
  return uuids
}

function searchTree(items: FileTreeItem[], targetUuid: string): FileTreeItem | null {
  for (const item of items) {
    if (item.uuid === targetUuid) {
      return item
    }
    if (item.isFolder && item.children) {
      const found = searchTree(item.children, targetUuid)
      if (found) return found
    }
  }
  return null
}

const moveElementToFolder = (fileTree: FileTreeItem[], sourceUuid: string, targetUuid: string) => {
  const targetBranch = searchTree(fileTree, targetUuid)
  if (targetBranch == null) console.error('wtf')
  else console.log(sourceUuid,
    '->',
    targetBranch.uuid)
}

export const FilePickerList = observer(() => {
  const fileTreeUuids = flattenFileTreeUuids(fileTreeStore.fileTreeData)

  useEffect(() => {
    return monitorForElements({
      onDrop: action(({ source, location }) => {
        const sourceUuid: string | undefined = source.data.source?.uuid
        if (sourceUuid == null) return
        const destination = location.current.dropTargets[0]
        if (!destination) return
        moveElementToFolder(fileTreeStore.fileTreeData, sourceUuid, destination.data.location)
      })
    })
  }, [])

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