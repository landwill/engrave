import { CSSProperties, Reducer, useReducer } from 'react'
import { TooltipDetails, TooltipDispatch } from '../interfaces.ts'
import { IconPanelButton, PanelIcon } from './IconPanelButton.tsx'
import { PanelBox } from './PanelBox.tsx'
import { Tooltip } from './Tooltip.tsx'

interface IconPanelProps {
  icons: PanelIcon[]
  direction: 'horizontal' | 'vertical'
  centered?: boolean
  divProps?: CSSProperties
}

export function IconPanel({ icons, direction, centered = false, divProps }: IconPanelProps) {
  const [tooltip, setTooltip] = useReducer<Reducer<TooltipDetails, TooltipDispatch>>((state, action) => {
    return { ...state, ...action }
  }, { isOpen: false, x: 0, y: 0, text: '' })
  return <PanelBox direction={direction}>
    <div style={{
      margin: '0.5em',
      flexGrow: 1,
      lineHeight: 0,
      display: 'flex',
      flexDirection: direction === 'vertical' ? 'column' : 'row',
      userSelect: 'none',
      justifyContent: centered ? 'center' : undefined,
      ...divProps
    }}>
      {
        icons.filter(i => i.visible == null || i.visible)
          .map(icon => <IconPanelButton key={icon.buttonName} icon={icon} direction={direction} setTooltip={setTooltip} />)
      }
    </div>
    {
      <Tooltip tooltip={tooltip} />
    }
  </PanelBox>
}