import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import FontFamily from '@tiptap/extension-font-family';

import {
  DocumentRecord,
  EditorViewMode,
  PageSetup,
  ThemeSettings,
  DrawingStroke,
} from '../../types/document';
import { getPageDimensions } from '../../utils/documentLogic';
import { DrawingCanvas } from './DrawingCanvas';

interface DocumentCanvasProps {
  document: DocumentRecord;
  content: string;
  onChangeContent: (html: string) => void;
  viewMode: EditorViewMode;
  zoom: number;
  showGridlines: boolean;
  showFormattingMarks: boolean;
  isReadOnly: boolean;
  activeDrawingTool: 'pen' | 'highlighter' | 'eraser' | null;
  drawingColor: string;
  drawingWidth: number;
  drawingStrokes: DrawingStroke[];
  onUpdateDrawingStrokes: (strokes: DrawingStroke[]) => void;
  onEditorReady: (editor: any) => void;
  onPageCountChange: (count: number) => void;
  onSelectionChange?: () => void;
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({
  document: docRecord,
  content,
  onChangeContent,
  viewMode,
  zoom,
  showGridlines,
  showFormattingMarks,
  isReadOnly,
  activeDrawingTool,
  drawingColor,
  drawingWidth,
  drawingStrokes,
  onUpdateDrawingStrokes,
  onEditorReady,
  onPageCountChange,
  onSelectionChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);

  const { width: pageWidth, height: pageHeight } = getPageDimensions(
    docRecord.pageSetup.paperSize,
    docRecord.pageSetup.orientation
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        dropcursor: { color: '#2b579a', width: 2 },
        underline: false,
        link: false,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'auraword-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        allowBase64: true,
        inline: true,
        HTMLAttributes: {
          class: 'auraword-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#2b579a] underline cursor-pointer',
        },
      }),
      Subscript,
      Superscript,
      FontFamily,
    ],
    content,
    editable: !isReadOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChangeContent(html);
      estimatePagination();
    },
    onSelectionUpdate: () => {
      onSelectionChange?.();
    },
  });

  // Share editor ref with unmount cleanup
  useEffect(() => {
    if (editor && !editor.isDestroyed && editor.view) {
      onEditorReady(editor);
      estimatePagination();
    }
    return () => {
      onEditorReady(null);
    };
  }, [editor]);

  // Keep editor editable state synced
  useEffect(() => {
    if (editor && !editor.isDestroyed && editor.view) {
      editor.setEditable(!isReadOnly);
    }
  }, [editor, isReadOnly]);

  // Sync external content changes safely (e.g. Mail Merge preview or loading documents)
  useEffect(() => {
    if (editor && !editor.isDestroyed && editor.view && content !== editor.getHTML()) {
      try {
        editor.commands.setContent(content, { emitUpdate: false });
        estimatePagination();
      } catch (err) {
        console.warn('Could not set editor content:', err);
      }
    }
  }, [content, editor]);

  // Estimate page count based on content height
  const estimatePagination = () => {
    if (!containerRef.current) return;
    const contentEl = containerRef.current.querySelector('.ProseMirror');
    if (!contentEl) return;

    // Inner usable page height
    const innerHeight = pageHeight - (docRecord.pageSetup.margins.top + docRecord.pageSetup.margins.bottom) * 96;
    const scrollHeight = contentEl.scrollHeight;

    // Check for explicit page breaks
    const pageBreaks = contentEl.querySelectorAll('.word-page-break, hr').length;

    const estimatedPages = Math.max(1, Math.ceil(scrollHeight / Math.max(200, innerHeight)) + pageBreaks);
    setPageCount(estimatedPages);
    onPageCountChange(estimatedPages);
  };

  useEffect(() => {
    estimatePagination();
  }, [content, docRecord.pageSetup, pageHeight]);

  // Handle drag and drop images
  const handleDrop = (e: React.DragEvent) => {
    if (!editor || isReadOnly) return;
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      e.preventDefault();
      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result as string }).run();
      };
      reader.readAsDataURL(files[0]);
    }
  };

  // Convert margins to px
  const marginTopPx = docRecord.pageSetup.margins.top * 96;
  const marginBottomPx = docRecord.pageSetup.margins.bottom * 96;
  const marginLeftPx = docRecord.pageSetup.margins.left * 96;
  const marginRightPx = docRecord.pageSetup.margins.right * 96;

  // Format footer page number
  const renderPageNumber = (pageIndex: number) => {
    const total = pageCount;
    if (docRecord.pageSetup.pageNumberFormat === 'roman') {
      const toRoman = (num: number) => ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'][num - 1] || num.toString();
      return toRoman(pageIndex);
    }
    if (docRecord.pageSetup.pageNumberFormat === 'pageOfTotal') {
      return `Page ${pageIndex} of ${total}`;
    }
    return pageIndex.toString();
  };

  return (
    <div
      ref={containerRef}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`min-h-full w-full py-8 px-4 flex flex-col items-center select-text transition-colors ${
        viewMode === 'read' ? 'bg-[#f4efe8]' : 'bg-[#e6e9ed]'
      }`}
    >
      <div
        id="auraword-pages-container"
        className="flex flex-col items-center gap-8 relative transition-transform duration-100 ease-out"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
        }}
      >
        {/* Render simulated pages */}
        {Array.from({ length: pageCount }).map((_, pageIdx) => {
          const currentPageNum = pageIdx + 1;
          const isFirstPage = currentPageNum === 1;
          const showHeaderThisPage = docRecord.pageSetup.showHeaderFooter && (!docRecord.pageSetup.differentFirstPage || !isFirstPage);
          const showFooterThisPage = docRecord.pageSetup.showHeaderFooter;

          return (
            <div
              key={currentPageNum}
              className={`relative bg-white shadow-xl transition-all ${
                viewMode === 'web'
                  ? 'w-full max-w-4xl min-h-screen rounded-none'
                  : 'rounded-xs border border-slate-300'
              } ${
                docRecord.theme.pageBorder === 'box'
                  ? 'border-2 border-slate-800'
                  : docRecord.theme.pageBorder === 'shadow'
                  ? 'shadow-2xl'
                  : docRecord.theme.pageBorder === 'double'
                  ? 'border-4 border-double border-slate-700'
                  : ''
              }`}
              style={{
                width: viewMode === 'web' ? '100%' : `${pageWidth}px`,
                minHeight: viewMode === 'web' ? 'auto' : `${pageHeight}px`,
                backgroundColor: docRecord.theme.pageColor,
              }}
            >
              {/* Optional Gridlines Background */}
              {showGridlines && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: 'radial-gradient(#2b579a 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                  }}
                />
              )}

              {/* Watermark */}
              {docRecord.theme.watermark && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 overflow-hidden">
                  <span className="text-8xl font-black text-slate-300/40 uppercase tracking-widest -rotate-45 transform">
                    {docRecord.theme.watermark}
                  </span>
                </div>
              )}

              {/* Page Header Area */}
              {showHeaderThisPage && viewMode === 'print' && (
                <div
                  className="absolute top-0 left-0 right-0 px-12 pt-5 pb-2 text-[11px] text-slate-400 border-b border-transparent hover:border-slate-300 flex justify-between items-center z-10"
                  style={{ paddingLeft: `${marginLeftPx}px`, paddingRight: `${marginRightPx}px` }}
                >
                  <span className="font-semibold text-slate-500 truncate max-w-xs">
                    {docRecord.pageSetup.headerText || docRecord.title}
                  </span>
                  <span>{new Date(docRecord.updatedAt).toLocaleDateString()}</span>
                </div>
              )}

              {/* TipTap Rich Text ProseMirror Container (rendered on page 1) */}
              {pageIdx === 0 && (
                <div
                  className="relative z-10 auraword-editor-area"
                  style={{
                    paddingTop: viewMode === 'web' ? '30px' : `${marginTopPx}px`,
                    paddingBottom: viewMode === 'web' ? '30px' : `${marginBottomPx}px`,
                    paddingLeft: viewMode === 'web' ? '30px' : `${marginLeftPx}px`,
                    paddingRight: viewMode === 'web' ? '30px' : `${marginRightPx}px`,
                    fontFamily: docRecord.theme.fontFamily,
                    lineHeight: docRecord.theme.lineSpacing,
                  }}
                >
                  <EditorContent editor={editor} />
                </div>
              )}

              {/* Subsequent page content filler */}
              {pageIdx > 0 && (
                <div
                  className="relative z-10 auraword-editor-area flex items-center justify-center text-slate-300 italic text-sm"
                  style={{
                    paddingTop: `${marginTopPx}px`,
                    paddingBottom: `${marginBottomPx}px`,
                    paddingLeft: `${marginLeftPx}px`,
                    paddingRight: `${marginRightPx}px`,
                    minHeight: `${pageHeight - marginTopPx - marginBottomPx}px`,
                  }}
                >
                  <p>Page {currentPageNum} content continues smoothly from above...</p>
                </div>
              )}

              {/* Drawing Overlay Layer */}
              <DrawingCanvas
                width={pageWidth}
                height={pageHeight}
                activeTool={activeDrawingTool}
                strokeColor={drawingColor}
                strokeWidth={drawingWidth}
                strokes={drawingStrokes}
                onUpdateStrokes={onUpdateDrawingStrokes}
              />

              {/* Page Footer Area */}
              {showFooterThisPage && viewMode === 'print' && (
                <div
                  className="absolute bottom-0 left-0 right-0 px-12 pb-5 pt-2 text-[11px] text-slate-400 border-t border-transparent hover:border-slate-300 flex justify-between items-center z-10"
                  style={{ paddingLeft: `${marginLeftPx}px`, paddingRight: `${marginRightPx}px` }}
                >
                  <span className="truncate max-w-xs">{docRecord.pageSetup.footerText}</span>
                  <span className="font-semibold text-slate-600">
                    {renderPageNumber(currentPageNum)}
                  </span>
                </div>
              )}

              {/* Page Break Label / Indicator */}
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-400 bg-slate-200/80 px-2 py-0.5 rounded shadow-2xs select-none pointer-events-none">
                Page {currentPageNum} of {pageCount}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
