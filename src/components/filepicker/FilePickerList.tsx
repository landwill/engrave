import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import { BaseEventPayload, ElementDragType } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types'
import { dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { action, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { CSSProperties, useEffect, useRef } from 'react'
import { DraggableSource, DropTargetLocation } from '../../interfaces.ts'
import { documentStore } from '../../stores/DocumentStore.ts'
import { fileSelectionStore } from '../../stores/FileSelectionStore.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.ts'
import { FileTreeComponent } from './FileTreeComponents.tsx'
import { flattenTreeWithLevels, moveElementToFolderIfApplicable } from './utils.ts'

const DIV_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '1em',
  width: '200px',
  userSelect: 'none',
  overflowY: 'auto',
  height: '100%'
}

const moveDraggedElementToDestination = ({ source, location }: BaseEventPayload<ElementDragType>) => {
  const sourceData = source.data.source as DraggableSource | null | undefined
  if (!sourceData) return

  const destination = location.current.dropTargets[0]
  if (!destination) return

  const destinationLocation = destination.data.location as DropTargetLocation
  moveElementToFolderIfApplicable(sourceData, destinationLocation.uuid, fileTreeStore.fileTreeData)
}

export const FilePickerList = observer(() => {
  // the ref is primarily for using the background div as a droptarget for files, to move them out of any folders
  const filePickerListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = filePickerListRef.current
    if (element == null) throw new Error('FilePickerListRef\'s .current was null')

    return combine(monitorForElements({
        onDrop: action(moveDraggedElementToDestination)
      }),
      dropTargetForElements({
        element,
        getData: () => ({ location: { uuid: undefined } as DropTargetLocation }) }))
  }, [])

  const orderedFileAndFolderList = flattenTreeWithLevels(fileTreeStore.fileTreeData, documentStore.documentIdentifiers)

  runInAction(() => {
    fileSelectionStore.displayedDocumentOrder = orderedFileAndFolderList.map(f => f.uuid)
  })

  return <div style={DIV_STYLE} id='file-picker-list' ref={filePickerListRef}>
    {
      orderedFileAndFolderList.map(filePickerListEntry => {
        return <FileTreeComponent key={filePickerListEntry.key}
                                  item={filePickerListEntry.item}
                                  uuid={filePickerListEntry.uuid}
                                  level={filePickerListEntry.level}
                                  parentUuid={filePickerListEntry.parentUuid} />
      })
    }
  </div>
})