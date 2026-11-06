import React, { useState } from 'react';
import {
  Maximize2,
  FileSpreadsheet,
  Columns as ColumnsIcon,
  Scissors,
  Hash,
  ChevronDown,
  Layers,
  Check,
} from 'lucide-react';
import { PageSetup, PaperSize, PageOrientation, PageMargins } from '../../types/document';

interface LayoutTabProps {
  pageSetup: PageSetup;
  onUpdatePageSetup: (setup: Partial<PageSetup>) => void;
  onInsertPageBreak: () => void;
}

const MARGIN_PRESETS: { name: string; desc: string; margins: PageMargins }[] = [
  { name: 'Normal', desc: 'Top: 1", Bottom: 1", Left: 1", Right: 1"', margins: { top: 1, bottom: 1, left: 1, right: 1 } },
  { name: 'Narrow', desc: 'Top: 0.5", Bottom: 0.5", Left: 0.5", Right: 0.5"', margins: { top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 } },
  { name: 'Moderate', desc: 'Top: 1", Bottom: 1", Left: 0.75", Right: 0.75"', margins: { top: 1, bottom: 1, left: 0.75, right: 0.75 } },
  { name: 'Wide', desc: 'Top: 1", Bottom: 1", Left: 2", Right: 2"', margins: { top: 1, bottom: 1, left: 2, right: 2 } },
];

export const LayoutTab: React.FC<LayoutTabProps> = ({
  pageSetup,
  onUpdatePageSetup,
  onInsertPageBreak,
}) => {
  const [showMarginsMenu, setShowMarginsMenu] = useState(false);
  const [showOrientationMenu, setShowOrientationMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);

  return (
    <div className="flex items-stretch gap-1 px-2 py-1 select-none text-slate-700 overflow-x-auto">
      {/* 1. Page Setup Group */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-1">
          {/* Margins */}
          <div className="relative">
            <button
              onClick={() => setShowMarginsMenu(!showMarginsMenu)}
              className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
              title="Page Margins"
            >
              <Maximize2 className="w-5 h-5 text-[#2b579a]" />
              <div className="flex items-center text-[10px] mt-0.5 font-medium">
                <span>Margins</span>
                <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
              </div>
            </button>
            {showMarginsMenu && (
              <div
                className="absolute left-0 top-full mt-1 bg-white border border-slate-300 shadow-xl rounded-lg py-1 z-40 w-56 text-xs"
                onClick={() => setShowMarginsMenu(false)}
              >
                {MARGIN_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => onUpdatePageSetup({ margins: preset.margins })}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 flex flex-col"
                  >
                    <span className="font-semibold text-slate-800">{preset.name}</span>
                    <span className="text-[10px] text-slate-500">{preset.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Orientation */}
          <div className="relative">
            <button
              onClick={() => setShowOrientationMenu(!showOrientationMenu)}
              className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-16"
              title="Page Orientation"
            >
              <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
              <div className="flex items-center text-[10px] mt-0.5 font-medium">
                <span className="capitalize">{pageSetup.orientation}</span>
                <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
              </div>
            </button>
            {showOrientationMenu && (
              <div
                className="absolute left-0 top-full mt-1 bg-white border border-slate-300 shadow-xl rounded-lg py-1 z-40 w-36 text-xs"
                onClick={() => setShowOrientationMenu(false)}
              >
                <button
                  onClick={() => onUpdatePageSetup({ orientation: 'portrait' })}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center justify-between ${
                    pageSetup.orientation === 'portrait' ? 'font-bold text-[#2b579a]' : ''
                  }`}
                >
                  <span>Portrait</span>
                  {pageSetup.orientation === 'portrait' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => onUpdatePageSetup({ orientation: 'landscape' })}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center justify-between ${
                    pageSetup.orientation === 'landscape' ? 'font-bold text-[#2b579a]' : ''
                  }`}
                >
                  <span>Landscape</span>
                  {pageSetup.orientation === 'landscape' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Paper Size */}
          <div className="relative">
            <button
              onClick={() => setShowSizeMenu(!showSizeMenu)}
              className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
              title="Paper Size"
            >
              <span className="font-bold text-xs text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300">
                {pageSetup.paperSize}
              </span>
              <div className="flex items-center text-[10px] mt-1 font-medium">
                <span>Size</span>
                <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
              </div>
            </button>
            {showSizeMenu && (
              <div
                className="absolute left-0 top-full mt-1 bg-white border border-slate-300 shadow-xl rounded-lg py-1 z-40 w-44 text-xs"
                onClick={() => setShowSizeMenu(false)}
              >
                {[
                  { id: 'Letter', label: 'Letter (8.5" × 11")' },
                  { id: 'A4', label: 'A4 (210 × 297 mm)' },
                  { id: 'Legal', label: 'Legal (8.5" × 14")' },
                  { id: 'A3', label: 'A3 (297 × 420 mm)' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onUpdatePageSetup({ paperSize: s.id as PaperSize })}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center justify-between ${
                      pageSetup.paperSize === s.id ? 'font-bold text-[#2b579a]' : ''
                    }`}
                  >
                    <span>{s.label}</span>
                    {pageSetup.paperSize === s.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Columns */}
          <div className="relative">
            <button
              onClick={() => setShowColumnsMenu(!showColumnsMenu)}
              className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
              title="Columns layout"
            >
              <ColumnsIcon className="w-5 h-5 text-amber-600" />
              <div className="flex items-center text-[10px] mt-0.5 font-medium">
                <span>{pageSetup.columns} Col</span>
                <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
              </div>
            </button>
            {showColumnsMenu && (
              <div
                className="absolute left-0 top-full mt-1 bg-white border border-slate-300 shadow-xl rounded-lg py-1 z-40 w-36 text-xs"
                onClick={() => setShowColumnsMenu(false)}
              >
                {[1, 2, 3].map((cols) => (
                  <button
                    key={cols}
                    onClick={() => onUpdatePageSetup({ columns: cols as 1 | 2 | 3 })}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center justify-between ${
                      pageSetup.columns === cols ? 'font-bold text-[#2b579a]' : ''
                    }`}
                  >
                    <span>{cols === 1 ? 'One' : cols === 2 ? 'Two' : 'Three'} Columns</span>
                    {pageSetup.columns === cols && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Page Break */}
          <button
            onClick={onInsertPageBreak}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
            title="Insert Page Break"
          >
            <Scissors className="w-5 h-5 text-slate-600" />
            <span className="text-[10px] mt-0.5 font-medium">Breaks</span>
          </button>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Page Setup</span>
      </div>

      {/* 2. Header & Footer Layout */}
      <div className="flex flex-col items-center justify-between px-2 shrink-0">
        <div className="flex items-center gap-2 pt-1 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={pageSetup.showHeaderFooter}
              onChange={(e) => onUpdatePageSetup({ showHeaderFooter: e.target.checked })}
              className="rounded text-[#2b579a]"
            />
            <span className="text-[11px] text-slate-700 font-medium">Show Header/Footer</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={pageSetup.differentFirstPage}
              onChange={(e) => onUpdatePageSetup({ differentFirstPage: e.target.checked })}
              className="rounded text-[#2b579a]"
            />
            <span className="text-[11px] text-slate-700 font-medium">Different First Page</span>
          </label>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Header & Footer Options</span>
      </div>
    </div>
  );
};
