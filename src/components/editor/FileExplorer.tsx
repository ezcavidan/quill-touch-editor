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

  const handleRenameFile = () => {
    if (!selectedFile || !createName.trim()) return;
    
    const updatedFiles = currentProject.files.map(file =>
      file.id === selectedFile.id ? { ...file, name: createName } : file
    );
    
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

  const handleDeleteFile = (fileId: string) => {
    const updatedFiles = currentProject.files.filter(file => file.id !== fileId);
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

  const handleDrop = (e: React.DragEvent, targetFolder: ProjectFile) => {
    e.preventDefault();
    if (!draggedFile || targetFolder.type !== 'folder' || draggedFile.id === targetFolder.id) {
      setDraggedFile(null);
      return;
    }

    // For now, just copy the file since we're not implementing full folder structure
    handleCopyFile(draggedFile);
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

  const renderFileItem = (file: ProjectFile) => (
    <div key={file.id} className="mb-1">
      <div
        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors group ${
          activeFileId === file.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
        }`}
        onClick={() => {
          if (file.type === 'file') {
            onFileSelect(file.id);
          } else {
            onToggleFolder(file.id);
          }
        }}
        draggable={file.type === 'file'}
        onDragStart={(e) => file.type === 'file' && handleDragStart(e, file)}
        onDragOver={file.type === 'folder' ? handleDragOver : undefined}
        onDrop={file.type === 'folder' ? (e) => handleDrop(e, file) : undefined}
      >
        {file.type === 'folder' ? (
          <Folder className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
        <span className="text-sm truncate flex-1">{file.name}</span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MobileButton 
              variant="ghost" 
              size="icon-sm" 
              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
            >
              <MoreVertical className="w-3 h-3" />
            </MobileButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openRenameDialog(file)}>
              <Edit className="w-4 h-4 mr-2" />
              {t('file.rename')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCopyFile(file)}>
              <Copy className="w-4 h-4 mr-2" />
              {t('file.copy')}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleDeleteFile(file.id)}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t('file.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

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
          {currentProject.files.map(renderFileItem)}
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