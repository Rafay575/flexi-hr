import React, { useState, useRef } from 'react';
import { 
  Upload, Download, AlertCircle, CheckCircle2, 
  ChevronRight, ArrowLeft, ArrowRight, FileText, 
  Trash2, Search, Info, Database, FileSpreadsheet,
  XCircle, Check, Loader2, ShieldCheck
} from 'lucide-react';

type Step = 'TEMPLATE' | 'UPLOAD' | 'VALIDATION' | 'PREVIEW';

interface BulkRecord {
  id: string;
  empId: string;
  component: string;
  amount: number;
  taxable: boolean;
  reason: string;
  status: 'VALID' | 'ERROR';
  errorMsg?: string;
}

export const BulkAdjustmentUpload: React.FC<{ onComplete: () => void; onCancel: () => void }> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState<Step>('TEMPLATE');
  const [adjType, setAdjType] = useState('Bonus');
  const [file, setFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [records, setRecords] = useState<BulkRecord[]>([
    { id: '1', empId: 'EMP-1001', component: 'BNS01', amount: 15000, taxable: true, reason: 'Q4 Performance', status: 'VALID' },
    { id: '2', empId: 'EMP-9999', component: 'BNS01', amount: 5000, taxable: true, reason: 'Invalid ID Test', status: 'ERROR', errorMsg: 'Employee ID not found' },
    { id: '3', empId: 'EMP-1102', component: 'BNS01', amount: -2000, taxable: false, reason: 'Correction', status: 'VALID' },
    { id: '4', empId: 'EMP-1005', component: 'MISC', amount: 50000, taxable: true, reason: 'Relocation', status: 'VALID' },
  ]);

  const validRecords = records.filter(r => r.status === 'VALID');
  const errorRecords = records.filter(r => r.status === 'ERROR');
  const totalAmount = validRecords.reduce((acc, curr) => acc + curr.amount, 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setCurrentStep('UPLOAD');
    }
  };

  const startValidation = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setCurrentStep('VALIDATION');
    }, 1500);
  };

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Wizard Header */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-10 px-10">
          {[
            { id: 'TEMPLATE', label: 'Template' },
            { id: 'UPLOAD', label: 'Upload' },
            { id: 'VALIDATION', label: 'Validate' },
            { id: 'PREVIEW', label: 'Preview' }
          ].map((s, idx, arr) => {
            const stepOrder = ['TEMPLATE', 'UPLOAD', 'VALIDATION', 'PREVIEW'];
            const isActive = s.id === currentStep;
            const isCompleted = stepOrder.indexOf(currentStep) > idx;

            return (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 
                    isCompleted ? 'bg-green-50 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    {isCompleted ? <Check size={18} /> : <span className="text-xs font-black">{idx + 1}</span>}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < arr.length - 1 && (
                  <div className={`flex-1 h-[2px] mx-[-15px] mt-[-18px] ${isCompleted ? 'bg-green-500' : 'bg-gray-100'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* STEP 1: TEMPLATE */}
        {currentStep === 'TEMPLATE' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center max-w-md mx-auto space-y-2">
              <h3 className="text-xl font-black text-gray-800">Select Adjustment Type</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Download the pre-formatted CSV template tailored for your adjustment category.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Bonus', 'Penalty', 'Reimbursement', 'Arrears'].map(type => (
                <button 
                  key={type}
                  onClick={() => setAdjType(type)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all group ${adjType === type ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${adjType === type ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                      <FileText size={24} />
                    </div>
                    {adjType === type && <CheckCircle2 size={20} className="text-primary" />}
                  </div>
                  <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight">{type} Template</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Columns: EmpID, Component, Amount, Taxable, Reason</p>
                </button>
              ))}
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl flex items-center justify-between border border-dashed border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-green-600"><FileSpreadsheet size={24}/></div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Ready to start?</p>
                  <p className="text-xs text-gray-500">Download the {adjType} template for Jan 2025.</p>
                </div>
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-white border border-gray-200 px-6 py-2.5 rounded-xl text-xs font-black uppercase text-primary hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <Download size={16} /> Download CSV Template
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileUpload} />
            </div>
          </div>
        )}

        {/* STEP 2: UPLOAD */}
        {currentStep === 'UPLOAD' && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="p-12 border-4 border-dashed border-primary/10 bg-primary/5 rounded-3xl flex flex-col items-center justify-center text-center gap-6 group hover:bg-primary/[0.07] transition-all">
              <div className="p-6 bg-white rounded-2xl shadow-xl text-primary group-hover:scale-110 transition-transform">
                <Upload size={48} />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-800">File Selected: {file?.name}</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{(file?.size || 0) / 1024} KB • Ready for processing</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setFile(null)} className="px-6 py-2 bg-white border border-gray-200 text-red-500 rounded-lg text-[10px] font-black uppercase transition-all hover:bg-red-50">Remove File</button>
                <button 
                  onClick={startValidation}
                  disabled={isValidating}
                  className="px-8 py-2 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  {isValidating ? <Loader2 size={14} className="animate-spin" /> : <Database size={14} />}
                  {isValidating ? 'Validating...' : 'Validate Records'}
                </button>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
               <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
               <p className="text-[10px] text-blue-700 leading-relaxed font-medium uppercase tracking-tight">
                 System will perform cross-checks for Employee IDs, component eligibility, and range validations (e.g. amount limits).
               </p>
            </div>
          </div>
        )}

        {/* STEP 3: VALIDATION */}
        {currentStep === 'VALIDATION' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border-2 border-gray-100 text-center">
                 <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Total Found</p>
                 <h4 className="text-2xl font-black text-gray-800">{records.length}</h4>
              </div>
              <div className="bg-green-50 p-5 rounded-2xl border-2 border-green-100 text-center">
                 <p className="text-[9px] font-black text-green-600 uppercase mb-1">Clean Records</p>
                 <h4 className="text-2xl font-black text-green-600">{validRecords.length}</h4>
              </div>
              <div className="bg-red-50 p-5 rounded-2xl border-2 border-red-100 text-center">
                 <p className="text-[9px] font-black text-red-600 uppercase mb-1">Errors Detected</p>
                 <h4 className="text-2xl font-black text-red-600">{errorRecords.length}</h4>
              </div>
            </div>

            <div className="space-y-3">
               <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-red-600 flex items-center gap-2 tracking-widest">
                    <XCircle size={14}/> Validation Failure Log
                  </h4>
                  <button className="text-[10px] font-black text-primary uppercase hover:underline flex items-center gap-1">
                    <Download size={12} /> Download Error Report
                  </button>
               </div>
               <div className="bg-white border-2 border-red-50 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                     <thead className="bg-red-50/50 border-b border-red-100 text-[9px] font-black text-red-800 uppercase tracking-tighter">
                        <tr>
                          <th className="px-4 py-3">Row #</th>
                          <th className="px-4 py-3">Emp ID</th>
                          <th className="px-4 py-3">Value Detected</th>
                          <th className="px-4 py-3">Critical Error</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-red-50">
                        {errorRecords.map((r, i) => (
                          <tr key={i} className="bg-white">
                             <td className="px-4 py-3 font-bold text-gray-400">#02</td>
                             <td className="px-4 py-3 font-mono font-bold text-gray-700">{r.empId}</td>
                             <td className="px-4 py-3 text-gray-600">{r.amount.toLocaleString()}</td>
                             <td className="px-4 py-3 font-black text-red-600 italic">{r.errorMsg}</td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <AlertCircle size={20} className="text-orange-500" />
                  <p className="text-xs font-bold text-orange-800 uppercase tracking-tight">Only "Clean Records" will be processed.</p>
               </div>
               <button 
                onClick={() => setCurrentStep('PREVIEW')}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 shadow-lg shadow-orange-100"
               >
                 Accept & Preview Valid
               </button>
            </div>
          </div>
        )}

        {/* STEP 4: PREVIEW */}
        {currentStep === 'PREVIEW' && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-sm font-black uppercase tracking-[2px] text-gray-400">Final Verification</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-tighter italic">Previewing {validRecords.length} records ready for injection</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Injection Value</p>
                  <h4 className="text-2xl font-black text-primary">{formatPKR(totalAmount)}</h4>
               </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-6 py-5">Employee ID</th>
                    <th className="px-6 py-5">Component</th>
                    <th className="px-6 py-5 text-right">Amount (PKR)</th>
                    <th className="px-6 py-5 text-center">Taxable</th>
                    <th className="px-6 py-5">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {validRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-primary">{r.empId}</td>
                      <td className="px-6 py-4">
                        <span className="text-[9px] font-black uppercase bg-gray-100 px-1.5 py-0.5 rounded border text-gray-500">{r.component}</span>
                      </td>
                      <td className={`px-6 py-4 text-right font-mono font-black ${r.amount < 0 ? 'text-red-500' : 'text-green-600'}`}>
                        {formatPKR(r.amount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {r.taxable ? <Check size={14} className="mx-auto text-green-500" /> : <XCircle size={14} className="mx-auto text-gray-200" />}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 truncate max-w-[150px] italic">{r.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-green-50 border border-green-100 p-5 rounded-2xl flex items-start gap-4">
               {/* Fixed: ShieldCheck is now imported and will no longer cause a "Cannot find name" error */}
               <ShieldCheck size={24} className="text-green-600 shrink-0 mt-0.5" />
               <div>
                  <h5 className="text-sm font-black text-green-900 uppercase">Transaction Finalization</h5>
                  <p className="text-xs text-green-700 leading-relaxed font-medium">
                    This batch will be injected into the Jan 2025 cycle. A ledger log will be created for each record. <strong>Digital Authorization ID: B-ADJ-99221</strong>.
                  </p>
               </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-10 pt-8 border-t flex items-center justify-between">
          <button 
            onClick={currentStep === 'TEMPLATE' ? onCancel : () => {
              const order = ['TEMPLATE', 'UPLOAD', 'VALIDATION', 'PREVIEW'];
              setCurrentStep(order[order.indexOf(currentStep) - 1] as Step);
            }}
            className="px-8 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            {currentStep === 'TEMPLATE' ? 'Cancel' : <><ArrowLeft size={18} /> Back</>}
          </button>
          
          <div className="flex gap-4">
            {currentStep === 'PREVIEW' ? (
              <button 
                onClick={onComplete}
                className="px-12 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95"
              >
                <Database size={18} /> Commit Batch & Process
              </button>
            ) : currentStep !== 'VALIDATION' ? (
               <button 
                disabled={currentStep === 'TEMPLATE' && !file}
                onClick={() => {
                  const order = ['TEMPLATE', 'UPLOAD', 'VALIDATION', 'PREVIEW'];
                  setCurrentStep(order[order.indexOf(currentStep) + 1] as Step);
                }}
                className="px-10 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                Continue <ArrowRight size={18} />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};