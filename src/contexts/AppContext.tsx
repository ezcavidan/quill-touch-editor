import React, { createContext, useContext, useEffect, useState } from 'react';
import { Project, Settings, DEFAULT_SETTINGS } from '@/types/project';

interface AppContextType {
  projects: Project[];
  currentProject: Project | null;
  settings: Settings;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('mobile-editor-projects');
    const savedSettings = localStorage.getItem('mobile-editor-settings');
    
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        // Convert date strings back to Date objects
        const projectsWithDates = parsedProjects.map((project: any) => ({
          ...project,
          lastModified: new Date(project.lastModified),
          createdAt: new Date(project.createdAt),
        }));
        setProjects(projectsWithDates);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    }

    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Save projects to localStorage
  useEffect(() => {
    localStorage.setItem('mobile-editor-projects', JSON.stringify(projects));
  }, [projects]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('mobile-editor-settings', JSON.stringify(settings));
  }, [settings]);

  const addProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      )
    );
    if (currentProject?.id === updatedProject.id) {
      setCurrentProject(updatedProject);
    }
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
    }
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const value: AppContextType = {
    projects,
    currentProject,
    settings,
    setProjects,
    setCurrentProject,
    updateSettings,
    addProject,
    updateProject,
    deleteProject,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};