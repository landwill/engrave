import { MouseEventHandler } from 'react'

export interface Document {
  key: string
  documentName: string
}

interface DocumentSelectorItemProps {
  selectedDocument: string
  file: Document
  onClick: MouseEventHandler
}

export function DocumentSelectorItem({ selectedDocument, onClick, file }: DocumentSelectorItemProps) {
  const className = selectedDocument === file.key ? 'active' : undefined

  return <span className={className}
               style={{ marginBottom: '0.25em', textOverflow: 'ellipsis', textWrap: 'nowrap', overflow: 'hidden' }}
               onClick={onClick}>
            {file.documentName}
        </span>
}