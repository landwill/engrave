import { ChevronRight } from 'lucide-react'

const CHEVRON_WIDTH = 16

interface OptionalFolderExpanderProps {
  isFolder: boolean
  isOpen: boolean
  title: string
}

export const OptionalFolderExpander = ({ isFolder, isOpen, title }: OptionalFolderExpanderProps) => {
  if (!isFolder) return undefined
  const isUntitled = !title.trim()

  const chevronClassNames = [isOpen ? 'expanded' : 'collapsed']
  if (isUntitled) chevronClassNames.push('untitled')
  const chevronClassName = chevronClassNames.join(' ')

  return <ChevronRight className={chevronClassName} style={{ flexShrink: 0, marginRight: '4px' }} size={CHEVRON_WIDTH} />
}