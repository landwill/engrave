import { useEffect } from 'react'
import { ContextMenuOpenProps, contextMenuStore } from '../stores/ContextMenuStore.ts'

export type ContextMenuOpener = (param: ContextMenuOpenProps) => void

export const useContextMenu = (): { openContextMenu: ContextMenuOpener } => {

  useEffect(() => {
    const handleClickOutside = () => {
      contextMenuStore.setClosed()
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return {
    openContextMenu: (contextMenu: ContextMenuOpenProps) => { contextMenuStore.openContextMenu(contextMenu) }
  }
}
