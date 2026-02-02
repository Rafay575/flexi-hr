import React, { useState } from 'react';
import { 
  Globe, Plus, Search, Filter, MoreVertical, 
  RefreshCw, Download, Calendar, History, 
  CheckCircle2, AlertCircle, Info, Landmark,
  DollarSign, ArrowRight, Settings2, Trash2,
  Lock, ExternalLink,
  /* Added missing icon imports */
  ChevronRight, TrendingUp, ShieldCheck
} from 'lucide-react';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  decimal: number;
  status: 'Active' | 'Inactive' | 'Base';
}

interface ExchangeRate {
  id: string;
  currency: string;
  rate: number;
  effectiveFrom: string;
  updatedBy: string;
  source: string;
}

const MOCK_CURRENCIES: Currency[] = [
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs.', decimal: 2, status: 'Base' },
  { code: 'USD', name: 'US Dollar', symbol: '$', decimal: 2, status: 'Active' },
  { code: 'GBP', name: 'British Pound', symbol: '£', decimal: 2, status: 'Active' },
  { code: 'EUR', name: 'Euro', symbol: '€', decimal: 2, status: 'Inactive' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', decimal: 2, status: 'Active' },
];

const MOCK_RATES: ExchangeRate[] = [
  { id: '1', currency: 'USD', rate: 278.45, effectiveFrom: '2025-01-20', updatedBy: 'System (SBP)', source: 'State Bank of Pakistan' },
  { id: '2', currency: 'GBP', rate: 354.12, effectiveFrom: '2025-01-20', updatedBy: 'System (SBP)', source: 'State Bank of Pakistan' },
  { id: '3', currency: 'AED', rate: 75.82, effectiveFrom: '2025-01-19', updatedBy: 'Ahmed Raza', source: 'Manual' },
  { id: '4', currency: 'USD', rate: 277.90, effectiveFrom: '2025-01-15', updatedBy: 'Zainab Siddiqui', source: 'Manual' },
];

export const CurrencyFXRates: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CURRENCIES' | 'RATES'>('CURRENCIES');
  const [showAddRate, setShowAddRate] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
            <Globe size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
              Currency & FX Rates
              <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-primary/20">Treasury</span>
            </h2>
            <p className="text-sm text-gray-500 font-medium">Manage multi-currency payroll disbursements and exchange parity</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-all">
            <Download size={18} /> Export Parity
          </button>
          <button 
            onClick={() => setShowAddRate(true)}
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Plus size={18} /> Add Exchange Rate
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 w-fit rounded-2xl border border-gray-200">
        <button
          onClick={() => setActiveTab('CURRENCIES')}
          className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'CURRENCIES' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Currencies
        </button>
        <button
          onClick={() => setActiveTab('RATES')}
          className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'RATES' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Exchange Rates
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === 'CURRENCIES' ? (
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden animate-in fade-in duration-300">
              <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400">Currency Definitions</h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input type="text" placeholder="Search currencies..." className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary w-40" />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      <th className="px-8 py-5">Code</th>
                      <th className="px-8 py-5">Currency Name</th>
                      <th className="px-8 py-5 text-center">Symbol</th>
                      <th className="px-8 py-5 text-center">Decimal</th>
                      <th className="px-8 py-5 text-center">Status</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-medium">
                    {MOCK_CURRENCIES.map((c) => (
                      <tr key={c.code} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-8 py-4 font-mono font-bold text-primary">{c.code}</td>
                        <td className="px-8 py-4 text-gray-700">{c.name}</td>
                        <td className="px-8 py-4 text-center font-bold text-gray-500 text-lg">{c.symbol}</td>
                        <td className="px-8 py-4 text-center text-gray-500">{c.decimal}</td>
                        <td className="px-8 py-4 text-center">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            c.status === 'Base' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                            c.status === 'Active' ? 'bg-green-50 text-green-600 border-green-200' :
                            'bg-gray-100 text-gray-400 border-gray-200'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            {c.status !== 'Base' ? (
                              <button className="p-2 text-gray-300 hover:text-primary transition-all"><Settings2 size={16}/></button>
                            ) : (
                              <button className="p-2 text-gray-300 cursor-not-allowed" title="Base currency is locked"><Lock size={16}/></button>
                            )}
                            <button className="p-2 text-gray-300 hover:text-red-500 transition-all  disabled:opacity-0" disabled={c.status === 'Base'}><Trash2 size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden animate-in fade-in duration-300">
              <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-2">
                  <History size={16} /> Rate History (Base: PKR)
                </h3>
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 bg-primary/5 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all flex items-center gap-1.5">
                    <Download size={14} /> Import Bulk
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      <th className="px-8 py-5">Effective Date</th>
                      <th className="px-8 py-5">Currency</th>
                      <th className="px-8 py-5 text-right">Rate (1 unit)</th>
                      <th className="px-8 py-5">Updated By</th>
                      <th className="px-8 py-5">Source</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-medium">
                    {MOCK_RATES.map((rate) => (
                      <tr key={rate.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-4 text-gray-500 font-mono text-xs">{rate.effectiveFrom}</td>
                        <td className="px-8 py-4 font-bold text-gray-700">{rate.currency}</td>
                        <td className="px-8 py-4 text-right font-mono font-black text-primary">PKR {rate.rate.toFixed(2)}</td>
                        <td className="px-8 py-4 text-xs text-gray-600">{rate.updatedBy}</td>
                        <td className="px-8 py-4">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{rate.source}</span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <button className="p-2 text-gray-300 hover:text-primary transition-all"><MoreVertical size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Auto-update & SBP Sync */}
        <div className="lg:col-span-4 space-y-6">
          {/* Auto Update Logic Card */}
          <div className="bg-indigo-900 p-8 rounded-3xl text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                    <RefreshCw size={24} className={`text-accent ${isRefreshing ? 'animate-spin' : ''}`} />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight">Auto-Update</h3>
                </div>
                <button 
                  onClick={() => setAutoUpdate(!autoUpdate)}
                  className={`w-12 h-6 rounded-full relative transition-all ${autoUpdate ? 'bg-accent' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full shadow-sm transition-all ${autoUpdate ? 'right-1 bg-primary' : 'left-1 bg-white'}`} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Primary Source</p>
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <Landmark size={16} className="text-accent" />
                    State Bank of Pakistan (SBP)
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Update Frequency</p>
                  <p className="text-sm font-bold">Daily at 10:00 AM PST</p>
                </div>
              </div>

              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[3px] transition-all flex items-center justify-center gap-2"
              >
                {isRefreshing ? 'Syncing...' : 'Force SBP Sync Now'}
              </button>
            </div>
            <Landmark className="absolute right-[-20px] bottom-[-20px] text-white/5 w-48 h-48 rotate-12 group-hover:scale-110 transition-transform duration-700" />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-4">
            <div className="flex items-center gap-3 text-orange-500">
              <AlertCircle size={20} />
              <h4 className="text-sm font-black uppercase tracking-tight">Manual Override Alert</h4>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              3 currencies (AED, SAR, QAR) are currently using <strong>Manual Rates</strong>. SBP automated parity for these pairs is disabled.
            </p>
            <button className="text-[10px] font-black text-primary uppercase flex items-center gap-1 hover:underline">
              Review Manual Exceptions <ChevronRight size={12} />
            </button>
          </div>

          <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-4">
            <Info size={24} className="text-blue-500 mt-1 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-black text-blue-900 uppercase tracking-tight">Disbursement Rule</p>
              <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                Foreign currency payouts are calculated based on the <strong>Effective Rate</strong> available at the time of Run Locking. Arrears for rate variance are not auto-processed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Rate Modal */}
      {showAddRate && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowAddRate(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-5 border-b flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <TrendingUp size={20} />
                </div>
                <h3 className="text-lg font-black text-gray-800">Add Exchange Rate</h3>
              </div>
              <button onClick={() => setShowAddRate(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-400">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Currency</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10">
                  <option>USD - US Dollar</option>
                  <option>GBP - British Pound</option>
                  <option>AED - UAE Dirham</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Exchange Rate (1 Unit = PKR)</label>
                <div className="relative">
                  <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input type="number" placeholder="278.45" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-black text-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Effective Date</label>
                  <input type="date" className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Source Reference</label>
                  <input type="text" placeholder="e.g. SBP/Manual" className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold outline-none" />
                </div>
              </div>
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-center gap-3">
                <ShieldCheck size={20} className="text-primary" />
                <p className="text-[10px] text-primary font-bold uppercase leading-tight">
                  This rate will be used for all pending calculations in the current open payroll cycle.
                </p>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t flex gap-3">
              <button onClick={() => setShowAddRate(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all">Cancel</button>
              <button onClick={() => setShowAddRate(false)} className="flex-[2] py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2 active:scale-95 transition-all">
                <CheckCircle2 size={18} /> Update Rate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const X = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);