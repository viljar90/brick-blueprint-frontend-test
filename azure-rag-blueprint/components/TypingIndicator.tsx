import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-6">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
        <Bot className="h-4 w-4 text-primary-foreground" />
      </div>
      
      <div className="flex flex-col">
        <div className="px-4 py-3 bg-muted rounded-tl-sm rounded-tr-3xl rounded-bl-3xl rounded-br-3xl">
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" 
                   style={{ animationDelay: '0ms', animationDuration: '1.5s' }} />
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" 
                   style={{ animationDelay: '200ms', animationDuration: '1.5s' }} />
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" 
                   style={{ animationDelay: '400ms', animationDuration: '1.5s' }} />
            </div>
            <span className="text-sm text-muted-foreground ml-2">AI is typing...</span>
          </div>
        </div>
      </div>
    </div>
  );
}