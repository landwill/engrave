import { CSSProperties, MouseEventHandler } from 'react'

interface DocumentSelectorItemProps {
  isActive: boolean
  title: string
  onClick?: MouseEventHandler
}

const SPAN_STYLE: CSSProperties = {
  marginBottom: '0.25em',
  textOverflow: 'ellipsis',
  textWrap: 'nowrap',
  overflow: 'hidden',
  paddingLeft: '1em',
  paddingRight: '1em',
  flexShrink: 0
}

function getTitleAndClassName(title: string, isActive: boolean) {
  let effectiveTitle = title
  let className = 'document-selector-item'
  if (isActive) className += ' active'
  if (title.trim() == '') {
    className += ' untitled'
    effectiveTitle = 'Untitled'
  }
  return { effectiveTitle, className }
}

export function DocumentSelectorItem({ isActive, title, onClick }: DocumentSelectorItemProps) {
  const { effectiveTitle, className } = getTitleAndClassName(title, isActive)

  return <span className={className}
               style={SPAN_STYLE}
               onClick={onClick}>
            {effectiveTitle}
        </span>
}