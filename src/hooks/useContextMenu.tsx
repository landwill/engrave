import { useLocalObservable } from 'mobx-react-lite'
import { useEffect } from 'react'
import { contextMenu, ContextMenuLocation } from '../stores/ContextMenu.ts'

export const useContextMenu = () => {
  const store = useLocalObservable(() => contextMenu)

  useEffect(() => {
    const handleClickOutside = () => {
      store.setClosed()
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [store])

  return {
    open: store.isOpen,
    setOpen: (location: ContextMenuLocation) => { store.setOpen(location) },
    setClosed: () => { store.setClosed() }
  }
}
