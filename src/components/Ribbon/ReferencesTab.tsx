import React, { useState } from 'react';
import {
  BookOpen,
  RefreshCw,
  Plus,
  Quote,
  BookmarkPlus,
  Bookmark,
  ChevronDown,
  Check,
} from 'lucide-react';
import { CitationStyle } from '../../types/document';

interface ReferencesTabProps {
  onInsertTableOfContents: () => void;
  onUpdateTableOfContents: () => void;
  onInsertFootnote: () => void;
  onInsertEndnote: () => void;
  onOpenCitationManager: () => void;
  citationStyle: CitationStyle;
  onChangeCitationStyle: (style: CitationStyle) => void;
  onInsertCaption: (type: 'Figure' | 'Table') => void;
}

export const ReferencesTab: React.FC<ReferencesTabProps> = ({
  onInsertTableOfContents,
  onUpdateTableOfContents,
  onInsertFootnote,
  onInsertEndnote,
  onOpenCitationManager,
  citationStyle,
  onChangeCitationStyle,
  onInsertCaption,
}) => {
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [showCaptionMenu, setShowCaptionMenu] = useState(false);

  return (
    <div className="flex items-stretch gap-1 px-2 py-1 select-none text-slate-700 overflow-x-auto">
      {/* 1. Table of Contents */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={onInsertTableOfContents}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-16"
            title="Generate Automatic Table of Contents from headings"
          >
            <BookOpen className="w-5 h-5 text-[#2b579a]" />
            <span className="text-[10px] mt-0.5 font-medium">Table of Contents</span>
          </button>

          <button
            onClick={onUpdateTableOfContents}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
            title="Update existing Table of Contents"
          >
            <RefreshCw className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] mt-0.5 font-medium">Update TOC</span>
          </button>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Table of Contents</span>
      </div>

      {/* 2. Footnotes */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={onInsertFootnote}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
            title="Insert Footnote at bottom of current page"
          >
            <span className="font-serif italic font-bold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              AB<sup>1</sup>
            </span>
            <span className="text-[10px] mt-1 font-medium">Footnote</span>
          </button>

          <button
            onClick={onInsertEndnote}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
            title="Insert Endnote at end of document"
          >
            <span className="font-serif italic font-bold text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              AB<sup>i</sup>
            </span>
            <span className="text-[10px] mt-1 font-medium">Endnote</span>
          </button>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Footnotes</span>
      </div>

      {/* 3. Citations & Bibliography */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenCitationManager}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-16"
            title="Open Citation & Source Manager"
          >
            <Quote className="w-5 h-5 text-amber-600" />
            <span className="text-[10px] mt-0.5 font-medium">Manage Sources</span>
          </button>

          {/* Citation Style Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStyleMenu(!showStyleMenu)}
              className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
              title="Select Citation Standard"
            >
              <span className="font-bold text-xs text-[#2b579a]">{citationStyle}</span>
              <div className="flex items-center text-[10px] mt-0.5 font-medium">
                <span>Style</span>
                <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
              </div>
            </button>
            {showStyleMenu && (
              <div
                className="absolute left-0 top-full mt-1 bg-white border border-slate-300 shadow-xl rounded-lg py-1 z-40 w-36 text-xs"
                onClick={() => setShowStyleMenu(false)}
              >
                {(['APA', 'MLA', 'Chicago', 'IEEE'] as CitationStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => onChangeCitationStyle(style)}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between ${
                      citationStyle === style ? 'font-bold text-[#2b579a]' : ''
                    }`}
                  >
                    <span>{style}</span>
                    {citationStyle === style && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Citations & Bibliography</span>
      </div>

      {/* 4. Captions */}
      <div className="flex flex-col items-center justify-between px-2 shrink-0">
        <div className="relative">
          <button
            onClick={() => setShowCaptionMenu(!showCaptionMenu)}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
            title="Insert figure or table caption"
          >
            <Bookmark className="w-5 h-5 text-slate-600" />
            <div className="flex items-center text-[10px] mt-0.5 font-medium">
              <span>Caption</span>
              <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
            </div>
          </button>
          {showCaptionMenu && (
            <div
              className="absolute left-0 top-full mt-1 bg-white border border-slate-300 shadow-xl rounded py-1 z-40 w-36 text-xs"
              onClick={() => setShowCaptionMenu(false)}
            >
              <button
                onClick={() => onInsertCaption('Figure')}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100"
              >
                Figure Caption
              </button>
              <button
                onClick={() => onInsertCaption('Table')}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100"
              >
                Table Caption
              </button>
            </div>
          )}
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Captions</span>
      </div>
    </div>
  );
};
