import { PanelBox } from './PanelBox.tsx'

interface LeftPanelIcon {
  icon: string // todo add icons instead of text
  action?: any // todo implement pages
}

const icons: LeftPanelIcon[] = [
  {
    icon: 'Files',
  }, {
    icon: 'Search',
  }, {
    icon: 'Git',
  }, {
    icon: 'Import',
  }, {
    icon: 'Export',
  }
]

export function LeftPanel() {
  return <PanelBox>
    <div style={{ margin: '1em', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {
        icons.map(icon => <div style={{ marginBottom: '1em', opacity: icon.action == null ? 0.5 : 1, pointerEvents: icon.action == null ? 'none' : undefined }}>{icon.icon}</div>)
      }
      <div style={{ marginTop: 'auto', opacity: 0.5 }}>Dark / light</div>{/* todo implement toggle*/}
    </div>
  </PanelBox>
}