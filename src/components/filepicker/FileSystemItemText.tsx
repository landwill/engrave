import { ListItemSpan } from '../ListItemSpan.tsx'

interface FileSystemItemTextProps {
  title: string
}

export const FileSystemItemText = ({ title }: FileSystemItemTextProps) => {
  const isUntitled = !title.trim()
  const spanClassName = isUntitled ? 'untitled' : undefined
  const displayedTitle = title || 'Untitled'

  return <ListItemSpan additionalClassName={spanClassName}
                       actionItem={false}
                       coloredHover={false}>
    {displayedTitle}
  </ListItemSpan>
}