import React from 'react';
import {
  FileText,
  BookOpen,
  Globe,
  ListTree,
  Ruler,
  Grid,
  Sidebar,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize2,
  Scan,
} from 'lucide-react';
import { EditorViewMode } from '../../types/document';

interface ViewTabProps {
  viewMode: EditorViewMode;
  onChangeViewMode: (mode: EditorViewMode) => void;
  showRuler: boolean;
  onToggleRuler: () => void;
  showGridlines: boolean;
  onToggleGridlines: () => void;
  showNavPane: boolean;
  onToggleNavPane: () => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoom100: () => void;
  onFitPageWidth: () => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

export const ViewTab: React.FC<ViewTabProps> = ({
  viewMode,
  onChangeViewMode,
  showRuler,
  onToggleRuler,
  showGridlines,
  onToggleGridlines,
  showNavPane,
  onToggleNavPane,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoom100,
  onFitPageWidth,
  isFocusMode,
  onToggleFocusMode,
}) => {
  return (
    <div className="flex items-stretch gap-1 px-2 py-1 select-none text-slate-700 overflow-x-auto">
      {/* 1. Document Views */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onChangeViewMode('print')}
            className={`flex flex-col items-center justify-center p-1 rounded transition-colors w-14 ${
              viewMode === 'print' ? 'bg-[#2b579a]/20 text-[#2b579a] font-semibold' : 'hover:bg-slate-200/70 text-slate-800'
            }`}
            title="Print Layout - Page-based view as printed"
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Print Layout</span>
          </button>

          <button
            onClick={() => onChangeViewMode('read')}
            className={`flex flex-col items-center justify-center p-1 rounded transition-colors w-14 ${
              viewMode === 'read' ? 'bg-[#2b579a]/20 text-[#2b579a] font-semibold' : 'hover:bg-slate-200/70 text-slate-800'
            }`}
            title="Read Mode - Optimized reading view"
          >
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span className="text-[10px] mt-0.5">Read Mode</span>
          </button>

          <button
            onClick={() => onChangeViewMode('web')}
            className={`flex flex-col items-center justify-center p-1 rounded transition-colors w-14 ${
              viewMode === 'web' ? 'bg-[#2b579a]/20 text-[#2b579a] font-semibold' : 'hover:bg-slate-200/70 text-slate-800'
            }`}
            title="Web Layout - Responsive continuous width"
          >
            <Globe className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] mt-0.5">Web Layout</span>
          </button>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Views</span>
      </div>

      {/* 2. Show Elements */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex flex-col gap-1 text-xs py-0.5">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showRuler}
              onChange={onToggleRuler}
              className="rounded text-[#2b579a]"
            />
            <span className="text-[11px] text-slate-700">Ruler</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showGridlines}
              onChange={onToggleGridlines}
              className="rounded text-[#2b579a]"
            />
            <span className="text-[11px] text-slate-700">Gridlines</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showNavPane}
              onChange={onToggleNavPane}
              className="rounded text-[#2b579a]"
            />
            <span className="text-[11px] text-slate-700">Navigation Pane</span>
          </label>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Show</span>
      </div>

      {/* 3. Zoom Group */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={onZoom100}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-12"
            title="Reset Zoom to 100%"
          >
            <span className="font-bold text-xs text-[#2b579a]">100%</span>
            <span className="text-[10px] mt-1 font-medium">Reset</span>
          </button>

          <button
            onClick={onZoomIn}
            className="p-1.5 hover:bg-slate-200/70 rounded text-slate-700"
            title="Zoom In (+10%)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono font-semibold px-1 text-slate-700">
            {Math.round(zoomLevel * 100)}%
          </span>

          <button
            onClick={onZoomOut}
            className="p-1.5 hover:bg-slate-200/70 rounded text-slate-700"
            title="Zoom Out (-10%)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={onFitPageWidth}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
            title="Fit to Page Width"
          >
            <Scan className="w-4 h-4 text-slate-600" />
            <span className="text-[10px] mt-0.5 font-medium">Page Width</span>
          </button>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Zoom</span>
      </div>

      {/* 4. Focus Mode */}
      <div className="flex flex-col items-center justify-between px-2 shrink-0">
        <button
          onClick={onToggleFocusMode}
          className={`flex flex-col items-center justify-center p-1 rounded transition-colors w-14 ${
            isFocusMode ? 'bg-amber-100 text-amber-900 font-semibold' : 'hover:bg-slate-200/70 text-slate-800'
          }`}
          title="Distraction-free Focus Mode"
        >
          <Maximize className="w-5 h-5 text-amber-600" />
          <span className="text-[10px] mt-0.5 font-medium">Focus</span>
        </button>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Focus</span>
      </div>
    </div>
  );
};
