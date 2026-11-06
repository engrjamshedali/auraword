import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Upload, Globe, Check } from 'lucide-react';

interface InsertImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (src: string, alt: string, caption?: string) => void;
}

const SAMPLE_IMAGES = [
  {
    name: 'Executive Workspace',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Corporate Analytics',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Project Roadmap',
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
  },
];

export const InsertImageModal: React.FC<InsertImageModalProps> = ({
  isOpen,
  onClose,
  onInsertImage,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'samples'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewSrc(result);
        if (!altText) setAltText(file.name.replace(/\.[^/.]+$/, ''));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_IMAGES[0]) => {
    setPreviewSrc(sample.url);
    setImageUrl(sample.url);
    setAltText(sample.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSrc = previewSrc || imageUrl;
    if (!finalSrc) return;
    onInsertImage(finalSrc, altText || 'Inserted image', caption);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden text-slate-800 text-sm">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#2b579a] text-white">
          <div className="flex items-center gap-2 font-semibold">
            <ImageIcon className="w-4 h-4" />
            <span>Insert Picture</span>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1 hover:bg-white/20 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2 px-3 font-medium border-b-2 transition-colors ${
              activeTab === 'upload' ? 'border-[#2b579a] text-[#2b579a]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Upload Device
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`pb-2 px-3 font-medium border-b-2 transition-colors ${
              activeTab === 'url' ? 'border-[#2b579a] text-[#2b579a]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            From Web URL
          </button>
          <button
            onClick={() => setActiveTab('samples')}
            className={`pb-2 px-3 font-medium border-b-2 transition-colors ${
              activeTab === 'samples' ? 'border-[#2b579a] text-[#2b579a]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sample Gallery
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#2b579a] hover:bg-blue-50/50 transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto text-[#2b579a] mb-2" />
                <p className="font-medium text-slate-700 text-xs">Click to browse image from device</p>
                <p className="text-[11px] text-slate-400 mt-1">Supports PNG, JPG, GIF, WebP, SVG</p>
              </div>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600">Image Web Address (URL):</label>
              <div className="relative">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setPreviewSrc(e.target.value);
                  }}
                  placeholder="https://example.com/image.png"
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#2b579a]"
                />
                <Globe className="w-4 h-4 absolute left-2.5 top-2 text-slate-400" />
              </div>
            </div>
          )}

          {activeTab === 'samples' && (
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_IMAGES.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className={`border rounded overflow-hidden cursor-pointer hover:border-[#2b579a] transition-all ${
                    previewSrc === sample.url ? 'ring-2 ring-[#2b579a] border-transparent' : 'border-slate-200'
                  }`}
                >
                  <img src={sample.url} alt={sample.name} className="h-16 w-full object-cover" />
                  <p className="text-[10px] p-1 text-center font-medium truncate bg-slate-50 text-slate-700">
                    {sample.name}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Preview Box */}
          {previewSrc && (
            <div className="border border-slate-200 rounded p-2 bg-slate-50">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Preview:</span>
              <img
                src={previewSrc}
                alt="Selected"
                className="max-h-32 mx-auto rounded object-contain border border-slate-200"
                onError={() => setPreviewSrc(null)}
              />
            </div>
          )}

          <div className="space-y-2 text-xs">
            <div>
              <label className="block font-medium text-slate-600 mb-0.5">Alt Text (Accessibility):</label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Brief description of the image"
                className="w-full px-2.5 py-1 border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-600 mb-0.5">Caption (Optional):</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Figure 1: Project overview"
                className="w-full px-2.5 py-1 border border-slate-300 rounded text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!previewSrc && !imageUrl}
              className="px-4 py-1.5 bg-[#2b579a] text-white rounded text-xs font-semibold hover:bg-[#1e3f70] disabled:opacity-50 shadow-xs"
            >
              Insert Picture
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
