import { action, makeObservable, observable } from 'mobx'
import { FileTreeItem } from '../interfaces.ts'

interface FolderDetail {
  name: string
  isOpen: boolean
}

// noinspection SpellCheckingInspection
export class FileTreeStore {
  fileTreeData = new Map<string, FileTreeItem>([
    ['voop', {
      isFolder: true,
      children: new Map([
        ['53c0031f-f80b-4940-9a23-6c7f28f6d9ed', {
          isFolder: false
        }],
        ['veep', {
          isFolder: true, children: new Map([
            ['84da3a17-e8d8-408d-aadc-ca1ef29185f1', { isFolder: false }]])
        }]])
    }]
  ])

  foldersDetails = new Map<string, FolderDetail>([
    ['voop', {
      name: 'Folder 1',
      isOpen: true
    }],
    ['veep', {
      name: 'Folder 2',
      isOpen: false
    }]
  ])

  constructor() {
    makeObservable(this, {
      fileTreeData: observable,
      foldersDetails: observable,
      collapseFolder: action
    })
  }

  collapseFolder(uuid: string) {
    const folderDetail = this.foldersDetails.get(uuid)
    if (folderDetail == null) throw new Error('No folder found with the given uuid: ' + uuid)
    folderDetail.isOpen = !folderDetail.isOpen
  }

  createFolder(name: string) {
    console.log('Created folder', name)
  }
}

export const fileTreeStore = new FileTreeStore()