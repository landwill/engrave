import { action, makeObservable, observable } from 'mobx'
import { documentStore } from './DocumentStore.ts'

class FileSelectionStore {
  selectedDocumentUuids = new Set<string>()
  displayedDocumentOrder: string[] = []
  selectionCursor: string | null = null

  constructor() {
    makeObservable(this, {
      selectedDocumentUuids: observable,
      selectionCursor: observable,
      displayedDocumentOrder: observable,
      deselectDocument: action,
      selectDocument: action,
      controlClickDocument: action,
      shiftClickDocument: action,
      isSelected: observable
    })
  }

  deselectDocument() {
    this.selectedDocumentUuids.clear()
  }

  selectDocument(documentUuid: string) {
    if (!documentStore.documentIdentifiers.has(documentUuid)) throw new Error('No document found for the given uuid: ' + documentUuid)
    this.selectedDocumentUuids = new Set([documentUuid])
    this.selectionCursor = documentUuid
  }

  controlClickDocument(documentUuid: string) {
    if (this.selectedDocumentUuids.has(documentUuid)) {
      if (this.selectedDocumentUuids.size !== 1) {
        // this condition is to avoid deselecting the only selected file.
        // Not for safety/usability, but to correspond with how other applications operate.
        this.selectedDocumentUuids.delete(documentUuid)
      }
    } else {
      this.selectedDocumentUuids.add(documentUuid)
    }
    this.selectionCursor = documentUuid
  }

  shiftClickDocument(documentUuid: string, clearSelection: boolean) {
    if (this.selectionCursor === documentUuid) {
      // already selected; do nothing
      this.selectDocument(documentUuid)
      return
    }

    // clearSelection is false for control-shift-clicks
    if (clearSelection) this.selectedDocumentUuids.clear()

    let selecting = false
    for (const item of this.displayedDocumentOrder) {
      if ([documentUuid, this.selectionCursor].includes(item)) {
        if (!selecting) {
          selecting = true
        } else {
          this.selectedDocumentUuids.add(item)
          break
        }
      }
      if (selecting) this.selectedDocumentUuids.add(item)
    }
  }

  isSelected(documentUuid: string | null): boolean {
    if (documentUuid == null) return false
    return this.selectedDocumentUuids.has(documentUuid)
  }
}

export const fileSelectionStore = new FileSelectionStore()