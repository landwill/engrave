interface TooltipProps {
  tooltip: { isOpen: boolean; x: number; y: number, text: string }
}

export function Tooltip({ tooltip }: TooltipProps) {
  return <div style={{
    position: 'fixed',
    opacity: tooltip.isOpen ? 1 : 0,
    transition: 'opacity 300ms',
    left: tooltip.x,
    top: tooltip.y,
    pointerEvents: 'none',
    zIndex: 100,
    paddingTop: '0.25em',
    paddingBottom: '0.25em',
    paddingLeft: '0.5em',
    paddingRight: '0.5em',
    borderRadius: '0.5em',
    fontSize: '0.8em',
    backgroundColor: 'var(--tooltip-background-color)',
    color: 'var(--tooltip-font-color)',
    transform: 'translateY(-50%)'
  }}>
    {tooltip.text}
  </div>
}