"use client";
import { useParams } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import CodeEditor from '../CodeEditor';
import { io, type Socket } from 'socket.io-client';
import styles from './page.module.css';
import langDetector from 'lang-detector';
import { FaDownload, FaCopy } from 'react-icons/fa';

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:4000';
const langMap: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  java: 'java',
  c: 'c',
  cpp: 'cpp',
  ruby: 'ruby',
  go: 'go',
  php: 'php',
  csharp: 'csharp',
  html: 'html',
  css: 'css',
  json: 'json',
  markdown: 'markdown',
  shell: 'shell',
  sql: 'sql',
  xml: 'xml',
  plaintext: 'plaintext',
};

function getMonacoLang(detected: string) {
  return langMap[detected.toLowerCase()] || 'plaintext';
}

// Helper to get file extension from language
function getFileExtension(lang: string) {
  const extMap: Record<string, string> = {
    javascript: 'js', typescript: 'ts', python: 'py', java: 'java', c: 'c', cpp: 'cpp', ruby: 'rb', go: 'go', php: 'php', csharp: 'cs', html: 'html', css: 'css', json: 'json', markdown: 'md', shell: 'sh', sql: 'sql', xml: 'xml', plaintext: 'txt',
  };
  return extMap[lang] || 'txt';
}

const EditorPage = () => {
  const params = useParams();
  const { roomId } = params;
  const [code, setCode] = useState('// Start coding!');
  const [language, setLanguage] = useState('javascript');
  const [detectedLang, setDetectedLang] = useState('JavaScript');
  const socketRef = useRef<Socket | null>(null);
  const isRemoteUpdate = useRef(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showEdited, setShowEdited] = useState(false);
  const [editorBg, setEditorBg] = useState('');

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);
    socketRef.current = socket;
    socket.emit('join', roomId);

    socket.on('code-update', (newCode: string) => {
      isRemoteUpdate.current = true;
      setCode(newCode);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    // Detect language whenever code changes
    const detected = langDetector(code) || 'plaintext';
    setDetectedLang(detected.charAt(0).toUpperCase() + detected.slice(1));
    setLanguage(getMonacoLang(detected));
  }, [code]);

  const handleCodeChange = (value: string | undefined) => {
    setEditorBg('edited');
    setTimeout(() => setEditorBg(''), 1500);
    setCode(value ?? '');
    if (!isRemoteUpdate.current && socketRef.current) {
      socketRef.current.emit('code-change', { roomId, code: value ?? '' });
    }
    isRemoteUpdate.current = false;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setEditorBg('copied');
      setTimeout(() => {
        setCopySuccess(false);
        setEditorBg('');
      }, 1500);
    } catch (err) {
      setCopySuccess(false);
    }
  };

  const handleDownload = () => {
    const ext = getFileExtension(language);
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${ext}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.logo}>codex-fly</span>
        <div className={styles.headerRight}>
          <div className={styles.roomCopyContainer}>
            <span style={{ color: '#fff', fontFamily: 'monospace', fontSize: 16, marginRight: 12 }}>Room: {roomId}</span>
            <button
              className={copySuccess ? `${styles.copyBtn} ${styles.copied} ${styles.iconBtn}` : `${styles.copyBtn} ${styles.iconBtn}`}
              onClick={handleCopyLink}
              style={{ marginLeft: 0, marginTop: 0, padding: '0.3rem 0.8rem', fontSize: 18 }}
              aria-label={copySuccess ? 'Copied!' : 'Copy room link'}
              title={copySuccess ? 'Copied!' : 'Copy room link'}
            >
              {copySuccess ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 10.5L9 14.5L15 7.5" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <FaCopy size={18} color="#fff" />
              )}
            </button>
            <button
              className={`${styles.copyBtn} ${styles.iconBtn}`}
              onClick={handleDownload}
              style={{ marginLeft: 0, marginTop: 0, padding: '0.3rem 0.8rem', fontSize: 18 }}
              aria-label="Download code"
              title="Download code"
            >
              <FaDownload size={18} color="#fff" />
            </button>
          </div>
        </div>
      </header>
      <div className={styles.editorCard}>
        <CodeEditor
          value={code}
          onChange={handleCodeChange}
          language={language}
        />
        {language !== 'plaintext' && detectedLang && (
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
            <span className={styles.langBadge}>
              <span>Language:</span> {detectedLang}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorPage; 