import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Send, Square, Plus, MessageCircle, Paperclip } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onStopResponse?: () => void;
  onNewChat?: () => void;
  onFileUpload?: (file: File) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  sidebarState?: 'collapsed' | 'expanded' | 'hover-expanded';
}

export interface MessageInputRef {
  focus: () => void;
}

export const MessageInput = forwardRef<MessageInputRef, MessageInputProps>(({
  onSendMessage,
  onStopResponse,
  onNewChat,
  onFileUpload,
  isLoading = false,
  placeholder = "Create magic...",
  disabled = false,
  sidebarState = 'collapsed'
}, ref) => {
  // Expose focus method to parent components
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    }
  }), []);

  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [shouldFocusAfterSend, setShouldFocusAfterSend] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading && onStopResponse) {
      onStopResponse();
    } else if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      setShouldFocusAfterSend(true);
    }
  };

  // Focus input immediately after sending a message
  useEffect(() => {
    if (shouldFocusAfterSend) {
      // Use setTimeout to ensure the focus happens after the form submission
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      setShouldFocusAfterSend(false);
    }
  }, [shouldFocusAfterSend]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Dynamic placeholder based on focus state
  const currentPlaceholder = isFocused ? "Type for magic..." : "Your chats are private and secure";

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
      setIsMenuOpen(false);
    }
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const quickActions = [
    {
      icon: Paperclip,
      label: "Upload file",
      action: () => {
        fileInputRef.current?.click();
        setIsMenuOpen(false);
      }
    },
    {
      icon: MessageCircle,
      label: "New chat",
      action: () => {
        if (onNewChat) {
          onNewChat();
        }
        setIsMenuOpen(false);
      }
    }
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-transparent z-50 px-4 py-4 transition-all duration-300 ${
      sidebarState === 'collapsed' ? 'ml-12' : 'ml-80'
    }`}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-full shadow-md hover:shadow-lg px-2 py-2 my-[0px] mx-[70px] relative focus-within:shadow-lg transition-all duration-200 hover:scale-[1.02] focus-within:scale-[1.02]">
          <form onSubmit={handleSubmit} className="flex items-center gap-1">
            {/* Quick Actions Menu */}
            <div className="relative" ref={menuRef}>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className={`h-10 w-10 rounded-full flex-shrink-0 transition-colors duration-200 ${
                  isMenuOpen
                    ? 'bg-black text-white hover:bg-black hover:text-white'
                    : '!hover:bg-gray-100 !hover:text-gray-900'
                }`}
                disabled={disabled}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Plus className={`h-4 w-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-45' : ''}`} />
                <span className="sr-only">Quick actions</span>
              </Button>

              {isMenuOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-[9999] py-2 px-[3px] py-[4px]">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-900"
                      onClick={action.action}
                    >
                      <action.icon className="h-4 w-4" />
                      <span className="text-sm">{action.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,text/*,.pdf,.doc,.docx"
            />

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={currentPlaceholder}
              disabled={disabled}
              className="flex-1 h-10 bg-transparent border-0 outline-none px-3 text-foreground placeholder:text-muted-foreground"
            />

            {/* Send/Stop Button */}
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 rounded-full flex-shrink-0"
              disabled={(!message.trim() && !isLoading) || disabled}
            >
              {isLoading ? (
                <Square className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">{isLoading ? 'Stop response' : 'Send message'}</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
});