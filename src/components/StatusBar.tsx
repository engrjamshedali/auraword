import React from 'react';
import {
  FileText,
  BookOpen,
  Globe,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { EditorViewMode, DocumentStats } from '../types/document';

interface StatusBarProps {
  currentPage: number;
  totalPages: number;
  stats: DocumentStats;
  viewMode: EditorViewMode;
  onChangeViewMode: (mode: EditorViewMode) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onOpenWordCount: () => void;
  trackingEnabled: boolean;
  onToggleTracking: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  currentPage,
  totalPages,
  stats,
  viewMode,
  onChangeViewMode,
  zoom,
  onZoomChange,
  onOpenWordCount,
  trackingEnabled,
  onToggleTracking,
}) => {
  return (
    <footer className="h-6 bg-[#2b579a] text-white flex items-center justify-between px-3 select-none text-[11px] shrink-0 font-sans border-t border-[#204479]">
      {/* Left items: Page, Words, Language, Proofing */}
      <div className="flex items-center gap-3">
        <button
          className="hover:bg-white/15 px-1.5 py-0.5 rounded transition-colors text-white/90 hover:text-white"
          title="Current Page"
        >
          Page {currentPage} of {totalPages}
        </button>

        <button
          onClick={onOpenWordCount}
          className="hover:bg-white/15 px-1.5 py-0.5 rounded transition-colors text-white/90 hover:text-white"
          title="Click to view detailed statistics"
        >
          {stats.words.toLocaleString()} words
        </button>

        <span className="hidden sm:inline text-white/70">
          English (United States)
        </span>

        <button
          onClick={onToggleTracking}
          className="hidden md:flex items-center gap-1 hover:bg-white/15 px-1.5 py-0.5 rounded transition-colors text-white/90"
          title="Toggle Track Changes"
        >
          <span>Track Changes:</span>
          <span className={trackingEnabled ? 'text-amber-300 font-bold' : 'text-white/60'}>
            {trackingEnabled ? 'On' : 'Off'}
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-1 text-emerald-300">
          <CheckCircle2 className="w-3 h-3" />
          <span className="text-[10px]">No proofing issues</span>
        </div>
      </div>

      {/* Right items: View Modes & Zoom Controls */}
      <div className="flex items-center gap-2">
        {/* View mode icons */}
        <div className="flex items-center gap-0.5 mr-2">
          <button
            onClick={() => onChangeViewMode('read')}
            className={`p-1 rounded transition-colors ${
              viewMode === 'read' ? 'bg-white/30 text-white' : 'hover:bg-white/15 text-white/80'
            }`}
            title="Read Mode"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeViewMode('print')}
            className={`p-1 rounded transition-colors ${
              viewMode === 'print' ? 'bg-white/30 text-white' : 'hover:bg-white/15 text-white/80'
            }`}
            title="Print Layout"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeViewMode('web')}
            className={`p-1 rounded transition-colors ${
              viewMode === 'web' ? 'bg-white/30 text-white' : 'hover:bg-white/15 text-white/80'
            }`}
            title="Web Layout"
          >
            <Globe className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
            className="hover:bg-white/15 p-0.5 rounded text-white/80 hover:text-white"
            title="Zoom Out"
          >
            <Minus className="w-3 h-3" />
          </button>

          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={zoom}
            onChange={(e) => onZoomChange(parseFloat(e.target.value))}
            className="hidden sm:inline-block w-20 h-1 bg-white/40 rounded-lg appearance-none cursor-pointer accent-white"
          />

          <button
            onClick={() => onZoomChange(Math.min(2.0, zoom + 0.1))}
            className="hover:bg-white/15 p-0.5 rounded text-white/80 hover:text-white"
            title="Zoom In"
          >
            <Plus className="w-3 h-3" />
          </button>

          <button
            onClick={() => onZoomChange(1.0)}
            className="w-10 text-right font-mono font-semibold hover:bg-white/15 px-1 py-0.5 rounded"
            title="Reset Zoom to 100%"
          >
            {Math.round(zoom * 100)}%
          </button>
        </div>
      </div>
    </footer>
  );
};
