import { FilePlusIcon, FolderPlusIcon } from 'lucide-react'
import React from 'react'
import { DocumentOperationsTopPanel } from './DocumentOperationsTopPanel.tsx'
import { Document, DocumentSelectorItem } from './DocumentSelectorItem.tsx'
import { PanelIcon } from './IconPanelButton.tsx'
import { PanelBox } from './PanelBox.tsx'


const DOCUMENT_OPERATIONS_TOP_PANEL_ICONS: PanelIcon[] = [
  {
    buttonName: 'New file',
    Icon: FilePlusIcon
  }, {
    buttonName: 'New folder',
    Icon: FolderPlusIcon
  }
]

const files: Document[] = [
  {
    key: 'e98e1ef3-24c8-4d27-8a7d-560f8c899c7e',
    documentName: 'Sample document'
  }, {
    key: '83f99248-f453-46a8-8210-5c32d65226a7',
    documentName: 'Sample document 2'
  }, {
    key: 'c327fd8e-394a-4588-b38c-9a72c7c2f967',
    documentName: 'Sample document with a very long name'
  }
]

interface DocumentSelectorPanelProps {
  selectedDocument: string
  setSelectedDocument: React.Dispatch<React.SetStateAction<string>>
}

export function DocumentSelectorPanel({ selectedDocument, setSelectedDocument }: DocumentSelectorPanelProps) {

  return <PanelBox direction='vertical'>
    <DocumentOperationsTopPanel icons={DOCUMENT_OPERATIONS_TOP_PANEL_ICONS} />
    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '1em', marginRight: '1em', marginTop: '1em', width: '180px' }}>
      {
        files.map(file =>
          <DocumentSelectorItem key={file.key} selectedDocument={selectedDocument} file={file} onClick={() => {setSelectedDocument(file.key)}} />)
      }
    </div>
  </PanelBox>
}