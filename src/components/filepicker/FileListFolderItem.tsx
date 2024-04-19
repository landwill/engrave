import { ChevronRight } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { ListItemProps } from '../../interfaces.ts'
import { fileTreeStore } from '../../stores/FileTreeStore.ts'
import { ListItem } from '../ListItem.tsx'

export const FileListFolderItem = observer(({ onContextMenu, onClick, uuid, title }: ListItemProps) => {
  const isOpen = fileTreeStore.foldersDetails.find(f => f.uuid === uuid)?.isOpen ?? false

  return <div style={{ display: 'flex', flexDirection: 'row', lineHeight: 'normal', alignItems: 'center' }}>
    <ChevronRight className={isOpen ? 'expanded' : 'collapsed'} style={{ flexShrink: 0 }} size={16} />
    {useMemo(() => <ListItem onClick={onClick} onContextMenu={onContextMenu}>{title}</ListItem>, [onClick, onContextMenu, title])}
  </div>
})