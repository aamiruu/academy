import React, { useState } from 'react';
import { FolderSearch, ExternalLink, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface FolderInputProps {
  onLoadFolder: (urlOrId: string) => void;
  isLoading: boolean;
  currentFolderId: string;
}

const DEFAULT_LINK = 'https://drive.google.com/drive/folders/1Lmpdb-9-Z7xLjRF84hNxDsJxd0jOFYUh?usp=drive_link';

export const FolderInput: React.FC<FolderInputProps> = ({
  onLoadFolder,
  isLoading,
  currentFolderId
}) => {
  const [urlInput, setUrlInput] = useState(DEFAULT_LINK);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onLoadFolder(urlInput.trim());
    }
  };

  return (
    <div className="bg-[#0E0E0E] border-b border-[#262626] py-3.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <FolderSearch className="w-4 h-4 text-blue-400" />
            </div>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste Google Drive Folder Link or Folder ID..."
              className="w-full pl-10 pr-28 py-2 bg-[#0A0A0A] border border-[#262626] rounded-md text-gray-100 placeholder-gray-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
            />
            {urlInput === DEFAULT_LINK && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-[#1A1A1A] text-gray-400 px-2 py-0.5 rounded border border-[#333333]">
                Project Folder
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isLoading || !urlInput.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 min-w-[130px]"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <span>Load Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {urlInput && (
              <a
                href={urlInput.startsWith('http') ? urlInput : `https://drive.google.com/drive/folders/${urlInput}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#1A1A1A] hover:bg-[#222222] text-gray-300 rounded-md border border-[#333333] transition-colors"
                title="Open directly in Google Drive"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

        </form>

        <div className="mt-2.5 flex flex-wrap items-center justify-between text-xs text-gray-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Quick preset:</span>
            <button
              type="button"
              onClick={() => {
                setUrlInput(DEFAULT_LINK);
                onLoadFolder(DEFAULT_LINK);
              }}
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 underline font-mono text-[11px] bg-[#141414] px-2 py-0.5 rounded border border-[#262626]"
            >
              1Lmpdb-9-Z7xLjRF84hNxDsJxd0jOFYUh (Project Folder)
            </button>
          </div>

          <div className="flex items-center gap-3 text-gray-400">
            <span className="flex items-center gap-1 text-gray-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Read-Only Access
            </span>
            <span className="flex items-center gap-1 text-gray-400 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Gemini 2.5 Code Inspection
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
