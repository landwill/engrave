import { action, makeObservable, observable } from 'mobx'
import { v4 as uuid } from 'uuid'
import { flattenFileTreeUuids, searchTreeForFolder } from '../components/filepicker/utils.ts'
import { FileTreeItem } from '../interfaces.ts'

interface FolderDetail {
  name: string
  isOpen: boolean
}

export class FileTreeStore {
  fileTreeData = new Map<string, FileTreeItem>()
  folderDetails = new Map<string, FolderDetail>()

  constructor() {
    makeObservable(this, {
      fileTreeData: observable,
      folderDetails: observable,
      collapseFolder: action,
      createFolder: action,
      deleteFolderAndChildFolders: action,
      removeFileReferenceFromFileTree: action,
      isFolder: observable
    })
  }

  collapseFolder(uuid: string) {
    const folderDetail = this.folderDetails.get(uuid)
    if (folderDetail == null) throw new Error('No folder found with the given uuid: ' + uuid)
    folderDetail.isOpen = !folderDetail.isOpen
  }

  createFolder(name: string) {
    const folderUuid = uuid()
    this.folderDetails.set(folderUuid, { name, isOpen: true })
    this.fileTreeData.set(folderUuid, { isFolder: true, children: new Map() })
  }

  /**
   * Deletes a folder and any nested folders, but does not remove the files contained within.
   * The children file UUIDs are returned for you to handle separately.
   */
  deleteFolderAndChildFolders(uuid: string) {
    const searchResult = searchTreeForFolder(this.fileTreeData, uuid)
    if (!searchResult) throw new Error(`Failed to identify the folder to delete (${uuid}).`)
    const { folder, parent } = searchResult
    const fileUuids = flattenFileTreeUuids(folder.children, 'file')
    const folderUuids = flattenFileTreeUuids(folder.children, 'folder')

    // delete folder
    parent.delete(uuid) // naturally also drops this folder's child folders
    // ...but the above doesn't remove the foldersDetails entries. See below

    // delete folder details for the target folder and all its children
    for (const deleteUuid of [uuid, ...folderUuids]) {
      this.folderDetails.delete(deleteUuid)
    }

    return fileUuids
  }

  removeFileReferenceFromFileTree(documentUuid: string) {
    (function traverseAndDeleteIfFound(branch: Map<string, FileTreeItem>): boolean {
      for (const [folderOrFileUuid, folderDetails] of branch) {
        if (!folderDetails.isFolder && folderOrFileUuid === documentUuid) {
          branch.delete(documentUuid)
          return true
        } else if (folderDetails.isFolder) {
          const done = traverseAndDeleteIfFound(folderDetails.children)
          if (done) return true
        }
      }
      return false
    })(this.fileTreeData)
  }

  isFolder(documentUuid: string) {
    return this.folderDetails.has(documentUuid)
  }
}

export const fileTreeStore = new FileTreeStore()