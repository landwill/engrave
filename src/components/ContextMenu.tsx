import { observer } from 'mobx-react-lite'
import { COMMON_BORDER_RADIUS } from '../consts.ts'
import { contextMenu } from '../stores/ContextMenu.ts'
import { ListItem } from './ListItem.tsx'

export const ContextMenu = observer(() => {
  if (contextMenu.isOpen) {
    return <div style={{
      position: 'fixed',
      top: contextMenu.y ?? 0,
      left: contextMenu.x ?? 0,
      backgroundColor: 'var(--panel-background-color)',
      borderRadius: COMMON_BORDER_RADIUS,
      border: '1px solid var(--border-color)',
      boxShadow: '#00000061 2px 2px 10px 0px',
      display: 'flex',
      flexDirection: 'column',
      padding: '0.5em'
    }}>
      <ListItem>Rename</ListItem>
      <ListItem>Delete</ListItem>
    </div>
  }
  return undefined
})