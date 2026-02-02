
import React, { useState } from 'react';
import { 
  Zap, Plus, Clock, AlertTriangle, CheckCircle2, History, 
  ExternalLink, Calendar, Search, Filter, MoreHorizontal,
  ChevronRight, ArrowRight, XCircle, Info
} from 'lucide-react';
import { CompOffCreditRequestForm } from './CompOffCreditRequestForm';

interface CompOffCredit {
  id: string;
  earnedDate: string;
  source: string;
  amount: string;
  expiryDate: string;
  status: 'Available' | 'Pending' | 'Used' | 'Expired';
  usedInRequest?: string;
  daysToExpiry?: number;
}

const MOCK_CREDITS: CompOffCredit[] = [
  { id: 'CO-101', earnedDate: 'Dec 25, 2024', source: 'Worked Holiday - Quaid-e-Azam Day', amount: '1.0 day', expiryDate: 'Mar 31, 2025', status: 'Available', daysToExpiry: 65 },
  { id: 'CO-102', earnedDate: 'Jan 05, 2025', source: 'Extra Shift - Weekend Deployment', amount: '1.0 day', expiryDate: 'Apr 05, 2025', status: 'Available', daysToExpiry: 70 },
  { id: 'CO-103', earnedDate: 'Jan 10, 2025', source: 'Approved OT - 4h System Migration', amount: '0.5 day', expiryDate: 'Apr 10, 2025', status: 'Pending' },
  { id: 'CO-104', earnedDate: 'Nov 12, 2024', source: 'Worked Holiday - Diwali', amount: '1.0 day', expiryDate: 'Feb 12, 2025', status: 'Available', daysToExpiry: 18 },
  { id: 'CO-105', earnedDate: 'Oct 01, 2024', source: 'Extra Shift - Project Alpha Go-live', amount: '1.0 day', expiryDate: 'Jan 01, 2025', status: 'Used', usedInRequest: 'LV-2024-882' },
  { id: 'CO-106', earnedDate: 'Sep 15, 2024', source: 'Approved OT - Client Support', amount: '1.0 day', expiryDate: 'Dec 15, 2024', status: 'Expired' },
  { id: 'CO-107', earnedDate: 'Aug 14, 2024', source: 'Worked Holiday - Independence Day', amount: '1.0 day', expiryDate: 'Nov 14, 2024', status: 'Used', usedInRequest: 'LV-2024-551' },
  { id: 'CO-108', earnedDate: 'Dec 10, 2024', source: 'Extra Shift - Audit Prep', amount: '1.0 day', expiryDate: 'Mar 10, 2025', status: 'Used', usedInRequest: 'LV-2025-102' },
];

