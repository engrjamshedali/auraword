import React from 'react';
import { PageMargins } from '../../types/document';

interface RulerProps {
  pageWidth: number;
  margins: PageMargins;
  zoom: number;
  onUpdateMargins?: (margins: Partial<PageMargins>) => void;
}

export const Ruler: React.FC<RulerProps> = ({
  pageWidth,
  margins,
  zoom,
}) => {
  // 1 inch = 96px in 96 DPI screen
  const totalInches = Math.round(pageWidth / 96);
  const leftMarginPx = margins.left * 96;
  const rightMarginPx = pageWidth - (margins.right * 96);

  return (
    <div
      className="h-6 bg-[#f0f4f8] border-b border-slate-300 relative select-none flex items-center justify-center shrink-0 overflow-hidden"
      style={{ minWidth: `${pageWidth * zoom}px` }}
    >
      <div
        className="h-full relative bg-white border-x border-slate-300"
        style={{
          width: `${pageWidth * zoom}px`,
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
        }}
      >
        {/* Left Margin Grey Zone */}
        <div
          className="absolute top-0 bottom-0 left-0 bg-slate-200/70 border-r border-slate-400"
          style={{ width: `${leftMarginPx}px` }}
        >
          {/* Margin Drag Triangle Marker */}
          <div className="absolute right-0 top-0 bottom-0 w-2 flex flex-col justify-between items-center -mr-1">
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#2b579a]" />
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[5px] border-b-[#2b579a]" />
          </div>
        </div>

        {/* Right Margin Grey Zone */}
        <div
          className="absolute top-0 bottom-0 right-0 bg-slate-200/70 border-l border-slate-400"
          style={{ width: `${margins.right * 96}px` }}
        >
          {/* Margin Drag Triangle Marker */}
          <div className="absolute left-0 top-0 bottom-0 w-2 flex flex-col justify-between items-center -ml-1">
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#2b579a]" />
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[5px] border-b-[#2b579a]" />
          </div>
        </div>

        {/* Inch markings and numbers */}
        {Array.from({ length: totalInches + 1 }).map((_, i) => {
          const x = i * 96;
          if (x > pageWidth) return null;
          return (
            <div key={i} className="absolute top-0 h-full flex flex-col items-center" style={{ left: `${x}px` }}>
              <span className="text-[9px] font-mono font-semibold text-slate-500 mt-0.5">
                {i}
              </span>
              <div className="w-px h-2.5 bg-slate-400 mt-auto" />
            </div>
          );
        })}

        {/* Half-inch ticks */}
        {Array.from({ length: totalInches }).map((_, i) => {
          const x = i * 96 + 48;
          if (x > pageWidth) return null;
          return (
            <div
              key={`half-${i}`}
              className="absolute bottom-0 w-px h-1.5 bg-slate-300"
              style={{ left: `${x}px` }}
            />
          );
        })}
      </div>
    </div>
  );
};
