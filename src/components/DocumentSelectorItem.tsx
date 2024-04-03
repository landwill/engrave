import { MouseEventHandler } from 'react'

export interface EngraveDocument {
  fileId: string
  filename: string
  body: string
}

interface DocumentSelectorItemProps {
  selectedDocument: string
  fileId: string
  filename: string
  onClick?: MouseEventHandler
}

export function DocumentSelectorItem({ selectedDocument, fileId, filename, onClick }: DocumentSelectorItemProps) {
  const className = selectedDocument === fileId ? 'active' : undefined

  return <span className={className}
               style={{ marginBottom: '0.25em', textOverflow: 'ellipsis', textWrap: 'nowrap', overflow: 'hidden' }}
               onClick={onClick}>
            {filename}
        </span>
}