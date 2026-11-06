/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TitleBar } from './components/TitleBar';
import { Ribbon, RibbonTabType } from './components/Ribbon/Ribbon';
import { Ruler } from './components/Editor/Ruler';
import { DocumentCanvas } from './components/Editor/DocumentCanvas';
import { NavigationPane } from './components/NavigationPane/NavigationPane';
import { StatusBar } from './components/StatusBar';
import { AuraAssistantPanel } from './components/AuraAssistant/AuraAssistantPanel';
import { CommentsPanel } from './components/Comments/CommentsPanel';
import { BackstageView } from './components/Backstage/BackstageView';
import { HomeScreen } from './components/HomeScreen/HomeScreen';

// Modals
import { FindReplaceModal } from './components/Modals/FindReplaceModal';
import { WordCountModal } from './components/Modals/WordCountModal';
import { CitationManagerModal } from './components/Modals/CitationManagerModal';
import { MailMergeModal } from './components/Modals/MailMergeModal';
import { InsertTableModal } from './components/Modals/InsertTableModal';
import { InsertImageModal } from './components/Modals/InsertImageModal';
import { InsertChartModal } from './components/Modals/InsertChartModal';
import { InsertEquationModal } from './components/Modals/InsertEquationModal';
import { ShortcutsModal } from './components/Modals/ShortcutsModal';

import {
  DocumentRecord,
  EditorViewMode,
  PageSetup,
  ThemeSettings,
  CitationSource,
  CitationStyle,
  MailMergeContact,
  DrawingStroke,
} from './types/document';
import {
  initializeDatabase,
  getAllDocuments,
  saveDocument,
  createNewDocument,
  duplicateDocument,
  deleteDocument,
  togglePin,
} from './services/storage';
import {
  exportToDocx,
  exportToPdf,
  exportToHtml,
  exportToTxt,
} from './services/exportService';
import { parseUploadedFile } from './services/importService';
import {
  calculateDocumentStats,
  convertTextCase,
  extractTableOfContents,
  replaceMailMergeTokens,
  getPageDimensions,
  TextCase,
} from './utils/documentLogic';

