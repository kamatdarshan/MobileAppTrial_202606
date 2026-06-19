import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  FileSpreadsheet,
  File as FileIcon,
  Image as ImageIcon,
  Code,
  Download,
  RefreshCw,
  ExternalLink,
  Trash2,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { LocalFile, FileCategory } from '../types';
import { formatBytes, formatDate } from '../utils';

interface FileCardProps {
  file: LocalFile;
  busy?: boolean;
  onAction: (actionName: string, fileId: string) => void;
}

const getCategoryIcon = (category: FileCategory) => {
  switch (category) {
    case 'pdf':
      return <FileText className="w-6 h-6 text-red-500" />;
    case 'spreadsheet':
      return <FileSpreadsheet className="w-6 h-6 text-green-500" />;
    case 'image':
      return <ImageIcon className="w-6 h-6 text-purple-500" />;
    case 'document':
      return <FileText className="w-6 h-6 text-blue-500" />;
    case 'code':
      return <Code className="w-6 h-6 text-orange-500" />;
    default:
      return <FileIcon className="w-6 h-6 text-slate-500" />;
  }
};

const getCategoryColor = (category: FileCategory) => {
  switch (category) {
    case 'pdf':
      return 'bg-red-50 border-red-100';
    case 'spreadsheet':
      return 'bg-green-50 border-green-100';
    case 'image':
      return 'bg-purple-50 border-purple-100';
    case 'document':
      return 'bg-blue-50 border-blue-100';
    case 'code':
      return 'bg-orange-50 border-orange-100';
    default:
      return 'bg-slate-50 border-slate-200';
  }
};

export const FileCard: React.FC<FileCardProps> = ({ file, busy, onAction }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 overflow-hidden"
    >
      <div
        className="flex items-start gap-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div
          className={`shrink-0 w-12 h-12 flex items-center justify-center rounded-xl border ${getCategoryColor(
            file.category
          )}`}
        >
          {getCategoryIcon(file.category)}
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="font-semibold text-slate-900 truncate">
            {file.name}
          </h3>
          <p className="text-sm text-slate-500 mt-0.5 pt-0.5">
            {formatDate(file.modifiedDate)} • {formatBytes(file.sizeBytes)}
          </p>
          {!file.hasContent && (
            <span className="inline-block mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5">
              Sample · re-upload to enable
            </span>
          )}
        </div>

        <button
          className="shrink-0 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-slate-600 mb-5">
                <div>
                  <span className="block text-xs font-medium text-slate-400 mb-0.5">
                    Uploaded By
                  </span>
                  {file.uploadedBy}
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-400 mb-0.5">
                    Created On
                  </span>
                  {formatDate(file.createdDate)}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                <button
                  onClick={() => onAction('open', file.id)}
                  disabled={busy}
                  className="flex flex-col items-center gap-1.5 px-3 py-1 text-slate-500 hover:text-blue-600 transition-colors disabled:opacity-40"
                >
                  {busy ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ExternalLink className="w-5 h-5" />
                  )}
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    Open
                  </span>
                </button>
                <button
                  onClick={() => onAction('download', file.id)}
                  disabled={busy}
                  className="flex flex-col items-center gap-1.5 px-3 py-1 text-slate-500 hover:text-indigo-600 transition-colors disabled:opacity-40"
                >
                  <Download className="w-5 h-5" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    Download
                  </span>
                </button>
                <button
                  onClick={() => onAction('replace', file.id)}
                  disabled={busy}
                  className="flex flex-col items-center gap-1.5 px-3 py-1 text-slate-500 hover:text-emerald-600 transition-colors disabled:opacity-40"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    Replace
                  </span>
                </button>
                <button
                  onClick={() => onAction('delete', file.id)}
                  disabled={busy}
                  className="flex flex-col items-center gap-1.5 px-3 py-1 text-slate-500 hover:text-red-600 transition-colors disabled:opacity-40"
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    Delete
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
