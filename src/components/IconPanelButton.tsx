import { LucideIcon } from 'lucide-react'
import React from 'react'

export interface PanelIcon {
  Icon: LucideIcon
  action?: () => void // todo implement pages
  buttonName: string
  additionalProps?: React.CSSProperties
}

const getMargins = (direction: 'horizontal' | 'vertical') => {
  if (direction === 'horizontal') {
    return { marginBottom: undefined, marginRight: '1em' }
  } else {
    return { marginBottom: '1em', marginRight: undefined }
  }
}

export function IconPanelButton({ icon, direction }: { icon: PanelIcon, direction: 'horizontal' | 'vertical' }) {
  const opacity = icon.action == null ? 0.4 : 1
  const pointerEvents = icon.action == null ? 'none' : undefined
  const { marginBottom, marginRight } = getMargins(direction)

  return <div
    style={{
      opacity,
      pointerEvents,
      marginBottom,
      marginRight,
      cursor: 'pointer',
      ...icon.additionalProps
    }}
    onClick={icon.action}>
    <icon.Icon />
  </div>
}