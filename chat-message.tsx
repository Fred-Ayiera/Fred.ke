import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "./code-block";
import { useToast } from "@/hooks/use-toast";
import { Bot, User, Clock, Check, Eye, Download, Copy } from "lucide-react";
import type { Message } from "@shared/schema";

interface ChatMessageProps {
  message: Message;
  isWelcome?: boolean;
}

export function ChatMessage({ message, isWelcome = false }: ChatMessageProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleCopyAll = async () => {
    if (message.generatedCode) {
      const { html, css, javascript } = message.generatedCode;
      const allCode = `<!-- HTML -->\n${html}\n\n/* CSS */\n${css}\n\n// JavaScript\n${javascript}`;
      
      try {
        await navigator.clipboard.writeText(allCode);
        toast({
          title: "Copied!",
          description: "All code has been copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy code",
          variant: "destructive",
        });
      }
    }
  };

  const handleDownloadAll = () => {
    if (message.generatedCode) {
      const { html, css, javascript, title } = message.generatedCode;
      const filename = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      const files = [
        { name: `${filename}.html`, content: html },
        { name: `${filename}.css`, content: css },
        { name: `${filename}.js`, content: javascript },
      ];

      files.forEach(file => {
        const blob = new Blob([file.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

      toast({
        title: "Downloaded!",
        description: "All files have been downloaded",
      });
    }
  };

  const handlePreview = () => {
    if (message.generatedCode) {
      const { html, css, javascript } = message.generatedCode;
      const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Preview</title>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${javascript}</script>
        </body>
        </html>
      `;
      
      const blob = new Blob([fullHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      toast({
        title: "Preview Opened",
        description: "Website preview opened in new tab",
      });
    }
  };

  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'justify-end' : ''}`}>
      {/* Avatar */}
      {isAssistant && (
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="text-white" size={14} />
        </div>
      )}

      {/* Message Content */}
      <div className={`flex-1 ${isUser ? 'max-w-2xl' : ''}`}>
        <div className={`rounded-2xl p-4 ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-sm shadow-lg' 
            : 'bg-slate-800/80 backdrop-blur-sm text-slate-100 rounded-tl-sm border border-slate-700/50'
        }`}>
          <p className="leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        {/* Generated Code */}
        {message.generatedCode && (
          <div className="mt-4 bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="p-4 border-b border-slate-700/50">
              <h3 className="font-semibold text-slate-100 mb-2">
                {message.generatedCode.title}
              </h3>
              <p className="text-sm text-slate-400">
                {message.generatedCode.description}
              </p>
            </div>

            {/* Code Blocks */}
            <div className="space-y-0">
              <CodeBlock
                code={message.generatedCode.html}
                language="html"
                filename="index.html"
                icon="html5"
              />
              <CodeBlock
                code={message.generatedCode.css}
                language="css"
                filename="styles.css"
                icon="css3"
              />
              <CodeBlock
                code={message.generatedCode.javascript}
                language="javascript"
                filename="script.js"
                icon="js"
              />
            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-slate-800/30 border-t border-slate-700/50">
              <div className="flex items-center space-x-3 flex-wrap gap-2">
                <Button
                  onClick={handlePreview}
                  className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600 text-white"
                  size="sm"
                >
                  <Eye size={14} />
                  <span>Preview</span>
                </Button>
                <Button
                  onClick={handleDownloadAll}
                  className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white"
                  size="sm"
                >
                  <Download size={14} />
                  <span>Download All</span>
                </Button>
                <Button
                  onClick={handleCopyAll}
                  variant="secondary"
                  className="flex items-center space-x-2"
                  size="sm"
                >
                  <Copy size={14} />
                  <span>Copy All</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className={`flex items-center space-x-2 mt-2 text-xs text-slate-500 ${
          isUser ? 'justify-end' : ''
        }`}>
          <Clock size={12} />
          <span>{isWelcome ? 'Just now' : formatTime(message.createdAt)}</span>
          {isUser && <Check size={12} className="text-blue-400" />}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="text-white" size={14} />
        </div>
      )}
    </div>
  );
}
