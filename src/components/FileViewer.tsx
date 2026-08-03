import React, { useState } from 'react';
import {
  FileCode,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Download,
  Info,
  Maximize2,
  Code2,
  Eye,
  Search
} from 'lucide-react';
import { DriveFile } from '../types';

interface FileViewerProps {
  file: DriveFile | null;
  fileContent: string | null;
  isLoadingContent: boolean;
}

export const FileViewer: React.FC<FileViewerProps> = ({
  file,
  fileContent,
  isLoadingContent
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');
  const [lineSearch, setLineSearch] = useState('');

  if (!file) {
    return (
      <div className="bg-[#0E0E0E] border border-[#262626] rounded-xl p-12 text-center h-full flex flex-col items-center justify-center text-gray-500 shadow-sm">
        <FileCode className="w-12 h-12 text-gray-700 mb-3" />
        <h3 className="text-sm font-semibold text-gray-300 mb-1">No File Selected</h3>
        <p className="text-xs text-gray-500 max-w-sm">
          Select any code file, document, or dataset from the project file tree on the left to inspect its contents.
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    if (fileContent) {
      navigator.clipboard.writeText(fileContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isMarkdown = file.extension === 'md' || file.name.endsWith('.md');
  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(file.extension || '');

  const lines = fileContent ? fileContent.split('\n') : [];
  const filteredLines = lineSearch
    ? lines.map((line, idx) => ({ line, num: idx + 1 })).filter(({ line }) => line.toLowerCase().includes(lineSearch.toLowerCase()))
    : lines.map((line, idx) => ({ line, num: idx + 1 }));

  return (
    <div className="bg-[#0E0E0E] border border-[#262626] rounded-xl flex flex-col h-full shadow-sm overflow-hidden">
      
      {/* File Header Toolbar */}
      <div className="bg-[#141414] border-b border-[#262626] px-4 py-2.5 flex items-center justify-between gap-3">
        
        <div className="flex items-center space-x-2 min-w-0">
          <div className="p-1.5 bg-blue-500/10 border border-blue-500/20 rounded-md text-blue-400">
            <FileCode className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-mono font-bold text-gray-100 truncate">{file.name}</h2>
              {file.extension && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#1A1A1A] text-gray-400 border border-[#333333] uppercase">
                  .{file.extension}
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-500 font-mono">ID: {file.id}</p>
          </div>
        </div>

        {/* View mode toggle & actions */}
        <div className="flex items-center space-x-2">
          {isMarkdown && (
            <div className="bg-[#0A0A0A] border border-[#262626] p-0.5 rounded-md flex items-center text-xs">
              <button
                onClick={() => setViewMode('code')}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-colors text-xs ${
                  viewMode === 'code' ? 'bg-blue-600 text-white font-medium' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Code
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-colors text-xs ${
                  viewMode === 'preview' ? 'bg-blue-600 text-white font-medium' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>
            </div>
          )}

          {fileContent && (
            <button
              onClick={handleCopy}
              className="p-1.5 bg-[#1A1A1A] hover:bg-[#222222] text-gray-300 hover:text-white rounded-md border border-[#333333] transition-colors text-xs flex items-center gap-1.5"
              title="Copy file contents"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}

          {file.webViewLink && (
            <a
              href={file.webViewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-[#1A1A1A] hover:bg-[#222222] text-gray-300 hover:text-white rounded-md border border-[#333333] transition-colors text-xs flex items-center gap-1"
              title="Open in Google Drive"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

      </div>

      {/* Code Filter Bar */}
      {fileContent && !isImage && viewMode === 'code' && (
        <div className="bg-[#0A0A0A] border-b border-[#262626] px-4 py-1.5 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Filter lines..."
              value={lineSearch}
              onChange={(e) => setLineSearch(e.target.value)}
              className="bg-transparent border-none text-gray-200 placeholder-gray-600 focus:outline-none text-xs w-48 font-mono"
            />
          </div>
          <span className="font-mono text-[11px] text-gray-500">
            {lines.length} lines
          </span>
        </div>
      )}

      {/* File Content Body */}
      <div className="flex-1 overflow-auto bg-[#0A0A0A] p-4 font-mono text-xs text-gray-200 custom-scrollbar">
        {isLoadingContent ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">Fetching file from Google Drive...</p>
          </div>
        ) : isImage && file.thumbnailLink ? (
          <div className="flex flex-col items-center justify-center py-8">
            <img
              src={file.thumbnailLink.replace('=s220', '=s800')}
              alt={file.name}
              className="max-h-96 rounded-lg border border-[#262626] object-contain shadow-md"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : fileContent === null ? (
          <div className="text-center py-16 text-gray-500">
            <Info className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-xs">Select a readable text or code file from the directory tree to view.</p>
          </div>
        ) : viewMode === 'preview' && isMarkdown ? (
          <div className="prose prose-invert max-w-none text-gray-300 text-xs p-2 font-sans leading-relaxed">
            <div className="whitespace-pre-wrap">{fileContent}</div>
          </div>
        ) : (
          <div className="space-y-0.5">
            {filteredLines.map(({ line, num }) => (
              <div key={num} className="flex hover:bg-[#141414] rounded px-1 group">
                <span className="w-12 text-gray-600 select-none text-right pr-4 font-mono text-[11px] shrink-0 group-hover:text-gray-400">
                  {num}
                </span>
                <span className="text-gray-200 whitespace-pre-wrap break-all flex-1 font-mono leading-relaxed">
                  {line || ' '}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
