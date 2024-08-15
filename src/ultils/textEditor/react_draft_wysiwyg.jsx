import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromHTML, ContentState, convertToRaw } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import debounce from 'lodash/debounce';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './react_draft_wysiwyg.scss';

const TextEditor = ({ initialContent }) => {
  const [editorState, setEditorState] = useState(() => {
    if (initialContent) {
      const blocksFromHTML = convertFromHTML(initialContent);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      return EditorState.createWithContent(state);
    }
    return EditorState.createEmpty();
  });
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focusEditor();
    }
  }, []);

  const logContent = useCallback(
    debounce(() => {
      const content = convertToRaw(editorState.getCurrentContent());
      const textArray = [];
      const mentions = [];
      const hashtags = [];

      content.blocks.forEach(block => {
        const text = block.text;
        textArray.push(text);

        const words = text.split(' ');
        words.forEach(word => {
          if (word.startsWith('@')) {
            mentions.push(word);
          } else if (word.startsWith('#')) {
            hashtags.push(word);
          }
        });
      });

      const html = convertToHTML(editorState.getCurrentContent());

      const result = {
        text: textArray.join(' '),
        html: html,
        mentions: mentions,
        hashtags: hashtags
      };

      console.log(result);
    }, 500),
    [editorState]
  );

  useEffect(() => {
    logContent();
  }, [editorState, logContent]);

  return (
    <div className="editor-container">
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        ref={editorRef}
        toolbar={{
          options: ['inline', 'list', 'textAlign', 'history'],
          inline: { inDropdown: false },
          list: { inDropdown: false },
          textAlign: { inDropdown: false },
          history: { inDropdown: false },
        }}
        mention={{
          separator: ' ',
          trigger: '@',
          suggestions: [
            { text: 'APPLE', value: 'apple', url: 'apple' },
            { text: 'BANANA', value: 'banana', url: 'banana' },
            { text: 'CHERRY', value: 'cherry', url: 'cherry' },
            { text: 'DURIAN', value: 'durian', url: 'durian' },
            { text: 'EGGFRUIT', value: 'eggfruit', url: 'eggfruit' },
            { text: 'FIG', value: 'fig', url: 'fig' },
            { text: 'GRAPEFRUIT', value: 'grapefruit', url: 'grapefruit' },
            { text: 'HONEYDEW', value: 'honeydew', url: 'honeydew' },
          ],
        }}
        hashtag={{
          separator: ' ',
          trigger: '#',
        }}
      />
    </div>
  );
};

export default TextEditor;
