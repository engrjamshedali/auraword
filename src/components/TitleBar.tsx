import React, { useState } from 'react';
import {
  Save,
  Undo2,
  Redo2,
  Printer,
  FilePlus,
  Home,
  Sparkles,
  Share2,
  MessageSquare,
  Search,
  Check,
  RefreshCw,
  Minus,
  Square,
  X,
  FileText,
} from 'lucide-react';

interface TitleBarProps {
  documentTitle: string;
  onUpdateTitle: (title: string) => void;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onPrint: () => void;
  onNew: () => void;
  onGoHome: () => void;
  onToggleAIAssistant: () => void;
  isAIOpen: boolean;
  onToggleComments: () => void;
  commentCount: number;
  onSearchCommand: (query: string) => void;
  onExportDocx: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  documentTitle,
  onUpdateTitle,
  saveStatus,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onPrint,
  onNew,
  onGoHome,
  onToggleAIAssistant,
  isAIOpen,
  onToggleComments,
  commentCount,
  onSearchCommand,
  onExportDocx,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(documentTitle);
  const [commandQuery, setCommandQuery] = useState('');

  const handleFinishEditing = () => {
    setIsEditingTitle(false);
    if (titleInput.trim()) {
      onUpdateTitle(titleInput.trim());
    } else {
      setTitleInput(documentTitle);
    }
  };

  return (
    <header className="h-10 bg-[#2b579a] text-white flex items-center justify-between px-3 select-none text-xs border-b border-[#204479] shrink-0">
      {/* Left: Brand & Quick Access Toolbar */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onGoHome}
          className="flex items-center gap-1.5 px-2 py-1 hover:bg-white/15 rounded transition-colors font-bold tracking-tight text-white mr-1"
          title="Return to AuraWord Dashboard"
        >
          <div className="w-5 h-5 bg-white text-[#2b579a] rounded-sm flex items-center justify-center font-serif font-black text-xs shadow-xs">
            W
          </div>
          <span className="font-semibold text-sm tracking-normal hidden sm:inline">AuraWord</span>
        </button>

        <div className="h-4 w-px bg-white/20 mx-0.5" />

        {/* Quick Access Icons */}
        <button
          onClick={onSave}
          title="Save (Ctrl+S)"
          className="p-1 hover:bg-white/15 rounded text-white/90 hover:text-white transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="hidden sm:inline-flex p-1 hover:bg-white/15 rounded text-white/90 hover:text-white disabled:opacity-40 transition-colors"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className="hidden sm:inline-flex p-1 hover:bg-white/15 rounded text-white/90 hover:text-white disabled:opacity-40 transition-colors"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onPrint}
          title="Print / Export PDF (Ctrl+P)"
          className="hidden sm:inline-flex p-1 hover:bg-white/15 rounded text-white/90 hover:text-white transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onNew}
          title="New Document (Ctrl+N)"
          className="hidden sm:inline-flex p-1 hover:bg-white/15 rounded text-white/90 hover:text-white transition-colors"
        >
          <FilePlus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center: Title & Save Status */}
      <div className="flex items-center gap-2 max-w-sm sm:max-w-md">
        {isEditingTitle ? (
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={handleFinishEditing}
            onKeyDown={(e) => e.key === 'Enter' && handleFinishEditing()}
            autoFocus
            className="bg-white text-slate-900 px-2 py-0.5 rounded text-xs font-semibold focus:outline-none w-56 shadow-inner"
          />
        ) : (
          <div
            onClick={() => {
              setTitleInput(documentTitle);
              setIsEditingTitle(true);
            }}
            title="Click to rename document"
            className="font-semibold text-xs text-white/95 hover:bg-white/15 px-2 py-0.5 rounded cursor-pointer truncate max-w-[130px] sm:max-w-[280px]"
          >
            {documentTitle || 'Untitled Document'}
          </div>
        )}

        {/* Save Status Badge */}
        <div className="flex items-center gap-1 text-[11px] text-white/80 shrink-0">
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1 text-emerald-300">
              <Check className="w-3 h-3" />
              <span className="hidden md:inline">Saved</span>
            </span>
          )}
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1 text-amber-200">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span className="hidden md:inline">Saving...</span>
            </span>
          )}
          {saveStatus === 'unsaved' && (
            <span className="flex items-center gap-1 text-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="hidden md:inline">Unsaved</span>
            </span>
          )}
        </div>
      </div>

      {/* Right: Search, AI button, Comments, and Window controls */}
      <div className="flex items-center gap-2">
        {/* Quick Command Finder */}
        <div className="hidden lg:flex items-center relative">
          <input
            type="text"
            value={commandQuery}
            onChange={(e) => {
              setCommandQuery(e.target.value);
              onSearchCommand(e.target.value);
            }}
            placeholder="Tell me what you want to do..."
            className="w-44 xl:w-56 bg-white/15 placeholder-white/60 text-white pl-7 pr-2 py-1 rounded text-xs focus:bg-white focus:text-slate-900 focus:placeholder-slate-400 focus:outline-none transition-all"
          />
          <Search className="w-3.5 h-3.5 absolute left-2 text-white/60 pointer-events-none" />
        </div>

        {/* Aura AI Assistant Button */}
        <button
          onClick={onToggleAIAssistant}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
            isAIOpen
              ? 'bg-amber-400 text-slate-900 font-semibold shadow-xs'
              : 'bg-white/15 hover:bg-white/25 text-white'
          }`}
          title="Toggle Aura AI Writing Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">Aura AI</span>
        </button>

        {/* Comments Button */}
        <button
          onClick={onToggleComments}
          className="flex items-center gap-1 px-2 py-1 hover:bg-white/15 rounded text-white/90 hover:text-white transition-colors relative"
          title="Comments side panel"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          {commentCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 rounded-full px-1 text-[9px] font-bold">
              {commentCount}
            </span>
          )}
        </button>

        {/* Share / Export */}
        <button
          onClick={onExportDocx}
          className="flex items-center gap-1 px-2 py-1 bg-white/15 hover:bg-white/25 rounded text-white transition-colors"
          title="Download as DOCX"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Export</span>
        </button>

        {/* Window controls styling */}
        <div className="hidden sm:flex items-center pl-2 ml-1 border-l border-white/20 gap-1 text-white/70">
          <button className="p-1 hover:bg-white/15 rounded" title="Minimize">
            <Minus className="w-3 h-3" />
          </button>
          <button className="p-1 hover:bg-white/15 rounded" title="Maximize">
            <Square className="w-2.5 h-2.5" />
          </button>
          <button onClick={onGoHome} className="p-1 hover:bg-red-500/80 rounded" title="Close document">
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
};
