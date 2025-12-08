
import React, { useState, useRef, useMemo } from 'react';
import { 
  UploadCloud, FileSpreadsheet, Download, AlertCircle, CheckCircle, 
  X, Loader2, AlertTriangle, Check, RefreshCw, AlertOctagon, FileWarning,
  ArrowRight, FileText, FileCheck, FileX, MinusCircle, Clock, Filter, Search,
  Calendar, MoreHorizontal, History, XCircle
} from 'lucide-react';

interface ValidationError {
  id: string;
  row: number;
  column: string;
  value: string;
  message: string;
  severity: 'critical' | 'warning';
}

interface ImportHistoryItem {
  id: string;
  fileName: string;
  date: string;
  importedBy: string;
  avatar: string;
  status: 'Completed' | 'Partial' | 'Failed';
  records: { total: number; success: number; failed: number };
  tags: string[];
}

const MOCK_HISTORY: ImportHistoryItem[] = [
  { 
      id: '1', fileName: 'Q3_Engineering_Hires.xlsx', date: 'Oct 20, 2023 • 10:30 AM', 
      importedBy: 'Alexandra M.', avatar: 'https://ui-avatars.com/api/?name=Alexandra+M&background=0A3AA9&color=fff',
      status: 'Completed', records: { total: 45, success: 45, failed: 0 }, tags: ['Engineering', 'Q3'] 
  },
  { 
      id: '2', fileName: 'Sales_Team_Update_v2.csv', date: 'Oct 18, 2023 • 02:15 PM', 
      importedBy: 'Sarah Jenkins', avatar: 'https://ui-avatars.com/api/?name=Sarah+J&background=random',
      status: 'Partial', records: { total: 120, success: 115, failed: 5 }, tags: ['Sales', 'Updates'] 
  },
  { 
      id: '3', fileName: 'Invalid_Format_Test.csv', date: 'Oct 15, 2023 • 09:00 AM', 
      importedBy: 'Alexandra M.', avatar: 'https://ui-avatars.com/api/?name=Alexandra+M&background=0A3AA9&color=fff',
      status: 'Failed', records: { total: 0, success: 0, failed: 0 }, tags: ['Test'] 
  },
  { 
      id: '4', fileName: 'Ops_Staff_Bulk_Add.xlsx', date: 'Sep 30, 2023 • 11:45 AM', 
      importedBy: 'David Chen', avatar: 'https://ui-avatars.com/api/?name=David+C&background=random',
      status: 'Completed', records: { total: 12, success: 12, failed: 0 }, tags: ['Ops', 'Urgent'] 
  },
];

