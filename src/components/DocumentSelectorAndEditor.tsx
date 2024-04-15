import { DocumentSelectorPanel } from './filepicker/DocumentSelectorPanel.tsx'
import { EditorPanel } from './editorpanel/EditorPanel.tsx'


export function DocumentSelectorAndEditor() {
  return <>
    <DocumentSelectorPanel />
    <EditorPanel />
  </>
}