import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { CSSProperties } from 'react'
import { documentStore } from '../../stores/DocumentStore.ts'
import { DocumentSelectorItem } from './DocumentSelectorItem.tsx'

const DIV_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '1em',
  width: '200px',
  userSelect: 'none',
  marginLeft: '0.5em',
  marginRight: '0.5em',
  overflowY: 'auto'
}

export const DocumentSelectorList = observer(() => {
  const selectedDocumentUuid = documentStore.selectedDocumentUuid
  const documentIdentifiers = documentStore.documentIdentifiers

  return <div style={DIV_STYLE}>
    {
      documentIdentifiers.slice().sort((a, b) => b.lastModified - a.lastModified).map(document => {
        return <DocumentSelectorItem key={document.documentUuid}
                                     documentUuid={document.documentUuid}
                                     isActive={selectedDocumentUuid === document.documentUuid}
                                     title={document.documentTitle}
                                     onClick={() => {runInAction(() => {documentStore.selectDocument(document.documentUuid)})}} />
      })
    }
  </div>
})