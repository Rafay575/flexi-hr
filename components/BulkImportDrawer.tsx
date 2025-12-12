
import React, { useState } from 'react';
import { Upload, AlertTriangle, CheckCircle, FileText, AlertCircle, Play } from 'lucide-react';
import { Drawer } from './ui/Drawer';
import { Button } from './ui/button';
import { parseCSV } from '../services/csvUtils';

interface ValidationError {
  row: number;
  errors: string[];
}

interface BulkImportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  entityName: string;
  templateHeader: string;
  onValidate: (row: any) => string[]; // Returns array of error messages
  onImport: (data: any[]) => Promise<void>;
}

export const BulkImportDrawer: React.FC<BulkImportDrawerProps> = ({
  isOpen,
  onClose,
  title,
  entityName,
  templateHeader,
  onValidate,
  onImport
}) => {
  const [step, setStep] = useState<'input' | 'preview' | 'success'>('input');
  const [csvText, setCsvText] = useState('');
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  const handleAnalyze = () => {
    if (!csvText.trim()) return;
    
    const data = parseCSV(csvText);
    const errors: ValidationError[] = [];

    data.forEach((row, index) => {
      const rowErrors = onValidate(row);
      if (rowErrors.length > 0) {
        errors.push({ row: index + 1, errors: rowErrors });
      }
    });

    setParsedData(data);
    setValidationErrors(errors);
    setStep('preview');
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      // Filter out invalid rows if needed, or block import. 
      // Requirement implies handling import, let's import only valid rows.
      const invalidIndices = new Set(validationErrors.map(e => e.row - 1)); // row is 1-based in UI
      const validRows = parsedData.filter((_, idx) => !invalidIndices.has(idx));
      
      if (validRows.length > 0) {
        await onImport(validRows);
        setImportedCount(validRows.length);
        setStep('success');
      }
    } finally {
      setIsImporting(false);
    }
  };

  const reset = () => {
    setStep('input');
    setCsvText('');
    setParsedData([]);
    setValidationErrors([]);
    setImportedCount(0);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={title} 
      description={`Bulk create ${entityName} records.`}
      size="xl"
    >
      <div className="space-y-6">
        {step === 'input' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-800 mb-2">Instructions</h4>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>Copy data from your spreadsheet and paste it below.</li>
                <li>Ensure the first row contains headers.</li>
                <li>Required Header Format: <code className="bg-slate-200 px-1 rounded text-xs">{templateHeader}</code></li>
              </ul>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Paste CSV Data</label>
              <textarea
                className="w-full h-64 p-4 rounded-lg border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder={`${templateHeader}\nValue 1, Value 2, ...`}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleAnalyze} disabled={!csvText.trim()}>
                Analyze Data
              </Button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Data Preview</h3>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={reset}>Back</Button>
                <Button 
                  onClick={handleImport} 
                  disabled={parsedData.length === 0 || validationErrors.length === parsedData.length}
                  isLoading={isImporting}
                >
                  <Play size={16} className="mr-2" />
                  Import {parsedData.length - validationErrors.length} Valid Rows
                </Button>
              </div>
            </div>

            <div className="flex gap-4 text-sm">
              <div className="px-3 py-1 rounded bg-slate-100 text-slate-700 font-medium">
                Total Rows: {parsedData.length}
              </div>
              <div className={`px-3 py-1 rounded font-medium ${validationErrors.length > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                Errors: {validationErrors.length}
              </div>
            </div>

            {validationErrors.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
                <h4 className="flex items-center gap-2 text-red-800 font-bold text-sm mb-2">
                  <AlertTriangle size={16} /> Validation Issues
                </h4>
                <div className="max-h-32 overflow-y-auto space-y-1 text-xs text-red-700">
                   {validationErrors.map((err, i) => (
                     <div key={i}>
                       <span className="font-mono font-bold">Row {err.row}:</span> {err.errors.join(', ')}
                     </div>
                   ))}
                </div>
              </div>
            )}

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-2 w-16">Row</th>
                      <th className="px-4 py-2 w-24">Status</th>
                      {Object.keys(parsedData[0] || {}).map(key => (
                        <th key={key} className="px-4 py-2 font-medium">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedData.map((row, index) => {
                      const errors = validationErrors.find(e => e.row === index + 1);
                      return (
                        <tr key={index} className={errors ? 'bg-red-50/30' : 'bg-white'}>
                          <td className="px-4 py-2 font-mono text-slate-500 text-xs">{index + 1}</td>
                          <td className="px-4 py-2">
                             {errors ? (
                               <span className="flex items-center text-red-600 text-xs font-bold gap-1">
                                 <AlertCircle size={14} /> Invalid
                               </span>
                             ) : (
                               <span className="flex items-center text-green-600 text-xs font-bold gap-1">
                                 <CheckCircle size={14} /> Valid
                               </span>
                             )}
                          </td>
                          {Object.values(row).map((val: any, i) => (
                            <td key={i} className="px-4 py-2 text-slate-700">{String(val)}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in-95">
             <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={40} />
             </div>
             <h3 className="text-2xl font-bold text-slate-900 mb-2">Import Completed</h3>
             <p className="text-slate-600 mb-8 text-center max-w-md">
               Successfully imported <strong>{importedCount}</strong> records. <br/>
               Audit logs have been updated.
             </p>
             <Button onClick={handleClose} size="lg">
               Close & Refresh
             </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
};
