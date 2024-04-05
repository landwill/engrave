import { FilePlusIcon, FolderPlusIcon } from 'lucide-react'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { v4 as uuid } from 'uuid'
import { documentStore } from '../stores/DocumentStore.ts'
import { DocumentOperationsTopPanel } from './DocumentOperationsTopPanel.tsx'
import { DocumentSelectorItem } from './DocumentSelectorItem.tsx'
import { PanelIcon } from './IconPanelButton.tsx'
import { PanelBox } from './PanelBox.tsx'

const getDocumentOperationPanelIcons = (setSelectedDocument: (uuid: string) => void): PanelIcon[] => {
  return [
    {
      buttonName: 'New file',
      Icon: FilePlusIcon,
      action: () => {
        const documentUuid = uuid()
        setSelectedDocument(documentUuid)
      }
    }, {
      buttonName: 'New folder',
      Icon: FolderPlusIcon
    }
  ]
}

export const DocumentSelectorPanel = observer(() => {
  const icons = useMemo(() => getDocumentOperationPanelIcons((uuid: string) => {documentStore.selectedDocumentUuid = uuid}), [])
  const selectedDocumentUuid = documentStore.selectedDocumentUuid
  const documentIdentifiers = documentStore.documentIdentifiers.slice()

  if (selectedDocumentUuid && !documentIdentifiers.some(file => file.documentUuid === selectedDocumentUuid)) {
    documentIdentifiers.push({ documentTitle: 'New file', documentUuid: selectedDocumentUuid, lastModified: Date.now() })
  }

  return <PanelBox direction='vertical'>
    <DocumentOperationsTopPanel icons={icons} />
    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '1em', marginRight: '1em', marginTop: '1em', width: '180px', userSelect: 'none' }}>
      {
        documentIdentifiers.sort((a, b) => b.lastModified - a.lastModified).map(document => {
          return <DocumentSelectorItem key={document.documentUuid}
                                isActive={selectedDocumentUuid === document.documentUuid}
                                filename={document.documentTitle === '' ? 'New file' : document.documentTitle}
                                onClick={() => {runInAction(() => {documentStore.selectedDocumentUuid = document.documentUuid})}} />
        })
      }
    </div>
  </PanelBox>
})