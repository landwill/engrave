import { ListItemSpan } from '../ListItemSpan.tsx'

interface FileSystemItemTextProps {
  title: string
}

export const FileSystemItemText = ({ title }: FileSystemItemTextProps) => {
  const trimmedTitle = title.trim()
  const isUntitled = !trimmedTitle
  const spanClassName = isUntitled ? 'untitled' : undefined
  const displayedTitle = trimmedTitle || 'Untitled'

  return <ListItemSpan additionalClassName={spanClassName}
                       actionItem={false}
                       coloredHover={false}>
    {displayedTitle}
  </ListItemSpan>
}