import { FileTreeFolder, FileTreeItem } from '../../interfaces.ts'

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

export const moveElementToFolder = (fileTree: FileTreeItem[], sourceUuid: string, targetFolderUuid: string | undefined, isFolder: boolean) => {
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

  const sourceContainingList = searchTreeForContainingList(fileTree, sourceUuid)

  if (sourceContainingList != null) {
    // item found in fileTree; move its corresponding info (isFolder, children, etc.) from the source
    const { item, parent, index } = sourceContainingList

    // Quit early if we're dragging a folder into one of its child (even nested) folders
    if (targetFolderUuid != null // If null, we're dragging to the top-level list, which doesn't contain this risk
      && item.isFolder // this risk only exists for folders
      && searchTreeForContainingList(item.children, targetFolderUuid) // i.e. the target was found in the
    ) {
      console.debug('Cannot move folders into their own subfolders (even if nested).')
      return
    }

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