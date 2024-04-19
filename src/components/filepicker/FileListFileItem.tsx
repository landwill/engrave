import { observer } from 'mobx-react-lite'
import { ListItemProps } from '../../interfaces.ts'
import { documentStore } from '../../stores/DocumentStore.ts'
import { ListItem } from '../ListItem.tsx'
import { getTitleAndClassName } from './utils.tsx'

export const FileListFileItem = observer(({ onContextMenu, onClick, uuid, title }: ListItemProps) => {
  const isActive = documentStore.selectedDocumentUuid === uuid

  const { effectiveTitle, className } = getTitleAndClassName(title, isActive)

  return <div style={{ display: 'flex', flexDirection: 'row', lineHeight: 'normal' }}>
    <ListItem additionalClassName={className}
                      onClick={onClick}
                      onContextMenu={onContextMenu}
    >
      {effectiveTitle}
    </ListItem>
  </div>
})