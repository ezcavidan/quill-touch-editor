import React, { useRef, useState, useEffect } from 'react';
import { ProjectFile } from '@/types/project';
import { useI18n } from '@/hooks/useI18n';
import { useApp } from '@/contexts/AppContext';

interface CodeAreaProps {
  activeFile: ProjectFile | undefined;
  onCodeChange: (content: string) => void;
}

const CodeArea: React.FC<CodeAreaProps> = ({ activeFile, onCodeChange }) => {
  const { t } = useI18n();
  const { settings } = useApp();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [lineNumbers, setLineNumbers] = useState<number[]>([1]);

  // Update line numbers when content changes
  useEffect(() => {
    if (activeFile?.content) {
      const lines = activeFile.content.split('\n');
      setLineNumbers(Array.from({ length: lines.length }, (_, i) => i + 1));
    } else {
      setLineNumbers([1]);
    }
  }, [activeFile?.content]);

  // Note: Syntax highlighting is applied via CSS classes on the textarea
  // We're keeping the implementation simple to avoid rendering issues

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const lineNumberEl = document.querySelector('.line-numbers');
    if (lineNumberEl) {
      lineNumberEl.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const getFontSize = () => {
    switch (settings.fontSize) {
      case 'small': return '12px';
      case 'large': return '16px';
      default: return '14px';
    }
  };

  return (
    <div className="flex-1 relative flex bg-editor-background">
      {/* Line Numbers */}
      <div 
        className="line-numbers w-12 bg-editor-background border-r border-border/30 py-4 text-right pr-2 text-xs text-muted-foreground select-none overflow-hidden"
        style={{ fontSize: getFontSize() }}
      >
        {lineNumbers.map((lineNum) => (
          <div key={lineNum} className="leading-relaxed" style={{ lineHeight: '1.6' }}>
            {lineNum}
          </div>
        ))}
      </div>

      {/* Code Editor */}
      <div className="flex-1 relative">
        <textarea
          ref={editorRef}
          value={activeFile?.content || ''}
          onChange={(e) => onCodeChange(e.target.value)}
          onScroll={handleScroll}
          className="w-full h-full p-4 bg-transparent text-editor-foreground resize-none border-none outline-none code-editor leading-relaxed"
          style={{
            fontSize: getFontSize(),
            lineHeight: '1.6',
            fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
            tabSize: settings.tabSize,
          }}
          placeholder={activeFile ? t('editor.startCoding') : t('editor.selectFile')}
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default CodeArea;