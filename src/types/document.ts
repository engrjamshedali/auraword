/**
 * Document types and interfaces for AuraWord
 */

export type PaperSize = 'A4' | 'Letter' | 'Legal' | 'A3';
export type PageOrientation = 'portrait' | 'landscape';

export interface PageMargins {
  top: number;    // in inches
  bottom: number; // in inches
  left: number;   // in inches
  right: number;  // in inches
}

export interface PageSetup {
  paperSize: PaperSize;
  orientation: PageOrientation;
  margins: PageMargins;
  columns: 1 | 2 | 3;
  headerText: string;
  footerText: string;
  showHeaderFooter: boolean;
  differentFirstPage: boolean;
  pageNumberFormat: 'number' | 'roman' | 'pageOfTotal';
  pageNumberPosition: 'bottom-center' | 'bottom-right' | 'top-right';
}

export type DocumentTheme = 'Office' | 'Modern' | 'Slate' | 'Emerald' | 'Crimson' | 'Ocean' | 'Executive';

export interface ThemeSettings {
  themeName: DocumentTheme;
  primaryColor: string;
  fontFamily: string;
  headingFont: string;
  watermark: string | null;
  pageColor: string;
  pageBorder: 'none' | 'box' | 'shadow' | 'double';
  lineSpacing: number;
}

export interface DocumentComment {
  id: string;
  author: string;
  text: string;
  createdAt: number;
  resolved: boolean;
  replies: {
    id: string;
    author: string;
    text: string;
    createdAt: number;
  }[];
  selectionText?: string;
}

export interface TrackChangeItem {
  id: string;
  type: 'insert' | 'delete' | 'format';
  author: string;
  text: string;
  timestamp: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export type CitationStyle = 'APA' | 'MLA' | 'Chicago' | 'IEEE';

export interface CitationSource {
  id: string;
  key: string;
  type: 'book' | 'journal' | 'website' | 'conference';
  authors: string;
  title: string;
  year: string;
  publisher?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  url?: string;
}

export interface MailMergeContact {
  [key: string]: string;
}

export interface DrawingPoint {
  x: number;
  y: number;
}

export interface DrawingStroke {
  id: string;
  points: DrawingPoint[];
  color: string;
  width: number;
  isHighlighter?: boolean;
}

export interface DocumentRecord {
  id: string;
  title: string;
  content: string; // HTML format for TipTap
  createdAt: number;
  updatedAt: number;
  author: string;
  isPinned: boolean;
  pageSetup: PageSetup;
  theme: ThemeSettings;
  comments: DocumentComment[];
  trackChanges: TrackChangeItem[];
  trackingEnabled: boolean;
  citations: CitationSource[];
  citationStyle: CitationStyle;
  drawingStrokes: DrawingStroke[];
  recipients?: MailMergeContact[];
}

export interface DocumentStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  paragraphs: number;
  pages: number;
  readingTimeMinutes: number;
  fleschScore: number;
}

export type EditorViewMode = 'print' | 'read' | 'web' | 'outline';
