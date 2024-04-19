import { observer } from 'mobx-react-lite'
import { CSSProperties } from 'react'
import { fileTreeStore } from '../../stores/FileTreeStore.ts'
import { FileTreeBaseItemComponent } from './FileTreeComponents.tsx'

const DIV_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '1em',
  width: '200px',
  userSelect: 'none',
  marginLeft: '0.5em',
  marginRight: '0.5em',
  overflowY: 'auto'
}

export const FilePickerList = observer(() => {
  return <div style={DIV_STYLE}>
    {
      fileTreeStore.fileTreeData.map(item => <FileTreeBaseItemComponent key={item.uuid} item={item} />)
    }
  </div>
})