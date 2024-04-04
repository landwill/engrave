import { autorun, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useRef } from 'react'
import { COMMON_BORDER_STYLE } from '../consts.ts'
import { DocumentStore } from '../stores/DocumentStore.ts'

interface EditorTitlePanelObserverProps {
  documentStore: DocumentStore
  editorBodyRef: React.RefObject<HTMLDivElement>
}

function moveCursorToElement(target: HTMLElement, toStart: boolean) {
  const range = document.createRange()
  const sel = window.getSelection()
  range.selectNodeContents(target)
  range.collapse(toStart)
  sel?.removeAllRanges()
  sel?.addRange(range)
}

export const EditorTitlePanel = observer(({ documentStore, editorBodyRef }: EditorTitlePanelObserverProps) => {
  const divRef = useRef<HTMLDivElement>(null)

  autorun(() => {
    const div = divRef.current
    const currentDocument = documentStore.currentDocument
    if (div && currentDocument) {
      div.textContent = currentDocument.documentTitle
      div.focus()
      if (!currentDocument.isNew) {
        moveCursorToElement(div, false)
      }
    }
  })

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    runInAction(() => {
      if (documentStore.currentDocument) {
        const newTitle = e.currentTarget.textContent ?? ''
        documentStore.renameCurrentDocument(newTitle)
      }
    })
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      editorBodyRef.current?.focus()
    }
  }

  if (!documentStore.currentDocument) {
    return <div>E04</div>
  }

  return (
    <div
      ref={divRef}
      contentEditable
      onInput={handleInput}
      tabIndex={1}
      onKeyDown={handleKeyDown}
      suppressContentEditableWarning
      style={{ padding: '1em', borderBottom: COMMON_BORDER_STYLE, fontSize: '1.25em', fontWeight: 500, outline: 'none' }}
    />
  )
})

