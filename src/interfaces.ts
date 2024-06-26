import { SerializedEditorState } from 'lexical'
import { MouseEventHandler } from 'react'

export interface DocumentIdentifier {
  documentTitle: string
  lastModified: number
}

export interface DocumentDetail extends DocumentIdentifier {
  body?: SerializedEditorState
}

export interface StoredDocument extends DocumentDetail {
  documentUuid: string
}

export interface IDBWorkerMessage {
  documentUuid: string
  body?: SerializedEditorState | ''
}

export interface TooltipDetails {
  isOpen: boolean
  text: string
  x: number
  y: number
}

export type FileTreeItem = FileTreeFolder | FileTreeFile;

export interface FileTreeFolder {
  isFolder: true
  children: Map<string, FileTreeItem>
}

export interface FileTreeFile {
  isFolder: false
}

export interface ListItemProps {
  uuid: string
  title: string
  onContextMenu?: MouseEventHandler
  onClick?: MouseEventHandler
}

export interface DraggableSource {
  uuid: string
  isFolder: boolean
}

export interface DropTargetLocation {
  uuid: string | undefined
}

export interface FileTreeItemSearchResult {
  item: FileTreeItem
  parent: Map<string, FileTreeItem>
  key: string
}

export interface TooltipDispatch {
  isOpen: boolean
  text?: string
  x?: number
  y?: number
}

export type FileTree = Map<string, FileTreeItem>

export interface FilePickerListEntry {
  key: string
  item: FileTreeItem
  level: number
  uuid: string
  parentUuid?: string
}

export interface RelativeItemUuids {
  above: string | null
  below: string | null
}