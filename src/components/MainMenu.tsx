import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { MobileButton } from '@/components/ui/mobile-button';
import { Card } from '@/components/ui/card';
import { Plus, Folder, Settings, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/hooks/useI18n';
import codladaLogo from '@/assets/codlada-logo.png';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MainMenu: React.FC = () => {
  const { projects, updateProject, deleteProject } = useApp();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/editor/${projectId}`);
  };

  const handleCreateProject = () => {
    navigate('/create');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleRenameClick = (projectId: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProjectId(projectId);
    setNewProjectName(currentName);
    setRenameDialogOpen(true);
  };

  const handleDeleteClick = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProjectId(projectId);
    setDeleteDialogOpen(true);
  };

  const handleRenameConfirm = () => {
    if (selectedProjectId && newProjectName.trim()) {
      const project = projects.find(p => p.id === selectedProjectId);
      if (project) {
        updateProject({
          ...project,
          name: newProjectName.trim(),
          lastModified: new Date(),
        });
      }
    }
    setRenameDialogOpen(false);
    setSelectedProjectId(null);
    setNewProjectName('');
  };

  const handleDeleteConfirm = () => {
    if (selectedProjectId) {
      deleteProject(selectedProjectId);
    }
    setDeleteDialogOpen(false);
    setSelectedProjectId(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-20 flex items-center px-6 bg-background">
        <div className="flex items-center gap-3">
          <img src={codladaLogo} alt="CODLADA" className="w-12 h-12" />
          <h1 className="text-2xl font-bold tracking-tight">CODLADA</h1>
        </div>
      </header>

      {/* Projects List */}
      <main className="flex-1 p-6 pb-24">
        <div className="max-w-md mx-auto">
          {projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Folder className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-medium mb-2">{t('projects.empty.title')}</h2>
              <p className="text-muted-foreground mb-8">
                {t('projects.empty.subtitle')}
              </p>
              <MobileButton 
                variant="floating" 
                size="lg" 
                onClick={handleCreateProject}
                className="mx-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                {t('projects.create')}
              </MobileButton>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">{t('projects.title')}</h2>
                <span className="text-sm text-muted-foreground">{projects.length} {t('projects.count')}</span>
              </div>
              
              <div className="space-y-4">
                {projects.map((project) => (
                  <Card 
                    key={project.id}
                    className="p-4 bg-gradient-card border-border hover:shadow-soft transition-all duration-200 cursor-pointer active:scale-[0.98]"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">{project.language.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{project.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">{project.language.name}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(project.lastModified)}
                          </span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <MobileButton variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </MobileButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => handleRenameClick(project.id, project.name, e)}>
                            {t('project.rename')}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => handleDeleteClick(project.id, e)}
                            className="text-destructive"
                          >
                            {t('project.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      {projects.length > 0 && (
        <div className="fixed bottom-24 right-6 z-50">
          <MobileButton 
            variant="floating" 
            size="icon" 
            onClick={handleCreateProject}
            className="w-14 h-14 rounded-full"
          >
            <Plus className="w-6 h-6" />
          </MobileButton>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border flex items-center justify-around">
        <MobileButton variant="ghost" size="icon" className="flex-col text-xs gap-1 h-16">
          <Folder className="w-6 h-6 text-primary" />
          <span className="text-primary font-medium">{t('nav.projects')}</span>
        </MobileButton>
        
        <MobileButton 
          variant="ghost" 
          size="icon" 
          className="flex-col text-xs gap-1 h-16"
          onClick={handleSettings}
        >
          <Settings className="w-6 h-6 text-muted-foreground" />
          <span className="text-muted-foreground">{t('nav.settings')}</span>
        </MobileButton>
      </nav>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('project.rename.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">{t('create.name')}</Label>
              <Input
                id="projectName"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder={t('project.rename.placeholder')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRenameConfirm();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <MobileButton variant="ghost" onClick={() => setRenameDialogOpen(false)}>
              {t('project.cancel')}
            </MobileButton>
            <MobileButton onClick={handleRenameConfirm} disabled={!newProjectName.trim()}>
              {t('project.confirm')}
            </MobileButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('project.delete.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('project.delete.message')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('project.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              {t('project.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MainMenu;