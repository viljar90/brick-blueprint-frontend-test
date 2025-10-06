import { useState } from 'react';
import { MessageSquare, Plus, Settings, HelpCircle, X, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { cn } from './ui/utils';

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

export type SidebarState = 'collapsed' | 'expanded' | 'hover-expanded';

interface ChatSidebarProps {
  state: SidebarState;
  onStateChange: (state: SidebarState) => void;
  onHover: () => void;
  onLeave: () => void;
  chatHistory: ChatHistory[];
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onSettings: () => void;
  currentChatId?: string;
}

export function ChatSidebar({
  state,
  onStateChange,
  onHover,
  onLeave,
  chatHistory,
  onNewChat,
  onSelectChat,
  onSettings,
  currentChatId
}: ChatSidebarProps) {
  const isCollapsed = state === 'collapsed';
  const isExpanded = state === 'expanded' || state === 'hover-expanded';
  
  // Track which chat item is being hovered
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 bg-transparent transition-all duration-300 ease-in-out flex flex-col",
        isCollapsed ? "w-[72px]" : "w-80"
      )}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Header */}
      <div className={cn("flex items-center bg-white rounded-xl shadow-md hover:shadow-lg relative mt-3 mb-1 p-2 h-16 transition-all duration-200 hover:scale-[1.01]",
        isExpanded ? "mx-3" : "mx-3 w-fit"
      )}>
        <div className="flex items-center gap-3 py-[0px] p-[0px]">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onStateChange(state === 'expanded' ? 'collapsed' : 'expanded')}
            className={cn(
              "h-8 w-8 transition-colors",
              state === 'expanded' && "bg-black hover:bg-black text-white hover:text-white"
            )}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
              <path d="M4 5H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 19H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          {isExpanded && <h2 className="font-medium truncate">Chat History</h2>}
        </div>
      </div>

      {/* Content */}
      <div className={cn("flex flex-col h-full overflow-hidden gap-3",
        isExpanded ? "px-3 py-2" : "px-3 py-2"
      )}>
        {isExpanded ? (
          <>
            {/* Chat History Card */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg flex-1 min-h-0 relative transition-all duration-200 hover:scale-[1.01]">
              <div className="h-full py-[8px] p-[8px]">
                <div className="h-full overflow-y-auto scrollbar-thin">
                  <div className="space-y-2">
                    {chatHistory.map((chat) => {
                      const isSelected = currentChatId === chat.id;
                      const isHovered = hoveredChatId === chat.id;
                      const showDetails = isSelected || isHovered;
                      return (
                        <div
                          key={chat.id}
                          className={cn(
                            "rounded-lg transition-all duration-200 ease-in-out overflow-hidden",
                            isSelected ? "bg-secondary" : "hover:bg-accent",
                            showDetails ? "min-h-[80px]" : "h-12"
                          )}
                          onMouseEnter={() => setHoveredChatId(chat.id)}
                          onMouseLeave={() => setHoveredChatId(null)}
                          onClick={() => onSelectChat(chat.id)}
                        >
                          <div className="cursor-pointer px-[8px] p-[8px]">
                            <div className="flex items-start gap-3 w-full">
                              <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium truncate">{chat.title}</p>
                                {showDetails && (
                                  <div className="mt-1">
                                    <p className="text-sm text-muted-foreground truncate">
                                      {chat.lastMessage}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {chat.timestamp.toLocaleDateString()}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.01]">
              <div className="p-4 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 p-3 rounded-lg"
                  onClick={onSettings}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 p-3 rounded-lg"
                >
                  <HelpCircle className="h-4 w-4" />
                  Help & Support
                </Button>
              </div>
            </div>
          </>
        ) : (
          // Collapsed state - aligned to left consistently
          <div className="flex flex-col justify-between h-full">
            {/* Recent chats icon card */}
            <div className="bg-white rounded-lg shadow-md w-12 px-[8px] py-[0px] pt-[2px] pr-[8px] pb-[0px] pl-[8px]">
              <ScrollArea className="max-h-[calc(100vh-200px)]">
                <div className="flex flex-col space-y-2 px-[0px] py-[8px] p-[0px]">
                  {chatHistory.map((chat) => (
                    <Button
                      key={chat.id}
                      variant={currentChatId === chat.id ? "secondary" : "ghost"}
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => onSelectChat(chat.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="sr-only">{chat.title}</span>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Actions icon card - positioned at bottom */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg p-2 w-12">
              <div className="flex flex-col space-y-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={onSettings}
                >
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}