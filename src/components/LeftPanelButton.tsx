import { LucideIcon } from 'lucide-react'
import React from 'react'

export interface LeftPanelIcon {
  Icon: LucideIcon
  action?: () => void // todo implement pages
  buttonName: string
  additionalProps?: React.CSSProperties
}

export function LeftPanelButton({ icon }: { icon: LeftPanelIcon }) {
  const opacity = icon.action == null ? 0.4 : 1
  const pointerEvents = icon.action == null ? 'none' : undefined

  return <div
    style={{
      opacity,
      pointerEvents,
      marginBottom: '1em',
      cursor: 'pointer',
      ...icon.additionalProps
    }}
    onClick={icon.action}>
    <icon.Icon />
  </div>
}