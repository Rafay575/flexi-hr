import React, { useState } from 'react';
import { 
  Landmark, Plus, Search, Filter, MoreVertical, 
  Settings2, FileCode, Download, Eye, CheckCircle2,
  Database, Layers, Trash2, Save, X, PlayCircle,
  Terminal, Info, ChevronRight, FileText, Code,
  ArrowRight
} from 'lucide-react';

interface BankFormat {
  id: string;
  bank: string;
  formatName: string;
  version: string;
  employeeCount: number;
  fileType: 'TXT' | 'CSV' | 'XLSX' | 'XML';
  encoding: 'UTF-8' | 'ASCII';
}

interface FieldMap {
  id: string;
  field: string;
  source: string;
  format: string;
  required: boolean;
}

const MOCK_FORMATS: BankFormat[] = [
  { id: 'BF-01', bank: 'Habib Bank Limited (HBL)', formatName: 'HBL BulkPay v4', version: 'v4.2', employeeCount: 210, fileType: 'TXT', encoding: 'ASCII' },
  { id: 'BF-02', bank: 'Meezan Bank', formatName: 'Meezan Corporate Direct', version: 'v1.0', employeeCount: 85, fileType: 'XLSX', encoding: 'UTF-8' },
  { id: 'BF-03', bank: 'Standard Chartered', formatName: 'SCB Straight2Bank', version: 'v3.1', employeeCount: 30, fileType: 'CSV', encoding: 'UTF-8' },
];

const MOCK_MAPPING: FieldMap[] = [
  { id: '1', field: 'Record Type', source: 'Constant "02"', format: 'Fixed(2)', required: true },
  { id: '2', field: 'Beneficiary Name', source: 'Employee.FullName', format: 'Upper(35)', required: true },
  { id: '3', field: 'Account Number', source: 'Employee.BankAcc', format: 'Numeric(14)', required: true },
  { id: '4', field: 'Amount', source: 'Payroll.NetPay', format: 'Dec*100(12)', required: true },
  { id: '5', field: 'Bank Reference', source: 'System.RunID', format: 'Alpha(10)', required: false },
];

