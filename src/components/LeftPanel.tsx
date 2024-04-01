import { DownloadIcon, FileIcon, GitCommitIcon, HelpCircleIcon, SearchIcon, SunMoonIcon, UploadIcon } from 'lucide-react'
import { DARK_MODE_LOCALSTORAGE_KEY } from '../consts.ts'
import { setRootTheme, Theme } from '../utils.ts'
import { LeftPanelButton, LeftPanelIcon } from './LeftPanelButton.tsx'
import { PanelBox } from './PanelBox.tsx'

const getCurrentLightDarkMode = (): Theme => {
  const localStorageDarkMode = localStorage.getItem(DARK_MODE_LOCALSTORAGE_KEY)
  if (localStorageDarkMode != null) {
    return localStorageDarkMode === 'true' ? Theme.DARK : Theme.LIGHT
  }
  return Theme.LIGHT
}

const toggleDarkMode = () => {
  const currentMode = getCurrentLightDarkMode()
  setRootTheme(currentMode === Theme.DARK ? Theme.LIGHT : Theme.DARK)
}

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
    action: () => {alert('Coming soon') /*todo*/}
  }, {
    buttonName: 'Toggle light/dark mode',
    Icon: SunMoonIcon,
    action: toggleDarkMode,
    additionalProps: { marginTop: 'auto' }
  }
]

export function LeftPanel() {
  return <PanelBox>
    <div style={{ marginTop: '1em', marginLeft: '1em', marginRight: '1em', flexGrow: 1, display: 'flex', flexDirection: 'column', userSelect: 'none' }}>
      {
        icons.map(icon => <LeftPanelButton key={icon.buttonName} icon={icon} />)
      }
    </div>
  </PanelBox>
}