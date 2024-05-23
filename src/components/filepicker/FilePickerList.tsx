import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import { BaseEventPayload, DropTargetRecord, ElementDragType } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types'
import { dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { action } from 'mobx'
import { useEffect, useRef } from 'react'
import { DraggableSource, DropTargetLocation } from '../../interfaces.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.ts'
import { FileOrFolderEntryCollection } from './FileOrFolderEntryCollection.tsx'
import { FilePickerListWrapper } from './FilePickerListWrapper.tsx'
import { moveElementToFolderIfApplicable } from './utils.ts'

const moveDraggedElementToDestination = ({ source, location }: BaseEventPayload<ElementDragType>) => {
  const sourceData = source.data.source as DraggableSource | null | undefined
  if (!sourceData) return

  const destination = location.current.dropTargets[0] as DropTargetRecord | null
  if (!destination) return

  const destinationLocation = destination.data.location as DropTargetLocation
  moveElementToFolderIfApplicable(sourceData, destinationLocation.uuid, fileTreeStore.fileTreeData)
}

export const FilePickerList = () => {
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
        getData: () => ({ location: { uuid: undefined } as DropTargetLocation })
      }))
  }, [])

  return <FilePickerListWrapper innerRef={filePickerListRef}>
    <FileOrFolderEntryCollection />
  </FilePickerListWrapper>
}