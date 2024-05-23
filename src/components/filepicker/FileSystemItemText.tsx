import { MouseEventHandler } from 'react'
import { ListItemSpan } from '../ListItemSpan.tsx'

interface FileSystemItemTextProps {
  title: string
  onContextMenu?: MouseEventHandler
}

export const FileSystemItemText = ({ title, onContextMenu }: FileSystemItemTextProps) => {
  const isUntitled = !title.trim()
  const spanClassName = isUntitled ? 'untitled' : undefined
  const displayedTitle = title || 'Untitled'

  return <ListItemSpan additionalClassName={spanClassName}
                       actionItem={false}
                       onContextMenu={onContextMenu}
                       coloredHover={false}>
    {displayedTitle}
  </ListItemSpan>
}