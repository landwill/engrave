import { MouseEventHandler } from 'react'

export interface EngraveDocument {
  fileId: string
  filename: string
  body: string
}

interface DocumentSelectorItemProps {
  isActive: boolean
  filename: string
  onClick?: MouseEventHandler
}

export function DocumentSelectorItem({ isActive, filename, onClick }: DocumentSelectorItemProps) {
  const className = isActive ? 'active' : undefined

  return <span className={className}
               style={{ marginBottom: '0.25em', textOverflow: 'ellipsis', textWrap: 'nowrap', overflow: 'hidden' }}
               onClick={onClick}>
            {filename}
        </span>
}