import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, FileText } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language: string;
  filename: string;
  icon?: string;
}

export function CodeBlock({ code, language, filename, icon }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Copied!",
        description: `${filename} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `${filename} has been downloaded`,
    });
  };

  const getIconColor = () => {
    switch (icon) {
      case 'html5':
        return 'text-orange-400';
      case 'css3':
        return 'text-blue-400';
      case 'js':
        return 'text-yellow-400';
      default:
        return 'text-slate-400';
    }
  };

  const highlightCode = (code: string, language: string) => {
    // Simple syntax highlighting
    let highlightedCode = code;
    
    if (language === 'html') {
      highlightedCode = highlightedCode
        .replace(/(&lt;!DOCTYPE[^&]*&gt;)/g, '<span class="token punctuation">$1</span>')
        .replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)/g, '<span class="token tag">$1</span><span class="token tag">$2</span>')
        .replace(/([a-zA-Z-]+)=/g, '<span class="token attr-name">$1</span>=')
        .replace(/="([^"]*)"/g, '=<span class="token attr-value">"$1"</span>');
    } else if (language === 'css') {
      highlightedCode = highlightedCode
        .replace(/([a-zA-Z-]+)(\s*:)/g, '<span class="token property">$1</span>$2')
        .replace(/:\s*([^;]+)/g, ': <span class="token string">$1</span>')
        .replace(/([.#][a-zA-Z-]+)/g, '<span class="token selector">$1</span>');
    } else if (language === 'javascript') {
      highlightedCode = highlightedCode
        .replace(/\b(function|const|let|var|if|else|for|while|return|class|extends)\b/g, '<span class="token keyword">$1</span>')
        .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, '<span class="token function">$1</span>(')
        .replace(/\b(\d+)\b/g, '<span class="token number">$1</span>');
    }
    
    return highlightedCode;
  };

  return (
    <div className="relative border-t border-slate-700/50 first:border-t-0">
      <div className="flex items-center justify-between bg-slate-900/50 px-4 py-2">
        <div className="flex items-center space-x-2">
          <FileText className={`${getIconColor()}`} size={16} />
          <span className="text-sm font-medium text-slate-300">{filename}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleCopy}
            variant="ghost"
            size="sm"
            className="p-1.5 h-auto text-slate-400 hover:text-white"
            title="Copy Code"
          >
            <Copy size={12} />
          </Button>
          <Button
            onClick={handleDownload}
            variant="ghost"
            size="sm"
            className="p-1.5 h-auto text-slate-400 hover:text-white"
            title="Download"
          >
            <Download size={12} />
          </Button>
        </div>
      </div>
      <div className="p-4 bg-slate-900/30 overflow-x-auto">
        <pre className="text-sm">
          <code 
            className="text-slate-200 font-mono"
            dangerouslySetInnerHTML={{ 
              __html: highlightCode(code.replace(/</g, '&lt;').replace(/>/g, '&gt;'), language)
            }}
          />
        </pre>
      </div>
    </div>
  );
}
