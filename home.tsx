import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ChatMessage } from "@/components/chat-message";
import { ChatInput } from "@/components/chat-input";
import { TypingIndicator } from "@/components/typing-indicator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Code, Settings, Trash2, ArrowDown } from "lucide-react";
import type { Message } from "@shared/schema";

export default function Home() {
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch chat history
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages", sessionId],
    enabled: !!sessionId,
  });

  // Generate website mutation
  const generateMutation = useMutation({
    mutationFn: async ({ prompt, sessionId }: { prompt: string; sessionId: string }) => {
      const response = await apiRequest("POST", "/api/generate", { prompt, sessionId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages", sessionId] });
      scrollToBottom();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate website",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  // Clear chat mutation
  const clearChatMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/messages/${sessionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages", sessionId] });
      toast({
        title: "Chat Cleared",
        description: "Your chat history has been cleared.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear chat history",
        variant: "destructive",
      });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleSendMessage = async (prompt: string) => {
    setIsGenerating(true);
    await generateMutation.mutateAsync({ prompt, sessionId });
  };

  const handleQuickAction = (action: string) => {
    const prompts = {
      "E-commerce": "Create a modern e-commerce website with a product catalog, shopping cart, and checkout process. Use a clean design with purple accents.",
      "Blog": "Create a modern blog website with a clean layout, article cards, and responsive design. Include a hero section and about page.",
      "Portfolio": "Create a modern portfolio website with a hero section, about section, projects showcase, and contact form. Use a dark theme with purple accents.",
      "Landing Page": "Create a modern landing page with a hero section, features, testimonials, and call-to-action. Use gradients and smooth animations.",
    };
    
    const prompt = prompts[action as keyof typeof prompts];
    if (prompt) {
      handleSendMessage(prompt);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center">
              <Code className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Fred.ke</h1>
              <p className="text-sm text-slate-400">AI Website Generator</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
              title="Settings"
            >
              <Settings size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
              onClick={() => clearChatMutation.mutate()}
              disabled={clearChatMutation.isPending}
              title="Clear Chat"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main 
        ref={chatContainerRef}
        className="pt-20 pb-32 px-4 max-w-4xl mx-auto h-screen overflow-y-auto"
      >
        <div className="space-y-6">
          {/* Welcome Message */}
          {messages.length === 0 && !isLoading && (
            <div className="animate-fade-in">
              <ChatMessage
                message={{
                  id: 0,
                  content: "👋 Welcome to Fred.ke! I'm your AI-powered website generator. I can help you create complete websites using HTML, CSS, and JavaScript. Just describe what you want to build, and I'll generate the code for you!",
                  role: "assistant",
                  sessionId,
                  generatedCode: null,
                  createdAt: new Date(),
                }}
                isWelcome
              />
            </div>
          )}

          {/* Chat Messages */}
          {messages.map((message) => (
            <div key={message.id} className="animate-slide-up">
              <ChatMessage message={message} />
            </div>
          ))}

          {/* Typing Indicator */}
          {isGenerating && (
            <div className="animate-fade-in">
              <TypingIndicator />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onQuickAction={handleQuickAction}
        isGenerating={isGenerating}
      />

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <Button
          className="fixed bottom-32 right-6 w-12 h-12 bg-slate-800/90 backdrop-blur-sm text-slate-400 hover:text-white rounded-full border border-slate-700/50 hover:bg-slate-700 transition-all shadow-lg hover:shadow-xl"
          onClick={scrollToBottom}
          title="Scroll to bottom"
        >
          <ArrowDown size={16} />
        </Button>
      )}
    </div>
  );
}
