import React, { useState } from 'react';
import {
  ListTree,
  FileText,
  Search,
  X,
  ChevronRight,
  ChevronDown,
  Hash,
} from 'lucide-react';
import { extractTableOfContents, TocItem } from '../../utils/documentLogic';

interface NavigationPaneProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
  pageCount: number;
  onJumpToHeading: (id: string, text: string) => void;
  onJumpToPage: (page: number) => void;
  onSearch: (query: string) => void;
}

export const NavigationPane: React.FC<NavigationPaneProps> = ({
  isOpen,
  onClose,
  htmlContent,
  pageCount,
  onJumpToHeading,
  onJumpToPage,
  onSearch,
}) => {
  const [activeTab, setActiveTab] = useState<'headings' | 'pages' | 'results'>('headings');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const headings = extractTableOfContents(htmlContent);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-300 flex flex-col shrink-0 select-none text-slate-700 text-xs shadow-inner">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-100 border-b border-slate-200">
        <span className="font-semibold text-slate-800 text-xs">Navigation</span>
        <button
          onClick={onClose}
          aria-label="Close Navigation Pane"
          className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search in Document bar */}
      <div className="p-2 border-b border-slate-200 bg-white">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search document..."
            className="w-full pl-7 pr-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs focus:bg-white focus:outline-none focus:border-[#2b579a]"
          />
          <Search className="w-3.5 h-3.5 absolute left-2 top-1.5 text-slate-400" />
        </form>
      </div>

      {/* Tabs (Headings, Pages, Results) */}
      <div className="flex border-b border-slate-200 bg-slate-100">
        <button
          onClick={() => setActiveTab('headings')}
          className={`flex-1 py-1.5 text-center font-medium transition-colors ${
            activeTab === 'headings'
              ? 'bg-white text-[#2b579a] border-b-2 border-b-[#2b579a] font-semibold'
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          Headings
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`flex-1 py-1.5 text-center font-medium transition-colors ${
            activeTab === 'pages'
              ? 'bg-white text-[#2b579a] border-b-2 border-b-[#2b579a] font-semibold'
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          Pages
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`flex-1 py-1.5 text-center font-medium transition-colors ${
            activeTab === 'results'
              ? 'bg-white text-[#2b579a] border-b-2 border-b-[#2b579a] font-semibold'
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          Results
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* 1. Headings Tree */}
        {activeTab === 'headings' && (
          <div className="space-y-1">
            {headings.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs px-2">
                No headings found. Add Heading 1, 2, or 3 styles to create an outline.
              </div>
            ) : (
              headings.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onJumpToHeading(item.id, item.text)}
                  className={`w-full text-left py-1 px-2 rounded hover:bg-slate-200/70 transition-colors flex items-center gap-1.5 ${
                    item.level === 1 ? 'font-bold text-slate-900' : item.level === 2 ? 'font-medium pl-4 text-slate-700' : 'pl-6 text-slate-600'
                  }`}
                >
                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{item.text}</span>
                </button>
              ))
            )}
          </div>
        )}

        {/* 2. Page Thumbnails */}
        {activeTab === 'pages' && (
          <div className="grid grid-cols-2 gap-3 p-1">
            {Array.from({ length: pageCount }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => onJumpToPage(idx + 1)}
                className="flex flex-col items-center p-2 bg-white border border-slate-300 rounded hover:border-[#2b579a] hover:shadow-xs transition-all group"
              >
                <div className="w-16 h-20 bg-slate-50 border border-slate-200 rounded-xs mb-1.5 flex items-center justify-center text-[10px] text-slate-400 font-mono shadow-2xs group-hover:bg-blue-50/50">
                  {idx + 1}
                </div>
                <span className="text-[11px] font-medium text-slate-600">Page {idx + 1}</span>
              </button>
            ))}
          </div>
        )}

        {/* 3. Search Results */}
        {activeTab === 'results' && (
          <div className="py-2 text-xs">
            {searchQuery ? (
              <div className="space-y-2">
                <p className="text-slate-500 font-medium">Search results for &quot;{searchQuery}&quot;:</p>
                <div className="p-2 bg-white border border-slate-200 rounded">
                  <p className="text-slate-700">Matches found in document body.</p>
                  <button
                    onClick={() => onSearch(searchQuery)}
                    className="mt-2 w-full py-1 bg-[#2b579a] text-white rounded text-[11px] font-semibold"
                  >
                    Highlight & Find Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                Type in the search bar above to find terms in this document.
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
