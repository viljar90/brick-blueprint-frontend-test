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
    <header className={`fixed top-0 right-0 z-40 transition-all duration-300 ease-in-out ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    } ${
      sidebarState === 'collapsed' ? 'left-[72px]' : 'left-80'
    }`}>
      <div className="flex h-16 items-center justify-between bg-white rounded-xl shadow-md hover:shadow-lg m-3 p-2 px-6 transition-all duration-200 hover:scale-[1.01]">
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