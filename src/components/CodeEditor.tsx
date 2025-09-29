import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { MobileButton } from '@/components/ui/mobile-button';
import { 
  ArrowLeft, 
  Play, 
  Terminal as TerminalIcon, 
  AlertTriangle, 
  Plus,
  Folder,
  File,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { ProjectFile } from '@/types/project';
import { nanoid } from 'nanoid';

const CodeEditor: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, currentProject, setCurrentProject, updateProject } = useApp();
  const navigate = useNavigate();
  
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Load project on mount
  useEffect(() => {
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setCurrentProject(project);
        if (project.files.length > 0) {
          setActiveFileId(project.files[0].id);
        }
      } else {
        navigate('/');
      }
    }
  }, [projectId, projects, setCurrentProject, navigate]);

  const activeFile = currentProject?.files.find(file => file.id === activeFileId);

  const handleCodeChange = (newContent: string) => {
    if (!currentProject || !activeFileId) return;
    
    const updatedFiles = currentProject.files.map(file =>
      file.id === activeFileId ? { ...file, content: newContent } : file
    );
    
    const updatedProject = {
      ...currentProject,
      files: updatedFiles,
      lastModified: new Date(),
    };
    
    updateProject(updatedProject);
  };

  const handleRun = () => {
    if (!currentProject || !activeFile) return;
    
    setTerminalOutput(prev => [
      ...prev,
      `Running ${activeFile.name}...`,
      `Output: Hello World! (Simulated)`,
      `Process finished with exit code 0`,
      '',
    ]);
    
    if (!showTerminal) {
      setShowTerminal(true);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const toggleFileExplorer = () => {
    setShowFileExplorer(!showFileExplorer);
  };

  const toggleTerminal = () => {
    setShowTerminal(!showTerminal);
  };

  const addFile = () => {
    if (!currentProject) return;
    
    const newFile: ProjectFile = {
      id: nanoid(),
      name: `untitled${currentProject.language.extension}`,
      content: '',
      type: 'file',
    };
    
    const updatedProject = {
      ...currentProject,
      files: [...currentProject.files, newFile],
      lastModified: new Date(),
    };
    
    updateProject(updatedProject);
    setActiveFileId(newFile.id);
  };

  const renderFileTree = (files: ProjectFile[]) => {
    return files.map(file => (
      <div key={file.id} className="mb-1">
        <div
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
            activeFileId === file.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
          }`}
          onClick={() => {
            if (file.type === 'file') {
              setActiveFileId(file.id);
              setShowFileExplorer(false);
            }
          }}
        >
          {file.type === 'folder' ? (
            <Folder className="w-4 h-4 text-muted-foreground" />
          ) : (
            <File className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="text-sm truncate">{file.name}</span>
        </div>
      </div>
    ));
  };

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-card relative z-20">
        <div className="flex items-center gap-3">
          <MobileButton variant="ghost" size="icon-sm" onClick={toggleFileExplorer}>
            <Plus className="w-4 h-4" />
          </MobileButton>
          <MobileButton variant="ghost" size="icon-sm">
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
          </MobileButton>
        </div>
        
        <div className="flex-1 text-center">
          <h1 className="text-sm font-medium truncate">{currentProject.name}</h1>
          {activeFile && (
            <p className="text-xs text-muted-foreground">{activeFile.name}</p>
          )}
        </div>
        
        <MobileButton variant="ghost" size="icon-sm" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4" />
        </MobileButton>
      </header>

      {/* File Explorer Overlay */}
      {showFileExplorer && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-30"
            onClick={() => setShowFileExplorer(false)}
          />
          <div className="fixed left-0 top-14 bottom-0 w-72 bg-card border-r border-border z-40 animate-slide-up overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Files</h3>
                <MobileButton variant="ghost" size="icon-sm" onClick={addFile}>
                  <Plus className="w-4 h-4" />
                </MobileButton>
              </div>
              <div className="space-y-1">
                {renderFileTree(currentProject.files)}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Editor Area */}
      <main className={`flex-1 flex flex-col ${showTerminal ? 'h-1/2' : ''}`}>
        <div className="flex-1 relative">
          <textarea
            ref={editorRef}
            value={activeFile?.content || ''}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="w-full h-full p-4 bg-editor-background text-editor-foreground resize-none border-none outline-none code-editor leading-relaxed"
            style={{
              fontSize: '14px',
              lineHeight: '1.6',
              fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
            }}
            placeholder={activeFile ? "Start coding..." : "Select a file to edit"}
            spellCheck={false}
          />
          
          {/* Line numbers could be added here */}
        </div>
        
        {/* Bottom Controls */}
        <div className="h-14 flex items-center justify-between px-4 border-t border-border bg-card">
          <MobileButton variant="floating" size="sm" onClick={handleRun} className="flex-1 mr-2 max-w-32">
            <Play className="w-4 h-4 mr-2" />
            Run
          </MobileButton>
          
          <MobileButton 
            variant={showTerminal ? "editor" : "ghost"} 
            size="icon-sm" 
            onClick={toggleTerminal}
          >
            <TerminalIcon className="w-4 h-4" />
          </MobileButton>
        </div>
      </main>

      {/* Terminal Panel */}
      {showTerminal && (
        <div className="h-64 border-t border-border bg-editor-background animate-slide-up">
          <div className="h-full flex flex-col">
            <div className="h-12 flex items-center justify-between px-4 border-b border-border">
              <h3 className="text-sm font-medium text-editor-foreground">Terminal</h3>
              <MobileButton variant="ghost" size="icon-sm" onClick={toggleTerminal}>
                <ChevronDown className="w-4 h-4" />
              </MobileButton>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="code-editor text-sm">
                {terminalOutput.map((line, index) => (
                  <div key={index} className="mb-1 text-editor-foreground">
                    {line || '\u00A0'}
                  </div>
                ))}
                <div className="flex items-center">
                  <span className="text-primary mr-2">$</span>
                  <span className="text-editor-foreground">Ready for input...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;