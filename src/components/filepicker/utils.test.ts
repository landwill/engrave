import { describe, expect, it } from 'vitest'
import { FileTreeItem } from '../../interfaces.ts'

import { moveElementToFolder } from './utils.ts'

const mockFileList: FileTreeItem[] = [
  {
    uuid: 'someFolder',
    isFolder: true,
    children: [
      {
        uuid: '53c0031f-f80b-4940-9a23-6c7f28f6d9ed',
        isFolder: false
      }, {
        uuid: 'someFolder2',
        isFolder: true,
        children: [
          {
            uuid: '84da3a17-e8d8-408d-aadc-ca1ef29185f1',
            isFolder: false
          }
        ]
      }
    ]
  }
]

describe('moveElementToFolder', () => {
  it.each([true, false])('should do nothing when the source is the target', (isFolder) => {
    const initialStructure = JSON.stringify(mockFileList)

    moveElementToFolder(mockFileList, 'someFolder', 'someFolder', isFolder)

    expect(JSON.stringify(mockFileList)).toBe(initialStructure)
  })
})