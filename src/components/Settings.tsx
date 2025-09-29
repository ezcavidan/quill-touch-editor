import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { MobileButton } from '@/components/ui/mobile-button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Globe, 
  Type,
  Folder,
  Settings as SettingsIcon,
  Save
} from 'lucide-react';
import { Settings as SettingsType } from '@/types/project';
import { useI18n } from '@/hooks/useI18n';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const navigate = useNavigate();
  const { t } = useI18n();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'az', name: 'Azərbaycan dili', flag: '🇦🇿' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  ];

  const fontSizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ];

  const tabSizes = [
    { value: 2, label: '2 spaces' },
    { value: 4, label: '4 spaces' },
  ];

  const handleSettingChange = (key: keyof SettingsType, value: any) => {
    updateSettings({ [key]: value });
  };

  const handleSave = () => {
    // Settings are automatically saved via context
    navigate('/');
  };

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
        <h1 className="text-lg font-semibold">{t('settings.title')}</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 p-6 pb-24">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* Theme Settings */}
          <Card className="p-6 bg-gradient-card border-border">
            <div className="flex items-center gap-3 mb-4">
              {settings.theme === 'dark' ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-primary" />
              )}
              <h3 className="font-medium">Theme</h3>
            </div>
            
            <div className="space-y-3">
              {(['light', 'dark'] as const).map((theme) => (
                <div 
                  key={theme}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    settings.theme === theme 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => handleSettingChange('theme', theme)}
                >
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? (
                      <Moon className="w-4 h-4" />
                    ) : (
                      <Sun className="w-4 h-4" />
                    )}
                    <span className="capitalize">{theme}</span>
                    {settings.theme === theme && (
                      <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Language Settings */}
          <Card className="p-6 bg-gradient-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Language</h3>
            </div>
            
            <div className="space-y-3">
              {languages.map((lang) => (
                <div 
                  key={lang.code}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    settings.language === lang.code 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => handleSettingChange('language', lang.code)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                    {settings.language === lang.code && (
                      <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Editor Settings */}
          <Card className="p-6 bg-gradient-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <Type className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Editor</h3>
            </div>
            
            <div className="space-y-6">
              {/* Font Size */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Font Size</Label>
                <div className="space-y-2">
                  {fontSizes.map((size) => (
                    <div 
                      key={size.value}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        settings.fontSize === size.value 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:bg-muted/50'
                      }`}
                      onClick={() => handleSettingChange('fontSize', size.value)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{size.label}</span>
                        {settings.fontSize === size.value && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tab Size */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Tab Size</Label>
                <div className="space-y-2">
                  {tabSizes.map((tab) => (
                    <div 
                      key={tab.value}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        settings.tabSize === tab.value 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:bg-muted/50'
                      }`}
                      onClick={() => handleSettingChange('tabSize', tab.value)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{tab.label}</span>
                        {settings.tabSize === tab.value && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auto-save Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <Label className="font-medium">Auto-save</Label>
                  <p className="text-sm text-muted-foreground">Automatically save changes</p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                />
              </div>

              {/* Auto-format Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <Label className="font-medium">Auto-format</Label>
                  <p className="text-sm text-muted-foreground">Format code automatically</p>
                </div>
                <Switch
                  checked={settings.autoFormat}
                  onCheckedChange={(checked) => handleSettingChange('autoFormat', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <MobileButton
            variant="floating"
            size="lg"
            className="w-full"
            onClick={handleSave}
          >
            <Save className="w-5 h-5 mr-2" />
            {t('settings.save')}
          </MobileButton>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border flex items-center justify-around">
        <MobileButton 
          variant="ghost" 
          size="icon" 
          className="flex-col text-xs gap-1 h-16"
          onClick={() => navigate('/')}
        >
          <Folder className="w-6 h-6 text-muted-foreground" />
          <span className="text-muted-foreground">Projects</span>
        </MobileButton>
        
        <MobileButton variant="ghost" size="icon" className="flex-col text-xs gap-1 h-16">
          <SettingsIcon className="w-6 h-6 text-primary" />
          <span className="text-primary font-medium">Settings</span>
        </MobileButton>
      </nav>
    </div>
  );
};

export default Settings;