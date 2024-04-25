import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { DropTargetRecord } from '@atlaskit/pragmatic-drag-and-drop/types'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { CSSProperties, useEffect } from 'react'
import { DraggableSource, DropTargetLocation, FileTreeFolder, FileTreeItem } from '../../interfaces.ts'
import { documentStore } from '../../stores/DocumentStore.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.ts'
import { FileTreeComponent } from './FileTreeComponents.tsx'

const DIV_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '1em',
  width: '200px',
  userSelect: 'none',
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

function searchTreeForFolder(items: FileTreeItem[], targetFolderUuid: string): FileTreeFolder | null {
  for (const item of items) {
    if (item.uuid === targetFolderUuid) {
      if (!item.isFolder) throw new Error('Unexpected; searchTreeForFolder landed on a non-folder.')
      return item
    }
    if (item.isFolder) {
      const found = searchTreeForFolder(item.children, targetFolderUuid)
      if (found) return found
    }
  }
  return null
}

function searchTreeForContainingList(items: FileTreeItem[], itemUuid: string): { item: FileTreeItem, parent: FileTreeItem[], index: number } | null {
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.uuid === itemUuid) {
      return { item, parent: items, index: i }
    }
    if (item.isFolder) {
      const found = searchTreeForContainingList(item.children, itemUuid)
      if (found) return found
    }
  }
  return null
}

const moveElementToFolder = (fileTree: FileTreeItem[], sourceUuid: string, targetFolderUuid: string | undefined, isFolder: boolean) => {
  if (sourceUuid === targetFolderUuid) return
  let targetChildren
  if (targetFolderUuid === undefined) {
    targetChildren = fileTree
  } else {
    const targetBranch = searchTreeForFolder(fileTree, targetFolderUuid)
    if (targetBranch == null) {
      console.error('Target branch not found when moving element to folder.')
      return
    }
    targetChildren = targetBranch.children
  }

  const result = searchTreeForContainingList(fileTree, sourceUuid)

  if (result != null) {
    // item found in fileTree; move its corresponding info (isFolder, children, etc.) from the source
    const { item, parent, index } = result
    targetChildren.push(item)
    parent.splice(index, 1)
  } else {
    // item not found in fileTree; it's presumably stored outside the fileTree, and is being newly added
    let newFileTreeEntry
    if (isFolder) {
      newFileTreeEntry = { uuid: sourceUuid, isFolder, children: [] }
    } else {
      newFileTreeEntry = { uuid: sourceUuid, isFolder }
    }
    targetChildren.push(newFileTreeEntry)
  }
}

export const FilePickerList = observer(() => {
  const fileTreeUuids = flattenFileTreeUuids(fileTreeStore.fileTreeData)

  useEffect(() => {
    return monitorForElements({
      onDrop: action(({ source, location }) => {
        const sourceData = source.data.source as DraggableSource | null | undefined // unsure if null or defined, so declaring both
        if (sourceData == null) return
        const { uuid, isFolder: sourceIsFolder } = sourceData
        const destination: DropTargetRecord | undefined = location.current.dropTargets[0]

        // suppressed because despite Pragmatic's type-hinting, null/undefined is possible
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (destination == null) return
        const destinationLocation = destination.data.location as DropTargetLocation
        moveElementToFolder(fileTreeStore.fileTreeData, uuid, destinationLocation.uuid, sourceIsFolder)
      })
    })
  }, [])

  return <div style={DIV_STYLE}>
    {
      fileTreeStore.fileTreeData.map(item => <FileTreeComponent key={item.uuid} item={item} />)
    }
    {
      documentStore.documentIdentifiers
        .filter(f => !fileTreeUuids.includes(f.documentUuid))
        .map(f => <FileTreeComponent key={f.documentUuid} item={{ uuid: f.documentUuid, isFolder: false } satisfies FileTreeItem} />)
    }
  </div>
})