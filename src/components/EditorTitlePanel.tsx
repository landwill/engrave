import React, { KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import { COMMON_BORDER_STYLE } from '../consts.ts'
import { useIndexedDB } from '../contexts/IndexedDBContext.tsx'
import { updateFileTitle } from '../indexeddx/utils.ts'

interface EditorTitlePanelProps {
  fileId: string
  initialTitle: string
  initialIsNewFile: boolean
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

export function EditorTitlePanel({ fileId, initialTitle, initialIsNewFile, editorBodyRef }: Readonly<EditorTitlePanelProps>): React.JSX.Element {
  const db = useIndexedDB()
  const divRef = useRef<HTMLDivElement>(null)
  const [isNewFile, setIsNewFile] = useState<boolean>(initialIsNewFile)

  useEffect(() => {
    if (divRef.current) {
      divRef.current.textContent = initialTitle
      divRef.current.focus()
      if (!initialIsNewFile) moveCursorToElement(divRef.current, false)
    }
  }, [initialIsNewFile, initialTitle])

  const updateTitle = (newTitle: string) => {
    if (db == null) {
      console.warn('idb was null; not updating title.')
      return
    }
    updateFileTitle(fileId, newTitle, db)
    console.debug(`Update ${fileId}; set title = ${newTitle}`)
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (isNewFile) {
      setIsNewFile(false)
      const pressedChar = (e.nativeEvent as InputEvent).data
      e.currentTarget.textContent = pressedChar
      updateTitle(pressedChar ?? '')
      moveCursorToElement(e.currentTarget, false)
    } else {
      updateTitle(e.currentTarget.textContent ?? '')
    }
  }

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      editorBodyRef.current?.focus()
    }
  }

  return (
    <div
      style={{ padding: '1em', borderBottom: COMMON_BORDER_STYLE, fontSize: '1.25em', fontWeight: 500, outline: 'none' }}
      ref={divRef}
      contentEditable
      onInput={handleInput}
      tabIndex={1}
      onKeyDown={handleKeyDown}
      suppressContentEditableWarning
    />
  )
}
