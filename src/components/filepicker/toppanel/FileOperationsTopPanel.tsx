import { FilePlusIcon, FolderPlusIcon } from 'lucide-react'
import { documentStore } from '../../../stores/DocumentStore.ts'
import { fileTreeStore } from '../../../stores/FileTreeStore.ts'
import { IconPanel } from '../../IconPanel.tsx'
import { PanelIcon } from '../../IconPanelButton.tsx'


const DIV_PROPS = { marginBottom: '0.5em' }


function useNamingModal() {
  const openNamingModal = (title: string, callback: (title: string) => void) => {
    const name = prompt(`${title}:`)
    if (name) callback(name)
  }
  return { openNamingModal }
}

export const FileOperationsTopPanel = () => {
  const { openNamingModal } = useNamingModal()
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
        openNamingModal('New folder', (name) => { fileTreeStore.createFolder(name)})
      }
    }
  ]
  return <IconPanel icons={icons} direction='horizontal' centered divProps={DIV_PROPS} />
}