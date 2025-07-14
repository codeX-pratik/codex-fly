import React, { useEffect, useRef } from 'react';
import MonacoEditor, { OnMount } from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, language = 'javascript', onChange }) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const lastDecorations = useRef<string[]>([]);
  const lastValue = useRef<string>(value);

  // Find the first line that changed
  function getChangedLine(oldValue: string, newValue: string): number | null {
    const oldLines = oldValue.split('\n');
    const newLines = newValue.split('\n');
    const minLen = Math.min(oldLines.length, newLines.length);
    for (let i = 0; i < minLen; i++) {
      if (oldLines[i] !== newLines[i]) return i + 1;
    }
    if (oldLines.length !== newLines.length) return minLen + 1;
    return null;
  }

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    const changedLine = getChangedLine(lastValue.current, value);
    lastValue.current = value;
    if (changedLine) {
      lastDecorations.current = editorRef.current.deltaDecorations(
        lastDecorations.current,
        [
          {
            range: new monacoRef.current.Range(changedLine, 1, changedLine, 1),
            options: {
              isWholeLine: true,
              className: 'monaco-line-changed',
            },
          },
        ]
      );
      setTimeout(() => {
        if (editorRef.current) {
          lastDecorations.current = editorRef.current.deltaDecorations(lastDecorations.current, []);
        }
      }, 1500);
    }
  }, [value]);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    // Inject CSS for the highlight
    const style = document.createElement('style');
    style.innerHTML = `.monaco-line-changed { background: #fff59d33 !important; }`;
    document.head.appendChild(style);
  };

  return (
    <div style={{ borderRadius: 8, overflow: 'hidden', width: '100%', height: '100%' }}>
      <MonacoEditor
        width="100%"
        height="100%"
        defaultLanguage={language}
        value={value}
        onChange={onChange}
        theme={'vs-dark'}
        onMount={handleEditorMount}
        options={{ fontSize: 16, minimap: { enabled: false }, fontFamily: 'Fira Mono, monospace', lineNumbers: 'on', scrollBeyondLastLine: false, wordWrap: 'on', automaticLayout: true, contextmenu: false }}
      />
    </div>
  );
};

export default CodeEditor; 