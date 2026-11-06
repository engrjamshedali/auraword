import React, { useState } from 'react';
import {
  HelpCircle,
  Keyboard,
  Info,
  Sparkles,
  FileText,
  BookOpen,
} from 'lucide-react';

interface HelpTabProps {
  onOpenShortcuts: () => void;
  onLoadSample: (sampleId: string) => void;
  onOpenAbout: () => void;
}

export const HelpTab: React.FC<HelpTabProps> = ({
  onOpenShortcuts,
  onLoadSample,
  onOpenAbout,
}) => {
  return (
    <div className="flex items-stretch gap-1 px-2 py-1 select-none text-slate-700 overflow-x-auto">
      {/* 1. Help & Shortcuts */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenShortcuts}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-16"
            title="Keyboard Shortcuts Guide"
          >
            <Keyboard className="w-5 h-5 text-[#2b579a]" />
            <span className="text-[10px] mt-0.5 font-medium">Shortcuts</span>
          </button>

          <button
            onClick={onOpenAbout}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
            title="About AuraWord version and specs"
          >
            <Info className="w-5 h-5 text-indigo-600" />
            <span className="text-[10px] mt-0.5 font-medium">About</span>
          </button>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Help & Support</span>
      </div>

      {/* 2. Sample Demo Documents */}
      <div className="flex flex-col items-center justify-between px-2 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onLoadSample('project-proposal')}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-20"
            title="Load Business Proposal Sample"
          >
            <FileText className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] mt-0.5 font-medium">Proposal Demo</span>
          </button>

          <button
            onClick={() => onLoadSample('academic-paper')}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-20"
            title="Load Academic Research Paper"
          >
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="text-[10px] mt-0.5 font-medium">Academic Demo</span>
          </button>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Sample Templates</span>
      </div>
    </div>
  );
};