const BulkImport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  
  // New Import State
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'validating' | 'error' | 'ready' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [importStats, setImportStats] = useState({ total: 0, valid: 0, invalid: 0 });
  const [finalResults, setFinalResults] = useState({ created: 0, updated: 0, skipped: 0, failed: 0 });
  
  // History View State
  const [historySearch, setHistorySearch] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState('All');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    // Reset state
    setFile(selectedFile);
    setStatus('idle');
    setValidationErrors([]);
    
    // Auto start upload simulation
    simulateUpload(selectedFile);
  };

  const simulateUpload = (currentFile: File) => {
    setStatus('uploading');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          simulateValidation(currentFile);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const simulateValidation = (currentFile: File) => {
    setStatus('validating');
    
    setTimeout(() => {
      // Mock Validation Logic based on filename for demo
      if (currentFile.name.toLowerCase().includes('error')) {
        setStatus('error');
        const mockErrors: ValidationError[] = [
            { id: '1', row: 4, column: 'Email Address', value: '', message: 'Missing mandatory field', severity: 'critical' },
            { id: '2', row: 8, column: 'Email Address', value: 'john.doe@gmail', message: 'Invalid email format', severity: 'critical' },
            { id: '3', row: 12, column: 'Joining Date', value: '12-31-2023', message: 'Invalid Date format (Expected YYYY-MM-DD)', severity: 'critical' },
            { id: '4', row: 15, column: 'Employee ID', value: 'EMP-2023-104', message: 'Duplicate ID found in system', severity: 'critical' },
            { id: '5', row: 22, column: 'Department', value: 'Space Operations', message: 'Value does not match allowed departments', severity: 'critical' },
            { id: '6', row: 28, column: 'Department', value: 'R&D Lab', message: 'Value does not match allowed departments', severity: 'critical' },
            { id: '7', row: 45, column: 'Salary', value: '-5000', message: 'Value cannot be negative', severity: 'critical' },
            { id: '8', row: 46, column: 'Joining Date', value: '2025-01-01', message: 'Date is in the future (Warning)', severity: 'warning' },
        ];
        setValidationErrors(mockErrors);
        setImportStats({ total: 50, valid: 42, invalid: 8 });
      } else {
        setStatus('ready');
        setImportStats({ total: 128, valid: 128, invalid: 0 });
      }
    }, 1500);
  };

  const handleFinalImport = () => {
      setStatus('uploading'); // reusing uploading spinner state for "Importing..."
      setProgress(0);
      // Simulate final API call
      setTimeout(() => {
          // Distribute the valid count across different outcomes for demo
          const totalValid = importStats.valid;
          const created = Math.floor(totalValid * 0.65);
          const updated = Math.floor(totalValid * 0.25);
          const skipped = Math.floor(totalValid * 0.08);
          // Remaining or simulated failures during db write
          const failed = totalValid - created - updated - skipped;

          setFinalResults({ created, updated, skipped, failed });
          setStatus('completed');
      }, 2000);
  };

  const resetImport = () => {
      setFile(null);
      setStatus('idle');
      setProgress(0);
      setValidationErrors([]);
  };

  // Group errors by column for the validation view
  const errorsByColumn = useMemo(() => {
      return validationErrors.reduce((acc, err) => {
          if (!acc[err.column]) {
              acc[err.column] = [];
          }
          acc[err.column].push(err);
          return acc;
      }, {} as Record<string, ValidationError[]>);
  }, [validationErrors]);

  // Filter History
  const filteredHistory = MOCK_HISTORY.filter(item => {
      const matchesSearch = item.fileName.toLowerCase().includes(historySearch.toLowerCase()) || item.importedBy.toLowerCase().includes(historySearch.toLowerCase());
      const matchesStatus = historyStatusFilter === 'All' || item.status === historyStatusFilter;
      return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <h2 className="text-2xl font-bold text-neutral-primary tracking-tight">Bulk Import Employees</h2>
            <p className="text-neutral-secondary mt-1">Upload data files to add or update employee records.</p>
        </div>
        <div className="flex p-1 bg-neutral-200/50 rounded-lg">
            <button 
                onClick={() => setActiveTab('new')}
                className={`px-4 py-2 text-sm font-bold rounded-md transition-all flex items-center gap-2 ${activeTab === 'new' ? 'bg-white text-flexi-blue shadow-sm' : 'text-neutral-secondary hover:text-neutral-primary'}`}
            >
                <UploadCloud className="w-4 h-4" /> New Import
            </button>
            <button 
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 text-sm font-bold rounded-md transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-white text-flexi-blue shadow-sm' : 'text-neutral-secondary hover:text-neutral-primary'}`}
            >
                <History className="w-4 h-4" /> Import History
            </button>
        </div>
      </div>

      {activeTab === 'new' ? (
        <div className="space-y-8 animate-in slide-in-from-left duration-300">
            {/* Template Download Card */}
            {status === 'idle' && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl shadow-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white rounded-lg text-flexi-blue shadow-sm border border-blue-100">
                            <FileSpreadsheet className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-neutral-primary">Download Import Template</h3>
                            <p className="text-xs text-neutral-secondary mt-1 max-w-md">
                                Use this pre-formatted template to ensure your data matches the system requirements. 
                                Do not change the header columns.
                            </p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-flexi-blue text-sm font-bold rounded-lg border border-blue-200 hover:bg-blue-50 hover:border-flexi-blue transition-all shadow-sm whitespace-nowrap">
                        <Download className="w-4 h-4" /> Download .CSV
                    </button>
                </div>
            )}

            {/* Main Content Area */}
            <div className="bg-white border border-neutral-border rounded-xl shadow-card overflow-hidden min-h-[400px]">
                
                {/* 1. COMPLETED STATE */}
                {status === 'completed' && (
                    <div className="p-10 animate-in zoom-in-95 duration-300">
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-state-success border border-green-100 shadow-sm">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-primary">Import Processing Complete</h3>
                            <p className="text-neutral-secondary mt-2">
                                Your file <span className="font-semibold text-neutral-primary">{file?.name}</span> has been processed. 
                            </p>
                        </div>

                        {/* Results Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
                            <div className="p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm flex flex-col items-center text-center">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-state-success shadow-sm mb-3">
                                    <FileCheck className="w-5 h-5" />
                                </div>
                                <span className="text-2xl font-bold text-neutral-primary">{finalResults.created}</span>
                                <span className="text-xs font-bold text-neutral-secondary uppercase tracking-wider mt-1">Created</span>
                            </div>
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-sm flex flex-col items-center text-center">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-flexi-blue shadow-sm mb-3">
                                    <RefreshCw className="w-5 h-5" />
                                </div>
                                <span className="text-2xl font-bold text-neutral-primary">{finalResults.updated}</span>
                                <span className="text-xs font-bold text-neutral-secondary uppercase tracking-wider mt-1">Updated</span>
                            </div>
                            <div className="p-4 bg-neutral-100 border border-neutral-200 rounded-xl shadow-sm flex flex-col items-center text-center">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-500 shadow-sm mb-3">
                                    <MinusCircle className="w-5 h-5" />
                                </div>
                                <span className="text-2xl font-bold text-neutral-primary">{finalResults.skipped}</span>
                                <span className="text-xs font-bold text-neutral-secondary uppercase tracking-wider mt-1">Skipped</span>
                            </div>
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm flex flex-col items-center text-center">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-state-error shadow-sm mb-3">
                                    <AlertOctagon className="w-5 h-5" />
                                </div>
                                <span className="text-2xl font-bold text-neutral-primary">{finalResults.failed}</span>
                                <span className="text-xs font-bold text-neutral-secondary uppercase tracking-wider mt-1">Failed</span>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button 
                                onClick={resetImport}
                                className="px-6 py-3 bg-white border border-neutral-border text-neutral-primary font-bold rounded-xl hover:bg-neutral-page transition-colors shadow-sm"
                            >
                                Import Another File
                            </button>
                            <button className="px-6 py-3 bg-flexi-blue text-white font-bold rounded-xl hover:bg-flexi-end transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2">
                                View Employee Directory <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
                
                {/* 2. UPLOADING / VALIDATING STATE */}
                {(status === 'uploading' || status === 'validating') && (
                    <div className="p-16 text-center animate-in fade-in duration-300 flex flex-col items-center justify-center min-h-[400px]">
                        <div className="relative mb-6">
                            <div className="w-20 h-20 rounded-full border-4 border-neutral-100 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-flexi-blue animate-spin" />
                            </div>
                            <div className="absolute top-0 left-0 w-full h-full">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="38"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        className="text-flexi-blue transition-all duration-300 ease-out"
                                        strokeDasharray="238"
                                        strokeDashoffset={238 - (238 * progress) / 100}
                                    />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-neutral-primary">
                            {status === 'uploading' ? 'Uploading File...' : 'Validating Data...'}
                        </h3>
                        <p className="text-neutral-secondary mt-2 max-w-xs mx-auto">
                            {status === 'uploading' 
                                ? `Please wait while we upload ${file?.name}. Do not close this window.`
                                : 'Checking for formatting errors, duplicates, and missing required fields.'
                            }
                        </p>
                    </div>
                )}

                {/* 3. ERROR / VALIDATION ISSUES STATE */}
                {status === 'error' && (
                    <div className="flex flex-col h-[600px] animate-in fade-in duration-300">
                        <div className="p-6 border-b border-neutral-border bg-red-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-100 text-state-error rounded-lg">
                                    <FileWarning className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-neutral-primary">Validation Failed</h3>
                                    <p className="text-sm text-neutral-secondary">
                                        Found <span className="font-bold text-state-error">{validationErrors.length} issues</span> in {file?.name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={resetImport}
                                    className="px-4 py-2 bg-white border border-neutral-border text-neutral-primary font-bold rounded-lg hover:bg-neutral-page transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button className="px-4 py-2 bg-white border border-neutral-border text-flexi-blue font-bold rounded-lg hover:bg-blue-50 transition-colors text-sm flex items-center gap-2">
                                    <Download className="w-4 h-4" /> Download Error Log
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                            {/* Error Sidebar */}
                            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-neutral-border bg-neutral-page/30 overflow-y-auto p-4">
                                <h4 className="text-xs font-bold text-neutral-secondary uppercase tracking-wider mb-3">Issues by Column</h4>
                                <div className="space-y-2">
                                    {Object.entries(errorsByColumn).map(([col, errs]) => (
                                        <div key={col} className="bg-white border border-neutral-border rounded-lg p-3 shadow-sm">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-bold text-neutral-primary">{col}</span>
                                                <span className="text-xs font-bold bg-red-100 text-state-error px-1.5 py-0.5 rounded-full">{errs.length}</span>
                                            </div>
                                            <div className="text-xs text-neutral-secondary truncate">
                                                {errs[0].message}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Error Table */}
                            <div className="flex-1 overflow-auto bg-white p-6">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-neutral-page text-xs font-semibold text-neutral-secondary uppercase tracking-wider border-b border-neutral-border sticky top-0">
                                        <tr>
                                            <th className="p-3 w-20">Row</th>
                                            <th className="p-3 w-1/4">Column</th>
                                            <th className="p-3 w-1/4">Invalid Value</th>
                                            <th className="p-3">Error Message</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-border text-sm">
                                        {validationErrors.map(err => (
                                            <tr key={err.id} className="hover:bg-[#F0EFF6]">
                                                <td className="p-3 font-mono text-neutral-500">{err.row}</td>
                                                <td className="p-3 font-medium text-neutral-primary">{err.column}</td>
                                                <td className="p-3 font-mono text-state-error bg-red-50/50 rounded">{err.value || '(Empty)'}</td>
                                                <td className="p-3 text-state-error flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4" /> {err.message}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. READY FOR IMPORT STATE */}
                {status === 'ready' && (
                    <div className="p-10 animate-in fade-in duration-300">
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-flexi-blue border border-blue-100 shadow-sm">
                                <FileCheck className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-primary">File Validated Successfully</h3>
                            <p className="text-neutral-secondary mt-2">
                                <span className="font-semibold text-neutral-primary">{file?.name}</span> is ready for import.
                            </p>
                        </div>

                        <div className="max-w-3xl mx-auto bg-neutral-page/30 border border-neutral-border rounded-xl p-6 mb-10">
                            <h4 className="text-sm font-bold text-neutral-primary mb-4">Import Summary</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-white border border-neutral-border rounded-lg text-center">
                                    <span className="block text-2xl font-bold text-neutral-primary">{importStats.total}</span>
                                    <span className="text-xs font-bold text-neutral-secondary uppercase tracking-wider">Total Records</span>
                                </div>
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                                    <span className="block text-2xl font-bold text-green-700">{importStats.valid}</span>
                                    <span className="text-xs font-bold text-green-800 uppercase tracking-wider">Valid Records</span>
                                </div>
                                <div className="p-4 bg-white border border-neutral-border rounded-lg text-center opacity-50">
                                    <span className="block text-2xl font-bold text-neutral-400">0</span>
                                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Errors</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button 
                                onClick={resetImport}
                                className="px-6 py-3 bg-white border border-neutral-border text-neutral-primary font-bold rounded-xl hover:bg-neutral-page transition-colors shadow-sm"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleFinalImport}
                                className="px-8 py-3 bg-flexi-blue text-white font-bold rounded-xl hover:bg-flexi-end transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2"
                            >
                                Start Import <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* 5. IDLE STATE (DROPZONE) */}
                {status === 'idle' && (
                    <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                            min-h-[400px] flex flex-col items-center justify-center p-10 transition-all cursor-pointer
                            ${isDragging ? 'bg-blue-50/50 border-2 border-dashed border-flexi-blue' : 'bg-white hover:bg-neutral-page/10'}
                        `}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className={`
                            w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all
                            ${isDragging ? 'bg-white shadow-md text-flexi-blue scale-110' : 'bg-neutral-page text-neutral-400'}
                        `}>
                            <UploadCloud className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-primary mb-2">
                            {isDragging ? 'Drop file here' : 'Click to upload or drag and drop'}
                        </h3>
                        <p className="text-neutral-secondary mb-8 text-center max-w-sm">
                            Supported formats: .CSV, .XLSX, .XLS <br />
                            Max file size: 25MB
                        </p>
                        <button className="px-6 py-3 bg-flexi-blue text-white font-bold rounded-xl shadow-md hover:bg-flexi-end transition-colors pointer-events-none">
                            Select File
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            onChange={(e) => e.target.files && e.target.files[0] && handleFileSelection(e.target.files[0])}
                        />
                    </div>
                )}
            </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
            {/* History Filters */}
            <div className="bg-white p-4 rounded-xl border border-neutral-border shadow-card flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted w-4 h-4" />
                    <input 
                        type="text" 
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        placeholder="Search history by filename or user..."
                        className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-border rounded-lg focus:ring-2 focus:ring-flexi-blue outline-none bg-neutral-page/20"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative min-w-[150px]">
                        <select 
                            value={historyStatusFilter}
                            onChange={(e) => setHistoryStatusFilter(e.target.value)}
                            className="w-full pl-3 pr-8 py-2 text-sm border border-neutral-border rounded-lg focus:ring-2 focus:ring-flexi-blue outline-none bg-white appearance-none cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="Completed">Completed</option>
                            <option value="Partial">Partial Success</option>
                            <option value="Failed">Failed</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-muted w-3.5 h-3.5 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* History List */}
            <div className="bg-white border border-neutral-border rounded-xl shadow-card overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-neutral-page text-xs font-semibold text-neutral-secondary uppercase tracking-wider border-b border-neutral-border">
                        <tr>
                            <th className="p-4">File Name</th>
                            <th className="p-4">Imported By</th>
                            <th className="p-4">Date & Time</th>
                            <th className="p-4">Records</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-border text-sm">
                        {filteredHistory.map(item => (
                            <tr key={item.id} className="hover:bg-[#F0EFF6] transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-flexi-blue rounded-lg border border-blue-100">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-neutral-primary">{item.fileName}</p>
                                            <div className="flex gap-1 mt-1">
                                                {item.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded border border-neutral-200">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <img src={item.avatar} alt={item.importedBy} className="w-6 h-6 rounded-full border border-neutral-border" />
                                        <span className="font-medium text-neutral-primary">{item.importedBy}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-neutral-secondary">
                                    {item.date}
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-bold text-neutral-primary">{item.records.success} / {item.records.total}</span>
                                        <span className="text-xs text-neutral-muted">{item.records.failed} failed</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                        item.status === 'Completed' ? 'bg-green-50 text-state-success border-green-200' :
                                        item.status === 'Partial' ? 'bg-yellow-50 text-state-warning border-yellow-200' :
                                        'bg-red-50 text-state-error border-red-200'
                                    }`}>
                                        {item.status === 'Completed' && <CheckCircle className="w-3 h-3" />}
                                        {item.status === 'Partial' && <AlertTriangle className="w-3 h-3" />}
                                        {item.status === 'Failed' && <XCircle className="w-3 h-3" />}
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="p-2 text-neutral-muted hover:text-flexi-blue hover:bg-neutral-page rounded transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
};

export default BulkImport;
