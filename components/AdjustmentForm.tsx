
import React, { useState, useRef } from 'react';
import { 
  X, Save, Send, Users, User, FileText, 
  Upload, AlertCircle, CheckCircle2, Search,
  Download, Trash2, Info, Percent, Calendar
} from 'lucide-react';

interface AdjustmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

type EntryMode = 'SINGLE' | 'BULK';

export const AdjustmentForm: React.FC<AdjustmentFormProps> = ({ isOpen, onClose, onSave }) => {
  const [mode, setMode] = useState<EntryMode>('SINGLE');
  const [formData, setFormData] = useState({
    empId: '',
    type: 'Bonus',
    component: 'Performance Bonus',
    amount: '',
    isTaxable: true,
    period: 'Jan 2025',
    category: 'Achievement',
    description: '',
  });
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSave = (status: 'DRAFT' | 'SUBMITTED') => {
    onSave({ ...formData, mode, status });
  };

  const isDescriptionValid = formData.description.length >= 20;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/5 rounded-lg text-primary">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 leading-tight">Create Adjustment</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ad-hoc payroll corrections</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="p-4 bg-gray-50 border-b flex justify-center">
          <div className="flex items-center gap-1 p-1 bg-gray-200/50 rounded-xl w-full">
            <button 
              onClick={() => setMode('SINGLE')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'SINGLE' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}
            >
              <User size={14} /> Single Entry
            </button>
            <button 
              onClick={() => setMode('BULK')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'BULK' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}
            >
              <Users size={14} /> Bulk Upload
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {mode === 'SINGLE' ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Employee</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search by ID or Name..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Type</label>
                  <select 
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none cursor-pointer"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option>Bonus</option>
                    <option>Penalty</option>
                    <option>Reimbursement</option>
                    <option>Correction</option>
                    <option>Arrears</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Apply to Period</label>
                  <select 
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none"
                    value={formData.period}
                  >
                    <option>Jan 2025</option>
                    <option>Feb 2025</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Amount (PKR)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xl font-black text-primary outline-none focus:ring-2 focus:ring-primary/10"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Taxable</span>
                    <button 
                      onClick={() => setFormData({...formData, isTaxable: !formData.isTaxable})}
                      className={`w-8 h-4 rounded-full relative transition-all ${formData.isTaxable ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${formData.isTaxable ? 'right-0.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-dashed">
                <h4 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Justification</h4>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-500">Reason Category</label>
                  <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none">
                    <option>Performance Achievement</option>
                    <option>Travel Expense</option>
                    <option>Data Correction</option>
                    <option>Service Reward</option>
                    <option>Policy Exception</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-black uppercase text-gray-500">Description</label>
                    <span className={`text-[9px] font-black ${isDescriptionValid ? 'text-green-500' : 'text-red-400'}`}>
                      {formData.description.length}/20 chars
                    </span>
                  </div>
                  <textarea 
                    rows={3}
                    placeholder="Provide context for this adjustment..."
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-primary hover:border-primary transition-all">
                  <Upload size={14} /> Attach Proof (Optional)
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="p-8 border-2 border-dashed border-primary/20 bg-primary/5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 hover:bg-primary/10 transition-all cursor-pointer group"
              >
                <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                  <Upload size={32} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Click to upload CSV</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Maximum 500 records per batch</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".csv"
                  onChange={(e) => setBulkFile(e.target.files?.[0] || null)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <Download size={18} className="text-gray-400" />
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-tight">CSV Template</p>
                </div>
                <button className="text-[10px] font-black text-primary uppercase bg-white px-3 py-1.5 rounded-lg border shadow-sm hover:bg-gray-50">
                  Download
                </button>
              </div>

              {bulkFile && (
                <div className="space-y-4 animate-in fade-in">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">File Preview & Validation</h4>
                  <div className="bg-white border rounded-xl overflow-hidden text-[10px]">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b">
                        <tr className="font-black text-gray-400 uppercase tracking-tighter">
                          <th className="px-3 py-2">Emp ID</th>
                          <th className="px-3 py-2">Comp Code</th>
                          <th className="px-3 py-2 text-right">Amount</th>
                          <th className="px-3 py-2 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 font-medium text-gray-600">
                        <tr>
                          <td className="px-3 py-2">EMP-1001</td>
                          <td className="px-3 py-2">BNS01</td>
                          <td className="px-3 py-2 text-right">15,000</td>
                          <td className="px-3 py-2 text-center text-green-500 font-black">OK</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2">EMP-9999</td>
                          <td className="px-3 py-2">BNS01</td>
                          <td className="px-3 py-2 text-right">5,000</td>
                          <td className="px-3 py-2 text-center text-red-500 font-black">INVALID ID</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex gap-3">
          <button 
            onClick={() => handleSave('DRAFT')}
            className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <FileText size={16} /> Save Draft
          </button>
          <button 
            onClick={() => handleSave('SUBMITTED')}
            disabled={mode === 'SINGLE' && (!formData.amount || !isDescriptionValid)}
            className="flex-[2] py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Send size={16} /> Submit Adjustment
          </button>
        </div>
      </div>
    </div>
  );
};

const Zap = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
  </svg>
);
