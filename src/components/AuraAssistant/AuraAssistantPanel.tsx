import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Wand2,
  CheckCheck,
  FileText,
  Volume2,
  Languages,
  PenTool,
  Copy,
  Check,
  CornerDownLeft,
  Loader2,
  Send,
  MessageSquare,
} from 'lucide-react';
import { executeAIAssistant, AIAssistAction } from '../../services/aiService';

interface AuraAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  documentContent: string;
  onReplaceSelection: (newText: string) => void;
  onInsertBelow: (newText: string) => void;
}

export const AuraAssistantPanel: React.FC<AuraAssistantPanelProps> = ({
  isOpen,
  onClose,
  selectedText,
  documentContent,
  onReplaceSelection,
  onInsertBelow,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const targetText = selectedText || documentContent.replace(/<[^>]*>/g, ' ').slice(0, 800);

  const handleAction = async (action: AIAssistAction, customMsg?: string) => {
    setIsLoading(true);
    setCopied(false);
    try {
      const response = await executeAIAssistant(action, targetText, customMsg);
      setGeneratedResult(response.resultText);
      setLastAction(action);
    } catch (err) {
      console.error(err);
      setGeneratedResult('An error occurred during AI processing.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    handleAction('draft', customPrompt.trim());
    setCustomPrompt('');
  };

  const handleCopy = () => {
    if (generatedResult) {
      navigator.clipboard.writeText(generatedResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <aside className="w-80 bg-white border-l border-slate-300 flex flex-col shrink-0 text-slate-800 text-xs shadow-xl select-none z-30">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#2b579a] to-[#1e3f70] text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="font-semibold text-sm">Aura AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close Aura Assistant"
          className="p-1 hover:bg-white/20 rounded transition-colors text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Selected text contextual banner */}
      <div className="px-3 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
        <span className="text-[11px] text-blue-900 font-medium truncate max-w-[200px]">
          {selectedText ? `Selection: "${selectedText.slice(0, 30)}..."` : 'Full Document Context'}
        </span>
        <span className="text-[10px] bg-blue-200/80 text-blue-800 px-1.5 py-0.5 rounded font-mono">
          {selectedText ? `${selectedText.split(/\s+/).length} words` : 'Context'}
        </span>
      </div>

      {/* Action shortcuts */}
      <div className="p-3 border-b border-slate-200 bg-slate-50 space-y-2">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
          Smart Operations
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => handleAction('rewrite')}
            disabled={isLoading}
            className="flex items-center gap-1.5 p-2 bg-white border border-slate-200 rounded hover:border-[#2b579a] hover:bg-blue-50/50 transition-colors text-left"
          >
            <Wand2 className="w-3.5 h-3.5 text-[#2b579a] shrink-0" />
            <span className="font-medium text-slate-700">Rewrite & Polish</span>
          </button>

          <button
            onClick={() => handleAction('grammar')}
            disabled={isLoading}
            className="flex items-center gap-1.5 p-2 bg-white border border-slate-200 rounded hover:border-[#2b579a] hover:bg-blue-50/50 transition-colors text-left"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-medium text-slate-700">Fix Grammar</span>
          </button>

          <button
            onClick={() => handleAction('summarize')}
            disabled={isLoading}
            className="flex items-center gap-1.5 p-2 bg-white border border-slate-200 rounded hover:border-[#2b579a] hover:bg-blue-50/50 transition-colors text-left"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="font-medium text-slate-700">Summarize</span>
          </button>

          <button
            onClick={() => handleAction('expand')}
            disabled={isLoading}
            className="flex items-center gap-1.5 p-2 bg-white border border-slate-200 rounded hover:border-[#2b579a] hover:bg-blue-50/50 transition-colors text-left"
          >
            <PenTool className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span className="font-medium text-slate-700">Elaborate</span>
          </button>

          <button
            onClick={() => handleAction('tone-executive')}
            disabled={isLoading}
            className="flex items-center gap-1.5 p-2 bg-white border border-slate-200 rounded hover:border-[#2b579a] hover:bg-blue-50/50 transition-colors text-left"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-medium text-slate-700">Executive Tone</span>
          </button>

          <button
            onClick={() => handleAction('translate-es')}
            disabled={isLoading}
            className="flex items-center gap-1.5 p-2 bg-white border border-slate-200 rounded hover:border-[#2b579a] hover:bg-blue-50/50 transition-colors text-left"
          >
            <Languages className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span className="font-medium text-slate-700">To Spanish</span>
          </button>
        </div>
      </div>

      {/* Generated Response Area with Confirmation / Insertion Controls */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#2b579a]" />
            <span className="text-xs">Consulting Aura Intelligence...</span>
          </div>
        ) : generatedResult ? (
          <div className="border border-slate-300 rounded-lg p-3 bg-slate-50/80 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-[#2b579a] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Suggestion</span>
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed select-text font-serif">
              {generatedResult}
            </div>

            {/* Confirmation actions */}
            <div className="pt-2 border-t border-slate-200 flex flex-col gap-1.5">
              {selectedText ? (
                <button
                  onClick={() => onReplaceSelection(generatedResult)}
                  className="w-full py-1.5 bg-[#2b579a] text-white rounded font-semibold text-xs hover:bg-[#1e3f70] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Replace Selection</span>
                </button>
              ) : null}

              <button
                onClick={() => onInsertBelow(generatedResult)}
                className="w-full py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
                <span>Insert Into Document</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs">
              Select text in your document to rewrite, or type custom instructions below.
            </p>
          </div>
        )}
      </div>

      {/* Custom Prompt Input */}
      <form onSubmit={handleCustomSubmit} className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="relative">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Ask Aura to draft or modify anything..."
            className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:border-[#2b579a]"
          />
          <button
            type="submit"
            disabled={!customPrompt.trim() || isLoading}
            className="absolute right-1.5 top-1.5 p-1 bg-[#2b579a] text-white rounded hover:bg-[#1e3f70] disabled:opacity-40 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </aside>
  );
};
