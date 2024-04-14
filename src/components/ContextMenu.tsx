import { observer } from 'mobx-react-lite'
import { COMMON_BORDER_RADIUS } from '../consts.ts'
import { contextMenuStore } from '../stores/ContextMenuStore.ts'

export const ContextMenu = observer(() => {
  if (contextMenuStore.isOpen) {
    return <div style={{
      position: 'fixed',
      top: contextMenuStore.y ?? 0,
      left: contextMenuStore.x ?? 0,
      backgroundColor: 'var(--panel-background-color)',
      borderRadius: COMMON_BORDER_RADIUS,
      border: '1px solid var(--border-color)',
      boxShadow: '#00000061 2px 2px 10px 0px',
      display: 'flex',
      flexDirection: 'column',
      padding: '0.5em'
    }}>
      {contextMenuStore.contextMenuItems}
    </div>
  }
  return undefined
})