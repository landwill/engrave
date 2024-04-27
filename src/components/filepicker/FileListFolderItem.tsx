import { ChevronRight, FileIcon, FolderIcon } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { CHEVRON_WIDTH, COMMON_BORDER_RADIUS } from '../../consts.ts'
import { ListItemProps } from '../../interfaces.ts'
import { documentStore } from '../../stores/DocumentStore.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.ts'
import { ListItemSpan } from '../ListItemSpan.tsx'

export const FileListFolderItem = observer(
  ({
      onContextMenu,
      onClick,
      uuid,
      title,
      isDragging,
      isDraggedOver,
      isFolder,
      level = 0
    }: Readonly<ListItemProps & { isDragging: boolean, isFolder: boolean, level: number, isDraggedOver: boolean }>
  ) => {
    const isOpen = fileTreeStore.folderDetails.get(uuid)?.isOpen ?? false
    const isActive = documentStore.selectedDocumentUuids.has(uuid)

    const classNames = ['list-item']
    if (isActive) classNames.push('active')
    const className = classNames.join(' ')

    const chevronClassNames = [isOpen ? 'expanded' : 'collapsed']
    let spanClassName = undefined
    if (!title.trim()) {
      spanClassName = 'untitled'
      chevronClassNames.push('untitled')
      title = 'Untitled'
    }
    const chevronClassName = chevronClassNames.join(' ')

    const FolderOrFileIcon = isFolder ? FolderIcon : FileIcon

    return <div style={{
      display: 'flex',
      flexDirection: 'row',
      lineHeight: 'normal',
      alignItems: 'center',
      marginLeft: '8px',
      paddingLeft: `${String(level * 16)}px`,
      marginRight: '6px',
      borderRadius: COMMON_BORDER_RADIUS,
      opacity: isDragging ? 0.5 : undefined,
      outline: isDraggedOver ? '1px solid transparent' : undefined
    }} className={className} onClick={onClick}>
      {
        isFolder && <ChevronRight className={chevronClassName} style={{ flexShrink: 0 }} size={CHEVRON_WIDTH} />
      }
      <FolderOrFileIcon size={16} style={{ flexShrink: 0, color: 'var(--color)' }} />
      {useMemo(() => {
          return <ListItemSpan additionalClassName={spanClassName} actionItem={false}
                               onContextMenu={onContextMenu}
                               coloredHover={false}>{title || 'Untitled'}</ListItemSpan>
        },
        [onContextMenu, spanClassName, title])}
    </div>
  })