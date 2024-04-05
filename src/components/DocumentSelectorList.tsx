import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { CSSProperties } from 'react'
import { documentStore } from '../stores/DocumentStore.ts'
import { DocumentSelectorItem } from './DocumentSelectorItem.tsx'

const DIV_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  marginLeft: '1em',
  marginRight: '1em',
  marginTop: '1em',
  width: '180px',
  userSelect: 'none'
}

export const DocumentSelectorList = observer(() => {
  const selectedDocumentUuid = documentStore.selectedDocumentUuid
  const documentIdentifiers = documentStore.documentIdentifiers

  return <div style={DIV_STYLE}>
    {
      documentIdentifiers.slice().sort((a, b) => b.lastModified - a.lastModified).map(document => {
        return <DocumentSelectorItem key={document.documentUuid}
                                     isActive={selectedDocumentUuid === document.documentUuid}
                                     filename={document.documentTitle === '' ? 'New file' : document.documentTitle}
                                     onClick={() => {runInAction(() => {documentStore.selectedDocumentUuid = document.documentUuid})}} />
      })
    }
  </div>
})