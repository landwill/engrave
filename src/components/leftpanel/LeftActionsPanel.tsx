import { BugIcon, DownloadIcon, FileIcon, HelpCircleIcon, SearchIcon, SunMoonIcon, UploadIcon } from 'lucide-react'
import React, { useMemo } from 'react'
import { ContextMenuOpener, useContextMenu } from '../../hooks/useContextMenu.tsx'
import { toggleDarkMode } from '../../misc/utils.ts'
import { fileSelectionStore } from '../../stores/FileSelectionStore.ts'
import { IconPanel } from '../IconPanel.tsx'
import { PanelIcon } from '../IconPanelButton.tsx'
import { ListItemSpan } from '../ListItemSpan.tsx'
import { dumpFileTreeStructure } from './debugTools.ts'
import { createV1Document } from './utils.ts'

const debugToolsIconMenuItems = <>
  <ListItemSpan onClick={createV1Document}>Create test/broken document</ListItemSpan>
  <ListItemSpan onClick={dumpFileTreeStructure}>Copy file tree structure to clipboard</ListItemSpan>
</>

const getLeftPanelIcons = (openContextMenu: ContextMenuOpener): PanelIcon[] => [
  {
    buttonName: 'Files',
    Icon: FileIcon
  }, {
    buttonName: 'Search files',
    Icon: SearchIcon
  }, {
    buttonName: 'Import',
    Icon: UploadIcon
  }, {
    buttonName: 'Export',
    Icon: DownloadIcon
  }, {
    buttonName: 'About',
    Icon: HelpCircleIcon,
    action: () => {fileSelectionStore.deselectDocument()}
  }, {
    buttonName: 'Debug Tools',
    Icon: BugIcon,
    action: (event) => {
      event.stopPropagation()
      openContextMenu({ x: event.pageX, y: event.pageY, contextMenuItems: debugToolsIconMenuItems })
    },
    visible: import.meta.env.DEV
  }, {
    buttonName: 'Toggle light/dark mode',
    Icon: SunMoonIcon,
    action: toggleDarkMode,
    additionalProps: { marginTop: 'auto', marginBottom: 0 }
  }
]

export const LeftActionsPanel = React.memo(function LeftPanel() {
  const { openContextMenu } = useContextMenu()

  const leftPanelIcons: PanelIcon[] = useMemo(() => getLeftPanelIcons(openContextMenu), [openContextMenu])

  return <IconPanel icons={leftPanelIcons} direction='vertical' />
})