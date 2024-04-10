import { DownloadIcon, FileIcon, GitCommitIcon, HelpCircleIcon, SearchIcon, SunMoonIcon, UploadIcon } from 'lucide-react'
import React from 'react'
import { documentStore } from '../stores/DocumentStore.ts'
import { toggleDarkMode } from '../utils.ts'
import { IconPanel } from './IconPanel.tsx'
import { PanelIcon } from './IconPanelButton.tsx'

const LEFT_PANEL_ICONS: PanelIcon[] = [
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
    Icon: UploadIcon
  }, {
    buttonName: 'Export',
    Icon: DownloadIcon
  }, {
    buttonName: 'About',
    Icon: HelpCircleIcon,
    action: () => {documentStore.deselectDocument()}
  }, {
    buttonName: 'Toggle light/dark mode',
    Icon: SunMoonIcon,
    action: toggleDarkMode,
    additionalProps: { marginTop: 'auto', marginBottom: 0 }
  }
]

export const LeftPanel = React.memo(function LeftPanel() {
  return <IconPanel icons={LEFT_PANEL_ICONS} direction='vertical' />
})