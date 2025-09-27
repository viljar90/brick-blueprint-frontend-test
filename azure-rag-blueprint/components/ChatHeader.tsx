import { User } from 'lucide-react';
import { Button } from './ui/button';

interface ChatHeaderProps {
  companyName?: string;
  logoUrl?: string;
  onSettingsClick?: () => void;
  sidebarState?: 'collapsed' | 'expanded' | 'hover-expanded';
  isVisible?: boolean;
}

export function ChatHeader({ 
  companyName = "Your Company", 
  logoUrl,
  onSettingsClick,
  sidebarState = 'collapsed',
  isVisible = false
}: ChatHeaderProps) {
  return (
    <header className={`fixed top-0 right-0 z-50 py-[0px] p-[0px] mt-[0px] mr-[0px] mb-[0px] transition-all duration-300 ease-in-out ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    } ${
      sidebarState === 'collapsed' ? 'left-12' : 'left-74'
    }`}>
      <div className="flex h-14.5 items-center justify-between bg-white rounded-xl shadow-md mt-[12px] mx-4 transform transition-all duration-300 mr-[16px] mb-[0px] ml-[32px] px-[16px] py-[0px] pt-[0px] pr-[8px] pb-[0px] pl-[24px]">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={`${companyName} logo`}
              className="h-8 w-auto"
            />
          ) : (
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-medium">
                {companyName.charAt(0)}
              </span>
            </div>
          )}
          
          <div>
            <h1 className="font-medium text-foreground">{companyName} AI Assistant</h1>
            <p className="text-sm text-muted-foreground">Powered by AI</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            className="h-9 w-9"
          >
            <User className="h-4 w-4" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </div>
    </header>
  );
}