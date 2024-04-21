import { ChevronRight } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { RefObject, useMemo } from 'react'
import { ListItemProps } from '../../interfaces.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.ts'
import { ListItem } from '../ListItem.tsx'

export const FileListFolderItem = observer(({ onContextMenu, onClick, uuid, title, innerRef, isDragging }: ListItemProps & {
  innerRef: RefObject<HTMLDivElement>,
  isDragging: boolean,
}) => {
  const isOpen = fileTreeStore.foldersDetails.find(f => f.uuid === uuid)?.isOpen ?? false

  return <div style={{ display: 'flex', flexDirection: 'row', lineHeight: 'normal', alignItems: 'center', opacity: isDragging ? 0.5 : 1 }} ref={innerRef}>
    <ChevronRight className={isOpen ? 'expanded' : 'collapsed'} style={{ flexShrink: 0 }} size={16} />
    {useMemo(() => <ListItem onClick={onClick} onContextMenu={onContextMenu}>{title}</ListItem>, [onClick, onContextMenu, title])}
  </div>
})