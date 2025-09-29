import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { MobileButton } from '@/components/ui/mobile-button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { PROGRAMMING_LANGUAGES, Project, ProjectFile } from '@/types/project';
import { nanoid } from 'nanoid';
import { useI18n } from '@/hooks/useI18n';

const ProjectCreation: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const { addProject } = useApp();
  const navigate = useNavigate();
  const { t } = useI18n();

  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguage(languageId);
  };

  const handleCreateProject = () => {
    if (!selectedLanguage || !projectName.trim()) return;

    const language = PROGRAMMING_LANGUAGES.find(lang => lang.id === selectedLanguage);
    if (!language) return;

    const mainFile: ProjectFile = {
      id: nanoid(),
      name: `main${language.extension}`,
      content: language.template,
      type: 'file',
    };

    const newProject: Project = {
      id: nanoid(),
      name: projectName.trim(),
      language,
      files: [mainFile],
      lastModified: new Date(),
      createdAt: new Date(),
    };

    addProject(newProject);
    navigate(`/editor/${newProject.id}`);
  };

  const isLanguageSelected = selectedLanguage !== null;
  const canCreate = isLanguageSelected && projectName.trim().length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card">
        <MobileButton 
          variant="ghost" 
          size="icon-sm" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-5 h-5" />
        </MobileButton>
        <h1 className="text-lg font-semibold">New Project</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-md mx-auto">
          {!isLanguageSelected ? (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Choose Language</h2>
                <p className="text-muted-foreground">Select a programming language to get started</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {PROGRAMMING_LANGUAGES.map((language) => (
                  <Card
                    key={language.id}
                    className="p-6 cursor-pointer hover:shadow-soft transition-all duration-200 active:scale-95 bg-gradient-card border-border"
                    onClick={() => handleLanguageSelect(language.id)}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{language.icon}</div>
                      <h3 className="font-medium text-sm">{language.name}</h3>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Project Details</h2>
                <p className="text-muted-foreground">Give your project a name</p>
              </div>

              {/* Selected Language Display */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-muted-foreground">Selected Language</Label>
                <Card className="p-4 mt-2 bg-primary/5 border-primary/20">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {PROGRAMMING_LANGUAGES.find(lang => lang.id === selectedLanguage)?.icon}
                    </span>
                    <span className="font-medium">
                      {PROGRAMMING_LANGUAGES.find(lang => lang.id === selectedLanguage)?.name}
                    </span>
                  </div>
                </Card>
              </div>

              {/* Project Name Input */}
              <div className="mb-8">
                <Label htmlFor="projectName" className="text-sm font-medium">
                  Project Name
                </Label>
                <Input
                  id="projectName"
                  type="text"
                  placeholder="Enter project name..."
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="mt-2 h-12 rounded-xl bg-input border-border focus:border-primary focus:ring-primary/20"
                  autoFocus
                />
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <MobileButton
                  variant="floating"
                  size="lg"
                  className="w-full"
                  onClick={handleCreateProject}
                  disabled={!canCreate}
                >
                  {t('create.button')}
                </MobileButton>
                
                <MobileButton
                  variant="ghost"
                  size="lg"
                  className="w-full"
                  onClick={() => setSelectedLanguage(null)}
                >
                  Change Language
                </MobileButton>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectCreation;