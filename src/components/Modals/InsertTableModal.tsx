import React, { useState } from 'react';
import { X, Table as TableIcon } from 'lucide-react';

interface InsertTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertTable: (rows: number, cols: number, withHeader: boolean) => void;
}

export const InsertTableModal: React.FC<InsertTableModalProps> = ({
  isOpen,
  onClose,
  onInsertTable,
}) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);
  const [withHeader, setWithHeader] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInsertTable(Math.max(1, rows), Math.max(1, cols), withHeader);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden text-slate-800 text-sm">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#2b579a] text-white">
          <div className="flex items-center gap-2 font-semibold">
            <TableIcon className="w-4 h-4" />
            <span>Insert Table</span>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1 hover:bg-white/20 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Number of columns:</label>
              <input
                type="number"
                min="1"
                max="12"
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-[#2b579a]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Number of rows:</label>
              <input
                type="number"
                min="1"
                max="30"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-[#2b579a]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="withHeaderCheck"
              checked={withHeader}
              onChange={(e) => setWithHeader(e.target.checked)}
              className="rounded text-[#2b579a] focus:ring-[#2b579a]"
            />
            <label htmlFor="withHeaderCheck" className="text-xs text-slate-600 cursor-pointer select-none">
              Include styled Header Row
            </label>
          </div>

          {/* Table preview grid */}
          <div className="border border-slate-200 rounded p-2 bg-slate-50 flex flex-col items-center justify-center min-h-[90px]">
            <div
              className="grid gap-1 max-w-[200px]"
              style={{ gridTemplateColumns: `repeat(${Math.min(cols, 6)}, 1fr)` }}
            >
              {Array.from({ length: Math.min(rows, 4) * Math.min(cols, 6) }).map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-4 rounded-xs border ${
                    i < Math.min(cols, 6) && withHeader
                      ? 'bg-blue-200 border-blue-400'
                      : 'bg-white border-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-slate-400 mt-2 font-mono">
              {cols} &times; {rows} Table Preview
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#2b579a] text-white rounded text-xs font-semibold hover:bg-[#1e3f70] shadow-xs"
            >
              Insert Table
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
