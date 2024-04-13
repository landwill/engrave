import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { type EditorState, type LexicalEditor } from 'lexical'
import { runInAction } from 'mobx'
import React from 'react'
import { documentStore } from '../stores/DocumentStore.ts'
import { PopulateFromIndexedDB } from './lexical/PopulateFromIndexedDB.tsx'

interface EditorBodyPanelProps {
  documentUuid: string
  // editorBodyRef: React.RefObject<HTMLTextAreaElement>
}

const theme = {
  text: {
    bold: 'textBold',
    italic: 'textItalic',
    underline: 'textUnderline'
  }
}

export const EditorBodyPanel = ({ documentUuid }: EditorBodyPanelProps): React.JSX.Element => {
  const initialConfig: InitialConfigType = {
    namespace: 'EngraveEditor',
    onError: (error: unknown) => {console.log(error)},
    theme
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onChange = (editorState: EditorState, _editor: LexicalEditor, _tags: Set<string>): void => {
    runInAction(() => {documentStore.updateDocumentBody(documentUuid, editorState.toJSON())})
  }

  return <LexicalComposer initialConfig={initialConfig}>
    <RichTextPlugin contentEditable={<ContentEditable tabIndex={2} style={{ height: '100%', paddingLeft: '1em', paddingRight: '1em', outline: 'none' }} />}
                    placeholder={<div />}
                    ErrorBoundary={LexicalErrorBoundary} />
    <OnChangePlugin onChange={onChange} />
    <PopulateFromIndexedDB documentUuid={documentUuid} />
  </LexicalComposer>
}