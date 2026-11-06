import React, { useState } from 'react';
import { X, Keyboard, Search } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string;
  action: string;
  category: 'File & App' | 'Formatting' | 'Navigation' | 'Editing' | 'Insert & Review';
}

const SHORTCUTS: ShortcutItem[] = [
  { keys: 'Ctrl + S', action: 'Save document to storage', category: 'File & App' },
  { keys: 'Ctrl + P', action: 'Print document / PDF Export', category: 'File & App' },
  { keys: 'Ctrl + O', action: 'Open document / Backstage', category: 'File & App' },
  { keys: 'Ctrl + N', action: 'Create a new document', category: 'File & App' },

  { keys: 'Ctrl + B', action: 'Bold selected text', category: 'Formatting' },
  { keys: 'Ctrl + I', action: 'Italicize selected text', category: 'Formatting' },
  { keys: 'Ctrl + U', action: 'Underline selected text', category: 'Formatting' },
  { keys: 'Ctrl + E', action: 'Center align text', category: 'Formatting' },
  { keys: 'Ctrl + L', action: 'Left align text', category: 'Formatting' },
  { keys: 'Ctrl + R', action: 'Right align text', category: 'Formatting' },
  { keys: 'Ctrl + J', action: 'Justify paragraph text', category: 'Formatting' },
  { keys: 'Ctrl + Shift + 7', action: 'Numbered list', category: 'Formatting' },
  { keys: 'Ctrl + Shift + 8', action: 'Bulleted list', category: 'Formatting' },

  { keys: 'Ctrl + Z', action: 'Undo last action', category: 'Editing' },
  { keys: 'Ctrl + Y', action: 'Redo last action', category: 'Editing' },
  { keys: 'Ctrl + A', action: 'Select all content', category: 'Editing' },
  { keys: 'Ctrl + F', action: 'Find in document', category: 'Editing' },
  { keys: 'Ctrl + H', action: 'Replace in document', category: 'Editing' },
  { keys: 'Ctrl + K', action: 'Insert hyperlink', category: 'Insert & Review' },

  { keys: 'Ctrl + Home', action: 'Move to beginning of document', category: 'Navigation' },
  { keys: 'Ctrl + End', action: 'Move to end of document', category: 'Navigation' },
  { keys: 'Esc', action: 'Close dialogs, menus, and Backstage', category: 'Navigation' },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = SHORTCUTS.filter(
    s =>
      s.keys.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden text-slate-800 text-sm">
        <div className="flex items-center justify-between px-5 py-3 bg-[#2b579a] text-white">
          <div className="flex items-center gap-2 font-semibold">
            <Keyboard className="w-5 h-5" />
            <span>AuraWord Keyboard Shortcuts Reference</span>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1 hover:bg-white/20 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search shortcut (e.g. bold, print, align)..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#2b579a]"
              autoFocus
            />
            <Search className="w-4 h-4 absolute left-3 top-2 text-slate-400" />
          </div>
        </div>

        {/* List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold text-left">
                <th className="pb-2 w-36">Shortcut Key</th>
                <th className="pb-2">Action</th>
                <th className="pb-2 w-28 text-right">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2">
                    <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[11px] font-semibold text-slate-800 shadow-2xs">
                      {s.keys}
                    </kbd>
                  </td>
                  <td className="py-2 text-slate-700">{s.action}</td>
                  <td className="py-2 text-right text-slate-400 text-[10px] uppercase font-semibold">
                    {s.category}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-xs">
              No matching shortcuts found.
            </div>
          )}
        </div>

        <div className="flex justify-end px-5 py-2.5 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2b579a] text-white rounded text-xs font-semibold hover:bg-[#1e3f70]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
