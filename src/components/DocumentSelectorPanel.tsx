import { DocumentOperationsTopPanel } from './DocumentOperationsTopPanel.tsx'
import { DocumentSelectorList } from './DocumentSelectorList.tsx'
import { PanelBox } from './PanelBox.tsx'


export const DocumentSelectorPanel = () => {
  return <PanelBox direction='vertical'>
    <DocumentOperationsTopPanel />
    <DocumentSelectorList />
  </PanelBox>
}