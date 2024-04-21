import { PanelBox } from '../PanelBox.tsx'
import { FilePickerList } from './FilePickerList.tsx'
import { FileOperationsTopPanel } from './toppanel/FileOperationsTopPanel.tsx'

export const FilePickerPanel = () => {
  return <PanelBox direction='vertical'>
    <FileOperationsTopPanel />
    <FilePickerList />
  </PanelBox>
}