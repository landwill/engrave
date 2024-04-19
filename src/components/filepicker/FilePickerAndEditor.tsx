import { DocumentSelectorPanel } from './DocumentSelectorPanel.tsx'
import { EditorPanel } from '../editorpanel/EditorPanel.tsx'


export function FilePickerAndEditor() {
  return <>
    <DocumentSelectorPanel />
    <EditorPanel />
  </>
}