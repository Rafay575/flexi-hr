import React, { useState, useMemo } from 'react';
import { 
  Upload, Download, FileSpreadsheet, Search, CheckCircle2, 
  XCircle, AlertTriangle, Info, ChevronRight, User, 
  Database, RefreshCw, Save, ArrowRight, Table, X, FileText
} from 'lucide-react';

interface ImportRow {
  row: number;
  empId: string;
  name: string;
  annual: number;
  casual: number;
  sick: number;
  status: 'Valid' | 'Error';
  message?: string;
}

const MOCK_VALIDATION: ImportRow[] = [
  { row: 1, empId: 'EMP-101', name: 'Ahmed Khan', annual: 12, casual: 5, sick: 10, status: 'Valid' },
  { row: 2, empId: 'EMP-102', name: 'Sara Miller', annual: 14, casual: 8, sick: 12, status: 'Valid' },
  { row: 3, empId: 'EMP-999', name: 'Unknown User', annual: 10, casual: 2, sick: 5, status: 'Error', message: 'Employee not found' },
  { row: 4, empId: 'EMP-103', name: 'Tom Chen', annual: -2, casual: 0, sick: 4, status: 'Error', message: 'Negative value not allowed' },
  { row: 5, empId: 'EMP-104', name: 'Anna Bell', annual: 18, casual: 4, sick: 6, status: 'Error', message: 'Exceeds maximum cap (14)' },
  { row: 6, empId: 'EMP-105', name: 'Zoya Malik', annual: 10, casual: 5, sick: 10, status: 'Valid' },
];

