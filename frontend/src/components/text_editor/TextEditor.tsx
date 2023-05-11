import {$getRoot, $getSelection} from 'lexical';

import * as React from 'react';

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import type { EditorState, LexicalEditor } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';

export interface ITextEditorProps {
  value: string | HTMLElement | React.ReactNode,
  // onSubmit: () => 
}



function MyCustomAutoFocusPlugin() {
    const [editor] = useLexicalComposerContext();
  
    React.useEffect(() => {
      // Focus the editor when the effect fires!
      editor.focus();
    }, [editor]);
  
    return null;
  }
  

function onError(error: any) {
    console.error(error);
}
const theme = {}




export default function TextEditor (props: ITextEditorProps) {
    const initialConfig = {
        namespace: 'TextEditor', 
        theme,
        onError,
    };

    const onChange = (editorState: EditorState, editor: LexicalEditor) => {
      editorState.read(() => {
        // const root = $getRoot();
        // const selection = $getSelection();
      });
    }
    
    return (
    <LexicalComposer initialConfig={initialConfig}>
        <PlainTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={onChange}/>
        <HistoryPlugin />
        <MyCustomAutoFocusPlugin />
    </LexicalComposer>
    );
}





