import { PanelBox } from '../PanelBox.tsx'
import { FileOperationsTopPanel } from './toppanel/FileOperationsTopPanel.tsx'
import { FileSelectorList } from './FileSelectorList.tsx'


export const DocumentSelectorPanel = () => {
  return <PanelBox direction='vertical' >
    <FileOperationsTopPanel />
    <FileSelectorList />
  </PanelBox>
}