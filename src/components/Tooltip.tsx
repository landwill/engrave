interface TooltipProps {
  tooltip: { isOpen: boolean; x: number; y: number }
  text: string
}

export function Tooltip({ tooltip, text }: TooltipProps) {
  return <div style={{
    position: 'fixed',
    left: tooltip.x,
    top: tooltip.y,
    pointerEvents: 'none',
    zIndex: 100,
    paddingTop: '0.25em',
    paddingBottom: '0.25em',
    paddingLeft: '0.5em',
    paddingRight: '0.5em',
    border: '1px solid white',
    borderRadius: '0.5em',
    fontSize: '0.9em',
    backgroundColor: 'var(--panel-background-color)',
    color: 'var(--color)',
    boxShadow: '0px 0px 3px 0.4px var(--border-color)'
  }}>
    {text}
  </div>
}