// noinspection SpellCheckingInspection

import { describe, expect, it } from 'vitest'
import { FileTreeItem } from '../../interfaces.ts'

import { moveElementToFolder, searchTreeForContainingList } from './utils.ts'

const mockFileList = new Map<string, FileTreeItem>([
  ['someFolder', {
    isFolder: true, children: new Map<string, FileTreeItem>([
      ['53c0031f-f80b-4940-9a23-6c7f28f6d9ed', { isFolder: false }],
      ['someFolder2', {
        isFolder: true, children: new Map<string, FileTreeItem>([
          ['84da3a17-e8d8-408d-aadc-ca1ef29185f1', { isFolder: false }]
        ])
      }]])
  }]])

describe('moveElementToFolder', () => {
  it.each([true, false])('should do nothing when the source is the target', (isFolder) => {
    const initialStructure = JSON.stringify(mockFileList)

    moveElementToFolder(mockFileList, 'someFolder', 'someFolder', isFolder)

    expect(JSON.stringify(mockFileList)).toBe(initialStructure)
  })

  it('should support moving elements to the top level (i.e. removing from fileTreeData)', () => {
    const fileUuidToMove = '53c0031f-f80b-4940-9a23-6c7f28f6d9ed'
    const initialFileData: Map<string, FileTreeItem> = new Map<string, FileTreeItem>([
      ['voop', {
        isFolder: true, children: new Map<string, FileTreeItem>([
          [fileUuidToMove, { isFolder: false }],
          ['veep', {
            isFolder: true, children: new Map<string, FileTreeItem>([
              ['84da3a17-e8d8-408d-aadc-ca1ef29185f1', { isFolder: false }]])
          }]])
      }]])
    // before
    expect(searchTreeForContainingList(initialFileData, fileUuidToMove)).not.toBeNull()

    // test
    moveElementToFolder(initialFileData, '53c0031f-f80b-4940-9a23-6c7f28f6d9ed', undefined, false)

    // after
    expect(searchTreeForContainingList(initialFileData, fileUuidToMove)).toBeNull()
  })

  it('should do nothing if moving an absent file to the top-level', () => {
    const initialFileData: Map<string, FileTreeItem> = new Map<string, FileTreeItem>([
      ['voop', {
        isFolder: true, children: new Map<string, FileTreeItem>([
          ['53c0031f-f80b-4940-9a23-6c7f28f6d9ed', { isFolder: false }],
          ['veep', {
            isFolder: true, children: new Map<string, FileTreeItem>([
              ['84da3a17-e8d8-408d-aadc-ca1ef29185f1', { isFolder: false }]])
          }]])
      }]])
    // before
    const initialStructure = JSON.stringify(mockFileList)

    // test
    expect(() => {moveElementToFolder(initialFileData, 'someNonexistentUuid', undefined, false)}).not.toThrowError()

    // after
    expect(JSON.stringify(mockFileList)).toBe(initialStructure)
  })
})