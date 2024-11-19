'use client';

import Theme from './plugins/Theme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { HeadingNode } from '@lexical/rich-text';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import React from 'react';
import { FloatingComposer, FloatingThreads, liveblocksConfig, LiveblocksPlugin, useIsEditorReady } from '@liveblocks/react-lexical';
import Loader from '../Loader';
import FloatingtoolbarPlugin from './plugins/FloatingtoolbarPlugin';
import { useThreads } from '@liveblocks/react/suspense';

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

export function Editor({ roomId, currentUserType }: { roomId: string, currentUserType: UserType }) {

  const status = useIsEditorReady();
  if (!roomId || !currentUserType) {
    return <div>Error: Missing room ID or user type.</div>;
  }

  const { threads } = useThreads();

  const initialConfig = liveblocksConfig({
    namespace: 'Editor',
    nodes: [HeadingNode],
    onError: (error: Error) => {
      console.error(error);
      throw error;
    },
    theme: Theme,
    editable: currentUserType === 'editor',
  });

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container size-full">
        <div className='toolbar-wrapper flex min-w-full justify-between'>
          <ToolbarPlugin />
          {/* {currentUserType === 'editor' && <DeleteModel roomId={roomId} />} */}

        </div>

        <div className='editor-wrapper flex flex-col items-center justify-start'>
          {status === 'mot-loaded' || status === 'loading' ? (<Loader />) : (
            <div className="editor-inner min-h-[1100px] relative mb-5 h-fit w-full max-w-[800px] shadow-md lg:mb-10">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="editor-input h-full" />
                }
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              {currentUserType === 'editor' && <FloatingtoolbarPlugin />}
              <HistoryPlugin />
              <AutoFocusPlugin />
            </div>
          )}
          <LiveblocksPlugin>
            <FloatingComposer className='w-[350px]' />
            <FloatingThreads className='' threads={threads} />
          </LiveblocksPlugin>
        </div>

      </div>
    </LexicalComposer>
  );
}
