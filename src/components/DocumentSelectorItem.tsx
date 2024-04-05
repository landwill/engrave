import { CSSProperties, MouseEventHandler } from 'react'

interface DocumentSelectorItemProps {
  isActive: boolean
  filename: string
  onClick?: MouseEventHandler
}

const SPAN_STYLE: CSSProperties = { marginBottom: '0.25em', textOverflow: 'ellipsis', textWrap: 'nowrap', overflow: 'hidden', paddingLeft: '1em', paddingRight: '1em', flexShrink: 0 }

export function DocumentSelectorItem({ isActive, filename, onClick }: DocumentSelectorItemProps) {
  let className = 'document-selector-item'
  if (isActive) className += ' active'

  return <span className={className}
               style={SPAN_STYLE}
               onClick={onClick}>
            {filename}
        </span>
}