import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { MouseEventHandler, useState } from 'react'
import { useContextMenu } from '../../hooks/useContextMenu.tsx'
import { FilePickerListEntry, RelativeItemUuids } from '../../interfaces.ts'
import { documentStore } from '../../stores/DocumentStore.ts'
import { fileSelectionStore } from '../../stores/FileSelectionStore.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.ts'
import { ListItemSpan } from '../ListItemSpan.tsx'
import { FileSystemItemHoverDiv } from './FileSystemItemHoverDiv.tsx'
import { FileSystemItemIdentity, FileSystemItemWrapper } from './FileSystemItemWrapper.tsx'

interface FileTreeComponentProps {
  fileSystemItemDetails: FilePickerListEntry
  relativeItemUuids: RelativeItemUuids
}

const deleteFolderWithConfirmation = (uuid: string) => {
  const deleteConfirmed = confirm('Are you sure you want to delete folder and all the files which it contains?\nThis cannot be undone!')
  if (deleteConfirmed) {
    const orphanedChildren: string[] = fileTreeStore.deleteFolderAndChildFolders(uuid)
    documentStore.deleteDocuments(orphanedChildren)
  }
}

const ContextMenuFolderItems = ({ uuid }: { uuid: string }) => <>
  <ListItemSpan>Rename</ListItemSpan>
  <ListItemSpan onClick={() => {deleteFolderWithConfirmation(uuid)}}>Delete</ListItemSpan>
</>

const ContextMenuFileItems = ({ uuid }: { uuid: string }) => <>
  <ListItemSpan>Rename</ListItemSpan>
  <ListItemSpan onClick={() => { documentStore.deleteDocument(uuid) }}>Delete</ListItemSpan>
</>

export const FileTreeComponent = observer((
  {
    fileSystemItemDetails,
    relativeItemUuids
  }: FileTreeComponentProps) => {
  const { item, uuid, parentUuid } = fileSystemItemDetails
  const [dragging, setDragging] = useState<boolean>(false)
  const isFolder = item.isFolder

  const fileName = isFolder ? fileTreeStore.folderDetails.get(uuid)?.name ?? 'Folder name not found' : documentStore.documentIdentifiers.get(uuid)?.documentTitle ?? 'Filename not found'

  const { openContextMenu } = useContextMenu()

  const onClick = action<MouseEventHandler>((event) => {
    if (event.shiftKey && event.ctrlKey) {
      fileSelectionStore.shiftClickItem(uuid, false)
    } else if (event.ctrlKey) {
      fileSelectionStore.controlClickItem(uuid)
    } else if (event.shiftKey) {
      fileSelectionStore.shiftClickItem(uuid, true)
    } else {
      isFolder ? fileTreeStore.collapseFolder(uuid) : fileSelectionStore.selectItem(uuid)
    }
  })

  const onContextMenu: MouseEventHandler = action((event) => {
    event.preventDefault()
    if (!fileSelectionStore.isSelected(uuid)) fileSelectionStore.selectItem(uuid)
    if (event.shiftKey || event.ctrlKey) return
    openContextMenu({ x: event.pageX, y: event.pageY, contextMenuItems: isFolder ? <ContextMenuFolderItems uuid={uuid} /> : <ContextMenuFileItems uuid={uuid} /> })
  })

  const itemIdentity: FileSystemItemIdentity = { uuid, isFolder, parentUuid }

  return <FileSystemItemWrapper setDragging={setDragging} itemIdentity={itemIdentity} fileName={fileName}>
    <FileSystemItemHoverDiv uuid={uuid}
                            title={fileName}
                            onClick={onClick}
                            onContextMenu={onContextMenu}
                            isDragging={dragging}
                            isFolder={isFolder}
                            relativeItemUuids={relativeItemUuids}
                            level={fileSystemItemDetails.level} />
  </FileSystemItemWrapper>
})