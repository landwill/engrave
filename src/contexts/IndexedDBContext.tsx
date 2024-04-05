import { createContext, useContext } from 'react'

export const IndexedDBContext = createContext<IDBDatabase | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export function useIndexedDB() {
  const context = useContext(IndexedDBContext)
  if (context === undefined) throw new Error('useIndexedDB must be used from within the respective provider.')
  return context
}