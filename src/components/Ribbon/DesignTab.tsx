import React, { useState } from 'react';
import {
  Palette,
  Droplet,
  Stamp,
  Square,
  Check,
  ChevronDown,
} from 'lucide-react';
import { ThemeSettings, DocumentTheme } from '../../types/document';

interface DesignTabProps {
  theme: ThemeSettings;
  onUpdateTheme: (theme: Partial<ThemeSettings>) => void;
}

const THEMES: { id: DocumentTheme; name: string; primary: string; bodyFont: string; headFont: string }[] = [
  { id: 'Office', name: 'Office Classic', primary: '#2b579a', bodyFont: 'Calibri, sans-serif', headFont: 'Calibri Light, sans-serif' },
  { id: 'Modern', name: 'Modern Aptos', primary: '#0284c7', bodyFont: 'Aptos, sans-serif', headFont: 'Aptos Display, sans-serif' },
  { id: 'Slate', name: 'Slate Minimal', primary: '#334155', bodyFont: 'Inter, sans-serif', headFont: 'Inter, sans-serif' },
  { id: 'Emerald', name: 'Emerald Executive', primary: '#059669', bodyFont: 'Roboto, sans-serif', headFont: 'Roboto, sans-serif' },
  { id: 'Crimson', name: 'Crimson Editorial', primary: '#991b1b', bodyFont: 'EB Garamond, serif', headFont: 'Georgia, serif' },
  { id: 'Ocean', name: 'Ocean Depth', primary: '#1e40af', bodyFont: 'Merriweather, serif', headFont: 'Aptos, sans-serif' },
];

const WATERMARKS = ['None', 'DRAFT', 'CONFIDENTIAL', 'DO NOT COPY', 'SAMPLE', 'INTERNAL USE'];

const PAGE_COLORS = [
  { name: 'Pure White', color: '#ffffff' },
  { name: 'Ivory Soft', color: '#fefcf8' },
  { name: 'Warm Cream', color: '#fcf8ee' },
  { name: 'Executive Mist', color: '#f8fafc' },
  { name: 'Soft Mint', color: '#f0fdf4' },
];

export const DesignTab: React.FC<DesignTabProps> = ({ theme, onUpdateTheme }) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showWatermarkMenu, setShowWatermarkMenu] = useState(false);
  const [showPageColorMenu, setShowPageColorMenu] = useState(false);
  const [showBorderMenu, setShowBorderMenu] = useState(false);

  return (
    <div className="flex items-stretch gap-1 px-2 py-1 select-none text-slate-700 overflow-x-auto">
      {/* 1. Document Themes */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-16"
            title="Choose Document Theme"
          >
            <Palette className="w-5 h-5 text-[#2b579a]" />
            <div className="flex items-center text-[10px] mt-0.5 font-medium">
              <span>{theme.themeName}</span>
              <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
            </div>
          </button>

          {showThemeMenu && (
            <div
              className="absolute left-0 top-full mt-1 bg-white border border-slate-300 shadow-xl rounded-lg py-1 z-40 w-52 text-xs"
              onClick={() => setShowThemeMenu(false)}
            >
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() =>
                    onUpdateTheme({
                      themeName: t.id,
                      primaryColor: t.primary,
                      fontFamily: t.bodyFont,
                      headingFont: t.headFont,
                    })
                  }
                  className={`w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center justify-between ${
                    theme.themeName === t.id ? 'font-bold bg-blue-50 text-[#2b579a]' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.primary }} />
                    <span>{t.name}</span>
                  </div>
                  {theme.themeName === t.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Themes</span>
      </div>

      {/* 2. Page Background Group */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-1">
          {/* Watermark */}
          <div className="relative">
            <button
              onClick={() => setShowWatermarkMenu(!showWatermarkMenu)}
              className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-16"
              title="Add a watermark behind text"
            >
              <Stamp className="w-5 h-5 text-amber-600" />
              <div className="flex items-center text-[10px] mt-0.5 font-medium">
                <span>Watermark</span>
                <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
              </div>
            </button>
            {showWatermarkMenu && (
              <div
                className="absolute left-0 top-full mt-1 bg-white border border-slate-300 shadow-xl rounded-lg py-1 z-40 w-44 text-xs font-mono"
                onClick={() => setShowWatermarkMenu(false)}
              >
                {WATERMARKS.map((wm) => (
                  <button
                    key={wm}
                    onClick={() => onUpdateTheme({ watermark: wm === 'None' ? null : wm })}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between ${
                      (theme.watermark === wm || (!theme.watermark && wm === 'None')) ? 'font-bold text-[#2b579a]' : ''
                    }`}
                  >
                    <span>{wm}</span>
                    {(theme.watermark === wm || (!theme.watermark && wm === 'None')) && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Page Color */}
          <div className="relative">
            <button
              onClick={() => setShowPageColorMenu(!showPageColorMenu)}
              className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-16"
              title="Page background color"
            >
              <Droplet className="w-5 h-5 text-blue-600" />
              <div className="flex items-center text-[10px] mt-0.5 font-medium">
                <span>Page Color</span>
                <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
              </div>
            </button>
            {showPageColorMenu && (
              <div
                className="absolute left-0 top-full mt-1 bg-white border border-slate-300 shadow-xl rounded-lg py-1 z-40 w-44 text-xs"
                onClick={() => setShowPageColorMenu(false)}
              >
                {PAGE_COLORS.map((pc) => (
                  <button
                    key={pc.name}
                    onClick={() => onUpdateTheme({ pageColor: pc.color })}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <span className="w-4 h-4 rounded border border-slate-300" style={{ backgroundColor: pc.color }} />
                    <span>{pc.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Page Borders */}
          <div className="relative">
            <button
              onClick={() => setShowBorderMenu(!showBorderMenu)}
              className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-16"
              title="Page Border Styling"
            >
              <Square className="w-5 h-5 text-slate-600" />
              <div className="flex items-center text-[10px] mt-0.5 font-medium">
                <span>Border</span>
                <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
              </div>
            </button>
            {showBorderMenu && (
              <div
                className="absolute left-0 top-full mt-1 bg-white border border-slate-300 shadow-xl rounded-lg py-1 z-40 w-36 text-xs"
                onClick={() => setShowBorderMenu(false)}
              >
                {(['none', 'box', 'shadow', 'double'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => onUpdateTheme({ pageBorder: b })}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 capitalize flex items-center justify-between ${
                      theme.pageBorder === b ? 'font-bold text-[#2b579a]' : ''
                    }`}
                  >
                    <span>{b === 'none' ? 'No Border' : `${b} Border`}</span>
                    {theme.pageBorder === b && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Page Background</span>
      </div>
    </div>
  );
};
