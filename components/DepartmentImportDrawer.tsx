
import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, Download, RefreshCw, XCircle } from 'lucide-react';
import { Drawer } from './ui/Drawer';
import { Button } from './ui/button';
import { useQueryClient } from '@tanstack/react-query';

interface DepartmentImportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type ImportStatus = 'idle' | 'uploading' | 'validating' | 'review' | 'success';

interface ValidationError {
  row: number;
  column: string;
  message: string;
  data: any;
}

export const DepartmentImportDrawer: React.FC<DepartmentImportDrawerProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [successCount, setSuccessCount] = useState(0);

  const resetState = () => {
    setStatus('idle');
    setFile(null);
    setProgress(0);
    setErrors([]);
    setSuccessCount(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    if (status === 'success') {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    }
    resetState();
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 100));
    }

    setStatus('validating');
    await new Promise(r => setTimeout(r, 800));

    // Mock Validation Logic
    // If file name contains "error", simulate validation errors
    if (file.name.toLowerCase().includes('error')) {
      setErrors([
        { row: 2, column: 'Parent Code', message: 'Parent department code "FIN" not found', data: { name: 'Audit', code: 'AUD', parent: 'FIN' } },
        { row: 5, column: 'Type', message: 'Invalid unit type "Group"', data: { name: 'Special Ops', code: 'OPS', type: 'Group' } },
        { row: 8, column: 'Code', message: 'Duplicate department code "ENG"', data: { name: 'Engineering 2', code: 'ENG' } },
      ]);
      setStatus('review');
    } else {
      setSuccessCount(14); // Simulate 14 records imported
      setStatus('success');
    }
  };

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Bulk Import Departments"
      description="Upload a CSV or Excel file to create multiple organization units at once."
      size="lg"
    >
      <div className="space-y-8">
        
        {/* Step 1: Template & Guidelines */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-3">
          <h4 className="font-semibold text-blue-900 flex items-center gap-2">
            <FileSpreadsheet size={18} />
            Import Guidelines
          </h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Use the official template to ensure correct formatting.</li>
            <li>Required fields: <strong>Name, Code, Type, Division ID</strong>.</li>
            <li>Parent ID is required for sub-departments and lines.</li>
            <li>Maximum 500 records per upload.</li>
          </ul>
          <Button variant="outline" size="sm" className="bg-white text-blue-700 border-blue-200 hover:bg-blue-50 mt-2">
            <Download size={14} className="mr-2" />
            Download Template
          </Button>
        </div>

        {/* Step 2: Upload Area */}
        {status === 'idle' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div 
              className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:border-primary-500 hover:bg-primary-50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".csv, .xlsx"
                onChange={handleFileSelect}
              />
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <Upload size={32} />
              </div>
              <p className="text-lg font-medium text-slate-900">
                {file ? file.name : "Click to upload or drag and drop"}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                CSV or Excel files up to 5MB
              </p>
            </div>

            <div className="flex justify-end">
              <Button disabled={!file} onClick={handleUpload}>
                Start Import
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Progress */}
        {(status === 'uploading' || status === 'validating') && (
          <div className="py-12 text-center animate-in fade-in">
             <div className="mb-4">
                <RefreshCw className="animate-spin w-12 h-12 text-primary-600 mx-auto" />
             </div>
             <h3 className="text-lg font-medium text-slate-900 mb-2">
               {status === 'uploading' ? 'Uploading file...' : 'Validating data...'}
             </h3>
             <div className="max-w-xs mx-auto w-full bg-slate-100 rounded-full h-2">
               <div 
                 className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                 style={{ width: `${progress}%` }}
               ></div>
             </div>
             <p className="text-sm text-slate-500 mt-2">{progress}% completed</p>
          </div>
        )}

        {/* Step 4: Validation Errors */}
        {status === 'review' && (
          <div className="space-y-4 animate-in fade-in">
             <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={20} />
                <div>
                   <h4 className="font-bold text-red-900">Validation Failed</h4>
                   <p className="text-sm text-red-700">Found {errors.length} errors in your file. Please correct them and re-upload.</p>
                </div>
             </div>

             <div className="border border-slate-200 rounded-xl overflow-hidden">
               <table className="w-full text-sm text-left">
                 <thead className="bg-slate-50 text-slate-500 font-medium">
                   <tr>
                     <th className="px-4 py-3">Row</th>
                     <th className="px-4 py-3">Column</th>
                     <th className="px-4 py-3">Issue</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {errors.map((err, idx) => (
                     <tr key={idx} className="bg-white">
                       <td className="px-4 py-3 font-mono text-slate-600">{err.row}</td>
                       <td className="px-4 py-3 font-medium text-slate-900">{err.column}</td>
                       <td className="px-4 py-3 text-red-600">{err.message}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>

             <div className="flex justify-end gap-2 pt-4">
               <Button variant="ghost" onClick={resetState}>Cancel</Button>
               <Button variant="outline" onClick={resetState}>Upload New File</Button>
             </div>
          </div>
        )}

        {/* Step 5: Success */}
        {status === 'success' && (
          <div className="py-12 text-center animate-in zoom-in-95 duration-300">
             <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
             </div>
             <h3 className="text-2xl font-bold text-slate-900 mb-2">Import Successful</h3>
             <p className="text-slate-600 mb-8">
               Successfully created <strong>{successCount}</strong> new organization units.
             </p>
             <Button onClick={handleClose} size="lg" className="min-w-[150px]">
               Done
             </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
};
