import { FilePlusIcon, FolderPlusIcon } from 'lucide-react'
import { documentStore } from '../stores/DocumentStore.ts'
import { IconPanel } from './IconPanel.tsx'
import { PanelIcon } from './IconPanelButton.tsx'

const icons: PanelIcon[] = [
  {
    buttonName: 'New file',
    Icon: FilePlusIcon,
    action: () => {
      documentStore.createAndSelectNewDocument()
    }
  }, {
    buttonName: 'New folder',
    Icon: FolderPlusIcon
  }
]

export const DocumentOperationsTopPanel = () => {
  return <IconPanel icons={icons} direction='horizontal' centered divProps={{ marginBottom: '0.5em' }} />
}