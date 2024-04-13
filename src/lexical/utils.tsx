import { $createParagraphNode, $getRoot, CLEAR_HISTORY_COMMAND, LexicalEditor } from 'lexical'

export const clearEditor = (editor: LexicalEditor) => {
  editor.update(() => {
    editor.setEditable(false)
    $getRoot().clear()
    $getRoot().append($createParagraphNode())
    editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined)
    requestAnimationFrame(() => {editor.setEditable(true)})
  })
}