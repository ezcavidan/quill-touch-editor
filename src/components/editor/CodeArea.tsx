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

  // Apply syntax highlighting to content
  const applySyntaxHighlighting = (content: string): string => {
    if (!content) return content;

    // Simple syntax highlighting patterns
    const patterns = [
      // Keywords
      { regex: /\b(function|const|let|var|if|else|for|while|return|class|import|export|from|async|await|try|catch|finally)\b/g, className: 'text-code-keyword font-semibold' },
      // Strings
      { regex: /(["'`])(?:(?=(\\?))\2.)*?\1/g, className: 'text-code-string' },
      // Numbers
      { regex: /\b\d+\.?\d*\b/g, className: 'text-code-number' },
      // Comments
      { regex: /\/\/.*$/gm, className: 'text-code-comment italic' },
      { regex: /\/\*[\s\S]*?\*\//g, className: 'text-code-comment italic' },
      // Operators
      { regex: /[+\-*/=<>!&|]+/g, className: 'text-code-operator' },
    ];

    let highlightedContent = content;
    patterns.forEach(pattern => {
      highlightedContent = highlightedContent.replace(
        pattern.regex,
        `<span class="${pattern.className}">$&</span>`
      );
    });

    return highlightedContent;
  };

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
          className="w-full h-full p-4 bg-transparent text-editor-foreground resize-none border-none outline-none code-editor leading-relaxed relative z-10"
          style={{
            fontSize: getFontSize(),
            lineHeight: '1.6',
            fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
            tabSize: settings.tabSize,
          }}
          placeholder={activeFile ? t('editor.startCoding') : t('editor.selectFile')}
          spellCheck={false}
        />

        {/* Syntax Highlighting Overlay (for display purposes only) */}
        {activeFile?.content && (
          <div 
            className="absolute inset-0 p-4 pointer-events-none text-transparent leading-relaxed whitespace-pre-wrap overflow-hidden"
            style={{
              fontSize: getFontSize(),
              lineHeight: '1.6',
              fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
              tabSize: settings.tabSize,
            }}
            dangerouslySetInnerHTML={{ 
              __html: applySyntaxHighlighting(activeFile.content)
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CodeArea;