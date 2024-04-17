import { PanelBox } from '../PanelBox.tsx'
import { DocumentOperationsTopPanel } from './DocumentOperationsTopPanel.tsx'
import { FileSelectorList } from './FileSelectorList.tsx'


export const DocumentSelectorPanel = () => {
  return <PanelBox direction='vertical' >
    <DocumentOperationsTopPanel />
    <FileSelectorList />
    {/*<FileSelectorPragmatic />*/}
  </PanelBox>
}