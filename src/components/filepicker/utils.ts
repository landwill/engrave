import { DocumentIdentifier, FileTreeFolder, FileTreeItem, FileTreeItemSearchResult } from '../../interfaces.ts'
import { documentStore } from '../../stores/DocumentStore.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.ts'

export function searchTreeForFolder(items: Map<string, FileTreeItem>, targetFolderUuid: string): { folder: FileTreeFolder, parent: Map<string, FileTreeItem> } | null {
  for (const [key, item] of items) {
    if (key === targetFolderUuid) {
      if (!item.isFolder) throw new Error(`Unexpected; searchTreeForFolder landed on a non-folder (${targetFolderUuid})`)
      return { folder: item, parent: items }
    }
    if (item.isFolder) {
      const found = searchTreeForFolder(item.children, targetFolderUuid)
      if (found) return found
    }
  }
  return null
}

export function searchTreeForContainingList(items: Map<string, FileTreeItem>, itemUuid: string): FileTreeItemSearchResult | null {
  for (const [key, item] of items) {
    if (key === itemUuid) return { item, parent: items, key }
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
    newFileTreeEntry = { isFolder: true, children: new Map() }
  } else {
    newFileTreeEntry = { isFolder: false }
  }
  targetBranch.children.set(sourceUuid, newFileTreeEntry)
}

const performMove = (targetChildren: Map<string, FileTreeItem>, source: FileTreeItemSearchResult) => {
  if (targetChildren === source.parent) return

  targetChildren.set(source.key, source.item)
  source.parent.delete(source.key)
}

function moveElementFromOneFolderToAnother(fileTreeItemSearchResult: FileTreeItemSearchResult, targetBranch: FileTreeFolder, targetUuid: string) {
  // item found in fileTree; move its corresponding info (isFolder, children, etc.) from the source
  const { item } = fileTreeItemSearchResult

  // Quit early if we're dragging a folder into one of its child (even nested) folders
  if (
    item.isFolder // this risk only exists for folders
    && searchTreeForContainingList(item.children, targetUuid) // i.e. the target was found in the
  ) {
    console.info('Cannot move folders into their own subfolders (even if nested).')
    return
  }

  performMove(targetBranch.children, fileTreeItemSearchResult)
}

function moveFolderToTopLevel(fileTree: Map<string, FileTreeItem>, sourceUuid: string) {
  const sourceContainingList = searchTreeForContainingList(fileTree, sourceUuid)
  if (sourceContainingList == null) {
    console.error('moveFolderToTopLevel found a null sourceContainingList. What causes this?', sourceUuid)
    return
  }
  performMove(fileTree, sourceContainingList)
}

// todo check if now unnecessary due to .delete being an option
function removeElementFromFileTree(fileTree: Map<string, FileTreeItem>, sourceUuid: string) {
  const fileTreeItemSearchResult = searchTreeForContainingList(fileTree, sourceUuid)
  if (fileTreeItemSearchResult == null) {
    // Didn't find the sourceUuid in the file tree.
    // Thus, it's already absent, and doesn't need removing. Our job here is done.
    return
  }

  const { parent, key } = fileTreeItemSearchResult
  parent.delete(key)
}

export const moveElementToFolder = (fileTree: Map<string, FileTreeItem>, itemToMoveUuid: string, targetUuid: string | undefined, sourceIsFolder: boolean) => {
  if (itemToMoveUuid === targetUuid) return

  if (targetUuid === undefined) {
    if (sourceIsFolder) {
      moveFolderToTopLevel(fileTree, itemToMoveUuid)
      return
    } else {
      removeElementFromFileTree(fileTree, itemToMoveUuid)
      return
    }
  }

  const searchResult = searchTreeForFolder(fileTree, targetUuid)
  if (searchResult == null) {
    console.error('Target branch not found when moving element to folder. Unknown scenario. Source: {}. Target: {}.', itemToMoveUuid, targetUuid)
    return
  }

  const { folder: targetBranch } = searchResult
  const sourceContainingList = searchTreeForContainingList(fileTree, itemToMoveUuid)

  if (sourceContainingList == null) {
    addForeignElementToFileTree(targetBranch, itemToMoveUuid, sourceIsFolder)
    return
  } else {
    moveElementFromOneFolderToAnother(sourceContainingList, targetBranch, targetUuid)
    return
  }
}

export const flattenFileTreeUuids = (fileTree: Map<string, FileTreeItem>, type: 'file' | 'folder' | 'all') => {
  const uuids: string[] = []
  ;(function traverse(items: Map<string, FileTreeItem>) {
    for (const [uuid, item] of items) {
      if (type === 'all' || (item.isFolder && type === 'folder') || (!item.isFolder && type === 'file')) {
        uuids.push(uuid)
      }
      if ('children' in item) traverse(item.children)
    }
  })(fileTree)
  return uuids
}

interface FilePickerListEntry {
  key: string
  item: FileTreeItem
  level: number
  uuid: string
  parentUuid?: string
}

export const flattenTreeWithLevels = (fileTreeData: Map<string, FileTreeItem>, fileIdentifiers: Map<string, DocumentIdentifier>): FilePickerListEntry[] => {
  const flattenedTree: FilePickerListEntry[] = []
  const seen = new Set()

  ;(function flattenTree(data: Map<string, FileTreeItem>, level = 0, visible = true, parentUuid: string | undefined = undefined) {
    Array.from(data.entries())
      .map(([uuid, item]) => ({
        uuid,
        item,
        name: (item.isFolder ? fileTreeStore.folderDetails.get(uuid)?.name : documentStore.documentIdentifiers.get(uuid)?.documentTitle) ?? 'Untitled'
      }))
      .sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
      .forEach(({ uuid, item }) => {
        // track 'visible' to continue traversing children (for the purpose of maintaining 'seen'), despite a parent folder being collapsed
        if (visible) flattenedTree.push({ uuid, item, key: uuid, level, parentUuid })
        seen.add(uuid)
        if (item.isFolder) flattenTree(item.children, level + 1, visible && (fileTreeStore.folderDetails.get(uuid)?.isOpen == true), uuid)
      })
  })(fileTreeData)

  Array.from(fileIdentifiers.entries())
    .filter(([fileUuid]) => !seen.has(fileUuid))
    .sort(([, item1], [, item2]) => item1.documentTitle.localeCompare(item2.documentTitle))
    .forEach(([fileUuid]) => flattenedTree.push({ uuid: fileUuid, key: fileUuid, item: { isFolder: false } satisfies FileTreeItem, level: 0 }))

  return flattenedTree
}