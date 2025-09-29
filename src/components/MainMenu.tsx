import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { MobileButton } from '@/components/ui/mobile-button';
import { Card } from '@/components/ui/card';
import { Plus, Folder, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MainMenu: React.FC = () => {
  const { projects } = useApp();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">{"<>"}</span>
          </div>
          <h1 className="text-xl font-semibold">Code Editor</h1>
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
              <h2 className="text-lg font-medium mb-2">No projects yet</h2>
              <p className="text-muted-foreground mb-8">
                Create your first project to get started coding
              </p>
              <MobileButton 
                variant="floating" 
                size="lg" 
                onClick={handleCreateProject}
                className="mx-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Project
              </MobileButton>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Your Projects</h2>
                <span className="text-sm text-muted-foreground">{projects.length} projects</span>
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
          <span className="text-primary font-medium">Projects</span>
        </MobileButton>
        
        <MobileButton 
          variant="ghost" 
          size="icon" 
          className="flex-col text-xs gap-1 h-16"
          onClick={handleSettings}
        >
          <Settings className="w-6 h-6 text-muted-foreground" />
          <span className="text-muted-foreground">Settings</span>
        </MobileButton>
      </nav>
    </div>
  );
};

export default MainMenu;