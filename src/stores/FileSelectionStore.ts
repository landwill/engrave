import { action, makeObservable, observable } from 'mobx'
import { documentStore } from './DocumentStore.ts'
import { fileTreeStore } from './FileTreeStore.ts'

// 'file system item' referring to files/folders in the structured tree view
class FileSystemItemSelectionStore {
  selectedItems = new Set<string>()
  displayedItemOrder: string[] = []
  selectionCursor: string | null = null

  constructor() {
    makeObservable(this, {
      selectedItems: observable,
      selectionCursor: observable,
      displayedItemOrder: observable,
      deselectItems: action,
      selectItem: action,
      controlClickItem: action,
      shiftClickItem: action,
      isSelected: observable
    })
  }

  deselectItems() {
    this.selectedItems.clear()
  }

  selectItem(itemUuid: string): void {
    if (!documentStore.documentIdentifiers.has(itemUuid) && !fileTreeStore.isFolder(itemUuid)) throw new Error('No file system item found for the given uuid: ' + itemUuid)
    this.selectedItems = new Set([itemUuid])
    this.selectionCursor = itemUuid
  }

  controlClickItem(itemUuid: string) {
    if (this.selectedItems.has(itemUuid)) {
      if (this.selectedItems.size !== 1) {
        // this condition is to avoid deselecting the only selected file.
        // Not for safety/usability, but to correspond with how other applications operate.
        this.selectedItems.delete(itemUuid)
      }
    } else {
      this.selectedItems.add(itemUuid)
    }
    this.selectionCursor = itemUuid
  }

  shiftClickItem(itemUuid: string, clearSelection: boolean) {
    if (this.selectionCursor === itemUuid) {
      // already selected; do nothing
      this.selectItem(itemUuid)
      return
    }

    // clearSelection is false for control-shift-clicks
    if (clearSelection) this.selectedItems.clear()

    let selecting = false
    for (const item of this.displayedItemOrder) {
      if ([itemUuid, this.selectionCursor].includes(item)) {
        if (!selecting) {
          selecting = true
        } else {
          this.selectedItems.add(item)
          break
        }
      }
      if (selecting) this.selectedItems.add(item)
    }
  }

  isSelected(itemUuid: string | null): boolean {
    if (itemUuid == null) return false
    return this.selectedItems.has(itemUuid)
  }
}

export const fileSelectionStore = new FileSystemItemSelectionStore()