import React from 'react';
import { MobileButton } from '@/components/ui/mobile-button';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface TerminalProps {
  terminalOutput: string[];
  onToggle: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ terminalOutput, onToggle }) => {
  const { t } = useI18n();

  return (
    <div className="h-64 border-t border-border bg-editor-background animate-slide-up">
      <div className="h-full flex flex-col">
        <div className="h-12 flex items-center justify-between px-4 border-b border-border">
          <h3 className="text-sm font-medium text-editor-foreground">{t('editor.terminal')}</h3>
          <MobileButton variant="ghost" size="icon-sm" onClick={onToggle}>
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
              <span className="text-editor-foreground">{t('editor.ready')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;