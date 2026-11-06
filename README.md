# AuraWord – Professional Word Processor

**Product:** AuraWord  
**Developed by:** AuraNix Technologies

![React](https://img.shields.io/badge/React-19.0.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-06B6D4?logo=tailwindcss&logoColor=white)
![TipTap](https://img.shields.io/badge/TipTap-3.32.0-000000)
![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)

> **Built with innovation by AuraNix Technologies.**

---

## Table of Contents

1. [Project Title and Branding](#1-project-title-and-branding)
2. [Project Overview](#2-project-overview)
3. [Key Features](#3-key-features)
4. [Rich Text Editing Capabilities](#4-rich-text-editing-capabilities)
5. [Document Formatting Tools](#5-document-formatting-tools)
6. [User Interface and Experience](#6-user-interface-and-experience)
7. [Technology Stack](#7-technology-stack)
8. [Project Architecture](#8-project-architecture)
9. [Installation Instructions](#9-installation-instructions)
10. [Local Development Setup](#10-local-development-setup)
11. [Configuration](#11-configuration)
12. [Usage Guide](#12-usage-guide)
13. [Screenshots and Preview Gallery](#13-screenshots-and-preview-gallery)
14. [Project Structure](#14-project-structure)
15. [Browser Compatibility](#15-browser-compatibility)
16. [Security and Privacy](#16-security-and-privacy)
17. [Future Roadmap](#17-future-roadmap)
18. [Contributing Guidelines](#18-contributing-guidelines)
19. [License](#19-license)
20. [Credits and Acknowledgements](#20-credits-and-acknowledgements)
21. [About AuraNix Technologies](#21-about-auranix-technologies)

---

## 1. Project Title and Branding

- **Project Name:** Remix AuraWord – Professional Word Processor
- **Product Name:** AuraWord
- **Brand:** AuraNix Technologies
- **Tagline:** *Built with innovation by AuraNix Technologies.*

**AuraWord** is a browser-based word processing application modeled after desktop office suites. It combines a 10-tab ribbon interface, multi-format document import/export, offline-first IndexedDB storage, academic citation management, mail merge, freehand canvas annotation, and an optional AI writing assistant into a single-page React and TypeScript application.

---

## 2. Project Overview

Modern web editors frequently trade deep document layout and formatting controls for minimal interfaces. **Remix AuraWord** bridges that gap by delivering a structured, Microsoft Word-inspired document authoring workspace directly in the browser.

Designed for technical writers, business professionals, students, and researchers, AuraWord runs client-side with zero mandatory cloud dependencies. Documents are automatically persisted to the browser's native `IndexedDB` database (`auraword_db`), allowing users to create, edit, annotate, and export `.docx`, `.pdf`, `.html`, and `.txt` files locally. When configured with a Gemini API key, the integrated **Aura Assistant** provides AI-powered rewriting, summarization, translation, and drafting—while automatically falling back to a deterministic local heuristic engine when offline or unconfigured.

---

## 3. Key Features

- **10-Tab Ribbon Interface:** Organized into `Home`, `Insert`, `Layout`, `References`, `Mailings`, `Review`, `View`, `Draw`, `Design`, and `Help` tabs, plus a full-screen `File` Backstage view and collapsible ribbon support.
- **Offline-First Document Management:** Automatic debounced saving (800 ms) to browser `IndexedDB`, complete with document pinning, duplication, deletion, and four built-in starter templates (*Blank Document*, *Project Proposal & Strategy*, *Academic Research Paper*, and *Formal Business Letter*).
- **Multi-Format Import & Export:**
  - **Import:** `.docx` (via `mammoth`), `.html` / `.htm`, and `.txt`.
  - **Export:** `.docx` (via `docx`), `.pdf` (via `html2canvas` and `jsPDF` with print fallback), styled `.html`, and plain `.txt`.
- **Academic References & Citations:** Manage bibliography sources (`Book`, `Journal`, `Website`, `Conference`), switch between `APA`, `MLA`, `Chicago`, and `IEEE` citation styles, insert in-text citations or full bibliographies, and generate a Table of Contents from document headings (`H1`–`H3`).
- **Mail Merge Workflow:** Manage recipient lists, import contacts via CSV parsing, insert merge tokens (`{{FirstName}}`, `«FieldName»`, `[[FieldName]]`), and preview live token replacement per recipient.
- **Freehand Drawing Overlay:** Interactive HTML5 `<canvas>` overlay supporting Pen, Highlighter, and Eraser tools with customizable stroke color and width.
- **Editorial Review & Readability Metrics:** Threaded document comments (reply, resolve, delete), read-only lock mode, and real-time word, character, paragraph, reading time, and **Flesch Reading Ease** calculations.
- **Aura AI Writing Assistant:** Side panel supporting 14 editorial actions (rewrite, grammar fix, summarize, 4 tone adjustments, expand, outline, custom section drafting, title generation, and Spanish/French/German translation) powered by `@google/genai` (`gemini-2.5-flash`) with an offline fallback engine.

---

## 4. Rich Text Editing Capabilities

AuraWord's editing core is built on **TipTap (`@tiptap/react` v3.32.0)** and **ProseMirror**, configured with the following extensions and capabilities:

| Capability | Implementation Details |
| :--- | :--- |
| **Core Text & History** | Powered by `@tiptap/starter-kit` with full Undo (`Ctrl+Z`) and Redo (`Ctrl+Y`) history stacks. |
| **Inline Marks** | Bold, Italic, Underline (`@tiptap/extension-underline`), Strikethrough, Subscript (`@tiptap/extension-subscript`), and Superscript (`@tiptap/extension-superscript`). |
| **Typography** | Custom Font Family selection (`@tiptap/extension-font-family`) and point-based Font Size (`@tiptap/extension-text-style`) with quick Grow/Shrink controls. |
| **Color & Highlighting** | Text foreground color (`@tiptap/extension-color`) and multi-color text background highlighting (`@tiptap/extension-highlight`). |
| **Case Conversion** | Instant transformation of selected text into `Sentence case`, `lowercase`, `UPPERCASE`, `Title Case`, or `tOGGLE cASE`. |
| **Format Painter** | Copies active inline formatting (`bold`, `italic`, `underline`, and text `color`) from the current selection and applies it to the next selected range. |
| **Lists & Indentation** | Bulleted lists, numbered lists, indent insertion, and node outdenting/lifting. |
| **Tables** | Resizable tables (`@tiptap/extension-table`, `TableRow`, `TableHeader`, `TableCell`) via quick grid picker or custom row/column modal. |
| **Images & Media** | Base64 and URL image insertion (`@tiptap/extension-image`) with optional figure captions, plus direct drag-and-drop image file upload onto the canvas. |
| **Rich Document Blocks** | Hyperlinks (`@tiptap/extension-link`), Cover Pages, Page Breaks, Blank Pages, SVG/HTML Charts, Mathematical Equations, Callout Shapes, Text Boxes, Footnotes, and Date/Time stamps. |

---

## 5. Document Formatting Tools

AuraWord provides granular page and theme controls across the **Layout** and **Design** ribbon tabs:

- **Paper Sizes:** Standard `Letter` (8.5" × 11"), `A4` (210mm × 297mm), `Legal` (8.5" × 14"), and `A3` rendered at 96 DPI CSS pixel dimensions.
- **Page Orientation:** Instant switching between `Portrait` and `Landscape`.
- **Page Margins:** Configurable top, bottom, left, and right margins (in inches), reflected dynamically on both the document canvas and the horizontal top **Ruler**.
- **Headers, Footers & Page Numbers:** Toggleable header and footer regions, optional *Different First Page* header suppression, custom header/footer text, and page numbering in numeric (`1`), Roman (`i, ii, iii`), or `Page X of Y` formats.
- **Document Themes:** 6 curated typography and color presets in the Design tab:
  - *Office Classic* (`#2b579a`, Calibri)
  - *Modern Aptos* (`#0284c7`, Aptos)
  - *Slate Minimal* (`#334155`, Inter)
  - *Emerald Executive* (`#059669`, Roboto)
  - *Crimson Editorial* (`#991b1b`, EB Garamond / Georgia)
  - *Ocean Depth* (`#1e40af`, Merriweather / Aptos)
- **Page Backgrounds & Borders:** Custom diagonal page watermarks (`DRAFT`, `CONFIDENTIAL`, `DO NOT COPY`, `SAMPLE`, `INTERNAL USE`), 5 page surface colors (*Pure White*, *Ivory Soft*, *Warm Cream*, *Executive Mist*, *Soft Mint*), and page border styles (`None`, `Box`, `Shadow`, `Double`).
- **Line Spacing:** Adjustable document line-height (`1.0`, `1.15`, `1.5`, `2.0`, etc.).

---

## 6. User Interface and Experience

- **Title Bar & Quick Access Toolbar:** Displays the inline-editable document title, live autosave status indicator (`Saved`, `Saving...`, `Unsaved`), Undo/Redo buttons, Print button, Comment counter badge, Aura Assistant toggle, and quick `.docx` export.
- **Backstage View (`File` Menu):** Full-screen overlay for creating documents from templates, opening recent documents, importing local files (`.docx`, `.html`, `.txt`), saving, printing, and exporting to `.docx`, `.pdf`, `.html`, or `.txt`.
- **Home Screen Dashboard:** Manage all stored documents with search filtering, pinned documents sorting, one-click duplication, and deletion.
- **View Modes & Workspace Aids:**
  - **Print Layout (`print`):** Paginated sheet view with margins, headers, footers, and shadows.
  - **Read Mode (`read`):** Warm sepia-toned (`#f4efe8`) reading surface.
  - **Web Layout (`web`):** Fluid, wide-screen borderless document container.
  - **Focus Mode:** Hides the Title Bar, Ribbon, Ruler, Side Panes, and Status Bar (`Esc` to exit).
  - **Visual Overlays:** Toggleable horizontal **Ruler**, dot **Gridlines**, and left **Navigation Pane** (with document outline headings and page jump controls).
  - **Zoom Controls:** Smooth canvas scaling from `50%` (`0.5x`) to `200%` (`2.0x`), plus `100%` reset and *Fit Page Width* (`115%`).

> **Note on Theme Support:** The application UI uses a classic light Office-inspired workspace palette (`#f3f2f1` / `#e6e9ed` / `#2b579a`) with customizable page background colors (*Pure White*, *Ivory Soft*, *Warm Cream*, *Executive Mist*, *Soft Mint*) and a warm *Read Mode* backdrop. A full application-wide dark mode toggle is not currently implemented.

---

## 7. Technology Stack

All packages and versions below are verified directly from `package.json`:

### Runtime Dependencies

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `react` / `react-dom` | `^19.0.1` | Core UI component library and DOM renderer |
| `@tiptap/react` / `@tiptap/pm` / `@tiptap/starter-kit` | `^3.32.0` | Headless ProseMirror rich-text editor framework |
| `@tiptap/extension-*` | `^3.32.0` | `color`, `font-family`, `highlight`, `image`, `link`, `subscript`, `superscript`, `table`, `table-cell`, `table-header`, `table-row`, `text-align`, `text-style`, `underline` |
| `@google/genai` | `^2.4.0` | Google Gemini SDK for Aura Assistant (`gemini-2.5-flash`) |
| `docx` | `^9.13.0` | Client-side generation of `.docx` OpenXML files |
| `mammoth` | `^1.13.0` | `.docx` to HTML conversion for document import |
| `jspdf` | `^4.2.1` | Client-side PDF document generation |
| `html2canvas` | `^1.4.1` | DOM-to-canvas rendering for PDF export |
| `lucide-react` | `^0.546.0` | Ribbon, toolbar, and modal iconography |
| `@tailwindcss/vite` / `tailwindcss` | `^4.3.3` | Utility-first CSS styling and Vite plugin |
| `motion` | `^12.23.24` | Animation library installed in project dependencies |
| `express` / `dotenv` | `^4.21.2` / `^17.2.3` | Installed runtime utilities |

### Development & Build Tooling

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `vite` | `^8.3.0` | Frontend development server and production bundler |
| `@vitejs/plugin-react` | `^6.1.1` | React fast refresh and JSX compilation for Vite |
| `typescript` | `^7.0.2` | Static type checking (`tsc --noEmit`) |
| `tsx` / `esbuild` | `^4.21.0` / `^0.25.0` | TypeScript execution and bundling utilities |
| `autoprefixer` | `^10.4.21` | CSS vendor prefixing |

---

## 8. Project Architecture

Remix AuraWord follows a modular, local-first Single-Page Application (SPA) architecture with a strict separation between UI components, persistence/export services, and pure testable business logic:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                             src/App.tsx                                 │
│        (Application State, Keyboard Shortcuts, Autosave Coordinator)     │
└───────┬──────────────────────────┬──────────────────────────┬───────────┘
        │                          │                          │
        ▼                          ▼                          ▼
┌───────────────────┐    ┌────────────────────┐    ┌──────────────────────┐
│   UI Components   │    │  Editor Workspace  │    │   Service & Logic    │
│                   │    │                    │    │       Layers         │
│ • TitleBar        │    │ • DocumentCanvas   │    │ • storage.ts         │
│ • Ribbon (10 Tabs)│    │   (TipTap v3)      │    │   (IndexedDB CRUD)   │
│ • BackstageView   │    │ • DrawingCanvas    │    │ • exportService.ts   │
│ • HomeScreen      │    │   (HTML5 Canvas)   │    │   (DOCX/PDF/HTML/TXT)│
│ • NavigationPane  │    │ • Ruler            │    │ • importService.ts   │
│ • CommentsPanel   │    │                    │    │   (Mammoth DOCX/TXT) │
│ • AuraAssistant   │    │                    │    │ • aiService.ts       │
│ • 9 Dialog Modals │    │                    │    │   (Gemini + Offline) │
│ • StatusBar       │    │                    │    │ • documentLogic.ts   │
└───────────────────┘    └────────────────────┘    └──────────────────────┘
```

### Architectural Highlights

1. **Decoupled Pure Logic (`src/utils/documentLogic.ts`):** Word/character/syllable counting, Flesch Reading Ease calculation, case conversion, citation formatting (`APA`, `MLA`, `Chicago`, `IEEE`), Table of Contents regex extraction, CSV parsing, and Mail Merge token replacement are implemented as pure TypeScript functions with zero DOM dependencies and verified via Node's native test runner (`src/utils/documentLogic.test.ts`).
2. **Offline-First Storage (`src/services/storage.ts`):** Wraps the browser's `IndexedDB` API (`auraword_db`, store `documents`) with automatic first-run seeding of 4 rich document templates.
3. **Resilient AI Layer (`src/services/aiService.ts`):** Attempts to call `gemini-2.5-flash` via `@google/genai` if an API key is available, and seamlessly falls back to a deterministic offline response generator (`generateOfflineAIResponse`) so the assistant never errors out without credentials.

### Current Experimental / Partial Features

In the interest of technical transparency, the following features are partially implemented or simulated in the current codebase:

- **Multi-Page Pagination Simulation:** `DocumentCanvas.tsx` estimates total page count from content scroll height and renders visual subsequent page sheets, while the primary editable ProseMirror instance is mounted on Page 1.
- **Track Changes:** Toggling Track Changes and accepting/rejecting pending changes updates the `trackChanges` state array on the document record, though live ProseMirror inline diff decorations are not yet wired to keystrokes.
- **Proofing Check & Columns UI:** The *Spelling & Grammar* button in the Review tab currently displays a completion alert, and the *Columns* selector updates the `pageSetup.columns` metadata property.

---

## 9. Installation Instructions

### Prerequisites

- **Node.js:** v20.x or v22.x recommended (compatible with `@types/node` `^22.14.0`)
- **Package Manager:** `npm` (included with Node.js) or `bun` (`bun.lock` is present in the repository)

### Step-by-Step Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd remix-auraword
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

## 10. Local Development Setup

All available scripts in `package.json`:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server on `http://0.0.0.0:3000` (`http://localhost:3000`). |
| `npm run build` | Builds the optimized production bundle into the `dist/` directory via `vite build`. |
| `npm run preview` | Locally previews the production build generated in `dist/`. |
| `npm run lint` | Runs TypeScript type-checking (`tsc --noEmit`) across the codebase. |
| `npm run clean` | Removes build artifacts (`rm -rf dist server.js`). |

### Running the Application Locally

```bash
npm run dev
```

Open **`http://localhost:3000`** in your web browser.

### Running Unit Tests

Pure document logic unit tests (`src/utils/documentLogic.test.ts`) use the built-in `node:test` and `node:assert/strict` modules and can be executed with `tsx`:

```bash
npx tsx --test src/utils/documentLogic.test.ts
```

---

## 11. Configuration

### Environment Variables

The project includes an `.env.example` file at the repository root:

```env
# GEMINI_API_KEY: Required for Gemini AI API calls.
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: The URL where this applet is hosted.
APP_URL="MY_APP_URL"
```

To configure local environment variables:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Set your Gemini API key if you want live AI responses in the **Aura Assistant** panel:
   - `src/services/aiService.ts` checks `process.env.GEMINI_API_KEY` or `import.meta.env.VITE_GEMINI_API_KEY`. For standard local Vite client builds, you can provide `VITE_GEMINI_API_KEY="your_api_key_here"` in `.env`.
   - **Optional:** If no API key is configured, AuraWord remains 100% functional and uses its built-in offline fallback engine for all 14 AI assistant actions.

---

## 12. Usage Guide

### Creating, Opening, and Importing Documents
- Click **File** in the top-left corner (or press `Ctrl + O`) to open the **Backstage View**, or click the **Home** icon on the Title Bar to open the **Home Screen Dashboard**.
- Select from four starter templates (*Blank Document*, *Project Proposal & Strategy*, *Academic Research Paper*, or *Formal Business Letter*).
- Click **Import / Upload File** to open an existing `.docx`, `.html`, or `.txt` file from your computer.

### Exporting and Printing
- **Quick DOCX Export:** Click the **Export DOCX** button in the Title Bar.
- **Full Export Options:** Open **File → Export** in the Backstage View to download your document as:
  - **Microsoft Word (`.docx`)**
  - **PDF Document (`.pdf`)**
  - **Web Page (`.html`)**
  - **Plain Text (`.txt`)**
- **Printing:** Press `Ctrl + P` or click the **Print** icon. `@media print` CSS rules automatically hide the ribbon, sidebars, and UI chrome for clean page output.

### Keyboard Shortcuts Reference

Press the **Shortcuts** button in the **Help** tab at any time to view and search all shortcuts:

| Shortcut Key | Action | Category |
| :--- | :--- | :--- |
| `Ctrl + S` / `Cmd + S` | Save document immediately to IndexedDB | File & App |
| `Ctrl + P` / `Cmd + P` | Print document / PDF print dialog | File & App |
| `Ctrl + O` / `Cmd + O` | Open Backstage File menu | File & App |
| `Ctrl + N` / `Cmd + N` | Create a new blank document | File & App |
| `Ctrl + B` / `Cmd + B` | Toggle Bold on selected text | Formatting |
| `Ctrl + I` / `Cmd + I` | Toggle Italic on selected text | Formatting |
| `Ctrl + U` / `Cmd + U` | Toggle Underline on selected text | Formatting |
| `Ctrl + L` / `E` / `R` / `J` | Align text Left, Center, Right, or Justify | Formatting |
| `Ctrl + Z` / `Ctrl + Y` | Undo / Redo last editor action | Editing |
| `Ctrl + F` / `Ctrl + H` | Open Find & Replace modal | Editing |
| `Ctrl + K` / `Cmd + K` | Insert or edit hyperlink | Insert & Review |
| `Esc` | Close active modals, Backstage view, or Focus Mode | Navigation |

---

## 13. Screenshots and Preview Gallery

> **Instructions for Adding Screenshots:**  
> To include visual previews in your fork or deployment, capture screenshots of the running application at `http://localhost:3000`, save them into a `docs/screenshots/` folder, and replace the placeholder paths below.

| Workspace View | Screenshot Placeholder |
| :--- | :--- |
| **Main Editor & Home Ribbon** | `<!-- ![Main Editor Workspace](docs/screenshots/editor-workspace.png) -->` *Add screenshot of the Print Layout view with the Home ribbon tab active.* |
| **Home Screen & Templates** | `<!-- ![Home Screen Dashboard](docs/screenshots/home-dashboard.png) -->` *Add screenshot of the Home Screen showing templates and pinned documents.* |
| **Aura AI Assistant & Comments** | `<!-- ![Aura Assistant & Comments](docs/screenshots/ai-and-comments.png) -->` *Add screenshot of the right-hand Aura Assistant and Comments panels.* |
| **Citations & Mail Merge Modals** | `<!-- ![Citation & Mail Merge Modals](docs/screenshots/modals-preview.png) -->` *Add screenshot of the Citation Manager or Mail Merge recipient manager.* |

---

## 14. Project Structure

```text
/
├── .env.example                           # Environment variable template
├── .gitignore                             # Git ignore rules
├── bun.lock                               # Bun lockfile
├── index.html                             # HTML entry point & Google Fonts (Aptos, Calibri, Inter, etc.)
├── metadata.json                          # Application metadata and capability declarations
├── package.json                           # Scripts, dependencies, and devDependencies
├── tsconfig.json                          # TypeScript compiler configuration (ES2022, bundler)
├── vite.config.ts                         # Vite bundler & Tailwind CSS v4 plugin configuration
└── src/
    ├── main.tsx                           # React DOM root mount
    ├── App.tsx                            # Root application component & state coordinator
    ├── index.css                          # Tailwind CSS import, ProseMirror styles & @media print rules
    ├── types/
    │   └── document.ts                    # Core TypeScript interfaces (DocumentRecord, PageSetup, etc.)
    ├── services/
    │   ├── aiService.ts                   # Gemini API integration + offline heuristic fallback
    │   ├── exportService.ts               # DOCX, PDF, HTML, and TXT export generators
    │   ├── importService.ts               # Mammoth DOCX, HTML, and TXT file parser
    │   └── storage.ts                     # IndexedDB persistence & starter document templates
    ├── utils/
    │   ├── documentLogic.ts               # Pure functions for stats, Flesch score, TOC, CSV & citations
    │   └── documentLogic.test.ts          # Unit tests using node:test and node:assert
    └── components/
        ├── TitleBar.tsx                   # Top bar with title editing, quick save/undo/redo, and search
        ├── StatusBar.tsx                  # Bottom bar with page count, word count, view modes & zoom
        ├── AuraAssistant/
        │   └── AuraAssistantPanel.tsx     # AI writing & translation side panel
        ├── Backstage/
        │   └── BackstageView.tsx          # Full-screen "File" menu for New/Open/Import/Export/Print
        ├── Comments/
        │   └── CommentsPanel.tsx          # Editorial comments & threaded replies sidebar
        ├── Editor/
        │   ├── DocumentCanvas.tsx         # TipTap editor host, page rendering, watermarks & headers
        │   ├── DrawingCanvas.tsx          # Freehand HTML5 canvas overlay for pen/highlighter/eraser
        │   └── Ruler.tsx                  # Horizontal inch ruler with margin indicators
        ├── HomeScreen/
        │   └── HomeScreen.tsx             # Document dashboard, template picker & file manager
        ├── NavigationPane/
        │   └── NavigationPane.tsx         # Left sidebar for heading outline, page navigation & search
        ├── Modals/
        │   ├── CitationManagerModal.tsx   # Academic source manager (APA, MLA, Chicago, IEEE)
        │   ├── FindReplaceModal.tsx       # Document search and text replacement dialog
        │   ├── InsertChartModal.tsx       # Visual chart generator modal
        │   ├── InsertEquationModal.tsx    # Mathematical formula & symbol insertion modal
        │   ├── InsertImageModal.tsx       # File upload & URL image insertion modal
        │   ├── InsertTableModal.tsx       # Custom table dimensions & styling dialog
        │   ├── MailMergeModal.tsx         # Recipient list & CSV import manager
        │   ├── ShortcutsModal.tsx         # Searchable keyboard shortcuts reference dialog
        │   └── WordCountModal.tsx         # Detailed document statistics & Flesch score dialog
        └── Ribbon/
            ├── Ribbon.tsx                 # Ribbon tab bar & collapsible toolbar container
            ├── HomeTab.tsx                # Clipboard, Font, Paragraph, Styles & Editing controls
            ├── InsertTab.tsx              # Pages, Tables, Illustrations, Charts, Equations & Links
            ├── DrawTab.tsx                # Pen, Highlighter, Eraser, color & stroke width tools
            ├── DesignTab.tsx              # Document Themes, Watermarks, Page Color & Borders
            ├── LayoutTab.tsx              # Margins, Orientation, Paper Size, Columns & Breaks
            ├── ReferencesTab.tsx          # Table of Contents, Footnotes, Citations & Captions
            ├── MailingsTab.tsx            # Mail Merge fields, recipient navigation & preview toggle
            ├── ReviewTab.tsx              # Proofing, Word Count, Comments, Track Changes & Read-Only
            ├── ViewTab.tsx                # View modes, Ruler/Gridlines/NavPane toggles, Zoom & Focus
            └── HelpTab.tsx                # Keyboard shortcuts, sample templates & About launcher
```

---

## 15. Browser Compatibility

Remix AuraWord relies on modern Web APIs including `IndexedDB`, `HTMLCanvasElement`, `DOMParser`, `FileReader`, `Blob`, and `Clipboard API`.

| Browser | Supported Versions | Notes |
| :--- | :--- | :--- |
| **Google Chrome / Chromium** | Latest 2 major versions | Full support including native print-to-PDF and clipboard APIs. |
| **Microsoft Edge** | Latest 2 major versions | Full support. |
| **Mozilla Firefox** | Latest 2 major versions | Full support. |
| **Apple Safari (macOS / iPadOS)** | Safari 16.4+ | Full support (`Cmd` key mapped automatically for keyboard shortcuts). |

---

## 16. Security and Privacy

- **100% Local Document Storage:** All documents, comments, citations, mail merge recipients, and drawing strokes are stored locally in the user's browser inside `IndexedDB` (`auraword_db`). No document content is transmitted to external storage servers.
- **Client-Side File Conversion:** `.docx` import (`mammoth`) and `.docx`/`.pdf`/`.html`/`.txt` export (`docx`, `jspdf`, `html2canvas`) execute entirely within the browser sandbox.
- **HTML Sanitization & Escaping:** Plain-text imports and HTML exports sanitize special characters (`&`, `<`, `>`, `"`, `'`) to prevent markup injection during conversion.
- **Optional AI Processing:** Document text is only sent to the Google Gemini API (`gemini-2.5-flash`) when the user explicitly clicks an action inside the **Aura Assistant** panel and a valid `GEMINI_API_KEY` is configured. Never commit real API keys to `.env` or version control.

---

## 17. Future Roadmap

- [x] Full 10-tab Microsoft Word-inspired Ribbon UI and Backstage File menu
- [x] Local-first `IndexedDB` document storage with autosave and starter templates
- [x] Client-side `.docx`, `.pdf`, `.html`, and `.txt` export and `.docx`/`.html`/`.txt` import
- [x] Academic Citation Manager (`APA`, `MLA`, `Chicago`, `IEEE`) and Table of Contents builder
- [x] Mail Merge contact manager with CSV import and live token preview
- [x] Freehand drawing canvas overlay (Pen, Highlighter, Eraser)
- [x] Aura AI Writing Assistant with offline heuristic fallback
- [ ] True multi-page ProseMirror DOM splitting across paginated sheet boundaries
- [ ] Inline ProseMirror decoration marks for real-time Track Changes insertions and deletions
- [ ] Full application-wide Dark Theme mode for the Ribbon and surrounding workspace UI
- [ ] Multi-column CSS layout rendering (`columns: 2 | 3`) inside the document canvas
- [ ] Rich `.docx` export support for embedded images, tables, and custom theme colors

---

## 18. Contributing Guidelines

Contributions, bug reports, and feature enhancements are welcome!

1. **Fork the repository** and create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Make your changes** while adhering to strict TypeScript typing and existing component conventions.
3. **Verify type safety and unit tests:**
   ```bash
   npm run lint
   npx tsx --test src/utils/documentLogic.test.ts
   npm run build
   ```
4. **Commit your changes** with a clear, descriptive commit message and open a Pull Request.

---

## 19. License

This project is licensed under the **Apache License 2.0** (`SPDX-License-Identifier: Apache-2.0`), as declared in the source header of `src/App.tsx`.

```text
Copyright 2026 AuraNix Technologies

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

---

## 20. Credits and Acknowledgements

Remix AuraWord is made possible by the open-source ecosystem:

- **[TipTap](https://tiptap.dev/) & [ProseMirror](https://prosemirror.net/)** for the extensible rich-text editor architecture.
- **[docx](https://docx.js.org/)** by Dolan Miu for declarative client-side `.docx` generation.
- **[Mammoth.js](https://github.com/mwilliamson/mammoth.js)** for clean semantic `.docx` to HTML conversion.
- **[jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/)** for client-side PDF rendering.
- **[Lucide Icons](https://lucide.dev/)** for crisp, consistent UI iconography.
- **[Tailwind CSS](https://tailwindcss.com/) & [Vite](https://vite.dev/)** for modern styling and instantaneous frontend tooling.
- **[Google GenAI SDK (`@google/genai`)](https://www.npmjs.com/package/@google/genai)** for powering the Aura Assistant.

---

## 21. About AuraNix Technologies

**AuraNix Technologies** builds modern, local-first productivity software and intelligent web applications engineered for speed, reliability, and user privacy. With **AuraWord**, AuraNix Technologies brings the familiarity and depth of desktop document authoring to the modern web platform.

*Built with innovation by AuraNix Technologies.*
