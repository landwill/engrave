import { FileIcon, FolderIcon } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { CSSProperties } from 'react'
import { COMMON_BORDER_RADIUS } from '../../consts.ts'
import { ListItemProps } from '../../interfaces.ts'
import { fileSelectionStore } from '../../stores/FileSelectionStore.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.ts'
import { FileSystemItemText } from './FileSystemItemText.tsx'
import { OptionalFolderExpander } from './OptionalFolderExpander.tsx'

function getClassName(uuid: string) {
  const isActive = fileSelectionStore.selectedDocumentUuids.has(uuid)

  const classNames = ['list-item']
  if (isActive) classNames.push('active')
  return classNames.join(' ')
}

export const FileSystemItemHoverDiv = observer(
  ({
      onContextMenu,
      onClick,
      uuid,
      title,
      isDragging,
      isFolder,
      level = 0
    }: Readonly<ListItemProps & { isDragging: boolean, isFolder: boolean, level: number }>
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
      marginLeft: '8px',
      paddingLeft: `${String(indentationLevel * 20)}px`,
      marginRight: '6px',
      borderRadius: COMMON_BORDER_RADIUS,
      opacity: isDragging ? 0.5 : undefined
    }

    return <div style={style} className={className} onClick={onClick}>
      <OptionalFolderExpander isFolder={isFolder} isOpen={isOpen} title={title} />
      <FileSystemIcon size={16} style={{ flexShrink: 0, color: 'var(--color)' }} />
      <FileSystemItemText title={title} onContextMenu={onContextMenu} />
    </div>
  })