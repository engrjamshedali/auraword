import React, { useState, useRef } from 'react';
import { X, Users, Upload, Plus, Trash2, Check, FileSpreadsheet } from 'lucide-react';
import { MailMergeContact } from '../../types/document';
import { parseMailMergeCsv } from '../../utils/documentLogic';

interface MailMergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: MailMergeContact[];
  onUpdateRecipients: (recipients: MailMergeContact[]) => void;
  onInsertField: (fieldTag: string) => void;
}

export const MailMergeModal: React.FC<MailMergeModalProps> = ({
  isOpen,
  onClose,
  recipients,
  onUpdateRecipients,
  onInsertField,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [contacts, setContacts] = useState<MailMergeContact[]>(recipients);

  if (!isOpen) return null;

  // Extract all distinct keys across contacts
  const fields = Array.from(
    new Set(contacts.flatMap(c => Object.keys(c)))
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      if (csvText) {
        const parsed = parseMailMergeCsv(csvText);
        if (parsed.length > 0) {
          setContacts(parsed);
          onUpdateRecipients(parsed);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleAddRow = () => {
    const newContact: MailMergeContact = {
      FirstName: 'New',
      LastName: 'Recipient',
      Company: 'Organization',
      City: 'City',
    };
    const updated = [...contacts, newContact];
    setContacts(updated);
    onUpdateRecipients(updated);
  };

  const handleDeleteRow = (index: number) => {
    const updated = contacts.filter((_, idx) => idx !== index);
    setContacts(updated);
    onUpdateRecipients(updated);
  };

  const handleCellChange = (rowIndex: number, field: string, value: string) => {
    const updated = [...contacts];
    updated[rowIndex] = { ...updated[rowIndex], [field]: value };
    setContacts(updated);
    onUpdateRecipients(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden text-slate-800 text-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#2b579a] text-white">
          <div className="flex items-center gap-2 font-semibold text-base">
            <Users className="w-5 h-5" />
            <span>Mail Merge Recipients & Field Manager</span>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1 hover:bg-white/20 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-xs font-medium hover:bg-slate-100 transition-colors shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              <span>Import CSV List</span>
            </button>
            <button
              onClick={handleAddRow}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-xs font-medium hover:bg-slate-100 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Add Recipient</span>
            </button>
          </div>

          {/* Quick field inserters */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-medium mr-1">Insert Merge Tag:</span>
            {fields.slice(0, 4).map((f) => (
              <button
                key={f}
                onClick={() => {
                  onInsertField(`{{${f}}}`);
                }}
                className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[11px] font-mono font-medium border border-blue-200"
              >
                {`{{${f}}}`}
              </button>
            ))}
          </div>
        </div>

        {/* Recipients Table */}
        <div className="p-5 max-h-[50vh] overflow-auto">
          {contacts.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-xs">
              <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>No recipients in merge list. Import a CSV or add contacts manually.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="p-2 w-10 text-center">#</th>
                    {fields.map((f) => (
                      <th key={f} className="p-2 border-l border-slate-200">
                        {f}
                      </th>
                    ))}
                    <th className="p-2 w-12 text-center border-l border-slate-200">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact, rowIdx) => (
                    <tr key={rowIdx} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-2 text-center font-mono text-slate-400">{rowIdx + 1}</td>
                      {fields.map((f) => (
                        <td key={f} className="p-1 border-l border-slate-200">
                          <input
                            type="text"
                            value={contact[f] || ''}
                            onChange={(e) => handleCellChange(rowIdx, f, e.target.value)}
                            className="w-full px-2 py-1 bg-transparent hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#2b579a] rounded text-xs border-none outline-none"
                          />
                        </td>
                      ))}
                      <td className="p-1 text-center border-l border-slate-200">
                        <button
                          onClick={() => handleDeleteRow(rowIdx)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                          title="Remove row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-200">
          <span className="text-xs text-slate-500 font-medium">
            Total Recipients: <strong>{contacts.length}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-[#2b579a] text-white text-xs font-semibold rounded hover:bg-[#1e3f70] transition-colors shadow-xs"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
