import React, { KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import { COMMON_BORDER_STYLE } from '../consts.ts'

interface EditorTitlePanelProps {
  filename: string | null
  newFile?: boolean
  setNewFile?: React.Dispatch<React.SetStateAction<boolean>>
  editorBodyRef: React.RefObject<HTMLDivElement>
}

export function EditorTitlePanel({ filename, newFile = false, setNewFile, editorBodyRef }: EditorTitlePanelProps): React.JSX.Element {
  // todo; handle the title
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_title, setTitle] = useState<string | null>(filename)
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTitle(filename ?? '')
    if (divRef.current) {
      divRef.current.textContent = filename ?? ''
      divRef.current.focus()
    }
  }, [filename])

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (newFile) {
      if (setNewFile) {
        setNewFile(false)
      }
      e.currentTarget.textContent = (e.nativeEvent as InputEvent).data
      setTitle((e.nativeEvent as InputEvent).data)
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(e.currentTarget);
      range.collapse(false); // false to collapse the range to the end
      sel?.removeAllRanges();
      sel?.addRange(range);
    } else {
      setTitle(e.currentTarget.textContent)
    }
  }

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      editorBodyRef.current?.focus()
      console.log(editorBodyRef)
    }
  }

  console.log(_title)

  return (
    <div
      style={{ padding: '1em', borderBottom: COMMON_BORDER_STYLE, width: '100%', fontSize: '1.25em', fontWeight: 500, outline: 'none' }}
      ref={divRef}
      contentEditable
      onInput={handleInput}
      tabIndex={1}
      onKeyDown={handleKeyDown}
      suppressContentEditableWarning
    />
  )
}
