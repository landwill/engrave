import { SerializedEditorState } from 'lexical'

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