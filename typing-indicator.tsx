import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="text-white" size={14} />
      </div>
      <div className="flex-1">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl rounded-tl-sm p-4 border border-slate-700/50">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-typing"></div>
              <div 
                className="w-2 h-2 bg-slate-400 rounded-full animate-typing" 
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div 
                className="w-2 h-2 bg-slate-400 rounded-full animate-typing" 
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
            <span className="text-slate-400 text-sm">Fred.ke is generating your website...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
