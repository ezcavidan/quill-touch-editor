import React, { useState } from 'react';
import { ProjectFile, Project } from '@/types/project';
import { MobileButton } from '@/components/ui/mobile-button';
import { 
  Plus, 
  Folder, 
  File, 
  MoreVertical,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { useI18n } from '@/hooks/useI18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileExplorerProps {
  currentProject: Project;
  activeFileId: string | null;
  expandedFolders: Set<string>;
  onFileSelect: (fileId: string) => void;
  onProjectUpdate: (project: Project) => void;
  onToggleFolder: (folderId: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  currentProject,
  activeFileId,
  expandedFolders,
  onFileSelect,
  onProjectUpdate,
  onToggleFolder
}) => {
  const { t } = useI18n();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [createType, setCreateType] = useState<'file' | 'folder'>('file');
  const [createName, setCreateName] = useState('');
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [draggedFile, setDraggedFile] = useState<ProjectFile | null>(null);

  const handleCreateFile = () => {
    if (!createName.trim()) return;
    
    const extension = createType === 'file' ? currentProject.language.extension : '';
    const fileName = createType === 'file' ? `${createName}${extension}` : createName;
    
    const newFile: ProjectFile = {
      id: nanoid(),
      name: fileName,
      content: createType === 'file' ? '' : '',
      type: createType,
      children: createType === 'folder' ? [] : undefined,
    };
    
    const updatedProject = {
      ...currentProject,
      files: [...currentProject.files, newFile],
      lastModified: new Date(),
    };
    
    onProjectUpdate(updatedProject);
    setCreateName('');
    setShowCreateDialog(false);
    
    if (createType === 'file') {
      onFileSelect(newFile.id);
    }
  };

  const renameFileRecursive = (files: ProjectFile[], fileId: string, newName: string): ProjectFile[] => {
    return files.map(file => {
      if (file.id === fileId) {
        return { ...file, name: newName };
      }
      if (file.children) {
        return { ...file, children: renameFileRecursive(file.children, fileId, newName) };
      }
      return file;
    });
  };

  const handleRenameFile = () => {
    if (!selectedFile || !createName.trim()) return;
    
    const updatedFiles = renameFileRecursive(currentProject.files, selectedFile.id, createName);
    
    const updatedProject = {
      ...currentProject,
      files: updatedFiles,
      lastModified: new Date(),
    };
    
    onProjectUpdate(updatedProject);
    setCreateName('');
    setShowRenameDialog(false);
    setSelectedFile(null);
  };

  const deleteFileRecursive = (files: ProjectFile[], fileId: string): ProjectFile[] => {
    return files.filter(file => file.id !== fileId).map(file => ({
      ...file,
      children: file.children ? deleteFileRecursive(file.children, fileId) : undefined,
    }));
  };

  const handleDeleteFile = (fileId: string) => {
    const updatedFiles = deleteFileRecursive(currentProject.files, fileId);
    const updatedProject = {
      ...currentProject,
      files: updatedFiles,
      lastModified: new Date(),
    };
    
    onProjectUpdate(updatedProject);
  };

  const handleCopyFile = (file: ProjectFile) => {
    const newFile: ProjectFile = {
      ...file,
      id: nanoid(),
      name: `copy_${file.name}`,
    };
    
    const updatedProject = {
      ...currentProject,
      files: [...currentProject.files, newFile],
      lastModified: new Date(),
    };
    
    onProjectUpdate(updatedProject);
  };

  const handleDragStart = (e: React.DragEvent, file: ProjectFile) => {
    setDraggedFile(file);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const moveFileToFolder = (files: ProjectFile[], fileId: string, targetFolderId: string): { success: boolean; files: ProjectFile[] } => {
    let movedFile: ProjectFile | null = null;
    
    // First, remove the file from its current location
    const removeFile = (fileList: ProjectFile[]): ProjectFile[] => {
      return fileList.filter(file => {
        if (file.id === fileId) {
          movedFile = file;
          return false;
        }
        if (file.children) {
          file.children = removeFile(file.children);
        }
        return true;
      });
    };
    
    const filesWithoutMoved = removeFile([...files]);
    
    if (!movedFile) return { success: false, files };
    
    // Then, add it to the target folder
    const addToFolder = (fileList: ProjectFile[]): ProjectFile[] => {
      return fileList.map(file => {
        if (file.id === targetFolderId && file.type === 'folder') {
          return {
            ...file,
            children: [...(file.children || []), movedFile!],
          };
        }
        if (file.children) {
          return {
            ...file,
            children: addToFolder(file.children),
          };
        }
        return file;
      });
    };
    
    return { success: true, files: addToFolder(filesWithoutMoved) };
  };

  const handleDrop = (e: React.DragEvent, targetFolder: ProjectFile) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedFile || targetFolder.type !== 'folder' || draggedFile.id === targetFolder.id) {
      setDraggedFile(null);
      return;
    }

    const result = moveFileToFolder(currentProject.files, draggedFile.id, targetFolder.id);
    
    if (result.success) {
      const updatedProject = {
        ...currentProject,
        files: result.files,
        lastModified: new Date(),
      };
      onProjectUpdate(updatedProject);
    }
    
    setDraggedFile(null);
  };

  const openCreateDialog = (type: 'file' | 'folder') => {
    setCreateType(type);
    setCreateName('');
    setShowCreateDialog(true);
  };

  const openRenameDialog = (file: ProjectFile) => {
    setSelectedFile(file);
    setCreateName(file.name);
    setShowRenameDialog(true);
  };

  const renderFileItem = (file: ProjectFile, depth: number = 0) => {
    const isExpanded = expandedFolders.has(file.id);
    const hasChildren = file.children && file.children.length > 0;
    
    return (
      <div key={file.id} className="mb-1">
        <div
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all group ${
            activeFileId === file.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
          } ${draggedFile?.id === file.id ? 'opacity-50' : ''}`}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={(e) => {
            e.stopPropagation();
            if (file.type === 'file') {
              onFileSelect(file.id);
            } else {
              onToggleFolder(file.id);
            }
          }}
          draggable
          onDragStart={(e) => handleDragStart(e, file)}
          onDragOver={file.type === 'folder' ? handleDragOver : undefined}
          onDrop={file.type === 'folder' ? (e) => handleDrop(e, file) : undefined}
        >
          {file.type === 'folder' ? (
            <Folder className={`w-4 h-4 flex-shrink-0 transition-colors ${
              isExpanded ? 'text-primary' : 'text-muted-foreground'
            }`} />
          ) : (
            <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          )}
          <span className="text-sm truncate flex-1">{file.name}</span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <MobileButton 
                variant="ghost" 
                size="icon-sm" 
                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity h-6 w-6 flex-shrink-0"
              >
                <MoreVertical className="w-3 h-3" />
              </MobileButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                openRenameDialog(file);
              }}>
                <Edit className="w-4 h-4 mr-2" />
                {t('file.rename')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                handleCopyFile(file);
              }}>
                <Copy className="w-4 h-4 mr-2" />
                {t('file.copy')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(file.id);
                }}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t('file.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Render children if folder is expanded */}
        {file.type === 'folder' && isExpanded && hasChildren && (
          <div className="animate-slideDown">
            {file.children!.map(child => renderFileItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">{t('editor.files')}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MobileButton variant="ghost" size="icon-sm">
                <Plus className="w-4 h-4" />
              </MobileButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openCreateDialog('file')}>
                <File className="w-4 h-4 mr-2" />
                {t('file.new')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openCreateDialog('folder')}>
                <Folder className="w-4 h-4 mr-2" />
                {t('file.newFolder')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-1">
          {currentProject.files.map(file => renderFileItem(file, 0))}
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {createType === 'file' ? t('file.new') : t('file.newFolder')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder={`${t('file.untitled')}${createType === 'file' ? currentProject.language.extension : ''}`}
              />
            </div>
          </div>
          <DialogFooter>
            <MobileButton variant="ghost" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </MobileButton>
            <MobileButton onClick={handleCreateFile}>
              Create
            </MobileButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('file.rename')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rename">Name</Label>
              <Input
                id="rename"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <MobileButton variant="ghost" onClick={() => setShowRenameDialog(false)}>
              Cancel
            </MobileButton>
            <MobileButton onClick={handleRenameFile}>
              Rename
            </MobileButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileExplorer;