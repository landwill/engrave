import { FilePlusIcon, FolderPlusIcon } from 'lucide-react'
import { documentStore } from '../../../stores/DocumentStore.ts'
import { fileTreeStore } from '../../../stores/FileTreeStore.ts'
import { IconPanel } from '../../IconPanel.tsx'
import { PanelIcon } from '../../IconPanelButton.tsx'

type NamingModalOpenerCallback = (title: string) => void
type NamingModalOpener = (title: string, callback: NamingModalOpenerCallback) => void

const openNamingModal: NamingModalOpener = (title: string, callback: (title: string) => void) => {
  const name = prompt(`${title}:`)
  if (name) callback(name)
}

const icons: PanelIcon[] = [
  {
    buttonName: 'New file',
    Icon: FilePlusIcon,
    action: () => {
      documentStore.createAndSelectNewDocument()
    }
  }, {
    buttonName: 'New folder',
    Icon: FolderPlusIcon,
    action: () => {
      openNamingModal('New folder', name => { fileTreeStore.createFolder(name)})
    }
  }
]

export const FileOperationsTopPanel = () => {
  return <IconPanel icons={icons} direction='horizontal' centered divProps={{ marginBottom: '0.5em' }} />
}