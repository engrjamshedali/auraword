import React, { useState } from 'react';
import {
  ArrowLeft,
  Home,
  FilePlus,
  FolderOpen,
  Info,
  Save,
  Download,
  Printer,
  Share2,
  Settings,
  HelpCircle,
  Clock,
  Pin,
  Trash2,
  Copy,
  Check,
  FileText,
  ShieldCheck,
  Calendar,
  User,
} from 'lucide-react';
import { DocumentRecord } from '../../types/document';
import { TEMPLATES } from '../../services/storage';

interface BackstageViewProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc: DocumentRecord;
  recentDocs: DocumentRecord[];
  onOpenDoc: (id: string) => void;
  onNewDoc: (templateId: string) => void;
  onSaveDoc: () => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
  onExportHtml: () => void;
  onExportTxt: () => void;
  onPrint: () => void;
  onGoHomeDashboard: () => void;
  onUploadFile: () => void;
}

export const BackstageView: React.FC<BackstageViewProps> = ({
  isOpen,
  onClose,
  currentDoc,
  recentDocs,
  onOpenDoc,
  onNewDoc,
  onSaveDoc,
  onExportDocx,
  onExportPdf,
  onExportHtml,
  onExportTxt,
  onPrint,
  onGoHomeDashboard,
  onUploadFile,
}) => {
  const [activeMenu, setActiveMenu] = useState<'info' | 'new' | 'open' | 'saveAs' | 'print' | 'about'>('info');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#f3f2f1] flex select-none text-slate-800">
      {/* Left Backstage Navigation Column */}
      <div className="w-56 bg-[#2b579a] text-white flex flex-col justify-between p-3 shrink-0">
        <div className="space-y-1">
          {/* Back arrow button to return to editor */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2.5 w-full text-left font-semibold text-sm hover:bg-white/15 rounded-md mb-4 transition-colors"
          >
            <div className="w-6 h-6 rounded-full border border-white/60 flex items-center justify-center">
              <ArrowLeft className="w-3.5 h-3.5" />
            </div>
            <span>Return to Editor</span>
          </button>

          <button
            onClick={onGoHomeDashboard}
            className="flex items-center gap-2.5 px-3 py-2 w-full text-left text-xs font-medium hover:bg-white/15 rounded transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Home Dashboard</span>
          </button>

          <button
            onClick={() => setActiveMenu('new')}
            className={`flex items-center gap-2.5 px-3 py-2 w-full text-left text-xs font-medium rounded transition-colors ${
              activeMenu === 'new' ? 'bg-white/20 text-white font-semibold' : 'hover:bg-white/15 text-white/90'
            }`}
          >
            <FilePlus className="w-4 h-4" />
            <span>New Document</span>
          </button>

          <button
            onClick={() => setActiveMenu('open')}
            className={`flex items-center gap-2.5 px-3 py-2 w-full text-left text-xs font-medium rounded transition-colors ${
              activeMenu === 'open' ? 'bg-white/20 text-white font-semibold' : 'hover:bg-white/15 text-white/90'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Open</span>
          </button>

          <button
            onClick={() => setActiveMenu('info')}
            className={`flex items-center gap-2.5 px-3 py-2 w-full text-left text-xs font-medium rounded transition-colors ${
              activeMenu === 'info' ? 'bg-white/20 text-white font-semibold' : 'hover:bg-white/15 text-white/90'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Info</span>
          </button>

          <button
            onClick={() => {
              onSaveDoc();
              onClose();
            }}
            className="flex items-center gap-2.5 px-3 py-2 w-full text-left text-xs font-medium hover:bg-white/15 rounded transition-colors text-white/90"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>

          <button
            onClick={() => setActiveMenu('saveAs')}
            className={`flex items-center gap-2.5 px-3 py-2 w-full text-left text-xs font-medium rounded transition-colors ${
              activeMenu === 'saveAs' ? 'bg-white/20 text-white font-semibold' : 'hover:bg-white/15 text-white/90'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Save As / Export</span>
          </button>

          <button
            onClick={() => setActiveMenu('print')}
            className={`flex items-center gap-2.5 px-3 py-2 w-full text-left text-xs font-medium rounded transition-colors ${
              activeMenu === 'print' ? 'bg-white/20 text-white font-semibold' : 'hover:bg-white/15 text-white/90'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>

        {/* Bottom Options */}
        <div className="pt-4 border-t border-white/20 space-y-1">
          <button
            onClick={() => setActiveMenu('about')}
            className={`flex items-center gap-2.5 px-3 py-2 w-full text-left text-xs font-medium rounded transition-colors ${
              activeMenu === 'about' ? 'bg-white/20 text-white font-semibold' : 'hover:bg-white/15 text-white/90'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>About AuraWord</span>
          </button>
        </div>
      </div>

      {/* Right Backstage Content Area */}
      <div className="flex-1 bg-white p-8 overflow-y-auto">
        {/* 1. INFO TAB */}
        {activeMenu === 'info' && (
          <div className="max-w-4xl space-y-6">
            <h2 className="text-2xl font-light text-slate-800 border-b border-slate-200 pb-3">
              Document Information
            </h2>

            <div className="grid grid-cols-3 gap-6">
              {/* Document Overview card */}
              <div className="col-span-2 space-y-4">
                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-semibold text-base">
                    <FileText className="w-5 h-5 text-[#2b579a]" />
                    <span>{currentDoc.title}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Document is stored securely in browser IndexedDB with real-time autosave.
                  </p>
                </div>

                <div className="p-4 border border-slate-200 rounded-lg space-y-3">
                  <h4 className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Protect Document</span>
                  </h4>
                  <p className="text-xs text-slate-600">
                    Control what types of changes people can make to this document.
                  </p>
                  <div className="pt-1">
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold">
                      Full Read/Write Access Enabled
                    </span>
                  </div>
                </div>
              </div>

              {/* Metadata sidebar properties */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3 text-xs">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Properties</h4>
                
                <div>
                  <span className="text-slate-400 block text-[11px]">Size</span>
                  <span className="font-semibold text-slate-700">
                    {(new Blob([currentDoc.content]).size / 1024).toFixed(1)} KB
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Paper Size</span>
                  <span className="font-semibold text-slate-700">
                    {currentDoc.pageSetup.paperSize} ({currentDoc.pageSetup.orientation})
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Created</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(currentDoc.createdAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Last Modified</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(currentDoc.updatedAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Author</span>
                  <span className="font-semibold text-slate-700">{currentDoc.author}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. NEW TAB (TEMPLATES) */}
        {activeMenu === 'new' && (
          <div className="max-w-4xl space-y-6">
            <h2 className="text-2xl font-light text-slate-800 border-b border-slate-200 pb-3">
              New Document
            </h2>

            <div className="grid grid-cols-3 gap-4">
              {TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => {
                    onNewDoc(tmpl.id);
                    onClose();
                  }}
                  className="p-4 border border-slate-200 rounded-lg hover:border-[#2b579a] hover:shadow-md cursor-pointer transition-all bg-white group flex flex-col justify-between min-h-[160px]"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      {tmpl.category}
                    </span>
                    <h4 className="font-semibold text-slate-900 group-hover:text-[#2b579a] text-sm">
                      {tmpl.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {tmpl.description}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#2b579a] mt-3 block">
                    Create Document &rarr;
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. OPEN TAB */}
        {activeMenu === 'open' && (
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-2xl font-light text-slate-800">Open Document</h2>
              <button
                onClick={onUploadFile}
                className="px-4 py-1.5 bg-[#2b579a] text-white rounded text-xs font-semibold hover:bg-[#1e3f70] transition-colors shadow-xs"
              >
                Browse Device File (.docx, .txt, .html)
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Recent Documents ({recentDocs.length})
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-white">
                {recentDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      onOpenDoc(doc.id);
                      onClose();
                    }}
                    className="p-3 hover:bg-blue-50/60 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#2b579a]" />
                      <div>
                        <span className="font-semibold text-sm text-slate-900 block">{doc.title}</span>
                        <span className="text-xs text-slate-400">
                          Last edited: {new Date(doc.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-[#2b579a] font-medium">Open &rarr;</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. SAVE AS / EXPORT TAB */}
        {activeMenu === 'saveAs' && (
          <div className="max-w-4xl space-y-6">
            <h2 className="text-2xl font-light text-slate-800 border-b border-slate-200 pb-3">
              Save As & Export Formats
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {/* DOCX Export */}
              <div
                onClick={() => {
                  onExportDocx();
                  onClose();
                }}
                className="p-5 border border-slate-200 rounded-xl hover:border-[#2b579a] hover:shadow-lg cursor-pointer transition-all bg-white group flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-blue-100 text-[#2b579a] rounded-lg flex items-center justify-center font-bold text-lg shrink-0">
                  W
                </div>
                <div>
                  <h4 className="font-semibold text-base text-slate-900 group-hover:text-[#2b579a]">
                    Word Document (.docx)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Standard OpenXML document fully compatible with Microsoft Word 2016-2026, Office 365, and Google Docs.
                  </p>
                  <span className="text-xs font-semibold text-[#2b579a] mt-3 inline-block">
                    Download .docx file
                  </span>
                </div>
              </div>

              {/* PDF Export */}
              <div
                onClick={() => {
                  onExportPdf();
                  onClose();
                }}
                className="p-5 border border-slate-200 rounded-xl hover:border-red-600 hover:shadow-lg cursor-pointer transition-all bg-white group flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center font-bold text-lg shrink-0">
                  PDF
                </div>
                <div>
                  <h4 className="font-semibold text-base text-slate-900 group-hover:text-red-600">
                    PDF Document (.pdf)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Preserves original pagination, formatting, fonts, and images for professional distribution and printing.
                  </p>
                  <span className="text-xs font-semibold text-red-600 mt-3 inline-block">
                    Download .pdf file
                  </span>
                </div>
              </div>

              {/* HTML Export */}
              <div
                onClick={() => {
                  onExportHtml();
                  onClose();
                }}
                className="p-5 border border-slate-200 rounded-xl hover:border-emerald-600 hover:shadow-lg cursor-pointer transition-all bg-white group flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-lg shrink-0">
                  HTML
                </div>
                <div>
                  <h4 className="font-semibold text-base text-slate-900 group-hover:text-emerald-600">
                    Web Page (.html)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Self-contained web page with inline styling and responsive typographic layout.
                  </p>
                  <span className="text-xs font-semibold text-emerald-600 mt-3 inline-block">
                    Download .html file
                  </span>
                </div>
              </div>

              {/* TXT Export */}
              <div
                onClick={() => {
                  onExportTxt();
                  onClose();
                }}
                className="p-5 border border-slate-200 rounded-xl hover:border-slate-500 hover:shadow-lg cursor-pointer transition-all bg-white group flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center font-bold text-lg shrink-0">
                  TXT
                </div>
                <div>
                  <h4 className="font-semibold text-base text-slate-900 group-hover:text-slate-700">
                    Plain Text (.txt)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Unformatted plain text for legacy software, scripting, and lightweight data ingestion.
                  </p>
                  <span className="text-xs font-semibold text-slate-600 mt-3 inline-block">
                    Download .txt file
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. PRINT TAB */}
        {activeMenu === 'print' && (
          <div className="max-w-3xl space-y-6">
            <h2 className="text-2xl font-light text-slate-800 border-b border-slate-200 pb-3">
              Print Setup
            </h2>

            <div className="p-6 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold text-base text-slate-800">Printer Destination</h4>
                <p className="text-xs text-slate-500">
                  Sends full paginated layout to your operating system print dialog or Save as PDF.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => onPrint(), 300);
                }}
                className="px-6 py-2.5 bg-[#2b579a] text-white rounded-lg font-semibold text-sm hover:bg-[#1e3f70] transition-colors shadow-md flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        )}

        {/* 6. ABOUT TAB */}
        {activeMenu === 'about' && (
          <div className="max-w-2xl space-y-6">
            <h2 className="text-2xl font-light text-slate-800 border-b border-slate-200 pb-3">
              About AuraWord
            </h2>

            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2b579a] text-white rounded-md flex items-center justify-center font-black text-xl font-serif">
                  W
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">AuraWord Desktop-Class Word Processor</h3>
                  <p className="text-slate-400">Version 2026.1 &bull; Architecture: React + TipTap + IndexedDB</p>
                </div>
              </div>

              <p>
                AuraWord is built to reproduce the rich user experience, ribbon organization, and high-fidelity productivity of Microsoft Word in modern browsers.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                <h5 className="font-bold text-slate-800">Key Features:</h5>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Full 10-Tab Microsoft Word Ribbon layout</li>
                  <li>Real OpenXML DOCX export via Packer & import via Mammoth</li>
                  <li>Academic citation manager with APA, MLA, Chicago, and IEEE styles</li>
                  <li>Mail Merge workflow with CSV import and live record browsing</li>
                  <li>Collaborative track changes and threaded comments</li>
                  <li>Freehand drawing, highlighters, and mathematical equation editor</li>
                  <li>Local-first IndexedDB persistence with offline durability</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
