import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Sparkles, Store, FileText, User, Building } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onQuickAction: (action: string) => void;
  isGenerating: boolean;
}

export function ChatInput({ onSendMessage, onQuickAction, isGenerating }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !isGenerating) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickActionClick = (action: string) => {
    if (!isGenerating) {
      onQuickAction(action);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
    }
  }, [message]);

  const quickActions = [
    { name: "E-commerce", icon: Store },
    { name: "Blog", icon: FileText },
    { name: "Portfolio", icon: User },
    { name: "Landing Page", icon: Building },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent backdrop-blur-sm">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-2xl">
          <div className="flex items-end space-x-3 p-4">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe the website you want to create..."
                className="min-h-12 max-h-32 resize-none bg-transparent border-0 focus:ring-0 focus:border-0 text-white placeholder-slate-400 p-0"
                disabled={isGenerating}
              />
              <div className="absolute bottom-0 right-0 text-xs text-slate-500 pb-1 pr-2">
                <Sparkles size={12} className="inline mr-1" />
                AI-powered
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 text-slate-400 hover:text-white"
                title="Attach File"
                disabled={isGenerating}
              >
                <Paperclip size={16} />
              </Button>
              <Button
                onClick={handleSend}
                disabled={!message.trim() || isGenerating}
                className="p-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-600 hover:to-violet-600 transition-all shadow-lg hover:shadow-xl"
                title="Generate Website"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="border-t border-slate-700/50 p-3">
            <div className="flex items-center space-x-2 overflow-x-auto">
              <span className="text-xs text-slate-400 whitespace-nowrap">Quick actions:</span>
              {quickActions.map((action) => (
                <Button
                  key={action.name}
                  onClick={() => handleQuickActionClick(action.name)}
                  disabled={isGenerating}
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 bg-slate-700/50 hover:bg-slate-600 text-slate-300 px-3 py-1.5 text-xs transition-colors whitespace-nowrap"
                >
                  <action.icon size={12} />
                  <span>{action.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
