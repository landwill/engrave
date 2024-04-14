import { LucideIcon } from 'lucide-react'
import React, { MouseEventHandler, useRef } from 'react'
import { TOOLTIP_OFFSET_X } from '../consts.ts'
import { TooltipDetails } from '../interfaces.ts'

export interface PanelIcon {
  Icon: LucideIcon
  buttonName: string
  action?: MouseEventHandler
  additionalProps?: React.CSSProperties
}

interface IconPanelButtonProps {
  icon: PanelIcon
  direction: 'horizontal' | 'vertical'
  setTooltip: React.Dispatch<React.SetStateAction<TooltipDetails>>
}

export const IconPanelButton = ({ icon, setTooltip }: IconPanelButtonProps) => {
  const opacity = icon.action == null ? 0.4 : 1
  const pointerEvents = icon.action == null ? 'none' : undefined
  const tooltipTimeoutRef = useRef<number | null>(null)

  const openTooltip = ({ x, y }: { x: number, y: number }) => {
    setTooltip({ isOpen: true, x, y, text: icon.buttonName })
  }

  const closeTooltip = () => {
    setTooltip({ isOpen: false, x: 0, y: 0, text: '' })
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current)
      tooltipTimeoutRef.current = null
    }
  }

  const showTooltip = (e: React.MouseEvent<HTMLDivElement>) => {
    const divRect = e.currentTarget.getBoundingClientRect()
    const y = divRect.top + divRect.height / 2
    const x = divRect.right + TOOLTIP_OFFSET_X
    tooltipTimeoutRef.current = setTimeout(() => {openTooltip({ x, y })}, 500)
  }

  return <>
    <div
      style={{
        opacity,
        pointerEvents,
        cursor: 'pointer',
        ...icon.additionalProps
      }}
      onMouseEnter={showTooltip}
      onMouseLeave={closeTooltip}
      onClick={icon.action}
    >
      <icon.Icon className='icon' style={{ padding: '0.5em' }} size={20}/>
    </div>
  </>
}