import React, { useState } from 'react';
import { Calendar, HeartPulse, Coffee, Zap, Info, ChevronRight, History, ExternalLink, Clock, Plus, X } from 'lucide-react';
import { LeaveType } from '../types';
import { ApplyLeaveWizard } from './ApplyLeaveWizard'; // Make sure this path is correct

interface Balance {
  type: LeaveType | string;
  total: number | '∞';
  used: number;
  remaining: number | '∞';
  earned: number;
  expiring?: { days: number; date: string };
  carryForward?: number;
  isHours?: boolean;
}

const MOCK_BALANCES: Balance[] = [
  { type: LeaveType.ANNUAL, total: 24, used: 8, remaining: 16, earned: 24, carryForward: 4, expiring: { days: 2, date: 'Mar 31' } },
  { type: LeaveType.CASUAL, total: 10, used: 3, remaining: 7, earned: 10 },
  { type: LeaveType.SICK, total: 12, used: 11, remaining: 1, earned: 12 },
  { type: 'Comp-Off', total: 2, used: 0, remaining: 2, earned: 2 },
  { type: LeaveType.UNPAID, total: '∞', used: 5, remaining: '∞', earned: 0 },
  { type: 'Short Leave', total: 20, used: 4, remaining: 16, earned: 20, isHours: true },
];

const getIcon = (type: string) => {
  switch (type) {
    case LeaveType.ANNUAL: return <Calendar className="text-[#3E3B6F]" />;
    case LeaveType.SICK: return <HeartPulse className="text-red-500" />;
    case LeaveType.CASUAL: return <Coffee className="text-amber-500" />;
    case 'Comp-Off': return <Zap className="text-indigo-500" />;
    case 'Short Leave': return <Clock className="text-blue-500" />;
    default: return <Info className="text-gray-400" />;
  }
};

