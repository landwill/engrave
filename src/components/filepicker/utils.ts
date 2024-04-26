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

function addForeignElementToFileTree(targetBranch: FileTreeFolder, sourceUuid: string, sourceIsFolder: boolean) {
  let newFileTreeEntry: FileTreeItem
  if (sourceIsFolder) {
    newFileTreeEntry = { uuid: sourceUuid, isFolder: true, children: [] }
  } else {
    newFileTreeEntry = { uuid: sourceUuid, isFolder: false }
  }
  targetBranch.children.push(newFileTreeEntry)
}

const performMove = (targetList: FileTreeItem[], source: {
  item: FileTreeItem;
  parent: FileTreeItem[];
  index: number
}) => {
  if (targetList === source.parent) return

  targetList.push(source.item)
  source.parent.splice(source.index, 1)
}

function moveElementFromOneFolderToAnother(sourceContainingList: {
  item: FileTreeItem;
  parent: FileTreeItem[];
  index: number
}, targetBranch: FileTreeFolder, targetUuid: string) {
  // item found in fileTree; move its corresponding info (isFolder, children, etc.) from the source
  const { item } = sourceContainingList

  // Quit early if we're dragging a folder into one of its child (even nested) folders
  if (
    item.isFolder // this risk only exists for folders
    && searchTreeForContainingList(item.children, targetUuid) // i.e. the target was found in the
  ) {
    console.debug('Cannot move folders into their own subfolders (even if nested).')
    return
  }

  performMove(targetBranch.children, sourceContainingList)
}

function moveFolderToTopLevel(fileTree: FileTreeItem[], sourceUuid: string) {
  const sourceContainingList = searchTreeForContainingList(fileTree, sourceUuid)
  if (sourceContainingList == null) {
    console.error('moveFolderToTopLevel found a null sourceContainingList. What causes this?', sourceUuid)
    return
  }
  performMove(fileTree, sourceContainingList)
}

export const moveElementToFolder = (fileTree: FileTreeItem[], sourceUuid: string, targetUuid: string | undefined, sourceIsFolder: boolean) => {
  if (sourceUuid === targetUuid) return

  if (targetUuid === undefined) {
    if (sourceIsFolder) {
      moveFolderToTopLevel(fileTree, sourceUuid)
      return
    } else {
      // removeElementFromFileTree(sourceUuid) // todo implement
      return
    }
  }

  const targetBranch = searchTreeForFolder(fileTree, targetUuid)
  if (targetBranch == null) {
    console.error('Target branch not found when moving element to folder. Unknown scenario. Source: {}. Target: {}.', sourceUuid, targetUuid)
    return
  }

  const sourceContainingList = searchTreeForContainingList(fileTree, sourceUuid)

  if (sourceContainingList == null) {
    addForeignElementToFileTree(targetBranch, sourceUuid, sourceIsFolder)
    return
  } else {
    moveElementFromOneFolderToAnother(sourceContainingList, targetBranch, targetUuid)
    return
  }
}