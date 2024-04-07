import { observer } from 'mobx-react-lite'
import { MouseEventHandler } from 'react'
import { useContextMenu } from '../hooks/useContextMenu.tsx'
import { ListItem } from './ListItem.tsx'

interface DocumentSelectorItemProps {
  isActive: boolean
  title: string
  onClick?: MouseEventHandler
}

function getTitleAndClassName(title: string, isActive: boolean) {
  const classNames = []
  let effectiveTitle = title
  if (isActive) classNames.push('active')
  if (title.trim() == '') {
    classNames.push('untitled')
    effectiveTitle = 'Untitled'
  }
  return { effectiveTitle, className: classNames.join(' ') }
}

export const DocumentSelectorItem = observer(({ isActive, title, onClick }: DocumentSelectorItemProps) => {
  const { effectiveTitle, className } = getTitleAndClassName(title, isActive)
  const { setOpen } = useContextMenu()

  return <ListItem additionalClassName={className} onClick={onClick} onContextMenu={e => {
    e.preventDefault()
    setOpen({ x: e.pageX, y: e.pageY })
  }}>
    {effectiveTitle}
  </ListItem>
})