export const BankFormatsConfig: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<BankFormat | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20">
            <Landmark size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Bank Format Configurations</h2>
            <p className="text-sm text-gray-500 font-medium">Manage bank-specific file structures and transmission protocols</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={18} /> Add New Format
        </button>
      </div>

      {!selectedFormat ? (
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden animate-in fade-in duration-300">
          <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Search formats..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10" />
            </div>
            <div className="flex gap-2">
               <button className="p-2 text-gray-400 hover:text-primary transition-all"><Filter size={20}/></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Bank Institution</th>
                  <th className="px-8 py-5">Format Name</th>
                  <th className="px-8 py-5 text-center">Version</th>
                  <th className="px-8 py-5 text-center">FileType</th>
                  <th className="px-8 py-5 text-center">Linked Employees</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium">
                {MOCK_FORMATS.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-8 py-4">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/5 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-all"><Landmark size={16}/></div>
                          <span className="font-bold text-gray-700">{f.bank}</span>
                       </div>
                    </td>
                    <td className="px-8 py-4 text-gray-500 font-bold">{f.formatName}</td>
                    <td className="px-8 py-4 text-center"><span className="text-[10px] font-black bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-gray-400 uppercase">{f.version}</span></td>
                    <td className="px-8 py-4 text-center"><span className="text-[10px] font-black text-primary uppercase">{f.fileType}</span></td>
                    <td className="px-8 py-4 text-center font-black text-gray-400">{f.employeeCount}</td>
                    <td className="px-8 py-4 text-right">
                       <div className="flex justify-end gap-2">
                          <button onClick={() => setSelectedFormat(f)} className="p-2 text-gray-300 hover:text-primary hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all shadow-sm"><Settings2 size={18}/></button>
                          <button className="p-2 text-gray-300 hover:text-primary hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all shadow-sm"><Eye size={18}/></button>
                          <button className="p-2 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={18}/></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
           {/* Detail View Header */}
           <div className="flex items-center justify-between">
              <button onClick={() => setSelectedFormat(null)} className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 hover:text-primary transition-all">
                <ArrowRight size={16} className="rotate-180" /> Back to Formats
              </button>
              <div className="flex gap-3">
                 <button className="px-5 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 flex items-center gap-2">
                    <Download size={14} /> Download Spec
                 </button>
                 <button className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 flex items-center gap-2">
                    <PlayCircle size={14} /> Test with Sample
                 </button>
                 <button className="px-6 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center gap-2">
                    <Save size={14} /> Save Changes
                 </button>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: General & Field Mapping */}
              <div className="lg:col-span-8 space-y-8">
                 <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 space-y-8">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-primary/5 text-primary rounded-xl"><FileCode size={20}/></div>
                       <h3 className="text-sm font-black uppercase tracking-[2px] text-gray-800">Format Identity & Detail</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase">File Type</label>
                          <select className="w-full bg-gray-50 border-none rounded-lg text-xs font-bold px-2 py-1.5 focus:ring-1 focus:ring-primary">
                             <option>TXT (Fixed Width)</option>
                             <option>CSV (Comma Separated)</option>
                             <option>XLSX (Excel)</option>
                             <option>XML</option>
                          </select>
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase">Encoding</label>
                          <select className="w-full bg-gray-50 border-none rounded-lg text-xs font-bold px-2 py-1.5 focus:ring-1 focus:ring-primary">
                             <option>ASCII</option>
                             <option>UTF-8</option>
                          </select>
                       </div>
                       <div className="flex items-center gap-3 pt-4">
                          <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary rounded" />
                          <span className="text-[9px] font-black text-gray-500 uppercase">Header Req.</span>
                       </div>
                       <div className="flex items-center gap-3 pt-4">
                          <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary rounded" />
                          <span className="text-[9px] font-black text-gray-500 uppercase">Trailer Req.</span>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
                       <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400">Field Mapping Registry</h3>
                       <button className="text-[10px] font-black text-primary uppercase flex items-center gap-1 hover:underline">
                         <Plus size={14}/> Add Field
                       </button>
                    </div>
                    <table className="w-full text-left text-sm">
                       <thead>
                          <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                             <th className="px-6 py-4 w-12 text-center">#</th>
                             <th className="px-6 py-4">Field Label</th>
                             <th className="px-6 py-4">Source Property</th>
                             <th className="px-6 py-4">Formatting Rule</th>
                             <th className="px-6 py-4 text-center">Mandatory</th>
                             <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                          {MOCK_MAPPING.map((m, i) => (
                            <tr key={m.id} className="hover:bg-gray-50 transition-colors group">
                               <td className="px-6 py-4 text-center font-black text-gray-300">{i+1}</td>
                               <td className="px-6 py-4 font-bold text-gray-700">{m.field}</td>
                               <td className="px-6 py-4"><span className="text-[10px] font-mono bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100">{m.source}</span></td>
                               <td className="px-6 py-4 font-mono text-[10px] text-gray-400">{m.format}</td>
                               <td className="px-6 py-4 text-center">
                                  {m.required ? <CheckCircle2 size={16} className="text-green-500 mx-auto" /> : <X size={16} className="text-gray-200 mx-auto" />}
                               </td>
                               <td className="px-6 py-4 text-right">
                                  <button className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>

              {/* Right: Format Strings & Templates */}
              <div className="lg:col-span-4 space-y-6">
                 <div className="bg-gray-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                    <div className="relative z-10 space-y-6">
                       <div className="flex items-center justify-between">
                          <h3 className="text-xs font-black uppercase tracking-widest text-accent flex items-center gap-2">
                             <Code size={16} /> Format String Templates
                          </h3>
                       </div>
                       
                       <div className="space-y-4">
                          <div className="space-y-2">
                             <p className="text-[9px] font-black text-white/40 uppercase">Detail Record Template</p>
                             <div className="bg-black/40 p-3 rounded-xl font-mono text-[10px] text-green-400 leading-relaxed border border-white/5 break-all">
                                [RT][BEN_NAME][ACC_NO][AMT][BANK_REF]
                             </div>
                          </div>
                          <div className="space-y-2">
                             <p className="text-[9px] font-black text-white/40 uppercase">Header Template</p>
                             <div className="bg-black/40 p-3 rounded-xl font-mono text-[10px] text-blue-400 leading-relaxed border border-white/5 break-all">
                                01[BANK_ID][RUN_ID][VAL_DATE][TOTAL_AMT]
                             </div>
                          </div>
                          <div className="space-y-2">
                             <p className="text-[9px] font-black text-white/40 uppercase">Trailer Template</p>
                             <div className="bg-black/40 p-3 rounded-xl font-mono text-[10px] text-orange-400 leading-relaxed border border-white/5 break-all">
                                99[TOTAL_COUNT][CHECK_SUM]
                             </div>
                          </div>
                       </div>

                       <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                          <Terminal size={18} className="text-white/20" />
                          <p className="text-[9px] text-white/50 font-medium leading-relaxed italic">
                            System uses Liquid syntax for dynamic property injection during run lock.
                          </p>
                       </div>
                    </div>
                    <Code className="absolute right-[-20px] top-[-20px] text-white/5 w-40 h-40 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                 </div>

                 <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-4">
                    <Info size={24} className="text-blue-500 mt-0.5 shrink-0" />
                    <div className="space-y-1">
                       <p className="text-xs font-black text-blue-900 uppercase tracking-tight">Pro-Tip: IBAN Length</p>
                       <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                         Pakistani banks enforce a 24-character IBAN length. The Numeric(14) accounts are deprecated for HBL v4.2 BulkPay.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Add New Format Drawer (Modal) */}
      {isAdding && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsAdding(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="px-8 py-5 border-b flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-primary/10 text-primary rounded-xl">
                      <Layers size={20} />
                   </div>
                   <h3 className="text-lg font-black text-gray-800">Add Bank Configuration</h3>
                </div>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-all"><X size={20} /></button>
             </div>
             <div className="p-8 space-y-6">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Institution</label>
                   <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10">
                      <option>Askari Bank</option>
                      <option>Faysal Bank</option>
                      <option>Bank Alfalah</option>
                      <option>United Bank Limited (UBL)</option>
                   </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Format Name</label>
                      <input type="text" placeholder="e.g. Master-Direct" className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold outline-none" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Initial Version</label>
                      <input type="text" placeholder="v1.0" className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold outline-none" />
                   </div>
                </div>
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-3">
                   <Info size={18} className="text-primary mt-0.5 shrink-0" />
                   <p className="text-[10px] text-primary/70 font-bold uppercase leading-relaxed">
                     Starting with a standard CSV template is recommended for new integrations. Manual mapping can be adjusted post-creation.
                   </p>
                </div>
             </div>
             <div className="p-6 bg-gray-50 border-t flex gap-3">
                <button onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all">Cancel</button>
                <button onClick={() => setIsAdding(false)} className="flex-[2] py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2 active:scale-95 transition-all">
                   <CheckCircle2 size={18} /> Initialize Format
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};