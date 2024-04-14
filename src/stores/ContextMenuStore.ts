import { action, makeObservable, observable } from 'mobx'
import React from 'react'


export interface ContextMenuOpenProps {
  x: number
  y: number
  contextMenuItems: React.ReactNode | React.ReactNode[]
}

class ContextMenuStore {
  isOpen = false
  x: number | null = null
  y: number | null = null
  documentUuid: string | null = null
  contextMenuItems: React.ReactNode | React.ReactNode[]

  constructor() {
    makeObservable(this, {
      isOpen: observable,
      x: observable,
      y: observable,
      documentUuid: observable,
      openContextMenu: action,
      setClosed: action
    })
  }

  openContextMenu({ x, y, contextMenuItems }: ContextMenuOpenProps) {
    this.x = x
    this.y = y
    this.isOpen = true
    this.contextMenuItems = contextMenuItems
  }

  setClosed() {
    this.isOpen = false
  }
}

export const contextMenuStore = new ContextMenuStore()