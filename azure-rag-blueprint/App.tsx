import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { ChatHeader } from './components/ChatHeader';
import { ChatSidebar, type SidebarState } from './components/ChatSidebar';
import { MessageBubble } from './components/MessageBubble';
import { MessageInput, MessageInputRef } from './components/MessageInput';
import { TypingIndicator } from './components/TypingIndicator';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ScrollArea } from './components/ui/scroll-area';
import { Toaster } from './components/ui/sonner';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

// Mock AI responses for demonstration
const mockAIResponses = [
  "I'd be happy to help you with that! Could you provide more specific details about what you're looking for?",
  "That's an interesting question. Based on current best practices, I'd recommend considering the following approaches...",
  "Great idea! Here are some suggestions to help you get started with this project.",
  "I understand what you're asking. Let me break this down into manageable steps for you.",
  "Thanks for the clarification. Here's how I would approach this problem...",
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarState, setSidebarState] = useState<SidebarState>('collapsed');
  const [isTyping, setIsTyping] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [responseTimeoutId, setResponseTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [mouseY, setMouseY] = useState(0);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      id: 'welcome-chat',
      title: 'Welcome to Acme Corp Assistant',
      lastMessage: 'Feel free to explore and ask me anything!',
      timestamp: new Date(Date.now() - 86400000),
      messages: [
        {
          id: 'welcome-1',
          content: 'Hello! I\'m your Acme Corp AI Assistant. How can I help you today?',
          role: 'assistant',
          timestamp: new Date(Date.now() - 86400000)
        },
        {
          id: 'welcome-2',
          content: 'Hi! Can you tell me what you can help me with?',
          role: 'user',
          timestamp: new Date(Date.now() - 86400000 + 30000)
        },
        {
          id: 'welcome-3',
          content: 'I\'d be happy to help! I can assist you with:\n\n• Answering questions about company policies and procedures\n• Helping with project planning and organization\n• Providing information and analysis\n• Creative brainstorming and problem-solving\n• General productivity and workflow suggestions\n\nWhat would you like to explore first?',
          role: 'assistant',
          timestamp: new Date(Date.now() - 86400000 + 60000)
        },
        {
          id: 'welcome-4',
          content: 'That sounds great! I\'ll start a new conversation when I have questions.',
          role: 'user',
          timestamp: new Date(Date.now() - 86400000 + 90000)
        },
        {
          id: 'welcome-5',
          content: 'Perfect! Feel free to explore and ask me anything. You can start a new chat anytime by clicking the "+" button in the sidebar. I\'m here whenever you need assistance!',
          role: 'assistant',
          timestamp: new Date(Date.now() - 86400000 + 120000)
        }
      ]
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<MessageInputRef>(null);

  // Configuration - easily customizable for different companies
  const config = {
    companyName: "Acme Corp",
    logoUrl: "", // Add your company logo URL here
    welcomeMessage: "How can I help you today?",
    aiName: "Assistant"
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial header reveal then hide animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHeaderVisible(false);
    }, 3000); // Show for 3 seconds then hide

    return () => clearTimeout(timer);
  }, []);

  // Mouse tracking for header animation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
      // Show header when mouse is within 50px of the top
      if (e.clientY <= 50) {
        setIsHeaderVisible(true);
      } else if (e.clientY > 100 && sidebarState === 'collapsed') {
        // Only hide header when mouse moves away from top AND sidebar is fully collapsed
        setIsHeaderVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [sidebarState]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsTyping(true);

    // Track which chat ID to update (either existing or new)
    let chatIdToUpdate = currentChatId;

    // Create new chat immediately if this is the first message
    if (!currentChatId && messages.length === 0) {
      const newChatId = Date.now().toString();
      chatIdToUpdate = newChatId; // Use this ID for AI response update
      const title = content.length > 40 ? content.substring(0, 40) + '...' : content;
      
      const newChat: ChatHistory = {
        id: newChatId,
        title,
        lastMessage: content,
        timestamp: new Date(),
        messages: newMessages
      };
      
      setChatHistory(prev => [newChat, ...prev]);
      setCurrentChatId(newChatId);
    } else if (currentChatId) {
      // Update existing chat with user message
      setChatHistory(prev => prev.map(chat =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: newMessages,
              lastMessage: content,
              timestamp: new Date()
            }
          : chat
      ));
    }

    // Simulate AI response delay
    const timeoutId = setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)],
        role: 'assistant',
        timestamp: new Date()
      };

      const finalMessages = [...newMessages, aiResponse];
      
      // Update both messages and chat history together to avoid race conditions
      setMessages(finalMessages);
      setIsTyping(false);
      setResponseTimeoutId(null);
      
      // Update chat history with AI response - use chatIdToUpdate instead of currentChatId
      if (chatIdToUpdate) {
        setChatHistory(prev => prev.map(chat => {
          if (chat.id === chatIdToUpdate) {
            return {
              ...chat,
              messages: [...finalMessages],
              lastMessage: aiResponse.content, // Explicitly set to AI response content
              timestamp: new Date()
            };
          }
          return chat;
        }));
      }
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds

    setResponseTimeoutId(timeoutId);
  };

  const handleStopResponse = () => {
    if (responseTimeoutId) {
      clearTimeout(responseTimeoutId);
      setResponseTimeoutId(null);
      setIsTyping(false);
      toast.info('Response stopped');
    }
  };

  const handleStartChat = (initialMessage?: string) => {
    if (initialMessage) {
      handleSendMessage(initialMessage);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId('');
    setSidebarState('collapsed');
    // Focus the input after clearing the chat
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100); // Small delay to ensure the component has updated
  };

  const handleFileUpload = (file: File) => {
    // Handle file upload - for now just show a toast with file info
    toast.success(`File uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    // You can implement actual file processing here
    // For example, if it's an image, you could display it in the chat
    // If it's a text file, you could read its contents and send as a message
  };

  const handleSelectChat = (chatId: string) => {
    const selectedChat = chatHistory.find(chat => chat.id === chatId);
    if (selectedChat) {
      setCurrentChatId(chatId);
      setMessages(selectedChat.messages);
      // Only collapse sidebar if it was hover-expanded, not manually expanded
      if (sidebarState === 'hover-expanded') {
        setSidebarState('collapsed');
      }
    }
  };

  const handleSidebarHover = () => {
    if (sidebarState === 'collapsed') {
      setSidebarState('hover-expanded');
    }
  };

  const handleSidebarLeave = () => {
    if (sidebarState === 'hover-expanded') {
      setSidebarState('collapsed');
    }
  };

  const handleCopyMessage = (content: string) => {
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(content)
        .then(() => {
          toast.success('Message copied to clipboard');
        })
        .catch((err) => {
          console.error('Clipboard API failed:', err);
          // Fallback to older method
          fallbackCopy(content);
        });
    } else {
      // Use fallback method
      fallbackCopy(content);
    }
  };

  const fallbackCopy = (content: string) => {
    try {
      // Create a temporary textarea element
      const textArea = document.createElement('textarea');
      textArea.value = content;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      // Try to copy using the older execCommand method
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        toast.success('Message copied to clipboard');
      } else {
        toast.error('Failed to copy message');
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
      toast.error('Copy not supported in this browser');
    }
  };

  const handleLikeMessage = (messageId: string) => {
    toast.success('Feedback recorded');
  };

  const handleDislikeMessage = (messageId: string) => {
    toast.success('Feedback recorded');
  };

  const showWelcomeScreen = messages.length === 0 && !isTyping;

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        state={sidebarState}
        onStateChange={setSidebarState}
        onHover={handleSidebarHover}
        onLeave={handleSidebarLeave}
        chatHistory={chatHistory}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onSettings={() => toast.info('Settings (demo)')}
        currentChatId={currentChatId}
      />
      <div className={`flex flex-col flex-1 min-w-0 transition-all duration-300 bg-transparent ${
        sidebarState === 'collapsed' ? 'ml-12' : 'ml-80'
      } ${isHeaderVisible ? 'pt-20' : 'pt-0'}`}>
        <ChatHeader
          companyName={config.companyName}
          logoUrl={config.logoUrl}
          onSettingsClick={() => toast.info('Settings (demo)')}
          sidebarState={sidebarState}
          isVisible={isHeaderVisible}
        />
        {showWelcomeScreen ? (
          <WelcomeScreen
            companyName={config.companyName}
            onStartChat={handleStartChat}
          />
        ) : (
          <ScrollArea className="flex-1 px-4 py-6 pb-24">
            <div className="max-w-4xl mx-auto px-[16px] py-[0px]">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onCopy={handleCopyMessage}
                  onLike={handleLikeMessage}
                  onDislike={handleDislikeMessage}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}
        <MessageInput
          ref={messageInputRef}
          onSendMessage={handleSendMessage}
          onStopResponse={handleStopResponse}
          onNewChat={handleNewChat}
          onFileUpload={handleFileUpload}
          isLoading={isTyping}
          sidebarState={sidebarState}
        />
      </div>
      <Toaster />
    </div>
  );
}