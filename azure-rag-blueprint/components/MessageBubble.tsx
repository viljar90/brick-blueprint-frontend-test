import { User, Bot, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from './ui/utils';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
  onCopy?: (content: string) => void;
  onLike?: (messageId: string) => void;
  onDislike?: (messageId: string) => void;
}

export function MessageBubble({ message, onCopy, onLike, onDislike }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      "flex gap-3 mb-6",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      
      <div className={cn(
        "flex flex-col max-w-[80%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-4 py-3",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tl-3xl rounded-bl-3xl rounded-br-3xl rounded-tr-sm" 
            : "bg-muted text-muted-foreground rounded-tl-sm rounded-tr-3xl rounded-bl-3xl rounded-br-3xl"
        )}>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        
        <div className="flex items-center gap-1 mt-2">
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          
          {!isUser && (
            <div className="flex items-center gap-1 ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onCopy?.(message.content)}
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy message</span>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onLike?.(message.id)}
              >
                <ThumbsUp className="h-3 w-3" />
                <span className="sr-only">Like message</span>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onDislike?.(message.id)}
              >
                <ThumbsDown className="h-3 w-3" />
                <span className="sr-only">Dislike message</span>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <User className="h-4 w-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
}