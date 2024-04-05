import { FilePlusIcon, FolderPlusIcon } from 'lucide-react'
import { v4 as uuid } from 'uuid'
import { documentStore } from '../stores/DocumentStore.ts'
import { IconPanel } from './IconPanel.tsx'

const icons = [
  {
    buttonName: 'New file',
    Icon: FilePlusIcon,
    action: () => {
      documentStore.selectedDocumentUuid = uuid()
    }
  }, {
    buttonName: 'New folder',
    Icon: FolderPlusIcon
  }
]

export const DocumentOperationsTopPanel = () => {
  return <IconPanel icons={icons} direction='horizontal' centered divProps={{ marginBottom: '0.5em' }} />
}