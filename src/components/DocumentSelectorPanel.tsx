import { FilePlusIcon, FolderPlusIcon } from 'lucide-react'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { v4 as uuid } from 'uuid'
import { DocumentIdentifier } from '../interfaces.ts'
import { DocumentStore } from '../stores/DocumentStore.ts'
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

interface DocumentSelectorPanelProps {
  documentStore: DocumentStore
}

export const DocumentSelectorPanel = observer(({ documentStore }: DocumentSelectorPanelProps) => {
  const icons = useMemo(() => getDocumentOperationPanelIcons((uuid: string) => {documentStore.selectedDocumentUuid = uuid}), [documentStore])
  const selectedDocumentUuid = documentStore.selectedDocumentUuid
  const documentIdentifiers = documentStore.documentIdentifiers.slice().sort((a, b) => b.lastModified - a.lastModified)

  const documents: DocumentIdentifier[] = selectedDocumentUuid && !documentIdentifiers.some(file => file.documentUuid === selectedDocumentUuid)
    ? [{ documentTitle: 'New file', documentUuid: selectedDocumentUuid, lastModified: Date.now() } satisfies DocumentIdentifier, ...documentIdentifiers]
    : documentIdentifiers

  return <PanelBox direction='vertical'>
    <DocumentOperationsTopPanel icons={icons} />
    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '1em', marginRight: '1em', marginTop: '1em', width: '180px', userSelect: 'none' }}>
      {
        documents.slice().sort((a, b) => b.lastModified - a.lastModified).map(document => {
          console.log(document.lastModified, document.documentTitle)
          return <DocumentSelectorItem key={document.documentUuid}
                                isActive={selectedDocumentUuid === document.documentUuid}
                                filename={document.documentTitle === '' ? 'New file' : document.documentTitle}
                                onClick={() => {runInAction(() => {documentStore.selectedDocumentUuid = document.documentUuid})}} />
        })
      }
    </div>
  </PanelBox>
})