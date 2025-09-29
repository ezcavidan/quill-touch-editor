import { useApp } from '@/contexts/AppContext';

export interface Translations {
  en: Record<string, string>;
  az: Record<string, string>;
  tr: Record<string, string>;
}

export const translations: Translations = {
  en: {
    // Main Menu
    'app.title': 'Code Editor',
    'projects.title': 'Your Projects',
    'projects.empty.title': 'No projects yet',
    'projects.empty.subtitle': 'Create your first project to get started coding',
    'projects.create': 'Create Project',
    'projects.count': 'projects',
    'nav.projects': 'Projects',
    'nav.settings': 'Settings',
    
    // Project Creation
    'create.title': 'Create New Project',
    'create.language': 'Choose Language',
    'create.name': 'Project Name',
    'create.name.placeholder': 'Enter project name',
    'create.button': 'Create Project',
    
    // Code Editor
    'editor.problems': 'Problems',
    'editor.addFile': 'Add File',
    'editor.run': 'Run',
    'editor.terminal': 'Terminal',
    'editor.files': 'Files',
    'editor.back': 'Back',
    'editor.loading': 'Loading project...',
    'editor.startCoding': 'Start coding...',
    'editor.selectFile': 'Select a file to edit',
    'editor.ready': 'Ready for input...',
    'editor.running': 'Running',
    'editor.output': 'Output: Hello World! (Simulated)',
    'editor.finished': 'Process finished with exit code 0',
    
    // File Management
    'file.new': 'New File',
    'file.newFolder': 'New Folder',
    'file.rename': 'Rename',
    'file.delete': 'Delete',
    'file.copy': 'Copy',
    'file.untitled': 'untitled',
    
    // Settings
    'settings.title': 'Settings',
    'settings.theme': 'Theme',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.language': 'Language',
    'settings.fontSize': 'Font Size',
    'settings.fontSize.small': 'Small',
    'settings.fontSize.medium': 'Medium',
    'settings.fontSize.large': 'Large',
    'settings.tabSize': 'Tab Size',
    'settings.autoSave': 'Auto Save',
    'settings.autoFormat': 'Auto Format',
    'settings.save': 'Save Settings',
  },
  az: {
    // Main Menu
    'app.title': 'Kod Redaktoru',
    'projects.title': 'Layihələriniz',
    'projects.empty.title': 'Hələ layihə yoxdur',
    'projects.empty.subtitle': 'Kodlaşmağa başlamaq üçün ilk layihənizi yaradın',
    'projects.create': 'Layihə Yarat',
    'projects.count': 'layihə',
    'nav.projects': 'Layihələr',
    'nav.settings': 'Tənzimləmələr',
    
    // Project Creation
    'create.title': 'Yeni Layihə Yarat',
    'create.language': 'Dil Seçin',
    'create.name': 'Layihə Adı',
    'create.name.placeholder': 'Layihə adını daxil edin',
    'create.button': 'Layihə Yarat',
    
    // Code Editor
    'editor.problems': 'Problemlər',
    'editor.addFile': 'Fayl Əlavə Et',
    'editor.run': 'İşə Sal',
    'editor.terminal': 'Terminal',
    'editor.files': 'Fayllar',
    'editor.back': 'Geri',
    'editor.loading': 'Layihə yüklənir...',
    'editor.startCoding': 'Kodlaşmağa başlayın...',
    'editor.selectFile': 'Redaktə etmək üçün fayl seçin',
    'editor.ready': 'Giriş üçün hazırdır...',
    'editor.running': 'İşləyir',
    'editor.output': 'Çıxış: Salam Dünya! (Simulyasiya)',
    'editor.finished': 'Proses 0 çıxış kodu ilə bitdi',
    
    // File Management
    'file.new': 'Yeni Fayl',
    'file.newFolder': 'Yeni Qovluq',
    'file.rename': 'Adını Dəyiş',
    'file.delete': 'Sil',
    'file.copy': 'Kopyala',
    'file.untitled': 'adsız',
    
    // Settings
    'settings.title': 'Tənzimləmələr',
    'settings.theme': 'Tema',
    'settings.theme.light': 'İşıqlı',
    'settings.theme.dark': 'Qaranlıq',
    'settings.language': 'Dil',
    'settings.fontSize': 'Şrift Ölçüsü',
    'settings.fontSize.small': 'Kiçik',
    'settings.fontSize.medium': 'Orta',
    'settings.fontSize.large': 'Böyük',
    'settings.tabSize': 'Tab Ölçüsü',
    'settings.autoSave': 'Avtomatik Saxlama',
    'settings.autoFormat': 'Avtomatik Format',
    'settings.save': 'Tənzimləməni Saxla',
  },
  tr: {
    // Main Menu
    'app.title': 'Kod Editörü',
    'projects.title': 'Projeleriniz',
    'projects.empty.title': 'Henüz proje yok',
    'projects.empty.subtitle': 'Kodlamaya başlamak için ilk projenizi oluşturun',
    'projects.create': 'Proje Oluştur',
    'projects.count': 'proje',
    'nav.projects': 'Projeler',
    'nav.settings': 'Ayarlar',
    
    // Project Creation
    'create.title': 'Yeni Proje Oluştur',
    'create.language': 'Dil Seçin',
    'create.name': 'Proje Adı',
    'create.name.placeholder': 'Proje adını girin',
    'create.button': 'Proje Oluştur',
    
    // Code Editor
    'editor.problems': 'Problemler',
    'editor.addFile': 'Dosya Ekle',
    'editor.run': 'Çalıştır',
    'editor.terminal': 'Terminal',
    'editor.files': 'Dosyalar',
    'editor.back': 'Geri',
    'editor.loading': 'Proje yükleniyor...',
    'editor.startCoding': 'Kodlamaya başlayın...',
    'editor.selectFile': 'Düzenlemek için dosya seçin',
    'editor.ready': 'Giriş için hazır...',
    'editor.running': 'Çalışıyor',
    'editor.output': 'Çıktı: Merhaba Dünya! (Simülasyon)',
    'editor.finished': 'İşlem 0 çıkış kodu ile tamamlandı',
    
    // File Management
    'file.new': 'Yeni Dosya',
    'file.newFolder': 'Yeni Klasör',
    'file.rename': 'Yeniden Adlandır',
    'file.delete': 'Sil',
    'file.copy': 'Kopyala',
    'file.untitled': 'adsız',
    
    // Settings
    'settings.title': 'Ayarlar',
    'settings.theme': 'Tema',
    'settings.theme.light': 'Açık',
    'settings.theme.dark': 'Koyu',
    'settings.language': 'Dil',
    'settings.fontSize': 'Yazı Boyutu',
    'settings.fontSize.small': 'Küçük',
    'settings.fontSize.medium': 'Orta',
    'settings.fontSize.large': 'Büyük',
    'settings.tabSize': 'Tab Boyutu',
    'settings.autoSave': 'Otomatik Kaydet',
    'settings.autoFormat': 'Otomatik Format',
    'settings.save': 'Ayarları Kaydet',
  },
};

export const useI18n = () => {
  const { settings } = useApp();
  
  const t = (key: string): string => {
    return translations[settings.language]?.[key] || translations.en[key] || key;
  };
  
  return { t };
};