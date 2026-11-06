import React, { useState } from 'react';
import { Search, Replace, ArrowDown, ArrowUp, X } from 'lucide-react';

interface FindReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFind: (query: string, matchCase: boolean) => number;
  onReplace: (query: string, replaceText: string, replaceAll: boolean) => number;
}

export const FindReplaceModal: React.FC<FindReplaceModalProps> = ({
  isOpen,
  onClose,
  onFind,
  onReplace,
}) => {
  const [activeTab, setActiveTab] = useState<'find' | 'replace'>('find');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleFindNext = () => {
    if (!findText) return;
    const count = onFind(findText, matchCase);
    setStatusMessage(count > 0 ? `Found ${count} occurrences` : 'No matches found');
  };

  const handleReplaceOnce = () => {
    if (!findText) return;
    const count = onReplace(findText, replaceText, false);
    setStatusMessage(count > 0 ? 'Replaced occurrence' : 'No match found to replace');
  };

  const handleReplaceAll = () => {
    if (!findText) return;
    const count = onReplace(findText, replaceText, true);
    setStatusMessage(`Replaced ${count} occurrences`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden text-slate-800 text-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 border-b border-slate-200">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('find')}
              className={`px-3 py-1 font-medium rounded text-xs transition-colors ${
                activeTab === 'find' ? 'bg-[#2b579a] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Find
            </button>
            <button
              onClick={() => setActiveTab('replace')}
              className={`px-3 py-1 font-medium rounded text-xs transition-colors ${
                activeTab === 'replace' ? 'bg-[#2b579a] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Replace
            </button>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Find and Replace"
            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Find what:</label>
            <div className="relative">
              <input
                type="text"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFindNext()}
                placeholder="Enter search term..."
                autoFocus
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#2b579a] focus:ring-1 focus:ring-[#2b579a]"
              />
              <Search className="w-4 h-4 absolute left-2.5 top-2 text-slate-400" />
            </div>
          </div>

          {activeTab === 'replace' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Replace with:</label>
              <div className="relative">
                <input
                  type="text"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="Enter replacement..."
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#2b579a] focus:ring-1 focus:ring-[#2b579a]"
                />
                <Replace className="w-4 h-4 absolute left-2.5 top-2 text-slate-400" />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="matchCaseCheckbox"
              checked={matchCase}
              onChange={(e) => setMatchCase(e.target.checked)}
              className="rounded text-[#2b579a] focus:ring-[#2b579a]"
            />
            <label htmlFor="matchCaseCheckbox" className="text-xs text-slate-600 select-none cursor-pointer">
              Match case
            </label>
          </div>

          {statusMessage && (
            <div className="text-xs font-medium text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
              {statusMessage}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
          <div className="flex gap-2">
            <button
              onClick={handleFindNext}
              className="px-3 py-1.5 bg-[#2b579a] text-white text-xs font-medium rounded hover:bg-[#1e3f70] transition-colors shadow-xs"
            >
              Find Next
            </button>
            {activeTab === 'replace' && (
              <>
                <button
                  onClick={handleReplaceOnce}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-300 transition-colors"
                >
                  Replace
                </button>
                <button
                  onClick={handleReplaceAll}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-300 transition-colors"
                >
                  Replace All
                </button>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-slate-300 text-slate-600 text-xs font-medium rounded hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
