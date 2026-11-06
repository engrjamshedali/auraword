import React, { useState } from 'react';
import {
  Mail,
  Users,
  Tag,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { MailMergeContact } from '../../types/document';

interface MailingsTabProps {
  onOpenRecipientsModal: () => void;
  recipients: MailMergeContact[];
  onInsertMergeField: (fieldTag: string) => void;
  isPreviewActive: boolean;
  onTogglePreview: () => void;
  activeRecipientIndex: number;
  onNavigateRecipient: (index: number) => void;
  onFinishAndMerge: () => void;
}

export const MailingsTab: React.FC<MailingsTabProps> = ({
  onOpenRecipientsModal,
  recipients,
  onInsertMergeField,
  isPreviewActive,
  onTogglePreview,
  activeRecipientIndex,
  onNavigateRecipient,
  onFinishAndMerge,
}) => {
  const [showFieldsMenu, setShowFieldsMenu] = useState(false);

  // Available field tags from contacts
  const fields = recipients.length > 0 ? Object.keys(recipients[0]) : ['FirstName', 'LastName', 'Company', 'City'];

  return (
    <div className="flex items-stretch gap-1 px-2 py-1 select-none text-slate-700 overflow-x-auto">
      {/* 1. Start Mail Merge */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenRecipientsModal}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-16"
            title="Start Letter or Document Merge"
          >
            <Mail className="w-5 h-5 text-[#2b579a]" />
            <span className="text-[10px] mt-0.5 font-medium">Letters</span>
          </button>

          <button
            onClick={onOpenRecipientsModal}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-16"
            title="Select and manage recipient list"
          >
            <Users className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] mt-0.5 font-medium">Recipients</span>
          </button>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Start Mail Merge</span>
      </div>

      {/* 2. Write & Insert Fields */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="relative">
          <button
            onClick={() => setShowFieldsMenu(!showFieldsMenu)}
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-16"
            title="Insert dynamic merge field tag"
          >
            <Tag className="w-5 h-5 text-indigo-600" />
            <div className="flex items-center text-[10px] mt-0.5 font-medium">
              <span>Insert Field</span>
              <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
            </div>
          </button>
          {showFieldsMenu && (
            <div
              className="absolute left-0 top-full mt-1 bg-white border border-slate-300 shadow-xl rounded-lg py-1 z-40 w-44 text-xs font-mono"
              onClick={() => setShowFieldsMenu(false)}
            >
              {fields.map((field) => (
                <button
                  key={field}
                  onClick={() => onInsertMergeField(`{{${field}}}`)}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>{`{{${field}}}`}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Merge Fields</span>
      </div>

      {/* 3. Preview Results */}
      <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-1.5 pt-0.5">
          <button
            onClick={onTogglePreview}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors border ${
              isPreviewActive
                ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
            title="Toggle live recipient data preview"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Results</span>
          </button>

          {/* Record Navigator */}
          <div className="flex items-center gap-1 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs">
            <button
              onClick={() => onNavigateRecipient(Math.max(0, activeRecipientIndex - 1))}
              disabled={activeRecipientIndex <= 0}
              className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30"
              title="Previous recipient"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-[11px] font-semibold text-slate-700">
              {recipients.length > 0 ? `${activeRecipientIndex + 1} of ${recipients.length}` : '0 of 0'}
            </span>
            <button
              onClick={() => onNavigateRecipient(Math.min(recipients.length - 1, activeRecipientIndex + 1))}
              disabled={activeRecipientIndex >= recipients.length - 1}
              className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30"
              title="Next recipient"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Preview Results</span>
      </div>

      {/* 4. Finish & Merge */}
      <div className="flex flex-col items-center justify-between px-2 shrink-0">
        <button
          onClick={onFinishAndMerge}
          className="flex flex-col items-center justify-center p-1 hover:bg-slate-200/70 rounded text-slate-800 transition-colors w-16"
          title="Complete mail merge and generate individual documents"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-[10px] mt-0.5 font-medium">Finish & Merge</span>
        </button>
        <span className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">Finish</span>
      </div>
    </div>
  );
};
