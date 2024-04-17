import { makeObservable, observable } from 'mobx'
import { FileTreeItem } from '../interfaces.ts'

export class FileTreeStore {
  fileTreeData: FileTreeItem[] = [
    {
      uuid: 'voop',
      isFolder: true,
      children: [
        {
          uuid: '53c0031f-f80b-4940-9a23-6c7f28f6d9ed',
          isFolder: false
        }, {
          uuid: 'veep',
          isFolder: true,
          children: [
            {
              uuid: '31ff1f30-d26d-4290-ba47-f1baf06dc6d1',
              isFolder: false
            }, {
              uuid: '84da3a17-e8d8-408d-aadc-ca1ef29185f1',
              isFolder: false
            }
          ]
        }
      ]
    }
  ]

  constructor() {
    makeObservable(this, {
      fileTreeData: observable
    })
  }
}

export const fileTreeStore = new FileTreeStore()