const BalanceCard = ({ 
  balance, 

  onOpenWizard 
}: { 
  balance: Balance, 
  onApply: () => void,
  onOpenWizard: (leaveType: string) => void 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isZero = balance.remaining === 0;
  const isLow = typeof balance.remaining === 'number' && balance.remaining < 2 && balance.remaining > 0;
  const unit = balance.isHours ? 'h' : 'd';
  
  const percentage = typeof balance.total === 'number' 
    ? Math.min(100, (balance.used / balance.total) * 100) 
    : 0;

  const handleApplyClick = () => {
    if (!isZero) {
      onOpenWizard(balance.type);
    }
  };

  return (
    <div className={`rounded-xl border transition-all duration-300 overflow-hidden ${
      isZero ? 'bg-gray-50 opacity-75 grayscale' : 
      isLow ? 'bg-amber-50/50 border-amber-200' : 
      'bg-white border-gray-100 shadow-sm hover:shadow-md'
    }`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">{getIcon(balance.type)}</div>
            <h4 className="font-bold text-gray-800">{balance.type}</h4>
          </div>
          {balance.expiring && (
            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider animate-pulse">
              {balance.expiring.days} {unit} expire {balance.expiring.date}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-[#3E3B6F]">{balance.remaining}</span>
              <span className="text-gray-400 font-medium">{unit}</span>
            </div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Available</p>
          </div>
          
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" fill="transparent" stroke="#E2E8F0" strokeWidth="6" />
              {typeof balance.total === 'number' && (
                <circle 
                  cx="32" cy="32" r="28" fill="transparent" 
                  stroke={isLow ? "#F59E0B" : "#3E3B6F"} 
                  strokeWidth="6" 
                  strokeDasharray="175.9" 
                  strokeDashoffset={175.9 - (175.9 * (100 - percentage)) / 100}
                  className="transition-all duration-1000"
                />
              )}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-500">
              {balance.total === '∞' ? '∞' : `${Math.round(100 - percentage)}%`}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-50 text-center mb-6">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Earned</p>
            <p className="font-bold text-gray-700">{balance.earned}{unit}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Used</p>
            <p className="font-bold text-gray-700">{balance.used}{unit}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Total</p>
            <p className="font-bold text-gray-700">{balance.total}{unit}</p>
          </div>
        </div>

        {balance.carryForward && (
          <p className="text-[11px] text-[#3E3B6F] font-medium flex items-center gap-1 mb-4">
            <History size={12} /> Includes {balance.carryForward}{unit} carry forward
          </p>
        )}

        <div className="flex items-center justify-between">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-gray-400 hover:text-[#3E3B6F] flex items-center gap-1"
          >
            View Ledger <ChevronRight size={14} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
          <button 
            disabled={isZero}
            onClick={handleApplyClick}
            className="bg-[#3E3B6F] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#4A4680] transition-colors disabled:bg-gray-200 disabled:text-gray-400"
          >
            Apply
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-gray-50/50 p-6 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
          <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Last 3 Transactions</h5>
          <div className="space-y-3">
            {[
              { date: 'Jan 15, 2024', label: 'Sick Leave Taken', qty: '-1.0', color: 'text-red-500' },
              { date: 'Jan 01, 2024', label: 'Monthly Accrual', qty: '+2.0', color: 'text-emerald-500' },
              { date: 'Dec 15, 2023', label: 'Yearly Carry Over', qty: '+4.0', color: 'text-emerald-500' },
            ].map((t, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-gray-700">{t.label}</p>
                  <p className="text-gray-400">{t.date}</p>
                </div>
                <span className={`font-bold ${t.color}`}>{t.qty} {unit}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const MyBalances = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>('Annual Leave');

  const handleApplyClick = () => {
    setSelectedLeaveType('Annual Leave');
    setIsWizardOpen(true);
  };

  const handleCardApplyClick = (leaveType: string) => {
    setSelectedLeaveType(leaveType);
    setIsWizardOpen(true);
  };

  const handleWizardSubmit = (formData: any) => {
    console.log('Leave application submitted:', formData);
    // Here you would typically send the data to your API
    alert(`Leave application submitted for ${formData.leaveType} from ${formData.startDate} to ${formData.endDate}`);
    setIsWizardOpen(false);
  };

  const handleWizardClose = () => {
    setIsWizardOpen(false);
  };

  return (
    <>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#3E3B6F]">My Leave Balances</h2>
            <p className="text-gray-500">Overview of your current entitlements and history.</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-[#3E3B6F]/20">
              <option>Year 2024</option>
              <option>Year 2023</option>
            </select>
            <button 
              onClick={handleApplyClick}
              className="bg-[#3E3B6F] text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-[#4A4680] shadow-lg shadow-[#3E3B6F]/20 transition-all active:scale-95"
            >
              <Plus size={18} /> Apply Leave
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {MOCK_BALANCES.map((b, i) => (
                <BalanceCard 
                  key={i} 
                  balance={b} 
                  onApply={() => {}} 
                  onOpenWizard={handleCardApplyClick}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#3E3B6F] rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-1">Total Available</p>
                <h3 className="text-5xl font-bold mb-6">52 <span className="text-xl font-normal text-white/50">Days</span></h3>
                
                <div className="space-y-4">
                  <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                    <p className="text-[10px] font-bold uppercase text-white/60 mb-1">Next Approved Leave</p>
                    <p className="font-bold">Feb 10, 2024</p>
                    <p className="text-xs text-white/40">Casual Leave (2 Days)</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                    <p className="text-[10px] font-bold uppercase text-white/60 mb-1">Pending Requests</p>
                    <p className="font-bold">3 Applications</p>
                    <p className="text-xs text-white/40">Awaiting Manager Approval</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Plus size={18} className="text-[#3E3B6F]" /> Quick Links
              </h4>
              <div className="space-y-3">
                {[
                  { label: 'Leave Policy Guide', icon: ExternalLink },
                  { label: 'Public Holiday List', icon: Calendar },
                  { label: 'Balance Adjustments', icon: History }
                ].map((link, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                    <span className="text-sm font-medium text-gray-600">{link.label}</span>
                    <link.icon size={14} className="text-gray-400 group-hover:text-[#3E3B6F]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Leave Application Stats */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-xl font-bold text-[#3E3B6F] mb-4">Quick Apply Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-blue-200">
              <div className="text-blue-600 font-bold text-sm mb-2">✓ Fast Approval</div>
              <p className="text-gray-600 text-sm">Apply 7+ days in advance for 95% faster approval</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-blue-200">
              <div className="text-blue-600 font-bold text-sm mb-2">⏱ Save Time</div>
              <p className="text-gray-600 text-sm">Complete applications take less than 2 minutes</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-blue-200">
              <div className="text-blue-600 font-bold text-sm mb-2">📱 Mobile Friendly</div>
              <p className="text-gray-600 text-sm">Apply on-the-go from your mobile device</p>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Leave Wizard Modal */}
      <ApplyLeaveWizard
        isOpen={isWizardOpen}
        onClose={handleWizardClose}
        onSubmit={handleWizardSubmit}
    
      />
    </>
  );
};

// If you don't have the ApplyLeaveWizard component, here's a basic version you can use:
