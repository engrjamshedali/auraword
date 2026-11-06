import React from 'react';
import { X, FileText, CheckCircle2 } from 'lucide-react';
import { DocumentStats } from '../../types/document';

interface WordCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: DocumentStats;
}

export const WordCountModal: React.FC<WordCountModalProps> = ({
  isOpen,
  onClose,
  stats,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden text-slate-800 text-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#2b579a] text-white">
          <div className="flex items-center gap-2 font-semibold">
            <FileText className="w-4 h-4" />
            <span>Word Count & Document Statistics</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Word Count"
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-y-2.5 text-xs text-slate-600 border-b border-slate-200 pb-4">
            <span className="text-slate-500 font-medium">Pages:</span>
            <span className="text-right font-bold text-slate-900">{stats.pages}</span>

            <span className="text-slate-500 font-medium">Words:</span>
            <span className="text-right font-bold text-slate-900">{stats.words.toLocaleString()}</span>

            <span className="text-slate-500 font-medium">Characters (no spaces):</span>
            <span className="text-right font-bold text-slate-900">{stats.charactersNoSpaces.toLocaleString()}</span>

            <span className="text-slate-500 font-medium">Characters (with spaces):</span>
            <span className="text-right font-bold text-slate-900">{stats.characters.toLocaleString()}</span>

            <span className="text-slate-500 font-medium">Paragraphs:</span>
            <span className="text-right font-bold text-slate-900">{stats.paragraphs}</span>
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <div className="flex justify-between items-center bg-blue-50 p-2.5 rounded border border-blue-100">
              <span className="text-blue-900 font-medium">Estimated Reading Time:</span>
              <span className="text-blue-700 font-bold">~{stats.readingTimeMinutes} min</span>
            </div>

            <div className="flex justify-between items-center bg-emerald-50 p-2.5 rounded border border-emerald-100">
              <div>
                <span className="text-emerald-900 font-medium block">Flesch Reading Ease:</span>
                <span className="text-[10px] text-emerald-600">
                  {stats.fleschScore >= 70 ? 'Easy to read' : stats.fleschScore >= 50 ? 'Standard' : 'Academic / Complex'}
                </span>
              </div>
              <span className="text-emerald-700 font-bold text-sm">{stats.fleschScore}/100</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-4 py-2.5 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2b579a] text-white text-xs font-semibold rounded hover:bg-[#1e3f70] transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
