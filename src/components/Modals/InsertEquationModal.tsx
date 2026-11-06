import React, { useState } from 'react';
import { X, Variable, Check } from 'lucide-react';

interface InsertEquationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertEquationHtml: (equationHtml: string) => void;
}

const COMMON_SYMBOLS = [
  'α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'μ', 'π', 'σ', 'ω',
  '±', '×', '÷', '≠', '≈', '≤', '≥', '∞', '∑', '∏', '∫', '∂', '√',
  '∈', '∉', '⊂', '⊆', '∪', '∩', '∧', '∨', '¬', '→', '⇒', '⇔',
  '°', '′', '″', '‰', '½', '¼', '¾', '²', '³', '⁻¹',
];

const EQUATION_PRESETS = [
  { name: 'Quadratic Formula', formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', display: 'x = (-b ± √(b² - 4ac)) / (2a)' },
  { name: 'Pythagorean Theorem', formula: 'a^2 + b^2 = c^2', display: 'a² + b² = c²' },
  { name: "Einstein's Mass-Energy", formula: 'E = mc^2', display: 'E = mc²' },
  { name: 'Euler’s Identity', formula: 'e^{i\\pi} + 1 = 0', display: 'e^(iπ) + 1 = 0' },
  { name: 'Area of a Circle', formula: 'A = \\pi r^2', display: 'A = πr²' },
  { name: 'Normal Distribution', formula: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}(\\frac{x-\\mu}{\\sigma})^2}', display: 'f(x) = (1 / (σ√(2π))) · e^(-½((x-μ)/σ)²)' },
];

export const InsertEquationModal: React.FC<InsertEquationModalProps> = ({
  isOpen,
  onClose,
  onInsertEquationHtml,
}) => {
  const [equationText, setEquationText] = useState('f(x) = a x^2 + b x + c');

  if (!isOpen) return null;

  const handleAppendSymbol = (sym: string) => {
    setEquationText(prev => prev + sym);
  };

  const handleInsert = () => {
    if (!equationText.trim()) return;

    // Format equation in professional mathematical typography box
    const formattedHtml = `
      <div style="display: inline-block; padding: 4px 12px; margin: 4px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; font-family: 'Cambria Math', 'Times New Roman', serif; font-style: italic; font-size: 1.1em; color: #0f172a;" contenteditable="false">
        ${equationText}
      </div>
      &nbsp;
    `;
    onInsertEquationHtml(formattedHtml);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden text-slate-800 text-sm">
        <div className="flex items-center justify-between px-5 py-3 bg-[#2b579a] text-white">
          <div className="flex items-center gap-2 font-semibold">
            <Variable className="w-5 h-5" />
            <span>Insert Equation & Math Symbols</span>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1 hover:bg-white/20 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Symbol Keyboard Palette */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Insert Mathematical Symbol:
            </label>
            <div className="grid grid-cols-10 gap-1 p-2 bg-slate-50 border border-slate-200 rounded">
              {COMMON_SYMBOLS.map((sym, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAppendSymbol(sym)}
                  className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded hover:border-[#2b579a] hover:bg-blue-50 font-serif text-sm text-slate-800 transition-colors"
                  title={`Insert ${sym}`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Standard Formula Presets:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {EQUATION_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setEquationText(preset.display)}
                  className="text-left p-2 border border-slate-200 rounded hover:border-[#2b579a] hover:bg-blue-50 transition-colors"
                >
                  <div className="font-semibold text-slate-700 truncate">{preset.name}</div>
                  <div className="font-serif italic text-slate-500 text-[11px] truncate mt-0.5">{preset.display}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Equation Input & Preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Equation Expression:</label>
            <textarea
              rows={3}
              value={equationText}
              onChange={(e) => setEquationText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono focus:ring-1 focus:ring-[#2b579a]"
              placeholder="e.g. y = mx + b or ∫ f(x) dx"
            />
          </div>

          {/* Live Preview Box */}
          <div className="p-3 bg-slate-100 rounded border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block mb-1 uppercase tracking-wider font-semibold">Rendered Preview</span>
            <div className="font-serif italic text-lg text-slate-900 min-h-[30px] flex items-center justify-center">
              {equationText || 'Type equation...'}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-3 bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-300 rounded text-xs text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleInsert}
            className="px-5 py-1.5 bg-[#2b579a] text-white rounded text-xs font-semibold hover:bg-[#1e3f70] shadow-xs"
          >
            Insert Equation
          </button>
        </div>
      </div>
    </div>
  );
};
