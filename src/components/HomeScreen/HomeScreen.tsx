import React, { useState, useRef } from 'react';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Clock,
  MoreVertical,
  Copy,
  Trash2,
  Edit2,
  Upload,
  LayoutGrid,
  List,
  Sparkles,
  Database,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { DocumentRecord } from '../../types/document';
import { TEMPLATES } from '../../services/storage';

interface HomeScreenProps {
  documents: DocumentRecord[];
  onOpenDocument: (id: string) => void;
  onCreateNew: (templateId: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onImportFile: (file: File) => void;
  onClose?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  documents,
  onOpenDocument,
  onCreateNew,
  onDuplicate,
  onDelete,
  onTogglePin,
  onImportFile,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'pinned'>('all');
  const [activeMenuDocId, setActiveMenuDocId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'pinned') return matchesSearch && doc.isPinned;
    return matchesSearch;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2f1] text-slate-800 flex flex-col font-sans select-none">
      {/* Top Navigation Bar */}
      <header className="h-14 bg-[#2b579a] text-white flex items-center justify-between px-6 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded text-xs font-semibold mr-1 transition-colors"
              title="Return to current document"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Editor</span>
            </button>
          )}
          <div className="w-8 h-8 bg-white text-[#2b579a] rounded flex items-center justify-center font-black font-serif text-lg shadow-sm">
            W
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight leading-none">AuraWord</h1>
            <span className="text-[10px] text-white/70 font-normal">Document Processing Studio</span>
          </div>
        </div>

        {/* Search documents */}
        <div className="relative w-80 max-w-sm hidden sm:block">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full bg-white/15 placeholder-white/70 text-white pl-9 pr-3 py-1.5 rounded-lg text-xs focus:bg-white focus:text-slate-900 focus:placeholder-slate-400 focus:outline-none transition-all shadow-inner"
          />
          <Search className="w-4 h-4 absolute left-3 top-2 text-white/70 pointer-events-none" />
        </div>

        {/* Right action */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".docx,.html,.txt"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded text-xs font-semibold transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Open File</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-8 overflow-y-auto">
        {/* Templates Banner */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Start a new document
            </h2>
            <span className="text-xs text-[#2b579a] font-semibold hover:underline cursor-pointer">
              Template Gallery ({TEMPLATES.length})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                data-template={tmpl.id}
                onClick={() => onCreateNew(tmpl.id)}
                className="bg-white border border-slate-200 hover:border-[#2b579a] hover:shadow-md rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between group h-36"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2b579a] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    {tmpl.id === 'blank' ? <Plus className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </div>
                  <h3 className="font-semibold text-xs text-slate-800 group-hover:text-[#2b579a]">
                    {tmpl.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {tmpl.description}
                  </p>
                </div>
                <div className="text-[10px] text-[#2b579a] font-semibold flex items-center gap-1">
                  <span>Create</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent & Pinned Documents */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('all')}
                className={`pb-2 transition-colors relative ${
                  activeTab === 'all' ? 'text-[#2b579a] font-bold border-b-2 border-b-[#2b579a]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Recent Documents ({documents.length})
              </button>
              <button
                onClick={() => setActiveTab('pinned')}
                className={`pb-2 transition-colors relative ${
                  activeTab === 'pinned' ? 'text-[#2b579a] font-bold border-b-2 border-b-[#2b579a]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Pinned
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded text-slate-600">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white text-[#2b579a] shadow-xs' : 'hover:bg-slate-300/50'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-white text-[#2b579a] shadow-xs' : 'hover:bg-slate-300/50'}`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Documents Display */}
          {filteredDocs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 space-y-2">
              <FileText className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium text-slate-600">No documents found matching your filter.</p>
              <button
                onClick={() => onCreateNew('blank')}
                className="mt-2 px-4 py-1.5 bg-[#2b579a] text-white rounded text-xs font-semibold hover:bg-[#1e3f70]"
              >
                Create Blank Document
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  data-docid={doc.id}
                  onClick={() => onOpenDocument(doc.id)}
                  className="bg-white border border-slate-200 hover:border-[#2b579a] hover:shadow-md rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between h-48 relative group"
                >
                  {/* Top Bar inside card */}
                  <div className="flex items-start justify-between">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2b579a] flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onTogglePin(doc.id)}
                        className={`p-1 rounded hover:bg-slate-100 transition-colors ${
                          doc.isPinned ? 'text-amber-500 fill-amber-500' : 'text-slate-300 hover:text-slate-600'
                        }`}
                        title={doc.isPinned ? 'Unpin' : 'Pin to top'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      <div className="relative">
                        <button
                          onClick={() => setActiveMenuDocId(activeMenuDocId === doc.id ? null : doc.id)}
                          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {activeMenuDocId === doc.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 shadow-xl rounded-md py-1 z-30 w-36 text-xs">
                            <button
                              onClick={() => {
                                onDuplicate(doc.id);
                                setActiveMenuDocId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-2 text-slate-700"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Duplicate</span>
                            </button>
                            <button
                              onClick={() => {
                                onDelete(doc.id);
                                setActiveMenuDocId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-red-50 flex items-center gap-2 text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Document Title & Snippet */}
                  <div className="my-2">
                    <h3 className="font-semibold text-sm text-slate-800 line-clamp-1 group-hover:text-[#2b579a]">
                      {doc.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {doc.content.replace(/<[^>]*>/g, ' ').slice(0, 100) || 'Empty document'}
                    </p>
                  </div>

                  {/* Bottom Timestamp */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                    </span>
                    <span className="font-mono text-slate-500">
                      {(new Blob([doc.content]).size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  data-docid={doc.id}
                  onClick={() => onOpenDocument(doc.id)}
                  className="p-3 hover:bg-blue-50/50 cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#2b579a]" />
                    <div>
                      <h4 className="font-semibold text-sm text-slate-800 group-hover:text-[#2b579a]">
                        {doc.title}
                      </h4>
                      <span className="text-xs text-slate-400">
                        Edited: {new Date(doc.updatedAt).toLocaleString()} &bull; {doc.author}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onTogglePin(doc.id)}
                      className={`p-1.5 rounded hover:bg-slate-100 ${doc.isPinned ? 'text-amber-500' : 'text-slate-300'}`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDuplicate(doc.id)}
                      className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(doc.id)}
                      className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer info: Local storage status */}
        <footer className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>
              Storage: <strong>IndexedDB Active</strong> &bull; Total Documents: <strong>{documents.length}</strong>
            </span>
          </div>
          <div>AuraWord &bull; Complete Microsoft Word-Style Suite</div>
        </footer>
      </main>
    </div>
  );
};
