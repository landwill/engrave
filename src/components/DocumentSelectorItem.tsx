import { MouseEventHandler } from 'react'

interface DocumentSelectorItemProps {
  isActive: boolean
  filename: string
  onClick?: MouseEventHandler
}

export function DocumentSelectorItem({ isActive, filename, onClick }: DocumentSelectorItemProps) {
  let className = 'document-selector-item'
  if (isActive) className += ' active'

  return <span className={className}
               style={{ marginBottom: '0.25em', textOverflow: 'ellipsis', textWrap: 'nowrap', overflow: 'hidden' }}
               onClick={onClick}>
            {filename}
        </span>
}