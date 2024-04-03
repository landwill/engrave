import React, { KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import { COMMON_BORDER_STYLE } from '../consts.ts'

interface EditorTitlePanelProps {
  fileId: string
  initialTitle: string
  initialIsNewFile: boolean
  editorBodyRef: React.RefObject<HTMLDivElement>
}

export function EditorTitlePanel({ fileId, initialTitle, initialIsNewFile, editorBodyRef }: Readonly<EditorTitlePanelProps>): React.JSX.Element {
  const divRef = useRef<HTMLDivElement>(null)
  const [isNewFile, setIsNewFile] = useState<boolean>(initialIsNewFile)

  useEffect(() => {
    if (divRef.current) {
      divRef.current.textContent = initialTitle
      divRef.current.focus()
    }
  }, [])

  const updateTitle = (newTitle: string) => {
    console.debug(`Update ${fileId}; set title = ${newTitle}`)
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (isNewFile) {
      setIsNewFile(false)
      console.log('executan')
      const pressedChar = (e.nativeEvent as InputEvent).data
      e.currentTarget.textContent = pressedChar
      updateTitle(pressedChar ?? '')
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(e.currentTarget);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    } else {
      updateTitle(e.currentTarget.textContent ?? '')
    }
  }

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      editorBodyRef.current?.focus()
      console.log(editorBodyRef)
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
