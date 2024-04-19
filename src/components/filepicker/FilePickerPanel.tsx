import { PanelBox } from '../PanelBox.tsx'
import { FileOperationsTopPanel } from './toppanel/FileOperationsTopPanel.tsx'
import { FilePickerList } from './FilePickerList.tsx'


export const FilePickerPanel = () => {
  return <PanelBox direction='vertical' >
    <FileOperationsTopPanel />
    <FilePickerList />
  </PanelBox>
}