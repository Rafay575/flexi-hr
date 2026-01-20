
import React, { useState } from 'react';
import { 
  FileSpreadsheet, Download, Filter, ChevronRight, ArrowUpRight, ArrowDownRight,
  History, Calendar, Info, RefreshCw, Zap, MinusCircle, PlusCircle, CreditCard, Clock
} from 'lucide-react';
import { LeaveType } from '../types';

interface Transaction {
  id: string;
  date: string;
  type: 'Opening' | 'Accrual' | 'CarryForward' | 'AdjustmentCredit' | 'LeaveTaken' | 'AdjustmentDebit' | 'Lapsed' | 'Encashed';
  description: string;
  credit?: number;
  debit?: number;
  balance: number;
  reference?: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TX-001', date: 'Jan 01, 2025', type: 'Opening', description: 'System opening balance', credit: 0, balance: 0 },
  { id: 'TX-002', date: 'Jan 01, 2025', type: 'CarryForward', description: 'Balance from 2024', credit: 2.00, balance: 2.00, reference: 'CF-2024' },
  { id: 'TX-003', date: 'Jan 31, 2025', type: 'Accrual', description: 'Monthly accrual for January', credit: 2.00, balance: 4.00, reference: 'JOB-992' },
  { id: 'TX-004', date: 'Feb 10, 2025', type: 'LeaveTaken', description: 'Approved Leave Request', debit: 3.00, balance: 1.00, reference: 'LV-2025-1024' },
  { id: 'TX-005', date: 'Feb 28, 2025', type: 'Accrual', description: 'Monthly accrual for February', credit: 2.00, balance: 3.00, reference: 'JOB-1021' },
  { id: 'TX-006', date: 'Mar 05, 2025', type: 'AdjustmentCredit', description: 'Comp-off credit adjustment', credit: 1.00, balance: 4.00, reference: 'ADJ-442' },
  { id: 'TX-007', date: 'Mar 15, 2025', type: 'Encashed', description: 'Leave encashment request', debit: 1.00, balance: 3.00, reference: 'ENC-001' },
  { id: 'TX-008', date: 'Mar 31, 2025', type: 'Accrual', description: 'Monthly accrual for March', credit: 2.00, balance: 5.00, reference: 'JOB-1201' },
  { id: 'TX-009', date: 'Mar 31, 2025', type: 'Lapsed', description: 'Quarterly policy lapse', debit: 0.50, balance: 4.50, reference: 'SYS-POL' },
];

const getTransactionIcon = (type: Transaction['type']) => {
  switch (type) {
    case 'Opening': return <div className="p-1.5 bg-gray-100 text-gray-600 rounded-md"><History size={14} /></div>;
    case 'Accrual': return <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-md"><RefreshCw size={14} /></div>;
    case 'CarryForward': return <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-md"><ArrowUpRight size={14} /></div>;
    case 'AdjustmentCredit': return <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md"><PlusCircle size={14} /></div>;
    case 'LeaveTaken': return <div className="p-1.5 bg-red-100 text-red-600 rounded-md"><ArrowDownRight size={14} /></div>;
    case 'AdjustmentDebit': return <div className="p-1.5 bg-orange-100 text-orange-600 rounded-md"><MinusCircle size={14} /></div>;
    /* Added missing Clock import to fix the error on line 40 */
    case 'Lapsed': return <div className="p-1.5 bg-gray-200 text-gray-500 rounded-md"><Clock size={14} /></div>;
    case 'Encashed': return <div className="p-1.5 bg-amber-100 text-amber-600 rounded-md"><CreditCard size={14} /></div>;
  }
};

const getTransactionLabel = (type: Transaction['type']) => {
  switch (type) {
    case 'Opening': return 'Opening Balance';
    case 'Accrual': return 'Monthly Accrual';
    case 'CarryForward': return 'Carry Forward';
    case 'AdjustmentCredit': return 'Adjustment (Credit)';
    case 'LeaveTaken': return 'Leave Taken';
    case 'AdjustmentDebit': return 'Adjustment (Debit)';
    case 'Lapsed': return 'Lapsed';
    case 'Encashed': return 'Encashed';
  }
};

