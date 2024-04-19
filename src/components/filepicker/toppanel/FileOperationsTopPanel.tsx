import { FilePlusIcon, FolderPlusIcon } from 'lucide-react'
import { documentStore } from '../../../stores/DocumentStore.ts'
import { IconPanel } from '../../IconPanel.tsx'
import { PanelIcon } from '../../IconPanelButton.tsx'

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

const DIV_PROPS = { marginBottom: '0.5em' }

export const FileOperationsTopPanel = () => {
  return <IconPanel icons={icons} direction='horizontal' centered divProps={DIV_PROPS} />
}