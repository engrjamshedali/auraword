import React from 'react';
import {
  CheckCheck,
  FileSpreadsheet,
  MessageSquarePlus,
  MessageSquare,
  History,
  Check,
  X,
  ShieldAlert,
  Lock,
  Unlock,
} from 'lucide-react';

interface ReviewTabProps {
  onCheckProofing: () => void;
  onOpenWordCount: () => void;
  onAddComment: () => void;
  onToggleComments: () => void;
  commentCount: number;
  trackingEnabled: boolean;
  onToggleTracking: () => void;
  pendingTrackChangesCount: number;
  onAcceptAllChanges: () => void;
  onRejectAllChanges: () => void;
  isReadOnly: boolean;
  onToggleReadOnly: () => void;
}

export const ReviewTab: React.FC<ReviewTabProps> = ({
  onCheckProofing,
  onOpenWordCount,
  onAddComment,
  onToggleComments,
  commentCount,
  trackingEnabled,
  onToggleTracking,
  pendingTrackChangesCount,
  onAcceptAllChanges,
  onRejectAllChanges,
  isReadOnly,
  onToggleReadOnly,
}) => {
  return (
    <div className="flex items-stretch gap-1 px-2 py-1 select-none text-slate-700 overflow-x-auto">
      {/* 1. Proofing Group */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={onCheckProofing}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-16"
            title="Check spelling and grammar"
          >
            <CheckCheck className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] mt-0.5 font-medium">Spelling</span>
          </button>

          <button
            onClick={onOpenWordCount}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-16"
            title="Detailed word count and readability stats"
          >
            <FileSpreadsheet className="w-5 h-5 text-[#2b579a]" />
            <span className="text-[10px] mt-0.5 font-medium">Word Count</span>
          </button>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Proofing</span>
      </div>

      {/* 2. Comments Group */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={onAddComment}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-14"
            title="Add a new comment on selected text"
          >
            <MessageSquarePlus className="w-5 h-5 text-blue-600" />
            <span className="text-[10px] mt-0.5 font-medium">New Comment</span>
          </button>

          <button
            onClick={onToggleComments}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-16 relative"
            title="Show comments sidebar"
          >
            <MessageSquare className="w-5 h-5 text-slate-600" />
            <span className="text-[10px] mt-0.5 font-medium">Show ({commentCount})</span>
          </button>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Comments</span>
      </div>

      {/* 3. Tracking Changes Group */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleTracking}
            className={`flex flex-col items-center justify-center p-1 rounded transition-colors w-16 border ${
              trackingEnabled
                ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-xs'
                : 'border-transparent hover:bg-slate-200/70 text-slate-800'
            }`}
            title="Toggle Track Changes recording"
          >
            <History className={`w-5 h-5 ${trackingEnabled ? 'text-amber-700' : 'text-slate-600'}`} />
            <span className="text-[10px] mt-0.5 font-medium">
              {trackingEnabled ? 'Tracking ON' : 'Track Changes'}
            </span>
          </button>

          <div className="flex flex-col gap-0.5">
            <button
              onClick={onAcceptAllChanges}
              disabled={pendingTrackChangesCount === 0}
              className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded text-[11px] font-medium disabled:opacity-40"
              title="Accept all revisions"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept All ({pendingTrackChangesCount})</span>
            </button>
            <button
              onClick={onRejectAllChanges}
              disabled={pendingTrackChangesCount === 0}
              className="flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded text-[11px] font-medium disabled:opacity-40"
              title="Reject all revisions"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reject All</span>
            </button>
          </div>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Tracking</span>
      </div>

      {/* 4. Protect Group */}
      <div className="flex flex-col items-center justify-between px-2 shrink-0">
        <button
          onClick={onToggleReadOnly}
          className={`flex flex-col items-center justify-center p-1 rounded transition-colors w-16 ${
            isReadOnly ? 'bg-amber-100 text-amber-900' : 'hover:bg-slate-200/70 text-slate-800'
          }`}
          title={isReadOnly ? 'Unlock document for editing' : 'Lock document as read-only'}
        >
          {isReadOnly ? <Lock className="w-5 h-5 text-amber-600" /> : <Unlock className="w-5 h-5 text-slate-500" />}
          <span className="text-[10px] mt-0.5 font-medium">
            {isReadOnly ? 'Protected' : 'Restrict'}
          </span>
        </button>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Protect</span>
      </div>
    </div>
  );
};
