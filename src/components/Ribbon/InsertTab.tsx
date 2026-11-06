import React, { useState } from 'react';
import {
  FileText,
  FilePlus,
  Scissors,
  Table as TableIcon,
  Image as ImageIcon,
  Shapes,
  BarChart2,
  Link,
  Heading,
  Footprints,
  Type,
  Variable,
  Calendar,
  Minus,
  Sparkles,
  ChevronDown,
  Smile,
  Plus,
} from 'lucide-react';

interface InsertTabProps {
  onInsertPageBreak: () => void;
  onInsertBlankPage: () => void;
  onInsertCoverPage: (style: string) => void;
  onOpenTableModal: () => void;
  onInsertQuickTable: (rows: number, cols: number) => void;
  onOpenImageModal: () => void;
  onOpenChartModal: () => void;
  onOpenEquationModal: () => void;
  onInsertLink: () => void;
  onInsertDateTime: () => void;
  onInsertHorizontalRule: () => void;
  onInsertShape: (shapeType: string) => void;
  onInsertIcon: (iconName: string) => void;
  onInsertTextBox: () => void;
  onToggleHeaderFooter: () => void;
}

const COMMON_SYMBOLS_QUICK = ['©', '®', '™', '€', '£', '¥', '§', '¶', '•', '★', '✔', '➜'];

