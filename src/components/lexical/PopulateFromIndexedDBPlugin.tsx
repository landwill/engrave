import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { CLEAR_HISTORY_COMMAND, LexicalEditor } from 'lexical'
import { useEffect } from 'react'
import { IDBWorkerMessage } from '../../interfaces.ts'
import { clearEditor } from '../../lexical/utils.tsx'
import { worker } from '../../misc/worker.ts'

interface PopulateFromIndexedDBProps {
  documentUuid: string
}

const handleWorkerMessage = (editor: LexicalEditor, event: MessageEvent<IDBWorkerMessage>, documentUuid: string) => {
  const { data } = event
  const { documentUuid: messageDocumentUuid, body } = data
  if (messageDocumentUuid !== documentUuid) {
    // We've changed document since the worker request was submitted; ignore the response.
    return
  }

  if (body == null || body === '') {
    clearEditor(editor)
    return
  }

  let parsedEditorState
  try {
    parsedEditorState = editor.parseEditorState(body)
  } catch (error) {
    console.error('Failed to parse file body to Lexical state. Body:', body)
    return
  }

  if (parsedEditorState.isEmpty()) {
    clearEditor(editor)
    return
  }

  editor.update(() => {
    editor.setEditorState(parsedEditorState)
    editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined)
    editor.setEditable(true)
  })
}

export const PopulateFromIndexedDBPlugin = ({ documentUuid: documentUuid }: PopulateFromIndexedDBProps) => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    editor.setEditable(false)
    worker.onmessage = (event: MessageEvent<IDBWorkerMessage>) => {handleWorkerMessage(editor, event, documentUuid)}

    worker.postMessage(documentUuid)
    return () => {
      worker.onmessage = null
    }
  }, [documentUuid, editor])

  return null
}