import { CSSProperties } from 'react'
import { IconPanelButton, PanelIcon } from './IconPanelButton.tsx'
import { PanelBox } from './PanelBox.tsx'

interface IconPanelProps {
  icons: PanelIcon[]
  direction: 'horizontal' | 'vertical'
  centered?: boolean
  divProps?: CSSProperties
}

export function IconPanel({ icons, direction, centered = false, divProps }: IconPanelProps) {
  return <PanelBox direction={direction}>
    <div style={{
      margin: '0.5em',
      flexGrow: 1,
      display: 'flex',
      flexDirection: direction === 'vertical' ? 'column' : 'row',
      userSelect: 'none',
      justifyContent: centered ? 'center' : undefined,
      ...divProps
    }}>
      {
        icons.filter(i => i.visible == null || i.visible)
          .map(icon => <IconPanelButton key={icon.buttonName} icon={icon} direction={direction} />)
      }
    </div>
  </PanelBox>
}