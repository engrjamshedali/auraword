import React, { useState } from 'react';
import {
  Clipboard,
  Scissors,
  Copy,
  Paintbrush,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  CaseSensitive,
  RemoveFormatting,
  Highlighter,
  Palette,
  List,
  ListOrdered,
  Outdent,
  Indent,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Pilcrow,
  Search,
  Replace,
  Check,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { TextCase } from '../../utils/documentLogic';

interface HomeTabProps {
  // Font & text formatting states
  fontFamily: string;
  onChangeFontFamily: (font: string) => void;
  fontSize: string;
  onChangeFontSize: (size: string) => void;
  onGrowFont: () => void;
  onShrinkFont: () => void;
  isBold: boolean;
  onToggleBold: () => void;
  isItalic: boolean;
  onToggleItalic: () => void;
  isUnderline: boolean;
  onToggleUnderline: () => void;
  isStrike: boolean;
  onToggleStrike: () => void;
  isSubscript: boolean;
  onToggleSubscript: () => void;
  isSuperscript: boolean;
  onToggleSuperscript: () => void;
  onChangeCase: (c: TextCase) => void;
  onClearFormatting: () => void;
  onSetHighlight: (color: string) => void;
  onSetColor: (color: string) => void;

  // Paragraph states
  isBulletList: boolean;
  onToggleBulletList: () => void;
  isOrderedList: boolean;
  onToggleOrderedList: () => void;
  onIndent: () => void;
  onOutdent: () => void;
  textAlign: string;
  onSetTextAlign: (align: 'left' | 'center' | 'right' | 'justify') => void;
  lineSpacing: number;
  onChangeLineSpacing: (spacing: number) => void;
  showFormattingMarks: boolean;
  onToggleFormattingMarks: () => void;

  // Styles
  currentHeading: number | 'p';
  onApplyHeading: (level: number | 'p') => void;

  // Clipboard & Editing
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  formatPainterActive: boolean;
  onToggleFormatPainter: () => void;
  onOpenFind: () => void;
  onOpenReplace: () => void;
  onSelectAll: () => void;
}

const FONT_FAMILIES = [
  'Calibri',
  'Aptos',
  'Arial',
  'Times New Roman',
  'Georgia',
  'EB Garamond',
  'Inter',
  'Roboto',
  'Merriweather',
  'Fira Code',
];

const FONT_SIZES = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'];

const HIGHLIGHT_COLORS = [
  { name: 'Yellow', color: '#fef08a' },
  { name: 'Bright Green', color: '#bbf7d0' },
  { name: 'Cyan', color: '#a5f3fc' },
  { name: 'Pink', color: '#fbcfe8' },
  { name: 'Orange', color: '#fed7aa' },
  { name: 'None', color: 'transparent' },
];

const FONT_COLORS = [
  { name: 'Automatic / Black', color: '#000000' },
  { name: 'Aura Blue', color: '#2b579a' },
  { name: 'Dark Red', color: '#b91c1c' },
  { name: 'Forest Green', color: '#15803d' },
  { name: 'Purple', color: '#7e22ce' },
  { name: 'Navy', color: '#1e3a8a' },
  { name: 'Slate Gray', color: '#475569' },
];

export const HomeTab: React.FC<HomeTabProps> = ({
  fontFamily,
  onChangeFontFamily,
  fontSize,
  onChangeFontSize,
  onGrowFont,
  onShrinkFont,
  isBold,
  onToggleBold,
  isItalic,
  onToggleItalic,
  isUnderline,
  onToggleUnderline,
  isStrike,
  onToggleStrike,
  isSubscript,
  onToggleSubscript,
  isSuperscript,
  onToggleSuperscript,
  onChangeCase,
  onClearFormatting,
  onSetHighlight,
  onSetColor,
  isBulletList,
  onToggleBulletList,
  isOrderedList,
  onToggleOrderedList,
  onIndent,
  onOutdent,
  textAlign,
  onSetTextAlign,
  lineSpacing,
  onChangeLineSpacing,
  showFormattingMarks,
  onToggleFormattingMarks,
  currentHeading,
  onApplyHeading,
  onCut,
  onCopy,
  onPaste,
  formatPainterActive,
  onToggleFormatPainter,
  onOpenFind,
  onOpenReplace,
  onSelectAll,
}) => {
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showCaseMenu, setShowCaseMenu] = useState(false);
  const [showLineSpacingMenu, setShowLineSpacingMenu] = useState(false);

  return (
    <div className="flex items-stretch gap-1 px-2 py-1 select-none text-slate-700 overflow-x-auto">
      {/* 1. Clipboard Group */}
      <div className="flex flex-col items-center justify-between px-1.5 border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={onPaste}
            className="flex flex-col items-center justify-center p-1.5 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-12"
            title="Paste (Ctrl+V)"
          >
            <Clipboard className="w-5 h-5 text-[#2b579a]" />
            <span className="text-[10px] mt-0.5 font-medium">Paste</span>
          </button>
          <div className="flex flex-col gap-0.5">
            <button
              onClick={onCut}
              className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200/70 rounded text-[11px] text-slate-700"
              title="Cut (Ctrl+X)"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Cut</span>
            </button>
            <button
              onClick={onCopy}
              className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200/70 rounded text-[11px] text-slate-700"
              title="Copy (Ctrl+C)"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
            <button
              onClick={onToggleFormatPainter}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                formatPainterActive ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'hover:bg-slate-200/70 text-slate-700'
              }`}
              title="Format Painter"
            >
              <Paintbrush className="w-3.5 h-3.5 text-amber-600" />
              <span>Format</span>
            </button>
          </div>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Clipboard</span>
      </div>

      {/* 2. Font Group */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex flex-col gap-1">
          {/* Font family & size row */}
          <div className="flex items-center gap-1">
            <select
              value={fontFamily}
              onChange={(e) => onChangeFontFamily(e.target.value)}
              className="h-6 px-1.5 text-xs border border-slate-300 rounded bg-white w-28 focus:outline-none focus:border-[#2b579a]"
            >
              {FONT_FAMILIES.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>

            <select
              value={fontSize}
              onChange={(e) => onChangeFontSize(e.target.value)}
              className="h-6 px-1 text-xs border border-slate-300 rounded bg-white w-12 focus:outline-none focus:border-[#2b579a]"
            >
              {FONT_SIZES.map((sz) => (
                <option key={sz} value={sz}>
                  {sz}
                </option>
              ))}
            </select>

            <button
              onClick={onGrowFont}
              title="Grow Font Size"
              className="p-1 hover:bg-slate-200/70 rounded text-xs font-bold"
            >
              A<sup>+</sup>
            </button>
            <button
              onClick={onShrinkFont}
              title="Shrink Font Size"
              className="p-1 hover:bg-slate-200/70 rounded text-xs"
            >
              A<sup>-</sup>
            </button>

            {/* Change Case Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCaseMenu(!showCaseMenu)}
                title="Change Case"
                className="p-1 hover:bg-slate-200/70 rounded flex items-center"
              >
                <CaseSensitive className="w-3.5 h-3.5" />
                <ChevronDown className="w-2.5 h-2.5 ml-0.5 text-slate-500" />
              </button>
              {showCaseMenu && (
                <div
                  className="absolute left-0 top-full mt-1 w-36 bg-white border border-slate-300 shadow-lg rounded z-40 py-1 text-xs"
                  onClick={() => setShowCaseMenu(false)}
                >
                  <button onClick={() => onChangeCase('sentence')} className="w-full text-left px-3 py-1 hover:bg-slate-100">
                    Sentence case.
                  </button>
                  <button onClick={() => onChangeCase('lowercase')} className="w-full text-left px-3 py-1 hover:bg-slate-100">
                    lowercase
                  </button>
                  <button onClick={() => onChangeCase('uppercase')} className="w-full text-left px-3 py-1 hover:bg-slate-100">
                    UPPERCASE
                  </button>
                  <button onClick={() => onChangeCase('title')} className="w-full text-left px-3 py-1 hover:bg-slate-100">
                    Capitalize Each Word
                  </button>
                  <button onClick={() => onChangeCase('toggle')} className="w-full text-left px-3 py-1 hover:bg-slate-100">
                    tOGGLE cASE
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onClearFormatting}
              title="Clear All Formatting"
              className="p-1 hover:bg-slate-200/70 rounded text-slate-600"
            >
              <RemoveFormatting className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bold, Italic, Underline, Colors row */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={onToggleBold}
              className={`p-1 rounded transition-colors ${isBold ? 'bg-[#2b579a]/20 text-[#2b579a] font-bold' : 'hover:bg-slate-200/70'}`}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onToggleItalic}
              className={`p-1 rounded transition-colors ${isItalic ? 'bg-[#2b579a]/20 text-[#2b579a]' : 'hover:bg-slate-200/70'}`}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onToggleUnderline}
              className={`p-1 rounded transition-colors ${isUnderline ? 'bg-[#2b579a]/20 text-[#2b579a]' : 'hover:bg-slate-200/70'}`}
              title="Underline (Ctrl+U)"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onToggleStrike}
              className={`p-1 rounded transition-colors ${isStrike ? 'bg-[#2b579a]/20 text-[#2b579a]' : 'hover:bg-slate-200/70'}`}
              title="Strikethrough"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onToggleSubscript}
              className={`p-1 rounded transition-colors ${isSubscript ? 'bg-[#2b579a]/20 text-[#2b579a]' : 'hover:bg-slate-200/70'}`}
              title="Subscript"
            >
              <Subscript className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onToggleSuperscript}
              className={`p-1 rounded transition-colors ${isSuperscript ? 'bg-[#2b579a]/20 text-[#2b579a]' : 'hover:bg-slate-200/70'}`}
              title="Superscript"
            >
              <Superscript className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {/* Text Highlight Color Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowHighlightPicker(!showHighlightPicker)}
                title="Text Highlight Color"
                className="p-1 hover:bg-slate-200/70 rounded flex items-center gap-0.5"
              >
                <Highlighter className="w-3.5 h-3.5 text-amber-500" />
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>
              {showHighlightPicker && (
                <div
                  className="absolute left-0 top-full mt-1 bg-white border border-slate-300 shadow-lg rounded p-2 z-40 flex flex-wrap gap-1.5 w-36"
                  onClick={() => setShowHighlightPicker(false)}
                >
                  {HIGHLIGHT_COLORS.map((hc) => (
                    <button
                      key={hc.name}
                      onClick={() => onSetHighlight(hc.color)}
                      className="w-5 h-5 rounded border border-slate-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: hc.color }}
                      title={hc.name}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Font Color Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                title="Font Color"
                className="p-1 hover:bg-slate-200/70 rounded flex items-center gap-0.5"
              >
                <Palette className="w-3.5 h-3.5 text-red-600" />
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>
              {showColorPicker && (
                <div
                  className="absolute left-0 top-full mt-1 bg-white border border-slate-300 shadow-lg rounded p-2 z-40 flex flex-wrap gap-1.5 w-36"
                  onClick={() => setShowColorPicker(false)}
                >
                  {FONT_COLORS.map((fc) => (
                    <button
                      key={fc.name}
                      onClick={() => onSetColor(fc.color)}
                      className="w-5 h-5 rounded border border-slate-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: fc.color }}
                      title={fc.name}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Font</span>
      </div>

      {/* 3. Paragraph Group */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex flex-col gap-1">
          {/* Lists & Indent row */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={onToggleBulletList}
              className={`p-1 rounded transition-colors ${isBulletList ? 'bg-[#2b579a]/20 text-[#2b579a]' : 'hover:bg-slate-200/70'}`}
              title="Bulleted List (Ctrl+Shift+8)"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onToggleOrderedList}
              className={`p-1 rounded transition-colors ${isOrderedList ? 'bg-[#2b579a]/20 text-[#2b579a]' : 'hover:bg-slate-200/70'}`}
              title="Numbered List (Ctrl+Shift+7)"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button onClick={onOutdent} className="p-1 hover:bg-slate-200/70 rounded" title="Decrease Indent">
              <Outdent className="w-3.5 h-3.5" />
            </button>
            <button onClick={onIndent} className="p-1 hover:bg-slate-200/70 rounded" title="Increase Indent">
              <Indent className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onToggleFormattingMarks}
              className={`p-1 rounded transition-colors ${showFormattingMarks ? 'bg-[#2b579a]/20 text-[#2b579a]' : 'hover:bg-slate-200/70'}`}
              title="Show/Hide Formatting Marks (¶)"
            >
              <Pilcrow className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Alignment & Line Spacing row */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => onSetTextAlign('left')}
              className={`p-1 rounded ${textAlign === 'left' ? 'bg-[#2b579a]/20 text-[#2b579a]' : 'hover:bg-slate-200/70'}`}
              title="Align Left (Ctrl+L)"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSetTextAlign('center')}
              className={`p-1 rounded ${textAlign === 'center' ? 'bg-[#2b579a]/20 text-[#2b579a]' : 'hover:bg-slate-200/70'}`}
              title="Center (Ctrl+E)"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSetTextAlign('right')}
              className={`p-1 rounded ${textAlign === 'right' ? 'bg-[#2b579a]/20 text-[#2b579a]' : 'hover:bg-slate-200/70'}`}
              title="Align Right (Ctrl+R)"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSetTextAlign('justify')}
              className={`p-1 rounded ${textAlign === 'justify' ? 'bg-[#2b579a]/20 text-[#2b579a]' : 'hover:bg-slate-200/70'}`}
              title="Justify (Ctrl+J)"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>

            {/* Line Spacing Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLineSpacingMenu(!showLineSpacingMenu)}
                title="Line and Paragraph Spacing"
                className="p-1 hover:bg-slate-200/70 rounded flex items-center text-xs font-semibold px-1.5"
              >
                <span>{lineSpacing}x</span>
                <ChevronDown className="w-2.5 h-2.5 ml-0.5 text-slate-400" />
              </button>
              {showLineSpacingMenu && (
                <div
                  className="absolute left-0 top-full mt-1 bg-white border border-slate-300 shadow-lg rounded py-1 z-40 w-24 text-xs"
                  onClick={() => setShowLineSpacingMenu(false)}
                >
                  {[1.0, 1.15, 1.5, 2.0, 2.5, 3.0].map((spacing) => (
                    <button
                      key={spacing}
                      onClick={() => onChangeLineSpacing(spacing)}
                      className={`w-full text-left px-3 py-1 hover:bg-slate-100 flex items-center justify-between ${
                        lineSpacing === spacing ? 'font-bold text-[#2b579a]' : ''
                      }`}
                    >
                      <span>{spacing}</span>
                      {lineSpacing === spacing && <Check className="w-3 h-3 text-[#2b579a]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Paragraph</span>
      </div>

      {/* 4. Styles Gallery */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-1.5 h-11">
          <button
            onClick={() => onApplyHeading('p')}
            className={`flex flex-col items-center justify-center px-2 py-1 h-10 rounded border transition-colors ${
              currentHeading === 'p' ? 'border-[#2b579a] bg-blue-50/70' : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
            title="Normal text"
          >
            <span className="text-xs font-normal">AaBbCc</span>
            <span className="text-[10px] text-slate-500">Normal</span>
          </button>

          <button
            onClick={() => onApplyHeading(1)}
            className={`flex flex-col items-center justify-center px-2 py-1 h-10 rounded border transition-colors ${
              currentHeading === 1 ? 'border-[#2b579a] bg-blue-50/70' : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
            title="Heading 1"
          >
            <span className="text-xs font-bold text-[#2b579a]">AaBbCc</span>
            <span className="text-[10px] text-slate-500">Heading 1</span>
          </button>

          <button
            onClick={() => onApplyHeading(2)}
            className={`flex flex-col items-center justify-center px-2 py-1 h-10 rounded border transition-colors ${
              currentHeading === 2 ? 'border-[#2b579a] bg-blue-50/70' : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
            title="Heading 2"
          >
            <span className="text-xs font-semibold text-[#1e3a8a]">AaBbCc</span>
            <span className="text-[10px] text-slate-500">Heading 2</span>
          </button>

          <button
            onClick={() => onApplyHeading(3)}
            className={`flex flex-col items-center justify-center px-2 py-1 h-10 rounded border transition-colors ${
              currentHeading === 3 ? 'border-[#2b579a] bg-blue-50/70' : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
            title="Heading 3"
          >
            <span className="text-xs font-medium text-slate-800">AaBbCc</span>
            <span className="text-[10px] text-slate-500">Heading 3</span>
          </button>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Styles</span>
      </div>

      {/* 5. Editing Group */}
      <div className="flex flex-col items-center justify-between px-2 shrink-0">
        <div className="flex flex-col gap-0.5">
          <button
            onClick={onOpenFind}
            className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-slate-200/70 rounded text-xs text-slate-700"
            title="Find text (Ctrl+F)"
          >
            <Search className="w-3.5 h-3.5 text-[#2b579a]" />
            <span>Find</span>
          </button>
          <button
            onClick={onOpenReplace}
            className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-slate-200/70 rounded text-xs text-slate-700"
            title="Replace text (Ctrl+H)"
          >
            <Replace className="w-3.5 h-3.5 text-blue-600" />
            <span>Replace</span>
          </button>
          <button
            onClick={onSelectAll}
            className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-slate-200/70 rounded text-xs text-slate-700"
            title="Select All (Ctrl+A)"
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Select All</span>
          </button>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Editing</span>
      </div>
    </div>
  );
};
