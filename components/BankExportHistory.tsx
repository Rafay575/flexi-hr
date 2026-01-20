
import React, { useState } from 'react';
import { 
  History, Search, Filter, Download, Eye, 
  CheckCircle2, AlertCircle, Clock, RefreshCw,
  FileText, Landmark, ArrowRight, X, ChevronRight,
  Terminal, ShieldCheck, Activity
} from 'lucide-react';

type ExportStatus = 'Generated' | 'Sent' | 'Processed' | 'Failed' | 'Partially Processed';

interface BankExportRecord {
  id: string;
  date: string;
  run: string;
  bank: string;
  employees: number;
  amount: number;
  status: ExportStatus;
}

const MOCK_HISTORY: BankExportRecord[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `EXP-2025-${99 - i}`,
  date: `2025-01-${15 - Math.floor(i/2)}`,
  run: 'Jan 2025 (v1.2)',
  bank: i % 3 === 0 ? 'Habib Bank Limited' : i % 3 === 1 ? 'Meezan Bank' : 'Standard Chartered',
  employees: 10 + Math.floor(Math.random() * 300),
  amount: 500000 + Math.floor(Math.random() * 20000000),
  status: i === 0 ? 'Sent' : i === 2 ? 'Failed' : i === 5 ? 'Partially Processed' : 'Processed'
}));

export const BankExportHistory: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedExport, setSelectedExport] = useState<BankExportRecord | null>(null);

  const getStatusStyle = (status: ExportStatus) => {
    switch (status) {
      case 'Generated': return 'bg-gray-100 text-gray-500 border-gray-200';
      case 'Sent': return 'bg-blue-50 text-blue-600 border-blue-200 animate-pulse';
      case 'Processed': return 'bg-green-50 text-green-600 border-green-200';
      case 'Failed': return 'bg-red-50 text-red-600 border-red-200';
      case 'Partially Processed': return 'bg-orange-50 text-orange-600 border-orange-200';
      default: return 'bg-gray-50 text-gray-400';
    }
  };

  const formatPKR = (val: number) => `PKR ${(val / 1000000).toFixed(2)}M`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Bank Export History</h2>
          <p className="text-sm text-gray-500">Audit trail of all disbursement instructions sent to financial partners</p>
        </div>
        <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all">
          <Download size={18} /> Export Master Log
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by Export ID, Bank or Run..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 flex items-center gap-2 hover:bg-gray-200">
            <Filter size={14} /> Status: All
          </button>
          <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 flex items-center gap-2 hover:bg-gray-200">
            <Clock size={14} /> Last 30 Days
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-5">Export ID</th>
                <th className="px-6 py-5">Transmission Date</th>
                <th className="px-6 py-5">Payroll Run</th>
                <th className="px-6 py-5">Recipient Bank</th>
                <th className="px-6 py-5 text-center">Employees</th>
                <th className="px-6 py-5 text-right">Amount</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_HISTORY.map((rec) => (
                <tr key={rec.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 font-mono font-bold text-primary">{rec.id}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{rec.date}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-gray-500">{rec.run}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Landmark size={14} className="text-gray-300" />
                      <span className="font-bold text-gray-700">{rec.bank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-gray-500">{rec.employees}</td>
                  <td className="px-6 py-4 text-right font-mono font-black text-gray-800">{formatPKR(rec.amount)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full border ${getStatusStyle(rec.status)}`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button 
                        onClick={() => setSelectedExport(rec)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                       >
                         <Eye size={18} />
                       </button>
                       <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                         <Download size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Slide-over / Modal */}
      {selectedExport && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedExport(null)} />
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 max-h-[85vh]">
            
            {/* Header */}
            <div className="bg-gray-50 px-8 py-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 text-primary rounded-lg"><History size={20}/></div>
                <div>
                   <h3 className="text-lg font-bold text-gray-800 tracking-tight">Transmission Details: {selectedExport.id}</h3>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedExport.bank} • {selectedExport.date}</p>
                </div>
              </div>
              <button onClick={() => setSelectedExport(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* Status Tracker */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { step: 'Generated', time: '09:00 AM', status: 'done' },
                  { step: 'Validated', time: '09:05 AM', status: 'done' },
                  { step: 'Transmitted', time: '09:10 AM', status: selectedExport.status === 'Failed' ? 'error' : 'done' },
                  { step: 'Bank Acknowledgement', time: '09:12 AM', status: selectedExport.status === 'Processed' ? 'done' : 'pending' },
                ].map((s, i) => (
                  <div key={i} className="relative text-center space-y-2">
                    <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      s.status === 'done' ? 'bg-green-500 border-green-500 text-white' :
                      s.status === 'error' ? 'bg-red-500 border-red-500 text-white' :
                      'bg-white border-gray-200 text-gray-300'
                    }`}>
                      {s.status === 'done' ? <CheckCircle2 size={16} /> : s.status === 'error' ? <X size={16} /> : <Clock size={16} />}
                    </div>
                    <p className="text-[10px] font-black text-gray-700 uppercase tracking-tighter leading-tight">{s.step}</p>
                    <p className="text-[9px] text-gray-400 font-bold">{s.time}</p>
                  </div>
                ))}
              </div>

              {/* Logs & Response */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                     <Terminal size={14}/> Transmission Log
                   </h4>
                   <div className="bg-gray-900 rounded-xl p-4 font-mono text-[10px] text-green-400 h-48 overflow-y-auto">
                      <p className="opacity-50"># Initiating Secure Tunnel...</p>
                      <p className="text-blue-400">[09:10:01] CONNECTED TO HBL_PROD_GATEWAY</p>
                      <p>[09:10:05] AUTHENTICATION_SUCCESS: FX-PAY-PK-01</p>
                      <p>[09:10:08] FILE_UPLOAD_START: PR_JAN25_V12.TXT</p>
                      <p>[09:10:45] BYTES_TRANSFERRED: 1.2MB</p>
                      <p className="text-yellow-400">[09:10:50] WAITING_FOR_ACK...</p>
                   </div>
                </div>
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                     <Activity size={14}/> Bank Gateway Response
                   </h4>
                   <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-xs font-bold text-gray-500">Bank Response Code:</span>
                        <span className="text-xs font-black text-primary">ACK-200-SUCCESS</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-xs font-bold text-gray-500">Reference ID:</span>
                        <span className="text-xs font-mono font-bold text-gray-800">HBL-7788992211</span>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-gray-100 flex items-start gap-3">
                         <ShieldCheck size={18} className="text-green-500 shrink-0" />
                         <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                           The file has been successfully received and queued for processing. Automated reconciliation will trigger at EOD.
                         </p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Data Summary */}
              <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-between">
                 <div className="flex items-center gap-8">
                    <div>
                       <p className="text-[9px] font-black text-gray-400 uppercase">Records Processed</p>
                       <p className="text-lg font-black text-primary">{selectedExport.employees}</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-gray-400 uppercase">Total Amount</p>
                       <p className="text-lg font-black text-primary">{formatPKR(selectedExport.amount)}</p>
                    </div>
                 </div>
                 <button className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary/90">
                    <RefreshCw size={14} /> Retry Transmission
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