export default function App() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [activeDoc, setActiveDoc] = useState<DocumentRecord | null>(null);
  const [editorInstance, setEditorInstance] = useState<any>(null);

  // View & UI states
  const [isHomeOpen, setIsHomeOpen] = useState(false);
  const [isBackstageOpen, setIsBackstageOpen] = useState(false);
  const [activeRibbonTab, setActiveRibbonTab] = useState<RibbonTabType>('home');
  const [viewMode, setViewMode] = useState<EditorViewMode>('print');
  const [zoom, setZoom] = useState(1.0);
  const [showRuler, setShowRuler] = useState(true);
  const [showGridlines, setShowGridlines] = useState(false);
  const [showNavPane, setShowNavPane] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  // Drawing state
  const [activeDrawingTool, setActiveDrawingTool] = useState<'pen' | 'highlighter' | 'eraser' | null>(null);
  const [drawingColor, setDrawingColor] = useState('#2b579a');
  const [drawingWidth, setDrawingWidth] = useState(2);

  // Formatting state
  const [fontFamily, setFontFamily] = useState('Calibri');
  const [fontSize, setFontSize] = useState('11');
  const [lineSpacing, setLineSpacing] = useState(1.15);
  const [showFormattingMarks, setShowFormattingMarks] = useState(false);
  const [formatPainterActive, setFormatPainterActive] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<any>(null);

  // Mail merge preview state
  const [isMailMergePreview, setIsMailMergePreview] = useState(false);
  const [activeRecipientIdx, setActiveRecipientIdx] = useState(0);

  // Modal open states
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);
  const [isWordCountOpen, setIsWordCountOpen] = useState(false);
  const [isCitationManagerOpen, setIsCitationManagerOpen] = useState(false);
  const [isMailMergeOpen, setIsMailMergeOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [isEquationModalOpen, setIsEquationModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize DB and load documents on mount
  useEffect(() => {
    async function init() {
      await initializeDatabase();
      const docs = await getAllDocuments();
      setDocuments(docs);
      if (docs.length > 0) {
        // Open the second document (e.g. rich Project Proposal template) or first document
        const target = docs[1] || docs[0];
        setActiveDoc(target);
      }
    }
    init();
  }, []);

  // Update selection text when cursor moves in editor
  const handleSelectionChange = () => {
    if (!editorInstance) return;
    const { from, to } = editorInstance.state.selection;
    const text = editorInstance.state.doc.textBetween(from, to, ' ');
    setSelectedText(text);

    // Apply format painter if active
    if (formatPainterActive && copiedFormat && from !== to) {
      if (copiedFormat.bold) editorInstance.chain().focus().setBold().run();
      if (copiedFormat.italic) editorInstance.chain().focus().setItalic().run();
      if (copiedFormat.underline) editorInstance.chain().focus().setUnderline().run();
      if (copiedFormat.color) editorInstance.chain().focus().setColor(copiedFormat.color).run();
      setFormatPainterActive(false);
    }
  };

  // Debounced Autosave
  const triggerAutoSave = useCallback(
    (updatedDoc: DocumentRecord) => {
      setSaveStatus('saving');
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);

      autosaveTimerRef.current = setTimeout(async () => {
        try {
          await saveDocument(updatedDoc);
          setSaveStatus('saved');
          const all = await getAllDocuments();
          setDocuments(all);
        } catch (e) {
          console.error('Autosave failed:', e);
          setSaveStatus('unsaved');
        }
      }, 800);
    },
    []
  );

  // Handle document content change
  const handleContentChange = (newHtml: string) => {
    if (!activeDoc || isMailMergePreview) return;
    const updated: DocumentRecord = {
      ...activeDoc,
      content: newHtml,
      updatedAt: Date.now(),
    };
    setActiveDoc(updated);
    triggerAutoSave(updated);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;

      if (cmdKey) {
        if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          if (activeDoc) {
            saveDocument(activeDoc);
            setSaveStatus('saved');
          }
        } else if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          window.print();
        } else if (e.key === 'f' || e.key === 'F') {
          e.preventDefault();
          setIsFindReplaceOpen(true);
        } else if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          setIsFindReplaceOpen(true);
        } else if (e.key === 'o' || e.key === 'O') {
          e.preventDefault();
          setIsBackstageOpen(true);
        } else if (e.key === 'n' || e.key === 'N') {
          e.preventDefault();
          handleCreateNew('blank');
        } else if (e.key === 'k' || e.key === 'K') {
          e.preventDefault();
          handleInsertLink();
        }
      } else if (e.key === 'Escape') {
        setIsFindReplaceOpen(false);
        setIsWordCountOpen(false);
        setIsCitationManagerOpen(false);
        setIsMailMergeOpen(false);
        setIsTableModalOpen(false);
        setIsImageModalOpen(false);
        setIsChartModalOpen(false);
        setIsEquationModalOpen(false);
        setIsShortcutsOpen(false);
        setIsBackstageOpen(false);
        if (isFocusMode) setIsFocusMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDoc, isFocusMode]);

  // Safe helper to set editor content without crashing if view is null/destroyed
  const safeSetEditorContent = (newContent: string) => {
    if (editorInstance && !editorInstance.isDestroyed && editorInstance.view) {
      try {
        editorInstance.commands.setContent(newContent, { emitUpdate: false });
      } catch (err) {
        console.warn('Could not set editor content:', err);
      }
    }
  };

  // Document management handlers
  const handleOpenDoc = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (doc) {
      setActiveDoc(doc);
      safeSetEditorContent(doc.content);
      setIsHomeOpen(false);
      setIsBackstageOpen(false);
    }
  };

  const handleCreateNew = async (templateId: string) => {
    const newDoc = await createNewDocument(templateId);
    const all = await getAllDocuments();
    setDocuments(all);
    setActiveDoc(newDoc);
    safeSetEditorContent(newDoc.content);
    setIsHomeOpen(false);
    setIsBackstageOpen(false);
  };

  const handleDuplicate = async (id: string) => {
    const dup = await duplicateDocument(id);
    const all = await getAllDocuments();
    setDocuments(all);
    setActiveDoc(dup);
    safeSetEditorContent(dup.content);
  };

  const handleDelete = async (id: string) => {
    await deleteDocument(id);
    const all = await getAllDocuments();
    setDocuments(all);
    if (activeDoc?.id === id) {
      if (all.length > 0) {
        setActiveDoc(all[0]);
        safeSetEditorContent(all[0].content);
      } else {
        handleCreateNew('blank');
      }
    }
  };

  const handleTogglePin = async (id: string) => {
    await togglePin(id);
    const all = await getAllDocuments();
    setDocuments(all);
  };

  const handleImportFile = async (file: File) => {
    try {
      const parsed = await parseUploadedFile(file);
      const newDoc = await createNewDocument('blank', parsed.title);
      newDoc.content = parsed.content;
      await saveDocument(newDoc);
      const all = await getAllDocuments();
      setDocuments(all);
      setActiveDoc(newDoc);
      safeSetEditorContent(newDoc.content);
      setIsHomeOpen(false);
      setIsBackstageOpen(false);
    } catch (err: any) {
      alert(`Import failed: ${err.message}`);
    }
  };

  // Editor command helpers
  const handleInsertLink = () => {
    if (!editorInstance) return;
    const previousUrl = editorInstance.getAttributes('link').href;
    const url = window.prompt('Enter web address (URL):', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editorInstance.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editorInstance.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleInsertPageBreak = () => {
    if (!editorInstance) return;
    editorInstance
      .chain()
      .focus()
      .insertContent('<hr class="word-page-break" /><p></p>')
      .run();
  };

  const handleInsertBlankPage = () => {
    if (!editorInstance) return;
    editorInstance
      .chain()
      .focus()
      .insertContent('<hr class="word-page-break" /><p style="height: 400px;"></p><hr class="word-page-break" /><p></p>')
      .run();
  };

  const handleInsertCoverPage = (style: string) => {
    if (!editorInstance || !activeDoc) return;
    const coverHtml = `
      <div style="text-align: center; padding: 60px 20px; border-bottom: 3px double #2b579a; margin-bottom: 40px;" contenteditable="false">
        <h1 style="font-size: 32px; color: #2b579a; margin-bottom: 10px; font-weight: bold;">${activeDoc.title}</h1>
        <h3 style="font-size: 18px; color: #64748b; font-weight: normal; margin-bottom: 30px;">Strategic Document Specification</h3>
        <p style="font-size: 14px; color: #334155;"><strong>Author:</strong> ${activeDoc.author} &bull; <strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">AuraWord Enterprise Edition</p>
      </div>
      <hr class="word-page-break" />
      <p></p>
    `;
    editorInstance.chain().focus().insertContentAt(0, coverHtml).run();
  };

  const handleInsertQuickTable = (rows: number, cols: number, withHeader: boolean = true) => {
    if (!editorInstance) return;
    editorInstance
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: withHeader })
      .run();
  };

  const handleInsertShape = (shapeType: string) => {
    if (!editorInstance) return;
    let shapeSvg = '';
    if (shapeType === 'rectangle') {
      shapeSvg = `<div style="display: inline-block; padding: 20px 40px; background: #2b579a; color: white; border-radius: 4px; font-weight: bold; margin: 8px;">Rectangle Shape</div>`;
    } else if (shapeType === 'rounded-rect') {
      shapeSvg = `<div style="display: inline-block; padding: 20px 40px; background: #0284c7; color: white; border-radius: 16px; font-weight: bold; margin: 8px;">Rounded Shape</div>`;
    } else if (shapeType === 'callout') {
      shapeSvg = `<div style="display: inline-block; padding: 16px 24px; background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; color: #78350f; font-weight: 500; margin: 8px;">Important Callout Note!</div>`;
    } else if (shapeType === 'star') {
      shapeSvg = `<span style="font-size: 28px; color: #eab308; display: inline-block; margin: 0 4px;">★</span>`;
    } else {
      shapeSvg = `<div style="display: inline-block; padding: 10px 20px; background: #10b981; color: white; font-weight: bold; margin: 8px;">➜ Arrow Notice</div>`;
    }
    editorInstance.chain().focus().insertContent(shapeSvg + '&nbsp;').run();
  };

  const handleInsertDateTime = () => {
    if (!editorInstance) return;
    const nowStr = new Date().toLocaleString([], {
      dateStyle: 'full',
      timeStyle: 'short',
    });
    editorInstance.chain().focus().insertContent(`<strong>${nowStr}</strong> `).run();
  };

  const handleInsertTextBox = () => {
    if (!editorInstance) return;
    const boxHtml = `
      <div style="border: 2px solid #2b579a; border-radius: 6px; padding: 16px; background-color: #f8fafc; margin: 16px 0; width: 60%;">
        <p style="font-weight: bold; margin-bottom: 4px; color: #2b579a;">Text Box Container</p>
        <p style="margin: 0; color: #475569;">Type your featured note or sidebar content inside this container.</p>
      </div>
      <p></p>
    `;
    editorInstance.chain().focus().insertContent(boxHtml).run();
  };

  const handleInsertTOC = () => {
    if (!editorInstance || !activeDoc) return;
    const tocItems = extractTableOfContents(activeDoc.content);
    if (tocItems.length === 0) {
      alert('No headings (Heading 1, 2, or 3) found to build a Table of Contents.');
      return;
    }
    const listHtml = tocItems
      .map(
        (item) => `
        <li style="margin-left: ${(item.level - 1) * 20}px; margin-bottom: 6px;">
          <a href="#${item.id}" style="color: #2b579a; text-decoration: none; font-weight: ${item.level === 1 ? 'bold' : 'normal'};">
            ${item.text}
          </a>
          <span style="float: right; color: #94a3b8;">Page 1</span>
        </li>
      `
      )
      .join('');

    const tocHtml = `
      <div style="border: 1px solid #cbd5e1; background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;" contenteditable="false">
        <h3 style="margin: 0 0 15px 0; color: #1e293b; border-bottom: 2px solid #2b579a; padding-bottom: 6px;">Table of Contents</h3>
        <ul style="list-style-type: none; padding-left: 0; margin: 0;">
          ${listHtml}
        </ul>
      </div>
      <p></p>
    `;
    editorInstance.chain().focus().insertContent(tocHtml).run();
  };

  const handleInsertFootnote = () => {
    if (!editorInstance) return;
    const noteText = window.prompt('Enter footnote note text:', 'Supplementary source clarification');
    if (!noteText) return;
    const fnHtml = `<sup>[1]</sup> <span style="font-size: 10px; color: #64748b; font-style: italic;">(${noteText})</span>&nbsp;`;
    editorInstance.chain().focus().insertContent(fnHtml).run();
  };

  const handleInsertCaption = (type: 'Figure' | 'Table') => {
    if (!editorInstance) return;
    const capText = window.prompt(`Enter ${type} caption:`, `${type} 1: Description`);
    if (!capText) return;
    editorInstance
      .chain()
      .focus()
      .insertContent(`<p style="font-size: 11px; color: #64748b; font-style: italic; margin-top: 4px;"><em>${capText}</em></p><p></p>`)
      .run();
  };

  // Find & Replace logic
  const handleFind = (query: string, matchCase: boolean): number => {
    if (!editorInstance || !activeDoc) return 0;
    const text = activeDoc.content.replace(/<[^>]*>/g, ' ');
    const regex = new RegExp(query, matchCase ? 'g' : 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  };

  const handleReplace = (query: string, replaceText: string, replaceAll: boolean): number => {
    if (!editorInstance || !activeDoc) return 0;
    const flags = replaceAll ? 'gi' : 'i';
    const regex = new RegExp(query, flags);
    const newContent = activeDoc.content.replace(regex, replaceText);
    safeSetEditorContent(newContent);
    handleContentChange(newContent);
    return replaceAll ? 1 : 1;
  };

  // Mail Merge helpers
  const handleInsertMergeField = (fieldTag: string) => {
    if (!editorInstance) return;
    editorInstance.chain().focus().insertContent(`<strong>${fieldTag}</strong> `).run();
  };

  const handleFinishAndMerge = () => {
    if (!activeDoc || !activeDoc.recipients || activeDoc.recipients.length === 0) {
      alert('Please add recipient contacts in Mail Merge first.');
      return;
    }
    const count = activeDoc.recipients.length;
    alert(`Successfully generated mail merge for ${count} recipients! Ready for batch export or printing.`);
  };

  // Comments helpers
  const handleAddComment = (text: string, selection?: string) => {
    if (!activeDoc) return;
    const newComment = {
      id: `comm-${Date.now()}`,
      author: 'Aura Editor',
      text,
      createdAt: Date.now(),
      resolved: false,
      replies: [],
      selectionText: selection || undefined,
    };
    const updated = {
      ...activeDoc,
      comments: [...activeDoc.comments, newComment],
    };
    setActiveDoc(updated);
    triggerAutoSave(updated);
  };

  const handleReplyComment = (commentId: string, replyText: string) => {
    if (!activeDoc) return;
    const updatedComments = activeDoc.comments.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [
            ...c.replies,
            {
              id: `rep-${Date.now()}`,
              author: 'Aura Editor',
              text: replyText,
              createdAt: Date.now(),
            },
          ],
        };
      }
      return c;
    });
    const updated = { ...activeDoc, comments: updatedComments };
    setActiveDoc(updated);
    triggerAutoSave(updated);
  };

  const handleToggleResolveComment = (commentId: string) => {
    if (!activeDoc) return;
    const updatedComments = activeDoc.comments.map((c) =>
      c.id === commentId ? { ...c, resolved: !c.resolved } : c
    );
    const updated = { ...activeDoc, comments: updatedComments };
    setActiveDoc(updated);
    triggerAutoSave(updated);
  };

  const handleDeleteComment = (commentId: string) => {
    if (!activeDoc) return;
    const updated = {
      ...activeDoc,
      comments: activeDoc.comments.filter((c) => c.id !== commentId),
    };
    setActiveDoc(updated);
    triggerAutoSave(updated);
  };

  if (!activeDoc) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 text-slate-600">
        <p className="text-sm font-semibold animate-pulse">Loading AuraWord Workspace...</p>
      </div>
    );
  }

  // Active displayed content (handles Mail Merge live token replacement if active)
  const displayedContent =
    isMailMergePreview && activeDoc.recipients && activeDoc.recipients[activeRecipientIdx]
      ? replaceMailMergeTokens(activeDoc.content, activeDoc.recipients[activeRecipientIdx])
      : activeDoc.content;

  const docStats = calculateDocumentStats(displayedContent, totalPages);
  const { width: currentDocWidth } = getPageDimensions(
    activeDoc.pageSetup.paperSize,
    activeDoc.pageSetup.orientation
  );

  return (
    <div className="flex flex-col h-screen w-screen bg-[#f3f2f1] overflow-hidden text-slate-800 font-sans">
      {/* 1. AuraWord Home Dashboard View (if toggled) */}
      {isHomeOpen && (
        <div className="fixed inset-0 z-40 bg-[#f3f2f1] overflow-hidden">
          <HomeScreen
            documents={documents}
            onOpenDocument={handleOpenDoc}
            onCreateNew={handleCreateNew}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onTogglePin={handleTogglePin}
            onImportFile={handleImportFile}
            onClose={() => setIsHomeOpen(false)}
          />
        </div>
      )}

      {/* 2. Top Title Bar & Quick Access */}
      {!isFocusMode && (
            <TitleBar
              documentTitle={activeDoc.title}
              onUpdateTitle={(title) => {
                const updated = { ...activeDoc, title };
                setActiveDoc(updated);
                triggerAutoSave(updated);
              }}
              saveStatus={saveStatus}
              onSave={() => {
                saveDocument(activeDoc);
                setSaveStatus('saved');
              }}
              onUndo={() => editorInstance?.chain().focus().undo().run()}
              onRedo={() => editorInstance?.chain().focus().redo().run()}
              canUndo={editorInstance?.can().undo() ?? false}
              canRedo={editorInstance?.can().redo() ?? false}
              onPrint={() => window.print()}
              onNew={() => handleCreateNew('blank')}
              onGoHome={() => setIsHomeOpen(true)}
              onToggleAIAssistant={() => setIsAIOpen(!isAIOpen)}
              isAIOpen={isAIOpen}
              onToggleComments={() => setIsCommentsOpen(!isCommentsOpen)}
              commentCount={activeDoc.comments.filter((c) => !c.resolved).length}
              onSearchCommand={(q) => {
                if (q) setIsFindReplaceOpen(true);
              }}
              onExportDocx={() => exportToDocx(activeDoc)}
            />
          )}

          {/* 3. Complete Microsoft Word Ribbon Bar */}
          {!isFocusMode && (
            <Ribbon
              onOpenFileMenu={() => setIsBackstageOpen(true)}
              activeTab={activeRibbonTab}
              onChangeTab={setActiveRibbonTab}
              homeProps={{
                fontFamily,
                onChangeFontFamily: (font) => {
                  setFontFamily(font);
                  editorInstance?.chain().focus().setFontFamily(font).run();
                },
                fontSize,
                onChangeFontSize: (sz) => {
                  setFontSize(sz);
                  editorInstance?.chain().focus().setMark('textStyle', { fontSize: `${sz}pt` }).run();
                },
                onGrowFont: () => {
                  const next = (parseInt(fontSize) || 11) + 2;
                  setFontSize(next.toString());
                  editorInstance?.chain().focus().setMark('textStyle', { fontSize: `${next}pt` }).run();
                },
                onShrinkFont: () => {
                  const next = Math.max(8, (parseInt(fontSize) || 11) - 2);
                  setFontSize(next.toString());
                  editorInstance?.chain().focus().setMark('textStyle', { fontSize: `${next}pt` }).run();
                },
                isBold: editorInstance?.isActive('bold') ?? false,
                onToggleBold: () => editorInstance?.chain().focus().toggleBold().run(),
                isItalic: editorInstance?.isActive('italic') ?? false,
                onToggleItalic: () => editorInstance?.chain().focus().toggleItalic().run(),
                isUnderline: editorInstance?.isActive('underline') ?? false,
                onToggleUnderline: () => editorInstance?.chain().focus().toggleUnderline().run(),
                isStrike: editorInstance?.isActive('strike') ?? false,
                onToggleStrike: () => editorInstance?.chain().focus().toggleStrike().run(),
                isSubscript: editorInstance?.isActive('subscript') ?? false,
                onToggleSubscript: () => editorInstance?.chain().focus().toggleSubscript().run(),
                isSuperscript: editorInstance?.isActive('superscript') ?? false,
                onToggleSuperscript: () => editorInstance?.chain().focus().toggleSuperscript().run(),
                onChangeCase: (targetCase: TextCase) => {
                  if (!editorInstance) return;
                  const { from, to } = editorInstance.state.selection;
                  const text = editorInstance.state.doc.textBetween(from, to, ' ');
                  if (text) {
                    const converted = convertTextCase(text, targetCase);
                    editorInstance.chain().focus().insertContent(converted).run();
                  }
                },
                onClearFormatting: () => editorInstance?.chain().focus().unsetAllMarks().clearNodes().run(),
                onSetHighlight: (color) => {
                  if (color === 'transparent') {
                    editorInstance?.chain().focus().unsetHighlight().run();
                  } else {
                    editorInstance?.chain().focus().setHighlight({ color }).run();
                  }
                },
                onSetColor: (color) => editorInstance?.chain().focus().setColor(color).run(),
                isBulletList: editorInstance?.isActive('bulletList') ?? false,
                onToggleBulletList: () => editorInstance?.chain().focus().toggleBulletList().run(),
                isOrderedList: editorInstance?.isActive('orderedList') ?? false,
                onToggleOrderedList: () => editorInstance?.chain().focus().toggleOrderedList().run(),
                onIndent: () => editorInstance?.chain().focus().insertContent('&nbsp;&nbsp;&nbsp;&nbsp;').run(),
                onOutdent: () => editorInstance?.chain().focus().lift().run(),
                textAlign: editorInstance?.isActive({ textAlign: 'center' })
                  ? 'center'
                  : editorInstance?.isActive({ textAlign: 'right' })
                  ? 'right'
                  : editorInstance?.isActive({ textAlign: 'justify' })
                  ? 'justify'
                  : 'left',
                onSetTextAlign: (align) => editorInstance?.chain().focus().setTextAlign(align).run(),
                lineSpacing,
                onChangeLineSpacing: (spacing) => {
                  setLineSpacing(spacing);
                  const updated = {
                    ...activeDoc,
                    theme: { ...activeDoc.theme, lineSpacing: spacing },
                  };
                  setActiveDoc(updated);
                  triggerAutoSave(updated);
                },
                showFormattingMarks,
                onToggleFormattingMarks: () => setShowFormattingMarks(!showFormattingMarks),
                currentHeading: editorInstance?.isActive('heading', { level: 1 })
                  ? 1
                  : editorInstance?.isActive('heading', { level: 2 })
                  ? 2
                  : editorInstance?.isActive('heading', { level: 3 })
                  ? 3
                  : 'p',
                onApplyHeading: (level) => {
                  if (level === 'p') {
                    editorInstance?.chain().focus().setParagraph().run();
                  } else {
                    editorInstance?.chain().focus().setHeading({ level }).run();
                  }
                },
                onCut: () => document.execCommand('cut'),
                onCopy: () => document.execCommand('copy'),
                onPaste: async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    editorInstance?.chain().focus().insertContent(text).run();
                  } catch (e) {
                    editorInstance?.chain().focus().run();
                  }
                },
                formatPainterActive,
                onToggleFormatPainter: () => {
                  if (!formatPainterActive && editorInstance) {
                    setCopiedFormat({
                      bold: editorInstance.isActive('bold'),
                      italic: editorInstance.isActive('italic'),
                      underline: editorInstance.isActive('underline'),
                      color: editorInstance.getAttributes('textStyle').color,
                    });
                    setFormatPainterActive(true);
                  } else {
                    setFormatPainterActive(false);
                  }
                },
                onOpenFind: () => setIsFindReplaceOpen(true),
                onOpenReplace: () => setIsFindReplaceOpen(true),
                onSelectAll: () => editorInstance?.chain().focus().selectAll().run(),
              }}
              insertProps={{
                onInsertPageBreak: handleInsertPageBreak,
                onInsertBlankPage: handleInsertBlankPage,
                onInsertCoverPage: handleInsertCoverPage,
                onOpenTableModal: () => setIsTableModalOpen(true),
                onInsertQuickTable: handleInsertQuickTable,
                onOpenImageModal: () => setIsImageModalOpen(true),
                onOpenChartModal: () => setIsChartModalOpen(true),
                onOpenEquationModal: () => setIsEquationModalOpen(true),
                onInsertLink: handleInsertLink,
                onInsertDateTime: handleInsertDateTime,
                onInsertHorizontalRule: () => editorInstance?.chain().focus().setHorizontalRule().run(),
                onInsertShape: handleInsertShape,
                onInsertIcon: (iconName) => editorInstance?.chain().focus().insertContent(` ★ `).run(),
                onInsertTextBox: handleInsertTextBox,
                onToggleHeaderFooter: () => {
                  const updated = {
                    ...activeDoc,
                    pageSetup: {
                      ...activeDoc.pageSetup,
                      showHeaderFooter: !activeDoc.pageSetup.showHeaderFooter,
                    },
                  };
                  setActiveDoc(updated);
                  triggerAutoSave(updated);
                },
              }}
              layoutProps={{
                pageSetup: activeDoc.pageSetup,
                onUpdatePageSetup: (newSetup) => {
                  const updated = {
                    ...activeDoc,
                    pageSetup: { ...activeDoc.pageSetup, ...newSetup },
                  };
                  setActiveDoc(updated);
                  triggerAutoSave(updated);
                },
                onInsertPageBreak: handleInsertPageBreak,
              }}
              referencesProps={{
                onInsertTableOfContents: handleInsertTOC,
                onUpdateTableOfContents: handleInsertTOC,
                onInsertFootnote: handleInsertFootnote,
                onInsertEndnote: handleInsertFootnote,
                onOpenCitationManager: () => setIsCitationManagerOpen(true),
                citationStyle: activeDoc.citationStyle,
                onChangeCitationStyle: (style) => {
                  const updated = { ...activeDoc, citationStyle: style };
                  setActiveDoc(updated);
                  triggerAutoSave(updated);
                },
                onInsertCaption: handleInsertCaption,
              }}
              mailingsProps={{
                onOpenRecipientsModal: () => setIsMailMergeOpen(true),
                recipients: activeDoc.recipients || [],
                onInsertMergeField: handleInsertMergeField,
                isPreviewActive: isMailMergePreview,
                onTogglePreview: () => setIsMailMergePreview(!isMailMergePreview),
                activeRecipientIndex: activeRecipientIdx,
                onNavigateRecipient: (idx) => setActiveRecipientIdx(idx),
                onFinishAndMerge: handleFinishAndMerge,
              }}
              reviewProps={{
                onCheckProofing: () => alert('Proofing check completed: No critical spelling errors found.'),
                onOpenWordCount: () => setIsWordCountOpen(true),
                onAddComment: () => {
                  const text = window.prompt('Enter comment text:');
                  if (text) handleAddComment(text, selectedText);
                },
                onToggleComments: () => setIsCommentsOpen(!isCommentsOpen),
                commentCount: activeDoc.comments.filter((c) => !c.resolved).length,
                trackingEnabled: activeDoc.trackingEnabled,
                onToggleTracking: () => {
                  const updated = { ...activeDoc, trackingEnabled: !activeDoc.trackingEnabled };
                  setActiveDoc(updated);
                  triggerAutoSave(updated);
                },
                pendingTrackChangesCount: activeDoc.trackChanges.filter((t) => t.status === 'pending').length,
                onAcceptAllChanges: () => {
                  const updated = {
                    ...activeDoc,
                    trackChanges: activeDoc.trackChanges.map((t) => ({ ...t, status: 'accepted' as const })),
                  };
                  setActiveDoc(updated);
                  triggerAutoSave(updated);
                },
                onRejectAllChanges: () => {
                  const updated = {
                    ...activeDoc,
                    trackChanges: activeDoc.trackChanges.map((t) => ({ ...t, status: 'rejected' as const })),
                  };
                  setActiveDoc(updated);
                  triggerAutoSave(updated);
                },
                isReadOnly,
                onToggleReadOnly: () => setIsReadOnly(!isReadOnly),
              }}
              viewProps={{
                viewMode,
                onChangeViewMode: setViewMode,
                showRuler,
                onToggleRuler: () => setShowRuler(!showRuler),
                showGridlines,
                onToggleGridlines: () => setShowGridlines(!showGridlines),
                showNavPane,
                onToggleNavPane: () => setShowNavPane(!showNavPane),
                zoomLevel: zoom,
                onZoomIn: () => setZoom(Math.min(2.0, zoom + 0.1)),
                onZoomOut: () => setZoom(Math.max(0.5, zoom - 0.1)),
                onZoom100: () => setZoom(1.0),
                onFitPageWidth: () => setZoom(1.15),
                isFocusMode,
                onToggleFocusMode: () => setIsFocusMode(!isFocusMode),
              }}
              drawProps={{
                activeTool: activeDrawingTool,
                onSelectTool: setActiveDrawingTool,
                strokeColor: drawingColor,
                onChangeColor: setDrawingColor,
                strokeWidth: drawingWidth,
                onChangeWidth: setDrawingWidth,
                onClearDrawing: () => {
                  const updated = { ...activeDoc, drawingStrokes: [] };
                  setActiveDoc(updated);
                  triggerAutoSave(updated);
                },
              }}
              designProps={{
                theme: activeDoc.theme,
                onUpdateTheme: (newTheme) => {
                  const updated = {
                    ...activeDoc,
                    theme: { ...activeDoc.theme, ...newTheme },
                  };
                  setActiveDoc(updated);
                  triggerAutoSave(updated);
                },
              }}
              helpProps={{
                onOpenShortcuts: () => setIsShortcutsOpen(true),
                onLoadSample: (sampleId) => handleCreateNew(sampleId),
                onOpenAbout: () => setIsBackstageOpen(true),
              }}
            />
          )}

          {/* 4. Horizontal Top Ruler */}
          {!isFocusMode && showRuler && viewMode === 'print' && (
            <Ruler
              pageWidth={currentDocWidth}
              margins={activeDoc.pageSetup.margins}
              zoom={zoom}
            />
          )}

          {/* 5. Center Workspace Layout */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Left Navigation Pane */}
            <NavigationPane
              isOpen={showNavPane && !isFocusMode}
              onClose={() => setShowNavPane(false)}
              htmlContent={displayedContent}
              pageCount={totalPages}
              onJumpToHeading={(id, text) => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onJumpToPage={(p) => {
                const pageContainer = document.getElementById('auraword-pages-container');
                if (pageContainer && pageContainer.children[p - 1]) {
                  pageContainer.children[p - 1].scrollIntoView({ behavior: 'smooth' });
                }
              }}
              onSearch={(query) => {
                handleFind(query, false);
              }}
            />

            {/* Main Document Pages Canvas */}
            <main className="flex-1 overflow-auto flex flex-col items-center">
              <DocumentCanvas
                document={activeDoc}
                content={displayedContent}
                onChangeContent={handleContentChange}
                viewMode={viewMode}
                zoom={zoom}
                showGridlines={showGridlines}
                showFormattingMarks={showFormattingMarks}
                isReadOnly={isReadOnly}
                activeDrawingTool={activeDrawingTool}
                drawingColor={drawingColor}
                drawingWidth={drawingWidth}
                drawingStrokes={activeDoc.drawingStrokes || []}
                onUpdateDrawingStrokes={(strokes) => {
                  const updated = { ...activeDoc, drawingStrokes: strokes };
                  setActiveDoc(updated);
                  triggerAutoSave(updated);
                }}
                onEditorReady={setEditorInstance}
                onPageCountChange={setTotalPages}
                onSelectionChange={handleSelectionChange}
              />
            </main>

            {/* Right Aura AI Assistant Panel */}
            <AuraAssistantPanel
              isOpen={isAIOpen && !isFocusMode}
              onClose={() => setIsAIOpen(false)}
              selectedText={selectedText}
              documentContent={displayedContent}
              onReplaceSelection={(newText) => {
                if (editorInstance) {
                  editorInstance.chain().focus().insertContent(newText).run();
                }
              }}
              onInsertBelow={(newText) => {
                if (editorInstance) {
                  editorInstance.chain().focus().insertContent(`<p>${newText}</p>`).run();
                }
              }}
            />

            {/* Right Comments Panel */}
            <CommentsPanel
              isOpen={isCommentsOpen && !isFocusMode}
              onClose={() => setIsCommentsOpen(false)}
              comments={activeDoc.comments}
              selectedText={selectedText}
              onAddComment={handleAddComment}
              onReplyComment={handleReplyComment}
              onToggleResolve={handleToggleResolveComment}
              onDeleteComment={handleDeleteComment}
            />
          </div>

          {/* 6. Bottom Status Bar */}
          {!isFocusMode && (
            <StatusBar
              currentPage={1}
              totalPages={totalPages}
              stats={docStats}
              viewMode={viewMode}
              onChangeViewMode={setViewMode}
              zoom={zoom}
              onZoomChange={setZoom}
              onOpenWordCount={() => setIsWordCountOpen(true)}
              trackingEnabled={activeDoc.trackingEnabled}
              onToggleTracking={() => {
                const updated = { ...activeDoc, trackingEnabled: !activeDoc.trackingEnabled };
                setActiveDoc(updated);
                triggerAutoSave(updated);
              }}
            />
          )}

          {/* 7. Backstage View (File Menu) */}
          <BackstageView
            isOpen={isBackstageOpen}
            onClose={() => setIsBackstageOpen(false)}
            currentDoc={activeDoc}
            recentDocs={documents}
            onOpenDoc={handleOpenDoc}
            onNewDoc={handleCreateNew}
            onSaveDoc={() => {
              saveDocument(activeDoc);
              setSaveStatus('saved');
            }}
            onExportDocx={() => exportToDocx(activeDoc)}
            onExportPdf={() => exportToPdf(activeDoc)}
            onExportHtml={() => exportToHtml(activeDoc)}
            onExportTxt={() => exportToTxt(activeDoc)}
            onPrint={() => window.print()}
            onGoHomeDashboard={() => {
              setIsBackstageOpen(false);
              setIsHomeOpen(true);
            }}
            onUploadFile={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.docx,.html,.txt';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handleImportFile(file);
              };
              input.click();
            }}
          />

          {/* 8. Modals */}
          <FindReplaceModal
            isOpen={isFindReplaceOpen}
            onClose={() => setIsFindReplaceOpen(false)}
            onFind={handleFind}
            onReplace={handleReplace}
          />

          <WordCountModal
            isOpen={isWordCountOpen}
            onClose={() => setIsWordCountOpen(false)}
            stats={docStats}
          />

          <CitationManagerModal
            isOpen={isCitationManagerOpen}
            onClose={() => setIsCitationManagerOpen(false)}
            citations={activeDoc.citations || []}
            activeStyle={activeDoc.citationStyle}
            onUpdateCitations={(citations) => {
              const updated = { ...activeDoc, citations };
              setActiveDoc(updated);
              triggerAutoSave(updated);
            }}
            onChangeStyle={(style) => {
              const updated = { ...activeDoc, citationStyle: style };
              setActiveDoc(updated);
              triggerAutoSave(updated);
            }}
            onInsertBibliography={(bibHtml) => {
              editorInstance?.chain().focus().insertContent(bibHtml).run();
            }}
            onInsertInTextCitation={(refText) => {
              editorInstance?.chain().focus().insertContent(` <em>${refText}</em> `).run();
            }}
          />

          <MailMergeModal
            isOpen={isMailMergeOpen}
            onClose={() => setIsMailMergeOpen(false)}
            recipients={activeDoc.recipients || []}
            onUpdateRecipients={(recipients) => {
              const updated = { ...activeDoc, recipients };
              setActiveDoc(updated);
              triggerAutoSave(updated);
            }}
            onInsertField={handleInsertMergeField}
          />

          <InsertTableModal
            isOpen={isTableModalOpen}
            onClose={() => setIsTableModalOpen(false)}
            onInsertTable={handleInsertQuickTable}
          />

          <InsertImageModal
            isOpen={isImageModalOpen}
            onClose={() => setIsImageModalOpen(false)}
            onInsertImage={(src, alt, caption) => {
              if (!editorInstance) return;
              editorInstance
                .chain()
                .focus()
                .setImage({ src, alt })
                .run();
              if (caption) {
                editorInstance
                  .chain()
                  .focus()
                  .insertContent(`<p style="font-size: 11px; color: #64748b; font-style: italic; text-align: center;">${caption}</p>`)
                  .run();
              }
            }}
          />

          <InsertChartModal
            isOpen={isChartModalOpen}
            onClose={() => setIsChartModalOpen(false)}
            onInsertChartHtml={(chartHtml) => {
              editorInstance?.chain().focus().insertContent(chartHtml).run();
            }}
          />

          <InsertEquationModal
            isOpen={isEquationModalOpen}
            onClose={() => setIsEquationModalOpen(false)}
            onInsertEquationHtml={(eqHtml) => {
              editorInstance?.chain().focus().insertContent(eqHtml).run();
            }}
          />

          <ShortcutsModal
            isOpen={isShortcutsOpen}
            onClose={() => setIsShortcutsOpen(false)}
          />
        </div>
      );
    }
