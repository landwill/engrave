import { action, makeObservable, observable } from 'mobx'


export interface ContextMenuLocation {
  x: number
  y: number
}

class ContextMenu {
  isOpen = false
  x: number | null = null
  y: number | null = null

  constructor() {
    makeObservable(this, {
      isOpen: observable,
      x: observable,
      y: observable,
      setOpen: action,
      setClosed: action
    })
  }

  setOpen({ x, y }: ContextMenuLocation) {
    this.x = x
    this.y = y
    this.isOpen = true
  }

  setClosed() {
    this.isOpen = false
  }
}


export const contextMenu = new ContextMenu()