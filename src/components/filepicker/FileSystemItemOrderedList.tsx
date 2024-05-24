import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { FilePickerListEntry, RelativeItemUuids } from '../../interfaces.ts'
import { documentStore } from '../../stores/DocumentStore.ts'
import { fileSelectionStore } from '../../stores/FileSelectionStore.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.ts'
import { FileTreeComponent } from './FileTreeComponents.tsx'
import { flattenTreeWithLevels } from './utils.ts'

const getRelativeItemUuids = (index: number, orderedFileSystemItemList: FilePickerListEntry[]): RelativeItemUuids => {
  const above = index > 0 ? orderedFileSystemItemList[index - 1].uuid : null
  const below = index < orderedFileSystemItemList.length - 1 ? orderedFileSystemItemList[index + 1].uuid : null

  return { above, below }
}

export const FileSystemItemOrderedList = observer(() => {
  const orderedFileAndFolderList = flattenTreeWithLevels(fileTreeStore.fileTreeData, documentStore.documentIdentifiers)

  runInAction(() => {
    fileSelectionStore.displayedDocumentOrder = orderedFileAndFolderList.map(f => f.uuid)
  })

  return <>
    {
      orderedFileAndFolderList.map((fileOrFolderDetails, index) => {
        const relativeItemUuids = getRelativeItemUuids(index, orderedFileAndFolderList)

        return <FileTreeComponent key={fileOrFolderDetails.key}
                                  fileSystemItemDetails={fileOrFolderDetails}
                                  relativeItemUuids={relativeItemUuids} />
      })
    }
  </>
})