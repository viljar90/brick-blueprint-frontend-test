import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface WelcomeScreenProps {
  companyName?: string;
  onStartChat: (message?: string) => void;
}

const suggestedPrompts = [
  "Help me analyze this data",
  "Explain a complex concept",
  "Generate creative ideas",
  "Assist with problem solving"
];

export function WelcomeScreen({ 
  companyName = "Your Company", 
  onStartChat 
}: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-2xl mx-auto pb-24">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-primary-foreground" />
        </div>
        
        <h1 className="text-3xl font-medium mb-2">
          Welcome to {companyName} AI Assistant
        </h1>
        
        <p className="text-muted-foreground max-w-md">
          I'm here to help you with questions, analysis, creative tasks, and more. 
          How can I assist you today?
        </p>
      </div>



      <div className="space-y-2 w-full max-w-md">
        <p className="text-sm text-muted-foreground text-center mb-3">
          Try these conversation starters:
        </p>
        
        {suggestedPrompts.map((prompt, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full text-left justify-start h-auto py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            onClick={() => onStartChat(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>


    </div>
  );
}