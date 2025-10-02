import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { MobileButton } from '@/components/ui/mobile-button';
import { 
  ArrowLeft, 
  Play, 
  Terminal as TerminalIcon, 
  AlertTriangle, 
  Plus,
  Eye
} from 'lucide-react';
import { ProjectFile } from '@/types/project';
import { nanoid } from 'nanoid';
import { useI18n } from '@/hooks/useI18n';
import FileExplorer from './editor/FileExplorer';
import CodeArea from './editor/CodeArea';
import Terminal from './editor/Terminal';

const CodeEditor: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, currentProject, setCurrentProject, updateProject } = useApp();
  const navigate = useNavigate();
  const { t } = useI18n();
  
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

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
    
    // For web projects, execute the code
    if (currentProject.language.id === 'web') {
      try {
        // Extract and execute JavaScript
        const scriptMatches = activeFile.content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
        const output: string[] = [`${t('editor.running')} ${activeFile.name}...`];
        
        // Override console.log to capture output
        const originalLog = console.log;
        const logs: string[] = [];
        console.log = (...args) => {
          logs.push(args.map(arg => String(arg)).join(' '));
          originalLog(...args);
        };
        
        if (scriptMatches) {
          scriptMatches.forEach(script => {
            const code = script.replace(/<script[^>]*>|<\/script>/gi, '');
            try {
              eval(code);
            } catch (err) {
              logs.push(`Error: ${err}`);
            }
          });
        }
        
        // Restore console.log
        console.log = originalLog;
        
        output.push(...logs);
        output.push(t('editor.finished'));
        output.push('');
        
        setTerminalOutput(prev => [...prev, ...output]);
      } catch (err) {
        setTerminalOutput(prev => [
          ...prev,
          `${t('editor.running')} ${activeFile.name}...`,
          `Error: ${err}`,
          '',
        ]);
      }
    } else {
      setTerminalOutput(prev => [
        ...prev,
        `${t('editor.running')} ${activeFile.name}...`,
        t('editor.output'),
        t('editor.finished'),
        '',
      ]);
    }
    
    if (!showTerminal) {
      setShowTerminal(true);
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
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
      name: `${t('file.untitled')}${currentProject.language.extension}`,
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

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">{t('editor.loading')}</p>
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
            <FileExplorer
              currentProject={currentProject}
              activeFileId={activeFileId}
              expandedFolders={expandedFolders}
              onFileSelect={(fileId) => {
                setActiveFileId(fileId);
                setShowFileExplorer(false);
              }}
              onProjectUpdate={updateProject}
              onToggleFolder={toggleFolder}
            />
          </div>
        </>
      )}

      {/* Editor Area */}
      <main className={`flex-1 flex flex-col ${showTerminal ? 'h-1/2' : ''}`}>
        <CodeArea
          activeFile={activeFile}
          onCodeChange={handleCodeChange}
        />
        
        {/* Bottom Controls */}
        <div className="h-14 flex items-center justify-between px-4 border-t border-border bg-card">
          <MobileButton variant="floating" size="sm" onClick={handleRun} className="flex-1 mr-2 max-w-32">
            <Play className="w-4 h-4 mr-2" />
            {t('editor.run')}
          </MobileButton>
          
          {currentProject.language.id === 'web' && (
            <MobileButton 
              variant={showPreview ? "editor" : "ghost"} 
              size="icon-sm" 
              onClick={togglePreview}
              className="mr-2"
            >
              <Eye className="w-4 h-4" />
            </MobileButton>
          )}
          
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
        <Terminal
          terminalOutput={terminalOutput}
          onToggle={toggleTerminal}
        />
      )}

      {/* Preview Window */}
      {showPreview && currentProject.language.id === 'web' && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-30"
            onClick={() => setShowPreview(false)}
          />
          <div className="fixed inset-4 z-40 bg-background rounded-lg shadow-2xl flex flex-col animate-scale-in">
            <div className="h-14 flex items-center justify-between px-4 border-b border-border">
              <h2 className="font-medium">{t('editor.preview')}</h2>
              <MobileButton variant="ghost" size="icon-sm" onClick={() => setShowPreview(false)}>
                <ArrowLeft className="w-4 h-4" />
              </MobileButton>
            </div>
            <div className="flex-1 overflow-auto">
              <iframe
                srcDoc={activeFile?.content || ''}
                className="w-full h-full border-0"
                title="Preview"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CodeEditor;