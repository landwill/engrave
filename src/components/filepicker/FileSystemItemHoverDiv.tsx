import { FileIcon, FolderIcon } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { CSSProperties } from 'react'
import { COMMON_BORDER_RADIUS } from '../../consts.ts'
import { ListItemProps, RelativeItemUuids } from '../../interfaces.ts'
import { fileSelectionStore } from '../../stores/FileSelectionStore.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.ts'
import { FileSystemItemText } from './FileSystemItemText.tsx'
import { OptionalFolderExpander } from './OptionalFolderExpander.tsx'

const getClassName = (uuid: string) => {
  const isActive = fileSelectionStore.selectedItems.has(uuid)

  const classNames = ['list-item']
  if (isActive) classNames.push('active')
  return classNames.join(' ')
}

const getBorderRadius = (relativeItemUuids: RelativeItemUuids): CSSProperties => {
  const isAboveItemSelected = fileSelectionStore.isSelected(relativeItemUuids.above)
  const isBelowItemSelected = fileSelectionStore.isSelected(relativeItemUuids.below)

  return {
    borderTopRightRadius: isAboveItemSelected ? undefined : COMMON_BORDER_RADIUS,
    borderTopLeftRadius: isAboveItemSelected ? undefined : COMMON_BORDER_RADIUS,
    borderBottomRightRadius: isBelowItemSelected ? undefined : COMMON_BORDER_RADIUS,
    borderBottomLeftRadius: isBelowItemSelected ? undefined : COMMON_BORDER_RADIUS
  }
}

export const FileSystemItemHoverDiv = observer(
  ({
      onContextMenu,
      onClick,
      uuid,
      title,
      isDragging,
      isFolder,
      relativeItemUuids,
      level = 0
    }: Readonly<ListItemProps & { isDragging: boolean, isFolder: boolean, level: number, relativeItemUuids: RelativeItemUuids }>
  ) => {
    const isOpen = fileTreeStore.folderDetails.get(uuid)?.isOpen ?? false
    const className = getClassName(uuid)

    const FileSystemIcon = isFolder ? FolderIcon : FileIcon
    const indentationLevel = isFolder ? level : level + 1

    const style: CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      lineHeight: 'normal',
      alignItems: 'center',
      marginLeft: 12,
      marginRight: 12,
      paddingLeft: `${String(indentationLevel * 20)}px`,
      borderRadius: COMMON_BORDER_RADIUS,
      ...getBorderRadius(relativeItemUuids),
      opacity: isDragging ? 0.5 : undefined
    }

    return <div style={style} className={className} onClick={onClick} onContextMenu={onContextMenu}>
      <OptionalFolderExpander isFolder={isFolder} isOpen={isOpen} title={title} />
      <FileSystemIcon size={16} style={{ flexShrink: 0, color: 'var(--color)' }} />
      <FileSystemItemText title={title} />
    </div>
  })