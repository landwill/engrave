import { observer } from 'mobx-react-lite'
import { RefObject } from 'react'
import { ListItemProps } from '../../interfaces.ts'
import { documentStore } from '../../stores/DocumentStore.ts'
import { ListItem } from '../ListItem.tsx'
import { getTitleAndClassName } from './utils.tsx'

export const FileListFileItem = observer(({ onContextMenu, onClick, uuid, title, innerRef, isDragging }: ListItemProps & { innerRef: RefObject<HTMLDivElement>, isDragging: boolean }) => {
  const isActive = documentStore.selectedDocumentUuid === uuid

  const { effectiveTitle, className } = getTitleAndClassName(title, isActive)

  return <div style={{ display: 'flex', flexDirection: 'row', lineHeight: 'normal', marginLeft: '4px', opacity: isDragging ? 0.5 : 1 }} ref={innerRef}>
    <ListItem additionalClassName={className}
              onClick={onClick}
              onContextMenu={onContextMenu}
    >
      {effectiveTitle}
    </ListItem>
  </div>
})