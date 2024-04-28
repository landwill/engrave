import { SerializedEditorState } from 'lexical'
import { flow, flowResult, makeAutoObservable } from 'mobx'
import { v4 as uuid } from 'uuid'
import { IndexedDB } from '../indexeddx/indexeddb.ts'
import { DocumentDetail, DocumentIdentifier } from '../interfaces.ts'
import { lazyErrorHandler } from '../misc/utils.ts'
import { contextMenuStore } from './ContextMenuStore.ts'
import { fileSelectionStore } from './FileSelectionStore.ts'
import { fileTreeStore } from './FileTreeStore.ts'

const NEW_FILE_NAME = ''
type MapInitializer = [string, DocumentIdentifier][]

export class DocumentStore {
  documentIdentifiers = new Map<string, DocumentIdentifier>()
  _idb: IndexedDB | null = null

  get idb() {
    if (this._idb == null) throw new Error('Tried accessing idb before setting it.')
    return this._idb
  }

  constructor() {
    makeAutoObservable(this, {
      loadDocuments: flow
    })
  }

  setup(idb: IndexedDB) {
    this._idb = idb
    flowResult(this.loadDocuments()).catch(lazyErrorHandler)
  }

  * loadDocuments(): Generator<Promise<(DocumentDetail & { documentUuid: string })[]>, void, (DocumentDetail & { documentUuid: string })[]> {
    const documents: (DocumentDetail & { documentUuid: string })[] = yield this.idb.getDocuments()
    const documentIdentifiersList: MapInitializer = documents.map(document => [document.documentUuid, {
      documentTitle: document.documentTitle,
      lastModified: document.lastModified
    } as DocumentIdentifier])
    this.documentIdentifiers = new Map<string, DocumentIdentifier>(documentIdentifiersList)
  }

  renameDocumentInIDB(documentUuid: string, documentTitle: string) {
    const documentIdentifier = this.documentIdentifiers.get(documentUuid)
    if (documentIdentifier == null) throw new Error('renameDocument called but failed to find the documentIdentifier.')
    this.idb.updateDocumentTitle(documentUuid, documentTitle)
      .catch(lazyErrorHandler)
  }

  updateDocumentBody(documentUuid: string, body: SerializedEditorState) {
    const document = this.documentIdentifiers.get(documentUuid)
    if (!document) throw new Error('Document not found.')
    this.idb.updateDocumentBody(documentUuid, body)
      .catch(lazyErrorHandler)
  }

  createAndSelectNewDocument(): string {
    const documentUuid = uuid()
    this.documentIdentifiers.set(documentUuid, { documentTitle: NEW_FILE_NAME, lastModified: Date.now() } as DocumentIdentifier)
    fileSelectionStore.selectDocument(documentUuid)
    return documentUuid
  }

  deleteDocument(documentUuid: string) {
    this.documentIdentifiers.delete(documentUuid)
    fileTreeStore.removeFileReferenceFromFileTree(documentUuid)
    this.verifySelectedDocument()
    contextMenuStore.setClosed()
    this.idb.deleteDocument(documentUuid)
      .catch(lazyErrorHandler)
  }

  deleteDocuments(orphanedChildren: string[]) {
    for (const uuid of orphanedChildren) this.deleteDocument(uuid)
  }

  verifySelectedDocument() {
    if (fileSelectionStore.selectedDocumentUuids.size === 1) {
      const [selectedUuid] = fileSelectionStore.selectedDocumentUuids
      if (!this.documentIdentifiers.has(selectedUuid)) fileSelectionStore.deselectDocument()
    }
  }

  $TEST_createBrokenFile(documentUuid: string) {
    this.idb.$TEST_createBrokenFile(documentUuid)
      .catch(lazyErrorHandler)
  }
}

export const documentStore = new DocumentStore()