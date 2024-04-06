export interface DocumentIdentifier {
  documentUuid: string
  documentTitle: string
  lastModified: number
}

export interface DocumentDetail extends DocumentIdentifier {
  body?: string
}