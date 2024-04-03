import { useState } from 'react'
import { DocumentSelectorPanel } from './DocumentSelectorPanel.tsx'
import { EditorPanel } from './EditorPanel.tsx'

export function DocumentSelectorAndEditor() {
  const [selectedDocument, setSelectedDocument] = useState<string>('')
  return <>
    <DocumentSelectorPanel selectedDocument={selectedDocument} setSelectedDocument={setSelectedDocument} />
    <EditorPanel selectedDocument={selectedDocument} />
  </>
}