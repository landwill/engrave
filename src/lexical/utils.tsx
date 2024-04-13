import { $createParagraphNode, $getRoot, LexicalEditor } from 'lexical'

export const clearEditor = (editor: LexicalEditor) => {
  editor.update(() => {
    editor.setEditable(false)
    $getRoot().clear()
    $getRoot().append($createParagraphNode())
    requestAnimationFrame(() => {editor.setEditable(true)});
  })
}