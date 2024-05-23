import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { documentStore } from '../../stores/DocumentStore.ts'
import { fileSelectionStore } from '../../stores/FileSelectionStore.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.ts'
import { FileTreeComponent } from './FileTreeComponents.tsx'
import { flattenTreeWithLevels } from './utils.ts'

export const FileSysteItemOrderedList = observer(() => {
  const orderedFileAndFolderList = flattenTreeWithLevels(fileTreeStore.fileTreeData, documentStore.documentIdentifiers)

  runInAction(() => {
    fileSelectionStore.displayedDocumentOrder = orderedFileAndFolderList.map(f => f.uuid)
  })

  return <>
    {
      orderedFileAndFolderList.map(fileOrFolderDetails => {
        return <FileTreeComponent key={fileOrFolderDetails.key} fileSystemItemDetails={fileOrFolderDetails} />
      })
    }
  </>
})