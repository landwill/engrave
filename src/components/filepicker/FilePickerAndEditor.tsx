import { FilePickerPanel } from './FilePickerPanel.tsx'
import { EditorPanel } from '../editorpanel/EditorPanel.tsx'

export function FilePickerAndEditor() {
  return <>
    <FilePickerPanel />
    <EditorPanel />
  </>
}