import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileJson,
  FileCheck,
  File,
  ChevronRight,
  ChevronDown,
  Search,
  Filter
} from 'lucide-react';
import { DriveFile } from '../types';

interface FileTreeProps {
  files: DriveFile[];
  selectedFileId?: string;
  onSelectFile: (file: DriveFile) => void;
  rootName?: string;
}

export const FileTree: React.FC<FileTreeProps> = ({
  files,
  selectedFileId,
  onSelectFile,
  rootName = 'Project Files'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    root: true
  });

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const getFileIcon = (file: DriveFile) => {
    if (file.isFolder) {
      return expandedFolders[file.id] ? (
        <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
      ) : (
        <Folder className="w-4 h-4 text-amber-400 shrink-0" />
      );
    }

    const ext = file.extension || '';
    const mime = file.mimeType || '';

    if (['ts', 'tsx', 'js', 'jsx', 'py', 'java', 'cpp', 'c', 'html', 'css', 'go', 'rs', 'php'].includes(ext)) {
      return <FileCode className="w-4 h-4 text-blue-400 shrink-0" />;
    }
    if (['json', 'yaml', 'yml', 'toml', 'env'].includes(ext) || mime.includes('json')) {
      return <FileJson className="w-4 h-4 text-purple-400 shrink-0" />;
    }
    if (['md', 'txt', 'doc', 'docx'].includes(ext) || mime.includes('document')) {
      return <FileText className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
    if (['csv', 'xlsx', 'xls'].includes(ext) || mime.includes('spreadsheet')) {
      return <FileSpreadsheet className="w-4 h-4 text-green-400 shrink-0" />;
    }
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext) || mime.includes('image')) {
      return <FileImage className="w-4 h-4 text-pink-400 shrink-0" />;
    }

    return <File className="w-4 h-4 text-slate-400 shrink-0" />;
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderItem = (item: DriveFile, level: number = 0) => {
    const isExpanded = expandedFolders[item.id] ?? true;
    const isSelected = selectedFileId === item.id;
    const matchesSearch = !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch && !item.isFolder) {
      return null;
    }

    return (
      <div key={item.id} className="select-none">
        <div
          onClick={() => {
            if (item.isFolder) {
              toggleFolder(item.id);
            } else {
              onSelectFile(item);
            }
          }}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          className={`flex items-center justify-between py-1.5 pr-3 text-xs rounded cursor-pointer transition-colors ${
            isSelected
              ? 'bg-[#1A1A1A] text-blue-400 font-medium border border-blue-500/30'
              : 'text-gray-300 hover:bg-[#1A1A1A] hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2 truncate min-w-0 pr-2">
            {item.isFolder ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(item.id);
                }}
                className="p-0.5 text-gray-500 hover:text-gray-300 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <span className="w-3.5" />
            )}

            {getFileIcon(item)}

            <span className="truncate font-mono">{item.name}</span>
          </div>

          {!item.isFolder && item.size && (
            <span className="text-[10px] text-gray-500 font-mono shrink-0">
              {formatSize(item.size)}
            </span>
          )}
        </div>

        {item.isFolder && isExpanded && item.children && item.children.length > 0 && (
          <div className="mt-0.5">
            {item.children.map((child) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#0E0E0E] border border-[#262626] rounded-xl p-3 flex flex-col h-full shadow-sm">
      
      {/* Search Header */}
      <div className="mb-3">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#262626]">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            File Directory
          </span>
          <span className="text-[11px] text-gray-500 font-mono">
            {files.length} items
          </span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#0A0A0A] border border-[#262626] rounded-md text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 custom-scrollbar">
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs">
            No files found in folder
          </div>
        ) : (
          files.map((file) => renderItem(file, 0))
        )}
      </div>

    </div>
  );
};
