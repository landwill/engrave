import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'
import { IDBWorkerMessage } from '../../interfaces.ts'
import { clearEditor } from '../../lexical/utils.tsx'
import { worker } from '../../misc/worker.ts'

interface PopulateFromIndexedDBProps {
  documentUuid: string
}

export const PopulateFromIndexedDBPlugin = ({ documentUuid: documentUuidProp }: PopulateFromIndexedDBProps) => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    editor.setEditable(false)
    worker.onmessage = ({ data }) => {
      const { documentUuid, body } = data as IDBWorkerMessage
      if (documentUuid !== documentUuidProp) throw new Error('Unexpected documentUuid.')
      if (body == null || body === '') {
        clearEditor(editor)
      } else {
        const parsedEditorState = editor.parseEditorState(body)
        if (parsedEditorState.isEmpty()) {
          clearEditor(editor)
        } else {
          editor.update(() => {
            editor.setEditorState(parsedEditorState)
            editor.setEditable(true)
          })
        }
      }
    }

    worker.postMessage(documentUuidProp)
    return () => {
      worker.onmessage = null
    }
  }, [documentUuidProp, editor])

  return null
}