import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { FiFile, FiPlus, FiSave, FiFolder, FiCode, FiEye, FiMinus, FiMaximize2, FiX } from 'react-icons/fi';

const Workspace = ({ project, onProjectSave, onCloseProject }) => {
  const [files, setFiles] = useState(project.files || {});
  const [activeFile, setActiveFile] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [showProjectsList, setShowProjectsList] = useState(false);
  const [viewMode, setViewMode] = useState('code'); // 'code' или 'preview'
  const [isMaximized, setIsMaximized] = useState(false);
  const iframeRef = useRef(null);

  const languageMap = {
    html: 'html',
    markdown: 'markdown',
    python: 'python',
    react: 'javascript',
    node: 'javascript',
    css: 'css',
    js: 'javascript'
  };

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    roundedSelection: false,
    automaticLayout: true,
    fontFamily: 'JetBrains Mono',
    contextmenu: false,
    theme: 'vs-dark',
    scrollBeyondLastLine: false
  };

  useEffect(() => {
    if (!activeFile && Object.keys(files).length > 0) {
      setActiveFile(Object.keys(files)[0]);
    }
  }, [files]);

  useEffect(() => {
    if (viewMode === 'preview' && activeFile && activeFile.endsWith('.html')) {
      updatePreview();
    }
  }, [viewMode, activeFile, files]);

  const getDefaultContent = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    const templates = {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      line-height: 1.6;
    }
    h1 {
      color: #2c3e50;
    }
  </style>
</head>
<body>
  <h1>Hello World!</h1>
  <p>This is your new HTML document.</p>
  
  <script>
    console.log('Hello from JavaScript!');
  </script>
</body>
</html>`,
      css: `/* CSS Styles */
body {
  margin: 0;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

h1 {
  color: #2c3e50;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}`,
      js: `// JavaScript Code
console.log('Hello World');

function greet(name) {
  return 'Hello, ' + name + '!';
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded and parsed');
});`,
      py: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Module Description

Author: Your Name
Date: ${new Date().toLocaleDateString()}
"""

def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
      md: `# Markdown Document

## Subheading

- List item 1
- List item 2

[Link](https://example.com)`,
      jsx: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Hello React</h1>
    </div>
  );
}

export default App;`
    };

    return templates[extension] || '';
  };

  const createFile = () => {
    if (!newFileName) return;
    
    const newFiles = { ...files };
    const content = getDefaultContent(newFileName);
    newFiles[newFileName] = content;
    setFiles(newFiles);
    setActiveFile(newFileName);
    setNewFileName('');
    saveProject(newFiles);
  };

  const saveProject = (updatedFiles) => {
    const updatedProject = { ...project, files: updatedFiles };
    onProjectSave(updatedProject);
  };

  const handleEditorChange = (value) => {
    const updatedFiles = { ...files };
    updatedFiles[activeFile] = value;
    setFiles(updatedFiles);
    
    // Автосохранение при изменении
    saveProject(updatedFiles);

    // Обновляем превью, если оно активно
    if (viewMode === 'preview' && activeFile.endsWith('.html')) {
      updatePreview();
    }
  };

  const updatePreview = () => {
    if (!iframeRef.current || !activeFile || !files[activeFile]) return;

    // Получаем HTML-код
    let html = files[activeFile];

    // Добавляем связанные CSS и JS файлы
    if (html.includes('</head>')) {
      let styles = '';
      let scripts = '';

      Object.keys(files).forEach(file => {
        if (file.endsWith('.css')) {
          styles += `<link rel="stylesheet" href="${file}">\n`;
        } else if (file.endsWith('.js')) {
          scripts += `<script src="${file}"></script>\n`;
        }
      });

      html = html.replace('</head>', `${styles}</head>`);
      html = html.replace('</body>', `${scripts}</body>`);
    }

    // Вставляем CSS и JS содержимое напрямую
    Object.keys(files).forEach(file => {
      if (file.endsWith('.css') && html.includes(`href="${file}"`)) {
        html = html.replace(
          `<link rel="stylesheet" href="${file}">`,
          `<style>${files[file]}</style>`
        );
      } else if (file.endsWith('.js') && html.includes(`src="${file}"`)) {
        html = html.replace(
          `<script src="${file}"></script>`,
          `<script>${files[file]}</script>`
        );
      }
    });

    // Обновляем iframe
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'code' ? 'preview' : 'code');
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <div className={`workspace ${isMaximized ? 'maximized' : ''}`}>
      <div className="window-controls">
        <div className="window-title">
          {project.name} - AtomGlide Code
        </div>
        <div className="window-buttons">
          <button onClick={() => {}}>
            <FiMinus />
          </button>
          <button onClick={toggleMaximize}>
            <FiMaximize2 />
          </button>
          <button onClick={onCloseProject}>
            <FiX />
          </button>
        </div>
      </div>

      <div className="file-manager">
        <div className="file-header">
          <div className="project-actions">
            <button 
              className="open-project-btn"
              onClick={() => setShowProjectsList(!showProjectsList)}
            >
              <FiFolder/> Открыть проект
            </button>
            <button 
              className="save-project-btn"
              onClick={() => saveProject(files)}
            >
              <FiSave/> Сохранить проект
            </button>
          </div>

          <div className="file-actions">
            <input
              type="text"
              placeholder="Имя файла (например: index.html)"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createFile()}
            />
            <button onClick={createFile}><FiPlus/> Создать</button>
          </div>
        </div>

        <div className="file-list">
          {Object.keys(files).map((fileName) => (
            <div 
              key={fileName} 
              className={`file-item ${activeFile === fileName ? 'active' : ''}`}
              onClick={() => {
                setActiveFile(fileName);
                if (fileName.endsWith('.html')) setViewMode('code');
              }}
            >
              <FiFile className="file-icon"/>
              {fileName}
            </div>
          ))}
        </div>
      </div>

      <div className="editor-container">
        {activeFile && (
          <>
            {activeFile.endsWith('.html') && (
              <div className="view-mode-toggle">
                <button
                  onClick={toggleViewMode}
                  className={viewMode === 'code' ? 'active' : ''}
                >
                  <FiCode/> Код
                </button>
                <button
                  onClick={toggleViewMode}
                  className={viewMode === 'preview' ? 'active' : ''}
                >
                  <FiEye/> Превью
                </button>
              </div>
            )}

            {viewMode === 'code' ? (
              <Editor
                height="100%"
                width="100%"
                language={languageMap[project.type] || languageMap[activeFile.split('.').pop()] || 'plaintext'}
                value={files[activeFile]}
                options={editorOptions}
                onChange={handleEditorChange}
                beforeMount={() => {
                  window.monaco.editor.defineTheme('vs-dark-custom', {
                    base: 'vs-dark',
                    inherit: true,
                    rules: [],
                    colors: {
                      'editor.background': '#1e1e1e',
                    }
                  });
                }}
                onMount={(editor) => {
                  editor.getModel()?.updateOptions({ tabSize: 2 });
                  window.monaco.editor.setTheme('vs-dark-custom');
                }}
              />
            ) : (
              <div className="preview-container">
                <iframe
                  ref={iframeRef}
                  title="HTML Preview"
                  sandbox="allow-scripts allow-same-origin"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    backgroundColor: 'white'
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Workspace;