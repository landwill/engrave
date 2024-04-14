import { BugIcon, DownloadIcon, FileIcon, GitCommitIcon, HelpCircleIcon, SearchIcon, SunMoonIcon, UploadIcon } from 'lucide-react'
import React, { useMemo } from 'react'
import { useContextMenu } from '../hooks/useContextMenu.tsx'
import { toggleDarkMode } from '../misc/utils.ts'
import { documentStore } from '../stores/DocumentStore.ts'
import { IconPanel } from './IconPanel.tsx'
import { PanelIcon } from './IconPanelButton.tsx'
import { ListItem } from './ListItem.tsx'

const createV1Document = () => {
  const documentUuid = documentStore.createAndSelectNewDocument()
  documentStore.$TEST_createBrokenFile(documentUuid)
}

const contextMenuItems = <>
  <ListItem onClick={createV1Document}>Create test/broken document</ListItem>
</>

export const LeftPanel = React.memo(function LeftPanel() {
  const { openContextMenu } = useContextMenu()
  const LEFT_PANEL_ICONS: PanelIcon[] = useMemo(() => [
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
      buttonName: 'Debug Tools',
      Icon: BugIcon,
      action: (event) => {
        event.stopPropagation()
        openContextMenu({ x: event.pageX, y: event.pageY, contextMenuItems })
      },
      visible: import.meta.env.DEV
    }, {
      buttonName: 'Toggle light/dark mode',
      Icon: SunMoonIcon,
      action: toggleDarkMode,
      additionalProps: { marginTop: 'auto', marginBottom: 0 }
    }
  ], [openContextMenu])

  return <IconPanel icons={LEFT_PANEL_ICONS} direction='vertical' />
})