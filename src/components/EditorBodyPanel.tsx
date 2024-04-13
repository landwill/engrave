import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { type EditorState, type LexicalEditor } from 'lexical'
import { runInAction } from 'mobx'
import React, { MutableRefObject } from 'react'
import ToolbarPlugin from '../lexical/ToolbarPlugin.tsx'
import { documentStore } from '../stores/DocumentStore.ts'
import { PopulateFromIndexedDBPlugin } from './lexical/PopulateFromIndexedDBPlugin.tsx'

interface EditorBodyPanelProps {
  documentUuid: string
  editorBodyRef: MutableRefObject<LexicalEditor | null>
}

const theme = {
  text: {
    bold: 'textBold',
    italic: 'textItalic',
    underline: 'textUnderline'
  }
}

export const EditorBodyPanel = ({ documentUuid, editorBodyRef }: EditorBodyPanelProps): React.JSX.Element => {
  const initialConfig: InitialConfigType = {
    namespace: 'EngraveEditor',
    onError: (error: unknown) => {console.log(error)},
    theme,
    editable: false
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onChange = (editorState: EditorState, _editor: LexicalEditor, _tags: Set<string>): void => {
    runInAction(() => {documentStore.updateDocumentBody(documentUuid, editorState.toJSON())})
  }

  return <LexicalComposer initialConfig={initialConfig} key={documentUuid}>
    <ToolbarPlugin />
    <RichTextPlugin contentEditable={<ContentEditable tabIndex={2} style={{ height: '100%', paddingLeft: '1em', paddingRight: '1em', outline: 'none' }} />}
                    placeholder={<div />}
                    ErrorBoundary={LexicalErrorBoundary}/>
    <OnChangePlugin onChange={onChange} ignoreSelectionChange/>
    <PopulateFromIndexedDBPlugin documentUuid={documentUuid} />
    <EditorRefPlugin editorRef={editorBodyRef}/>
    <HistoryPlugin />
  </LexicalComposer>
}