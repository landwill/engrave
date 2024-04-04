import { FilePlusIcon, FolderPlusIcon } from 'lucide-react'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import { v4 as uuid } from 'uuid'
import { DocumentStore } from '../stores/DocumentStore.ts'
import { DocumentOperationsTopPanel } from './DocumentOperationsTopPanel.tsx'
import { DocumentSelectorItem } from './DocumentSelectorItem.tsx'
import { PanelIcon } from './IconPanelButton.tsx'
import { PanelBox } from './PanelBox.tsx'

const getDocumentOperationPanelIcons = (setSelectedDocument: React.Dispatch<React.SetStateAction<string>>): PanelIcon[] => {
  return [
    {
      buttonName: 'New file',
      Icon: FilePlusIcon,
      action: () => {
        const fileId = uuid()
        setSelectedDocument(fileId)
      }
    }, {
      buttonName: 'New folder',
      Icon: FolderPlusIcon
    }
  ]
}

export const DocumentSelectorPanel = observer(({ documentStore }: { documentStore: DocumentStore }) => {
  const icons = useMemo(() => getDocumentOperationPanelIcons(() => {documentStore.selectedDocumentUuid = null}), [])
  const selectedDocumentUuid = documentStore.selectedDocumentUuid
  const documentIdentifiers = documentStore.documentIdentifiers

  return <PanelBox direction='vertical'>
    <DocumentOperationsTopPanel icons={icons} />
    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '1em', marginRight: '1em', marginTop: '1em', width: '180px', userSelect: 'none' }}>
      {
        documentIdentifiers.map(document =>
          <DocumentSelectorItem key={document.documentUuid}
                                isActive={selectedDocumentUuid === document.documentUuid}
                                filename={document.documentTitle === '' ? 'Untitled' : document.documentTitle}
                                onClick={() => {runInAction(() => {documentStore.selectedDocumentUuid = document.documentUuid})}} />)
      }
    </div>
  </PanelBox>
})