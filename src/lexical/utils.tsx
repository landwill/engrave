import { $createParagraphNode, $getRoot, LexicalEditor } from 'lexical'

export const clearEditor = (editor: LexicalEditor) => {
  editor.update(() => {
    $getRoot().clear()
    $getRoot().append($createParagraphNode())
  })
}