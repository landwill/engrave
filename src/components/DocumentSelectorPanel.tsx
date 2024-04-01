import { PanelBox } from './PanelBox.tsx'

interface Document {
  documentName: string
}

const files: Document[] = [
  {
    documentName: 'Sample document'
  }, {
    documentName: 'Sample document 2'
  }
]

export function DocumentSelectorPanel() {
  return <PanelBox>
    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '1em', marginRight: '1em', marginTop: '1em' }}>
      {
        files.map(file => <span style={{ marginBottom: '0.25em'}}>{file.documentName}</span>)
      }
    </div>
  </PanelBox>
}