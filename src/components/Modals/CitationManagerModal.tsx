import React, { useState } from 'react';
import { X, BookOpen, Plus, Trash2, Edit3, BookmarkPlus } from 'lucide-react';
import { CitationSource, CitationStyle } from '../../types/document';
import { formatCitation } from '../../utils/documentLogic';

interface CitationManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  citations: CitationSource[];
  activeStyle: CitationStyle;
  onUpdateCitations: (citations: CitationSource[]) => void;
  onChangeStyle: (style: CitationStyle) => void;
  onInsertBibliography: (formattedText: string) => void;
  onInsertInTextCitation: (citationRef: string) => void;
}

export const CitationManagerModal: React.FC<CitationManagerModalProps> = ({
  isOpen,
  onClose,
  citations,
  activeStyle,
  onUpdateCitations,
  onChangeStyle,
  onInsertBibliography,
  onInsertInTextCitation,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New citation form state
  const [formData, setFormData] = useState<Partial<CitationSource>>({
    type: 'book',
    authors: '',
    title: '',
    year: new Date().getFullYear().toString(),
    publisher: '',
    journal: '',
  });

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.authors || !formData.title) return;

    if (editingId) {
      const updated = citations.map(c => (c.id === editingId ? { ...c, ...(formData as CitationSource) } : c));
      onUpdateCitations(updated);
    } else {
      const newSource: CitationSource = {
        id: `cite-${Date.now()}`,
        key: (citations.length + 1).toString(),
        type: formData.type || 'book',
        authors: formData.authors || '',
        title: formData.title || '',
        year: formData.year || '',
        publisher: formData.publisher,
        journal: formData.journal,
      };
      onUpdateCitations([...citations, newSource]);
    }

    setIsAdding(false);
    setEditingId(null);
    setFormData({
      type: 'book',
      authors: '',
      title: '',
      year: new Date().getFullYear().toString(),
      publisher: '',
    });
  };

  const handleDelete = (id: string) => {
    onUpdateCitations(citations.filter(c => c.id !== id));
  };

  const handleGenerateBib = () => {
    if (citations.length === 0) return;
    const entries = citations.map(c => `<li>${formatCitation(c, activeStyle)}</li>`).join('');
    const bibHtml = `<h3>References (${activeStyle})</h3><ol>${entries}</ol>`;
    onInsertBibliography(bibHtml);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden text-slate-800 text-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#2b579a] text-white">
          <div className="flex items-center gap-2 font-semibold text-base">
            <BookOpen className="w-5 h-5" />
            <span>Source Manager & Citations</span>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1 hover:bg-white/20 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Style Selector */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-md">
            <div>
              <span className="font-semibold text-xs text-slate-700 block">Citation Style:</span>
              <span className="text-[11px] text-slate-500">Formatting standard for bibliographies & notes</span>
            </div>
            <select
              value={activeStyle}
              onChange={(e) => onChangeStyle(e.target.value as CitationStyle)}
              className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium bg-white focus:outline-none focus:ring-1 focus:ring-[#2b579a]"
            >
              <option value="APA">APA 7th Edition</option>
              <option value="MLA">MLA 9th Edition</option>
              <option value="Chicago">Chicago Manual of Style</option>
              <option value="IEEE">IEEE Reference Standard</option>
            </select>
          </div>

          {/* Source List */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Document Sources ({citations.length})
              </h4>
              {!isAdding && (
                <button
                  onClick={() => {
                    setIsAdding(true);
                    setEditingId(null);
                    setFormData({
                      type: 'book',
                      authors: '',
                      title: '',
                      year: new Date().getFullYear().toString(),
                    });
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 bg-[#2b579a] text-white text-xs font-medium rounded hover:bg-[#1e3f70] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Source</span>
                </button>
              )}
            </div>

            {citations.length === 0 && !isAdding ? (
              <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-xs">
                No citations or references added yet. Click &quot;New Source&quot; to add your first reference.
              </div>
            ) : (
              <div className="space-y-2">
                {citations.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 border border-slate-200 rounded hover:border-slate-300 bg-white flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-900">
                        {formatCitation(c, activeStyle)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Type: <span className="capitalize font-medium">{c.type}</span> &bull; Key: [{c.key}]
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        title="Insert In-Text Citation"
                        onClick={() => {
                          const refText = activeStyle === 'IEEE' ? `[${c.key}]` : `(${c.authors.split(',')[0]} ${c.year})`;
                          onInsertInTextCitation(refText);
                          onClose();
                        }}
                        className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[11px] font-medium transition-colors"
                      >
                        Insert Citation
                      </button>
                      <button
                        title="Delete source"
                        onClick={() => handleDelete(c.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add / Edit Form */}
          {isAdding && (
            <div className="p-4 border border-blue-200 bg-blue-50/50 rounded-lg space-y-3">
              <h5 className="text-xs font-bold text-slate-800">
                {editingId ? 'Edit Citation Source' : 'Add New Citation Source'}
              </h5>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Source Type:</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                  >
                    <option value="book">Book</option>
                    <option value="journal">Journal Article</option>
                    <option value="website">Website / Online</option>
                    <option value="conference">Conference Proceeding</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Year:</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                    placeholder="2026"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-medium text-slate-600 mb-1">Author(s):</label>
                  <input
                    type="text"
                    value={formData.authors}
                    onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                    placeholder="e.g. Lovelace, Ada or Smith, John & Taylor, Sarah"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-medium text-slate-600 mb-1">Title:</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                    placeholder="e.g. Foundations of Computing and Analytical Systems"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Publisher / Journal:</label>
                  <input
                    type="text"
                    value={formData.publisher || formData.journal || ''}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value, journal: e.target.value })}
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                    placeholder="e.g. Oxford University Press"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1 text-slate-600 border border-slate-300 rounded text-xs hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-[#2b579a] text-white rounded text-xs font-semibold hover:bg-[#1e3f70]"
                >
                  Save Source
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-200">
          <button
            onClick={handleGenerateBib}
            disabled={citations.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-xs"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>Insert Bibliography into Document</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-300 text-slate-600 text-xs font-medium rounded hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
