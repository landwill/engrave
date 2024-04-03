import { FilePlusIcon, FolderPlusIcon } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { useIndexedDB } from '../contexts/IndexedDBContext.tsx'
import { INDEXEDDB_STORE_NAME_FILES } from '../indexeddx/consts.ts'
import { DocumentOperationsTopPanel } from './DocumentOperationsTopPanel.tsx'
import { DocumentSelectorItem, EngraveDocument } from './DocumentSelectorItem.tsx'
import { PanelIcon } from './IconPanelButton.tsx'
import { PanelBox } from './PanelBox.tsx'

const getDocumentOperationPanelIcons = (setSelectedDocument: React.Dispatch<React.SetStateAction<string>>): PanelIcon[] => {
  console.log('Calculating icons')
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

const getFiles = (db: IDBDatabase): Promise<EngraveDocument[]> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(INDEXEDDB_STORE_NAME_FILES, 'readonly')
    const store = tx.objectStore(INDEXEDDB_STORE_NAME_FILES)
    const request = store.getAll()
    request.onsuccess = () => {resolve(request.result)}
    request.onerror = () => {reject(new Error(request.error?.message))}
  })
}

const handleGetFilesError = (error: unknown) => {
  console.error(error)
}

interface DocumentSelectorPanelProps {
  selectedDocument: string
  setSelectedDocument: React.Dispatch<React.SetStateAction<string>>
}

export function DocumentSelectorPanel({ selectedDocument, setSelectedDocument }: Readonly<DocumentSelectorPanelProps>) {
  const [files, setFiles] = useState<EngraveDocument[]>([])
  const icons = useMemo(() => getDocumentOperationPanelIcons(setSelectedDocument), [setSelectedDocument])
  const db = useIndexedDB()

  useEffect(() => {
    if (db == null) return
    getFiles(db).then(setFiles).catch(handleGetFilesError)
  }, [db])

  const documents: EngraveDocument[] = selectedDocument !== '' && !files.some(file => file.fileId === selectedDocument)
    ? [{ fileId: selectedDocument, filename: 'New file', body: '' }, ...files]
    : files

  return <PanelBox direction='vertical'>
    <DocumentOperationsTopPanel icons={icons} />
    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '1em', marginRight: '1em', marginTop: '1em', width: '180px' }}>
      {
        documents.map(file =>
          <DocumentSelectorItem key={file.fileId} selectedDocument={selectedDocument} fileId={file.fileId} filename={file.filename}
                                onClick={() => {setSelectedDocument(file.fileId)}} />)
      }
    </div>
  </PanelBox>
}