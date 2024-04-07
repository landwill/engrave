import { action, makeObservable, observable } from 'mobx'


export interface ContextMenuOpenProps {
  x: number
  y: number
  documentUuid: string
}

class ContextMenu {
  isOpen = false
  x: number | null = null
  y: number | null = null
  documentUuid: string | null = null

  constructor() {
    makeObservable(this, {
      isOpen: observable,
      x: observable,
      y: observable,
      documentUuid: observable,
      setOpen: action,
      setClosed: action
    })
  }

  setOpen({ x, y, documentUuid }: ContextMenuOpenProps) {
    this.x = x
    this.y = y
    this.documentUuid = documentUuid
    this.isOpen = true
  }

  setClosed() {
    this.isOpen = false
  }
}


export const contextMenu = new ContextMenu()