import { ChevronRight } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { COMMON_BORDER_RADIUS } from '../../consts.ts'
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
      isFolder,
      level = 0
    }: Readonly<ListItemProps & { isDragging: boolean, isFolder: boolean, level: number }>
  ) => {
    const isOpen = fileTreeStore.foldersDetails.find(f => f.uuid === uuid)?.isOpen ?? false
    const isActive = documentStore.selectedDocumentUuid === uuid

    const classNames = ['list-item']
    if (isActive) classNames.push('active')

    if (!title.trim()) {
      title = 'Untitled'
      classNames.push('untitled')
    }
    // const effectiveTitle = (title == null || title == '') ? 'Untitled' : title
    const className = classNames.join(' ')

    return <div style={{
      display: 'flex',
      flexDirection: 'row',
      lineHeight: 'normal',
      alignItems: 'center',
      marginLeft: `${String(8 + level * 16)}px`,
      marginRight: '6px',
      borderRadius: COMMON_BORDER_RADIUS,
      opacity: isDragging ? 0.5 : undefined
    }} className={className} onClick={onClick}>
      {
        isFolder && <ChevronRight className={isOpen ? 'expanded' : 'collapsed'} style={{ flexShrink: 0 }} size={16} />}
      {useMemo(() => <ListItemSpan actionItem={false}
                                   onContextMenu={onContextMenu}
                                   coloredHover={false}>{title == '' ? 'Untitled' : title}</ListItemSpan>,
        [onContextMenu, title])}
    </div>
  })