export const BalanceLedger = () => {
  const [selectedType, setSelectedType] = useState<string>(LeaveType.ANNUAL);
  const [selectedYear, setSelectedYear] = useState('2025');

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#3E3B6F]">Balance Ledger</h2>
          <p className="text-gray-500">Detailed audit trail of your leave transactions.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-[#3E3B6F]/20"
          >
            {Object.values(LeaveType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-[#3E3B6F]/20"
          >
            <option>2025</option>
            <option>2024</option>
          </select>
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10">
            <FileSpreadsheet size={18} /> Export Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-8">
            <div className="bg-primary-gradient p-6 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-1">{selectedType}</p>
              <h3 className="text-xl font-bold">{selectedYear} Summary</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Opening Balance</span>
                  <span className="font-bold">0.00 d</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">+ Accrued</span>
                  <span className="font-bold text-emerald-600">+12.00 d</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">+ Carry Forward</span>
                  <span className="font-bold text-indigo-600">+2.00 d</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">+ Adjustments</span>
                  <span className="font-bold text-blue-600">+1.00 d</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">- Leave Taken</span>
                  <span className="font-bold text-red-500">-5.00 d</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">- Lapsed</span>
                  <span className="font-bold text-gray-400">0.00 d</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">- Encashed</span>
                  <span className="font-bold text-amber-500">0.00 d</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <p className="text-xs font-bold text-[#3E3B6F] uppercase">Current Balance</p>
                <p className="text-2xl font-bold text-[#3E3B6F]">10.00 <span className="text-xs font-normal opacity-50">Days</span></p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 flex items-center gap-3 text-gray-400">
              <Info size={16} />
              <p className="text-[10px] leading-tight font-medium uppercase tracking-wider">Updates occur daily at 00:00 UTC during system maintenance.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h4 className="font-bold text-gray-800">Transactions</h4>
                <div className="flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-emerald-500" />
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Audit</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#3E3B6F] bg-white border border-gray-200 px-3 py-1.5 rounded-lg transition-all">
                  <Filter size={14} /> Filters
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/30">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Date</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Transaction</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Description</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] text-right">Credit</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] text-right">Debit</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] text-right">Balance</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] text-right">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_TRANSACTIONS.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <span className="text-xs font-medium text-gray-500">{tx.date}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          {getTransactionIcon(tx.type)}
                          <span className="text-sm font-bold text-gray-800">{getTransactionLabel(tx.type)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs text-gray-500 font-medium">{tx.description}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        {tx.credit !== undefined && (
                          <span className={`text-sm font-bold ${tx.credit > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {tx.credit > 0 ? `+${tx.credit.toFixed(2)}` : tx.credit.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        {tx.debit !== undefined && (
                          <span className="text-sm font-bold text-red-500">
                            -{tx.debit.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="text-sm font-bold text-[#3E3B6F] bg-[#3E3B6F]/5 px-2 py-1 rounded">
                          {tx.balance.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        {tx.reference && (
                          <button className="text-[10px] font-bold text-[#3E3B6F] hover:underline flex items-center gap-1 justify-end ml-auto">
                            {tx.reference} <ChevronRight size={12} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <p className="text-xs text-gray-500 font-medium">Showing <span className="font-bold">9</span> of <span className="font-bold">30</span> transactions</p>
              <div className="flex items-center gap-2">
                <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-400 cursor-not-allowed">
                  <ChevronRight size={18} className="rotate-180" />
                </button>
                <div className="flex gap-1">
                  <button className="w-8 h-8 rounded-lg bg-[#3E3B6F] text-white text-xs font-bold">1</button>
                  <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 text-xs font-bold">2</button>
                </div>
                <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-500 hover:bg-gray-50">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-2xl p-8 border border-amber-100 flex flex-col md:flex-row items-center gap-6">
            <div className="p-4 bg-white rounded-2xl shadow-sm text-amber-500">
              <Zap size={32} />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-amber-900">Missing a transaction?</h4>
              <p className="text-sm text-amber-800 opacity-70">If you notice discrepancies in your balance history, please contact your HRBP or use the Audit Request tool.</p>
            </div>
            <button className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/10">
              Open Audit Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
