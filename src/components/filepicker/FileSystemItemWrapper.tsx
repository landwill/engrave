import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview'
import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types'
import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import invariant from 'tiny-invariant'
import { DraggableSource, DropTargetLocation } from '../../interfaces.ts'

const STYLES = {
  hovered: {
    border: '1px solid var(--dnd-hover-border)',
    backgroundColor: 'var(--dnd-hover-background)'
  },
  idle: {
    border: '1px solid transparent'
  }
}

export interface DraggableFileDetailsBase {
  uuid: string
  setDragging: React.Dispatch<React.SetStateAction<boolean>>,
  fileName: string,
  isFolder: boolean
}

export interface CustomDraggableFileDetails extends DraggableFileDetailsBase {
  element: HTMLDivElement
}

function customDraggable({ element, uuid, setDragging, fileName, isFolder }: CustomDraggableFileDetails): CleanupFn {
  return draggable({
    element,
    getInitialData: () => ({ source: { uuid, isFolder } as DraggableSource }),
    onDragStart: () => {setDragging(true)},
    onDrop: () => {setDragging(false)},
    onGenerateDragPreview: ({ nativeSetDragImage }) => {
      setCustomNativeDragPreview({
        getOffset: () => ({ x: -20, y: -8 }),
        nativeSetDragImage,
        render({ container }) {
          const root = ReactDOM.createRoot(container)
          root.render(<div>{fileName}</div>)
          return () => {root.unmount()}
        }
      })
    }
  })
}

interface CustomDropTargetDetails {
  element: HTMLDivElement
  folderUuid: string | undefined
  setIsDraggedOver: React.Dispatch<React.SetStateAction<boolean>>
  isFolder: boolean
}

function customDroppable({ element, folderUuid, setIsDraggedOver, isFolder }: CustomDropTargetDetails) {
// function customDroppable(element: HTMLDivElement, uuid: string | undefined, setIsDraggedOver: React.Dispatch<React.SetStateAction<boolean>>, isFolder: boolean) {
  return dropTargetForElements({
    element,
    onDragEnter: () => {setIsDraggedOver(true)},
    onDragLeave: () => {setIsDraggedOver(false)},
    onDrop: () => {
      setIsDraggedOver(false)
    },
    getData: () => ({ location: { uuid: folderUuid } as DropTargetLocation }),
    canDrop: () => isFolder
  })
}

export interface FileSystemItemIdentity {
  uuid: string
  isFolder: boolean
  parentUuid?: string
}

interface FileSystemItemWrapperProps {
  hovered: boolean
  fileName: string
  itemIdentity: FileSystemItemIdentity
  setDragging: React.Dispatch<React.SetStateAction<boolean>>
  setIsDraggedOver: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode | React.ReactNode[]
}

export const FileSystemItemWrapper = ({
  hovered,
  fileName,
  itemIdentity,
  setDragging,
  setIsDraggedOver,
  children
}: FileSystemItemWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const { uuid, isFolder, parentUuid } = itemIdentity
  const folderUuid = isFolder ? uuid : parentUuid

  useEffect(() => {
    const element = ref.current
    invariant(element)

    return combine(
      customDraggable({ element, uuid, fileName, isFolder, setDragging }),
      customDroppable({ element, folderUuid, setIsDraggedOver, isFolder: true })
    )
  }, [fileName, folderUuid, isFolder, setDragging, setIsDraggedOver, uuid])

  const style = hovered ? STYLES.hovered : STYLES.idle

  return <div ref={ref} style={style}>
    {children}
  </div>
}