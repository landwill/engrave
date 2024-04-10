import { LucideIcon } from 'lucide-react'
import React, { MouseEventHandler, useRef, useState } from 'react'
import { Tooltip } from './Tooltip.tsx'

export interface PanelIcon {
  Icon: LucideIcon
  buttonName: string
  action?: MouseEventHandler
  additionalProps?: React.CSSProperties
}

const getMargins = (direction: 'horizontal' | 'vertical') => {
  if (direction === 'horizontal') {
    return { marginBottom: undefined, marginRight: '1em' }
  } else {
    return { marginBottom: '1em', marginRight: undefined }
  }
}

interface IconPanelButtonProps {
  icon: PanelIcon
  direction: 'horizontal' | 'vertical'
}

export function IconPanelButton({ icon, direction }: IconPanelButtonProps) {
  const [tooltip, setTooltip] = useState<{ isOpen: boolean, x: number, y: number }>({ isOpen: false, x: 0, y: 0 })
  const opacity = icon.action == null ? 0.4 : 1
  const pointerEvents = icon.action == null ? 'none' : undefined
  const { marginBottom, marginRight } = getMargins(direction)
  const tooltipTimeoutRef = useRef<number | null>(null)

  const openTooltip = ({ x, y }: { x: number, y: number }) => {
    setTooltip({ isOpen: true, x, y })
  }

  const closeTooltip = () => {
    setTooltip({ isOpen: false, x: 0, y: 0 })
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current)
      tooltipTimeoutRef.current = null
    }
  }

  return <>
    <div
      style={{
        opacity,
        pointerEvents,
        marginBottom,
        marginRight,
        cursor: 'pointer',
        ...icon.additionalProps
      }}
      onMouseEnter={(e) => {
        tooltipTimeoutRef.current = setTimeout(() => {openTooltip({ x: e.pageX + 15, y: e.pageY - 10 })}, 500)
      }}
      onMouseLeave={closeTooltip}
      onClick={icon.action}
    >
      <icon.Icon size={20}/>
    </div>
    {tooltip.isOpen && <Tooltip tooltip={tooltip} text={icon.buttonName} />
    }
  </>
}