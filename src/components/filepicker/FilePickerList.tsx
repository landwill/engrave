import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import { dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { DropTargetRecord } from '@atlaskit/pragmatic-drag-and-drop/types'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { CSSProperties, useEffect, useRef } from 'react'
import { DraggableSource, DropTargetLocation, FileTreeItem } from '../../interfaces.ts'
import { documentStore } from '../../stores/DocumentStore.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.ts'
import { FileTreeComponent } from './FileTreeComponents.tsx'
import { flattenFileTreeUuids, moveElementToFolder } from './utils.ts'

const DIV_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '1em',
  width: '200px',
  userSelect: 'none',
  overflowY: 'auto',
  height: '100%'
}

export const FilePickerList = observer(() => {
  const fileTreeUuids = flattenFileTreeUuids(fileTreeStore.fileTreeData, 'all')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (element == null) throw new Error('null FilePickerList ref.current')

    return combine(monitorForElements({
        onDrop: action(({ source, location }) => {
          const sourceData = source.data.source as DraggableSource | null | undefined // unsure if null or defined, so declaring both
          if (sourceData == null) return
          const { uuid, isFolder: sourceIsFolder } = sourceData
          const destination: DropTargetRecord | undefined = location.current.dropTargets[0]

          // suppressed because despite Pragmatic's type-hinting, null/undefined is possible
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (destination == null) return
          const destinationLocation = destination.data.location as DropTargetLocation
          moveElementToFolder(fileTreeStore.fileTreeData, uuid, destinationLocation.uuid, sourceIsFolder)
        })
      }),
      dropTargetForElements({ element, getData: () => ({ location: { uuid: undefined } as DropTargetLocation }) }))
  }, [])

  const displayedOrder: string[] = []

  return <div style={DIV_STYLE} id='file-picker-list' ref={ref}>
    {
      Array.from(fileTreeStore.fileTreeData.entries()).map(([uuid, item]) => {
        displayedOrder.push(uuid)
        return <FileTreeComponent key={uuid} item={item} uuid={uuid} />
      })
    }
    {
      Array.from(documentStore.documentIdentifiers.entries())
        .filter(([fileUuid]) => !fileTreeUuids.includes(fileUuid))
        .map(([fileUuid]) => {
          displayedOrder.push(fileUuid)
          return <FileTreeComponent key={fileUuid} item={{ isFolder: false } satisfies FileTreeItem} uuid={fileUuid} />
        })
    }
  </div>
})