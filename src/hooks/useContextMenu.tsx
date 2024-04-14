import { useEffect } from 'react'
import { contextMenuStore, ContextMenuOpenProps } from '../stores/ContextMenuStore.ts'

export const useContextMenu = () => {

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