export const OpeningBalancesImport = () => {
  const [activeTab, setActiveTab] = useState<'manual' | 'csv'>('manual');
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success'>('idle');

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setShowPreview(true);
    }, 1500);
  };

  const handleImport = () => {
    setImportStatus('success');
  };

  const errorCount = MOCK_VALIDATION.filter(r => r.status === 'Error').length;
  const validCount = MOCK_VALIDATION.filter(r => r.status === 'Valid').length;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">Opening Balances Import</h2>
          <p className="text-gray-500 font-medium">Initialize or reset employee leave entitlements for the fiscal period.</p>
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-gray-200/50 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('manual')}
          className={`px-8 py-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'manual' ? 'bg-[#3E3B6F] text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setActiveTab('csv')}
          className={`px-8 py-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'csv' ? 'bg-[#3E3B6F] text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          CSV Import
        </button>
      </div>

      {activeTab === 'manual' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">1. Select Employee</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  className="w-full p-4 pl-12 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#3E3B6F] outline-none transition-all font-bold text-gray-800"
                  onChange={(e) => setSelectedEmp({ name: e.target.value, id: 'EMP-101', avatar: 'AK' })}
                >
                  <option value="">Search employee...</option>
                  <option>Ahmed Khan</option>
                  <option>Sara Miller</option>
                  <option>Tom Chen</option>
                </select>
              </div>

              {selectedEmp && (
                <div className="flex items-center gap-4 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl animate-in slide-in-from-top-2">
                  <div className="w-12 h-12 rounded-xl bg-accent-peach flex items-center justify-center font-bold text-[#3E3B6F]">
                    {selectedEmp.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{selectedEmp.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{selectedEmp.id}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#3E3B6F] p-8 rounded-[32px] text-white relative overflow-hidden shadow-xl">
               <div className="relative z-10 space-y-4">
                 <div className="p-2 bg-white/10 rounded-lg w-fit text-[#E8D5A3]"><Info size={24}/></div>
                 <h4 className="font-bold text-lg leading-tight">Opening Balance Rules</h4>
                 <p className="text-xs text-white/60 leading-relaxed">
                   Opening balances overwrite any existing accruals. This transaction will be logged as <strong>"Opening Adjustment"</strong> in the ledger.
                 </p>
               </div>
               <Database className="absolute -bottom-10 -right-10 opacity-5 -rotate-12" size={150} />
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">2. Configure Balances</h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Effective Date: Today</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leave Type</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Current</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Opening</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Effective Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {['Annual Leave', 'Casual Leave', 'Sick Leave'].map((type) => (
                      <tr key={type} className="group">
                        <td className="px-8 py-6 font-bold text-gray-900">{type}</td>
                        <td className="px-8 py-6 text-center">
                          <span className="text-xs font-bold text-gray-400 italic">0.0 d</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="relative w-32">
                            <input 
                              type="number" 
                              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-[#3E3B6F] outline-none focus:bg-white focus:border-[#3E3B6F]" 
                              placeholder="0.0"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 font-bold uppercase">Days</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <input 
                            type="date" 
                            className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 outline-none" 
                            defaultValue={new Date().toISOString().split('T')[0]}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3">
                <button className="px-6 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                <button 
                  disabled={!selectedEmp}
                  className="bg-[#3E3B6F] text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all disabled:opacity-50"
                >
                  Save Balances
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {importStatus === 'success' ? (
            <div className="bg-emerald-50 rounded-[40px] p-12 text-center space-y-6 border border-emerald-100 animate-in zoom-in duration-500">
               <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-emerald-500 mx-auto shadow-sm">
                 <CheckCircle2 size={48} />
               </div>
               <div>
                 <h3 className="text-3xl font-bold text-emerald-900 uppercase tracking-tight">Import Complete</h3>
                 <p className="text-emerald-700 font-medium mt-2">145 employees updated successfully. 5 rows were skipped due to errors.</p>
               </div>
               <div className="flex justify-center gap-4 pt-4">
                  <button onClick={() => setImportStatus('idle')} className="px-8 py-3 bg-[#3E3B6F] text-white rounded-2xl font-bold shadow-lg shadow-[#3E3B6F]/20">Back to Dashboard</button>
                  <button className="px-8 py-3 bg-white border border-emerald-200 text-emerald-700 rounded-2xl font-bold hover:bg-emerald-100 transition-all">Download Log</button>
               </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Steps/Workflow */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#3E3B6F] flex items-center justify-center font-bold text-xs">1</div>
                      <h4 className="text-sm font-bold text-gray-800">Download Template</h4>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed pl-11">Download the standard CSV template with required leave columns.</p>
                    <button className="ml-11 flex items-center gap-2 px-4 py-2 border border-gray-200 text-xs font-bold text-[#3E3B6F] rounded-lg hover:bg-gray-50">
                      <Download size={14} /> Download CSV Template
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#3E3B6F] flex items-center justify-center font-bold text-xs">2</div>
                      <h4 className="text-sm font-bold text-gray-800">Upload Data</h4>
                    </div>
                    <div 
                      onClick={handleUpload}
                      className="ml-11 border-2 border-dashed border-gray-100 rounded-2xl p-8 text-center hover:border-[#3E3B6F]/30 hover:bg-indigo-50/20 transition-all cursor-pointer group"
                    >
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-3">
                           <RefreshCw className="text-[#3E3B6F] animate-spin" size={24} />
                           <p className="text-[10px] font-bold text-[#3E3B6F] uppercase">Validating File...</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto text-gray-300 group-hover:text-[#3E3B6F] mb-2" size={28} />
                          <p className="text-[10px] font-bold text-gray-400 uppercase group-hover:text-[#3E3B6F]">Drop CSV or XLS here</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {showPreview && (
                  <div className="bg-red-50 p-6 rounded-[32px] border border-red-100 space-y-4 animate-in slide-in-from-top-4">
                    <div className="flex items-center gap-3 text-red-600">
                      <AlertTriangle size={20} />
                      <h5 className="font-bold text-sm">Validation Issues</h5>
                    </div>
                    <p className="text-xs text-red-800/70 font-medium leading-relaxed">
                      We found <strong>{errorCount} errors</strong> in your file. You can download the error report to see which rows need fixing.
                    </p>
                    <button className="w-full py-2.5 bg-white border border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                       <FileText size={14} /> Download Error Report
                    </button>
                  </div>
                )}
              </div>

              {/* Preview Table */}
              <div className="lg:col-span-8">
                {showPreview ? (
                  <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
                    <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                       <div className="flex items-center gap-3 text-sm font-bold text-gray-700 uppercase tracking-widest">
                         <Table size={18}/> 3. Validation Preview
                       </div>
                       <div className="flex gap-4">
                          <div className="text-center">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Valid Rows</p>
                            <p className="text-lg font-bold text-emerald-600">{validCount}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Errors</p>
                            <p className="text-lg font-bold text-red-500">{errorCount}</p>
                          </div>
                       </div>
                    </div>
                    <div className="overflow-x-auto max-h-[500px]">
                      <table className="w-full text-left">
                        <thead className="sticky top-0 bg-white shadow-sm z-10">
                          <tr>
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase">Row</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase">Emp ID / Name</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase">Annual</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase">Casual</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {MOCK_VALIDATION.map((row) => (
                            <tr key={row.row} className={`group ${row.status === 'Error' ? 'bg-red-50/30' : 'hover:bg-gray-50/50'}`}>
                              <td className="px-8 py-4 text-xs font-bold text-gray-400">{row.row}</td>
                              <td className="px-8 py-4">
                                <p className="text-xs font-bold text-gray-900">{row.name}</p>
                                <p className="text-[9px] text-gray-400 uppercase tracking-tighter">{row.empId}</p>
                              </td>
                              <td className="px-8 py-4 text-xs font-bold text-gray-700">{row.annual} d</td>
                              <td className="px-8 py-4 text-xs font-bold text-gray-700">{row.casual} d</td>
                              <td className="px-8 py-4">
                                <div className="flex flex-col items-center">
                                   {row.status === 'Valid' ? (
                                     <span className="text-emerald-500 flex items-center gap-1 text-[9px] font-bold uppercase"><CheckCircle2 size={12}/> Valid</span>
                                   ) : (
                                     <>
                                       <span className="text-red-500 flex items-center gap-1 text-[9px] font-bold uppercase"><XCircle size={12}/> Error</span>
                                       <p className="text-[8px] text-red-400 mt-0.5">{row.message}</p>
                                     </>
                                   )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
                         <p className="text-xs text-gray-500 font-medium italic">Row validation complete. {validCount} rows ready for database entry.</p>
                       </div>
                       <button 
                        onClick={handleImport}
                        className="bg-[#3E3B6F] text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-[#3E3B6F]/20 hover:bg-[#4A4680] transition-all flex items-center gap-2 active:scale-95"
                       >
                         <CheckCircle2 size={18} /> Import {validCount} Valid Rows
                       </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                    <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-3xl flex items-center justify-center mb-8">
                      <FileSpreadsheet size={48} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Preview Required</h3>
                    <p className="text-gray-400 max-w-sm mb-8 leading-relaxed font-medium">Follow the steps on the left to upload your opening balances. We will perform a real-time validation before any updates are made.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
