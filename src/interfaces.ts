import { SerializedEditorState } from 'lexical'
import { MouseEventHandler } from 'react'

export interface DocumentIdentifier {
  documentUuid: string
  documentTitle: string
  lastModified: number
}

export interface DocumentDetail extends DocumentIdentifier {
  body?: SerializedEditorState
}

export interface IDBWorkerMessage {
  documentUuid: string
  body?: SerializedEditorState | ''
}

export interface TooltipDetails {
  isOpen: boolean
  x: number
  y: number
  text: string
}

export type FileTreeItem = FileTreeFolder | FileTreeFile;

interface FileTreeBaseItem {
  uuid: string
}

export interface FileTreeFolder extends FileTreeBaseItem {
  isFolder: true
  children: FileTreeItem[]
}

export interface FileTreeFile extends FileTreeBaseItem {
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
  uuid: string
}