export const InsertTab: React.FC<InsertTabProps> = ({
  onInsertPageBreak,
  onInsertBlankPage,
  onInsertCoverPage,
  onOpenTableModal,
  onInsertQuickTable,
  onOpenImageModal,
  onOpenChartModal,
  onOpenEquationModal,
  onInsertLink,
  onInsertDateTime,
  onInsertHorizontalRule,
  onInsertShape,
  onInsertIcon,
  onInsertTextBox,
  onToggleHeaderFooter,
}) => {
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [hoverGrid, setHoverGrid] = useState({ r: 0, c: 0 });
  const [showCoverMenu, setShowCoverMenu] = useState(false);
  const [showShapesMenu, setShowShapesMenu] = useState(false);
  const [showSymbolsMenu, setShowSymbolsMenu] = useState(false);

  return (
    <div className="flex items-stretch gap-1 px-2 py-1 select-none text-slate-700 overflow-x-auto">
      {/* 1. Pages Group */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-1">
          {/* Cover Page */}
          <div className="relative">
            <button
              onClick={() => setShowCoverMenu(!showCoverMenu)}
              className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
              title="Add a professional cover page"
            >
              <FileText className="w-5 h-5 text-[#2b579a]" />
              <div className="flex items-center text-[10px] mt-0.5 font-medium">
                <span>Cover</span>
                <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
              </div>
            </button>
            {showCoverMenu && (
              <div
                className="absolute left-0 top-full mt-1 bg-white border border-slate-300 shadow-xl rounded py-1 z-40 w-44 text-xs"
                onClick={() => setShowCoverMenu(false)}
              >
                <button
                  onClick={() => onInsertCoverPage('modern')}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-100 font-medium"
                >
                  Modern Minimalist
                </button>
                <button
                  onClick={() => onInsertCoverPage('executive')}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-100 font-medium"
                >
                  Executive Corporate
                </button>
                <button
                  onClick={() => onInsertCoverPage('academic')}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-100 font-medium"
                >
                  Academic Thesis
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onInsertBlankPage}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
            title="Insert a blank page"
          >
            <FilePlus className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] mt-0.5 font-medium">Blank</span>
          </button>

          <button
            onClick={onInsertPageBreak}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
            title="Insert page break (Ctrl+Enter)"
          >
            <Scissors className="w-5 h-5 text-amber-600" />
            <span className="text-[10px] mt-0.5 font-medium">Page Break</span>
          </button>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Pages</span>
      </div>

      {/* 2. Tables Group */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="relative">
          <button
            onClick={() => setShowTablePicker(!showTablePicker)}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
            title="Insert or draw a table"
          >
            <TableIcon className="w-5 h-5 text-[#2b579a]" />
            <div className="flex items-center text-[10px] mt-0.5 font-medium">
              <span>Table</span>
              <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
            </div>
          </button>

          {/* Interactive Table Picker Grid Dropdown */}
          {showTablePicker && (
            <div
              className="absolute left-0 top-full mt-1 bg-white border border-slate-300 shadow-xl rounded-lg p-3 z-40 w-56"
              onMouseLeave={() => setHoverGrid({ r: 0, c: 0 })}
            >
              <div className="text-xs font-semibold text-slate-700 mb-2">
                {hoverGrid.r > 0 ? `${hoverGrid.c} × ${hoverGrid.r} Table` : 'Insert Table'}
              </div>

              {/* Grid 8x8 */}
              <div className="grid grid-cols-8 gap-1 mb-3">
                {Array.from({ length: 8 }).map((_, rowIdx) =>
                  Array.from({ length: 8 }).map((_, colIdx) => {
                    const isHighlighted = rowIdx < hoverGrid.r && colIdx < hoverGrid.c;
                    return (
                      <div
                        key={`${rowIdx}-${colIdx}`}
                        onMouseEnter={() => setHoverGrid({ r: rowIdx + 1, c: colIdx + 1 })}
                        onClick={() => {
                          onInsertQuickTable(rowIdx + 1, colIdx + 1);
                          setShowTablePicker(false);
                        }}
                        className={`w-4 h-4 rounded-xs border cursor-pointer transition-colors ${
                          isHighlighted ? 'bg-blue-300 border-[#2b579a]' : 'bg-slate-100 border-slate-300 hover:bg-slate-200'
                        }`}
                      />
                    );
                  })
                )}
              </div>

              <div className="border-t border-slate-200 pt-2">
                <button
                  onClick={() => {
                    setShowTablePicker(false);
                    onOpenTableModal();
                  }}
                  className="w-full text-left px-2 py-1 hover:bg-slate-100 rounded text-xs text-[#2b579a] font-medium flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Custom Table Dialog...</span>
                </button>
              </div>
            </div>
          )}
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Tables</span>
      </div>

      {/* 3. Illustrations Group */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenImageModal}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
            title="Insert pictures from device or web"
          >
            <ImageIcon className="w-5 h-5 text-sky-600" />
            <span className="text-[10px] mt-0.5 font-medium">Pictures</span>
          </button>

          {/* Shapes Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowShapesMenu(!showShapesMenu)}
              className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
              title="Insert predefined shapes"
            >
              <Shapes className="w-5 h-5 text-indigo-600" />
              <div className="flex items-center text-[10px] mt-0.5 font-medium">
                <span>Shapes</span>
                <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
              </div>
            </button>
            {showShapesMenu && (
              <div
                className="absolute left-0 top-full mt-1 bg-white border border-slate-300 shadow-xl rounded py-1 z-40 w-44 text-xs"
                onClick={() => setShowShapesMenu(false)}
              >
                <button onClick={() => onInsertShape('rectangle')} className="w-full text-left px-3 py-1.5 hover:bg-slate-100">
                  Rectangle
                </button>
                <button onClick={() => onInsertShape('rounded-rect')} className="w-full text-left px-3 py-1.5 hover:bg-slate-100">
                  Rounded Rectangle
                </button>
                <button onClick={() => onInsertShape('callout')} className="w-full text-left px-3 py-1.5 hover:bg-slate-100">
                  Speech Callout
                </button>
                <button onClick={() => onInsertShape('star')} className="w-full text-left px-3 py-1.5 hover:bg-slate-100">
                  5-Point Star
                </button>
                <button onClick={() => onInsertShape('arrow')} className="w-full text-left px-3 py-1.5 hover:bg-slate-100">
                  Block Arrow
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onOpenChartModal}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
            title="Insert Bar, Line, or Pie chart with live data"
          >
            <BarChart2 className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] mt-0.5 font-medium">Chart</span>
          </button>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Illustrations</span>
      </div>

      {/* 4. Links & Header/Footer */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={onInsertLink}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-12"
            title="Insert Hyperlink (Ctrl+K)"
          >
            <Link className="w-5 h-5 text-blue-600" />
            <span className="text-[10px] mt-0.5 font-medium">Link</span>
          </button>

          <button
            onClick={onToggleHeaderFooter}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-16"
            title="Configure Header and Footer"
          >
            <Heading className="w-5 h-5 text-purple-600" />
            <span className="text-[10px] mt-0.5 font-medium">Header/Footer</span>
          </button>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Links & Layout</span>
      </div>

      {/* 5. Text & Symbols */}
      <div className="flex flex-col items-center justify-between px-2 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={onInsertTextBox}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
            title="Insert floating or styled Text Box"
          >
            <Type className="w-5 h-5 text-slate-700" />
            <span className="text-[10px] mt-0.5 font-medium">Text Box</span>
          </button>

          <button
            onClick={onInsertDateTime}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
            title="Insert current date and time stamp"
          >
            <Calendar className="w-5 h-5 text-amber-600" />
            <span className="text-[10px] mt-0.5 font-medium">Date/Time</span>
          </button>

          <button
            onClick={onInsertHorizontalRule}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
            title="Insert divider line"
          >
            <Minus className="w-5 h-5 text-slate-500" />
            <span className="text-[10px] mt-0.5 font-medium">Divider</span>
          </button>

          <button
            onClick={onOpenEquationModal}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
            title="Insert mathematical equation and symbols"
          >
            <Variable className="w-5 h-5 text-[#2b579a]" />
            <span className="text-[10px] mt-0.5 font-medium">Equation</span>
          </button>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Text & Symbols</span>
      </div>
    </div>
  );
};