export const MyCompOffCredits = ({ onApply }: { onApply: () => void }) => {
  const [activeTab, setActiveTab] = useState('Available');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);

  const filteredCredits = MOCK_CREDITS.filter(c => {
    const matchesTab = activeTab === 'Available' ? c.status === 'Available' :
                       activeTab === 'Pending' ? c.status === 'Pending' :
                       activeTab === 'Used' ? c.status === 'Used' :
                       c.status === 'Expired';
    const matchesSearch = c.source.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const expiringSoon = MOCK_CREDITS.filter(c => c.status === 'Available' && c.daysToExpiry && c.daysToExpiry <= 30);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Used': return 'bg-gray-100 text-gray-500 border-gray-200';
      case 'Expired': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl">
            <Zap size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#3E3B6F]">My Comp-Off Credits</h2>
            <p className="text-gray-500 font-medium">Earned credits for working on holidays or extra shifts.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsRequestFormOpen(true)}
          className="bg-[#3E3B6F] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4A4680] shadow-lg shadow-[#3E3B6F]/20 transition-all active:scale-95"
        >
          <Plus size={18} /> Request New Credit
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex items-center gap-5">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={24}/></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available</p>
            <p className="text-2xl font-bold text-emerald-600">3.0 Days</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm flex items-center gap-5">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl"><Clock size={24}/></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending</p>
            <p className="text-2xl font-bold text-amber-600">0.5 Days</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm flex items-center gap-5">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><AlertTriangle size={24}/></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expiring Soon</p>
            <p className="text-2xl font-bold text-orange-600">1.0 Day</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="p-3 bg-gray-50 text-gray-500 rounded-xl"><History size={24}/></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Used This Year</p>
            <p className="text-2xl font-bold text-gray-900">3.0 Days</p>
          </div>
        </div>
      </div>

      {/* Expiry Warning */}
      {expiringSoon.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-[32px] p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-orange-900 font-bold">Credits Expiring Soon!</p>
              <p className="text-sm text-orange-800/70">{expiringSoon[0].amount} expires on {expiringSoon[0].expiryDate}. Use it before it lapses!</p>
            </div>
          </div>
          <button 
            onClick={onApply}
            className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 whitespace-nowrap"
          >
            Apply Now
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30 flex flex-wrap items-center justify-between gap-6">
          <div className="flex gap-2 p-1 bg-gray-200/50 rounded-2xl">
            {['Available', 'Pending', 'Used', 'Expired'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab ? 'bg-white text-[#3E3B6F] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search credits..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#3E3B6F]/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Earned Date</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Source / Activity</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expiry</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCredits.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-gray-900">{c.earnedDate}</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">{c.id}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-medium text-gray-700">{c.source}</p>
                    {c.usedInRequest && (
                      <button className="text-[10px] font-bold text-[#3E3B6F] flex items-center gap-1 mt-1 hover:underline">
                        Used in: {c.usedInRequest} <ExternalLink size={10} />
                      </button>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-[#3E3B6F]">{c.amount}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-600">{c.expiryDate}</span>
                      {c.status === 'Available' && c.daysToExpiry && (
                        <span className={`text-[9px] font-bold uppercase mt-1 ${c.daysToExpiry <= 30 ? 'text-orange-500' : 'text-gray-400'}`}>
                           {c.daysToExpiry} days left
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2  transition-all">
                      {c.status === 'Available' && (
                        <button 
                          onClick={onApply}
                          className="bg-indigo-50 text-[#3E3B6F] px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#3E3B6F] hover:text-white transition-all shadow-sm border border-indigo-100"
                        >
                          Use as Leave
                        </button>
                      )}
                      {c.status === 'Pending' && (
                        <button className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all" title="Cancel Request">
                          <XCircle size={18} />
                        </button>
                      )}
                      <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-gray-50 rounded-lg transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCredits.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} />
              </div>
              <p className="text-gray-400 font-medium italic">No {activeTab.toLowerCase()} credits found.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Info size={16} className="text-[#3E3B6F]" /> What is Comp-Off?
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            Compensatory Off (Comp-Off) credits are granted when you work beyond your standard schedule, such as on weekends or public holidays. These credits can be used as leave days later.
          </p>
          <div className="pt-4 border-t border-gray-50">
             <button className="text-xs font-bold text-[#3E3B6F] hover:underline flex items-center gap-2">
               Read Comp-Off Policy <ChevronRight size={14} />
             </button>
          </div>
        </div>

        <div className="bg-indigo-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl flex items-center">
           <div className="relative z-10 space-y-4">
             <h4 className="text-xl font-bold">Earned too many?</h4>
             <p className="text-white/60 text-sm">Credits usually expire within 90 days of being earned. Check your department rules for extensions or encashment eligibility.</p>
             <button className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 rounded-xl text-xs font-bold transition-all">
               Check Rulebook
             </button>
           </div>
           <Zap className="absolute right-[-20px] bottom-[-20px] text-white/5" size={200} />
        </div>
      </div>

      <CompOffCreditRequestForm isOpen={isRequestFormOpen} onClose={() => setIsRequestFormOpen(false)} />
    </div>
  );
};
