import { DownloadIcon, FileIcon, GitCommitIcon, HelpCircleIcon, SearchIcon, SunMoonIcon, UploadIcon } from 'lucide-react'
import { LeftPanelButton, LeftPanelIcon } from './LeftPanelButton.tsx'
import { PanelBox } from './PanelBox.tsx'

const icons: LeftPanelIcon[] = [
  {
    buttonName: 'Files',
    Icon: FileIcon
  }, {
    buttonName: 'Search files',
    Icon: SearchIcon
  }, {
    buttonName: 'Git',
    Icon: GitCommitIcon
  }, {
    buttonName: 'Import',
    Icon: UploadIcon,
  }, {
    buttonName: 'Export',
    Icon: DownloadIcon
  }, {
    buttonName: 'About',
    Icon: HelpCircleIcon,
    action: () => {alert('Coming soon!') /*todo*/}
  }, {
    buttonName: 'Toggle light/dark mode',
    Icon: SunMoonIcon,
    action: () => {alert('Coming soon!') /*todo*/},
    additionalProps: { marginTop: 'auto' }
  }
]

export function LeftPanel() {
  return <PanelBox>
    <div style={{ marginTop: '1em', marginLeft: '1em', marginRight: '1em', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {
        icons.map(icon => <LeftPanelButton key={icon.buttonName} icon={icon} />)
      }
    </div>
  </PanelBox>
}