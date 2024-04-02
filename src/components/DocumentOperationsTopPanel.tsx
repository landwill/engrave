import { IconPanel } from './IconPanel.tsx'
import { PanelIcon } from './IconPanelButton.tsx'

interface DocumentOperationsTopPanelProps {
  icons: PanelIcon[]
}

export function DocumentOperationsTopPanel({ icons }: DocumentOperationsTopPanelProps) {
  return <IconPanel icons={icons} direction='horizontal' centered divProps={{ marginBottom: '0.5em' }} />
}