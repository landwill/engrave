import { ChevronRight } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { COMMON_BORDER_RADIUS } from '../../consts.ts'
import { ListItemProps } from '../../interfaces.ts'
import { documentStore } from '../../stores/DocumentStore.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.ts'
import { CHEVRON_WIDTH, FolderIndentLine } from '../icons/FolderIndentLine.tsx'
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
    const isOpen = fileTreeStore.foldersDetails.get(uuid)?.isOpen ?? false
    const isActive = documentStore.selectedDocumentUuid === uuid

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

    return <div style={{
      display: 'flex',
      flexDirection: 'row',
      lineHeight: 'normal',
      alignItems: 'center',
      marginLeft: '8px',
      marginRight: '6px',
      borderRadius: COMMON_BORDER_RADIUS,
      opacity: isDragging ? 0.5 : undefined
    }} className={className} onClick={onClick}>
      {
        Array.from({ length: level }, (_, i) => <FolderIndentLine key={i} />)
      }
      {
        isFolder && <ChevronRight className={chevronClassName} style={{ flexShrink: 0 }} size={CHEVRON_WIDTH} />
      }
      {useMemo(() => {
          return <ListItemSpan additionalClassName={spanClassName} actionItem={false}
                               onContextMenu={onContextMenu}
                               coloredHover={false}>{title || 'Untitled'}</ListItemSpan>
        },
        [onContextMenu, spanClassName, title])}
    </div>
  })