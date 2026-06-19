import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, ArrowUp, ArrowDown, Plus, FileText } from 'lucide-react';
import { LocalFile, SortOption, SortOrder } from './types';
import { initialFiles } from './data';
import { FileCard } from './components/FileCard';

export default function App() {
  const [files, setFiles] = useState<LocalFile[]>(initialFiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAction = (actionName: string, fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    if (actionName === 'delete') {
      setFiles(prev => prev.filter(f => f.id !== fileId));
      showToast(`Deleted ${file.name}`);
    } else {
      let msg = '';
      if (actionName === 'open') msg = `Opening ${file.name}...`;
      if (actionName === 'download') msg = `Downloading ${file.name} to your device...`;
      if (actionName === 'upload') msg = `Uploading new version of ${file.name}...`;
      showToast(msg);
    }
  };

  const handleGlobalUpload = () => {
    // Mock new file addition
    const newDocObj: LocalFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Scanned_Document_${Math.floor(Math.random() * 1000)}.pdf`,
      category: 'pdf',
      sizeBytes: Math.floor(Math.random() * 5000000) + 100000,
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
      uploadedBy: 'Current User',
    };
    setFiles([newDocObj, ...files]);
    showToast(`Uploaded ${newDocObj.name}`);
  };

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortOrder(option === 'name' ? 'asc' : 'desc');
    }
  };

  const filteredAndSortedFiles = useMemo(() => {
    let result = [...files];

    // Search filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        f =>
          f.name.toLowerCase().includes(q) ||
          f.uploadedBy.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'size') {
        comparison = a.sizeBytes - b.sizeBytes;
      } else if (sortBy === 'date') {
        comparison = new Date(a.modifiedDate).getTime() - new Date(b.modifiedDate).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [files, searchQuery, sortBy, sortOrder]);

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center w-full font-sans text-slate-800">
      {/* Mobile containment simulation for wider screens */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen shadow-2xl relative flex flex-col overflow-hidden sm:border-x sm:border-slate-200">
        
        {/* Header Section */}
        <header className="bg-white px-5 pt-8 pb-4 shadow-sm z-10 sticky top-0 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
                DocManage
              </h1>
              <p className="text-sm font-medium text-slate-500 mt-0.5">
                {files.length} active documents
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 shadow-inner">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-slate-800 border-none rounded-2xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Sort Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <div className="flex items-center mr-1 text-slate-400">
                <SlidersHorizontal className="w-4 h-4 ml-1" />
              </div>
              
              {(['date', 'name', 'size'] as SortOption[]).map(option => (
                <button
                  key={option}
                  onClick={() => toggleSort(option)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    sortBy === option
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="capitalize">{option}</span>
                  {sortBy === option && (
                    sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* File List */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <motion.div layout className="flex flex-col gap-4 pb-24">
            <AnimatePresence mode="popLayout">
              {filteredAndSortedFiles.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-12 text-center text-slate-500 flex flex-col items-center"
                >
                  <Search className="w-12 h-12 text-slate-300 mb-3" />
                  <p className="font-medium text-slate-600">No documents found</p>
                  <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
                </motion.div>
              ) : (
                filteredAndSortedFiles.map(file => (
                  <FileCard key={file.id} file={file} onAction={handleAction} />
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Global Upload FAB */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGlobalUpload}
          className="absolute bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-colors z-20"
        >
          <Plus className="w-6 h-6" />
        </motion.button>

        {/* Global Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-[320px] bg-slate-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl z-30 text-center flex items-center justify-center"
            >
              <div className="truncate">{toastMessage}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
