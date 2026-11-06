import React from 'react';
import { Pen, Highlighter, Eraser, Trash2, Check } from 'lucide-react';

interface DrawTabProps {
  activeTool: 'pen' | 'highlighter' | 'eraser' | null;
  onSelectTool: (tool: 'pen' | 'highlighter' | 'eraser' | null) => void;
  strokeColor: string;
  onChangeColor: (color: string) => void;
  strokeWidth: number;
  onChangeWidth: (width: number) => void;
  onClearDrawing: () => void;
}

const DRAW_COLORS = ['#000000', '#2b579a', '#dc2626', '#16a34a', '#9333ea', '#d97706'];
const HIGHLIGHT_COLORS = ['#fef08a', '#bbf7d0', '#a5f3fc', '#fbcfe8'];

export const DrawTab: React.FC<DrawTabProps> = ({
  activeTool,
  onSelectTool,
  strokeColor,
  onChangeColor,
  strokeWidth,
  onChangeWidth,
  onClearDrawing,
}) => {
  return (
    <div className="flex items-stretch gap-1 px-2 py-1 select-none text-slate-700 overflow-x-auto">
      {/* 1. Tools */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onSelectTool(activeTool === 'pen' ? null : 'pen')}
            className={`flex flex-col items-center justify-center p-1 rounded transition-colors w-14 ${
              activeTool === 'pen' ? 'bg-[#2b579a]/20 text-[#2b579a] font-semibold border border-[#2b579a]/40' : 'hover:bg-slate-200/70 text-slate-800'
            }`}
            title="Ballpoint Pen"
          >
            <Pen className="w-5 h-5 text-[#2b579a]" />
            <span className="text-[10px] mt-0.5">Pen</span>
          </button>

          <button
            onClick={() => onSelectTool(activeTool === 'highlighter' ? null : 'highlighter')}
            className={`flex flex-col items-center justify-center p-1 rounded transition-colors w-14 ${
              activeTool === 'highlighter' ? 'bg-amber-100 text-amber-900 font-semibold border border-amber-300' : 'hover:bg-slate-200/70 text-slate-800'
            }`}
            title="Highlighter"
          >
            <Highlighter className="w-5 h-5 text-amber-500" />
            <span className="text-[10px] mt-0.5">Highlighter</span>
          </button>

          <button
            onClick={() => onSelectTool(activeTool === 'eraser' ? null : 'eraser')}
            className={`flex flex-col items-center justify-center p-1 rounded transition-colors w-14 ${
              activeTool === 'eraser' ? 'bg-slate-300 text-slate-900 font-semibold border border-slate-400' : 'hover:bg-slate-200/70 text-slate-800'
            }`}
            title="Eraser"
          >
            <Eraser className="w-5 h-5 text-slate-600" />
            <span className="text-[10px] mt-0.5">Eraser</span>
          </button>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Draw Tools</span>
      </div>

      {/* 2. Color Palette */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-1.5 pt-1">
          {(activeTool === 'highlighter' ? HIGHLIGHT_COLORS : DRAW_COLORS).map((color) => (
            <button
              key={color}
              onClick={() => onChangeColor(color)}
              className="w-5 h-5 rounded-full border border-slate-300 relative flex items-center justify-center hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            >
              {strokeColor === color && <Check className="w-3 h-3 text-white drop-shadow-xs" />}
            </button>
          ))}
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Color</span>
      </div>

      {/* 3. Thickness */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-1 pt-1.5">
          {[2, 4, 8, 14].map((w) => (
            <button
              key={w}
              onClick={() => onChangeWidth(w)}
              className={`p-1 rounded flex items-center justify-center w-7 h-7 border transition-colors ${
                strokeWidth === w ? 'border-[#2b579a] bg-blue-50' : 'border-slate-200 hover:bg-slate-100'
              }`}
              title={`Thickness ${w}px`}
            >
              <div
                className="bg-slate-800 rounded-full"
                style={{ width: `${w}px`, height: `${w}px` }}
              />
            </button>
          ))}
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Thickness</span>
      </div>

      {/* 4. Clear */}
      <div className="flex flex-col items-center justify-between px-2 shrink-0">
        <button
          onClick={onClearDrawing}
          className="flex flex-col items-center justify-center p-1 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded transition-colors w-14"
          title="Clear all drawing strokes"
        >
          <Trash2 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Clear Ink</span>
        </button>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Canvas</span>
      </div>
    </div>
  );
};
