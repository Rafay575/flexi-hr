import React from 'react';
import { 
  Trophy, Flame, TrendingUp, Calendar, CheckCircle2, 
  XCircle, Clock, ChevronRight, Award, Zap, 
  History, Info, Star, Target
} from 'lucide-react';

interface RewardHistory {
  period: string;
  rule: string;
  award: string;
  status: 'Credited' | 'Pending' | 'Rejected';
  creditedOn: string;
  reason: string;
}

const MOCK_HISTORY: RewardHistory[] = [
  { period: 'Jan 2025', rule: 'Perfect Attendance Bonus', award: '+1 day Annual Leave', status: 'Credited', creditedOn: 'Feb 02, 2025', reason: 'Zero absences, zero lates' },
  { period: 'Dec 2024', rule: 'Perfect Attendance Bonus', award: '+1 day Annual Leave', status: 'Credited', creditedOn: 'Jan 02, 2025', reason: 'Zero absences, zero lates' },
  { period: 'Nov 2024', rule: 'Punctuality Award', award: '+0.5 day Casual Leave', status: 'Credited', creditedOn: 'Dec 02, 2024', reason: '< 3 lates this month' },
  { period: 'Q4 2024', rule: 'Quarterly Wellness Reward', award: '+2 days Annual Leave', status: 'Credited', creditedOn: 'Jan 05, 2025', reason: '< 2 sick days in quarter' },
  { period: 'Oct 2024', rule: 'Perfect Attendance Bonus', award: '+1 day Annual Leave', status: 'Credited', creditedOn: 'Nov 02, 2024', reason: 'Zero absences, zero lates' },
  { period: 'Sep 2024', rule: 'Perfect Attendance Bonus', award: '+1 day Annual Leave', status: 'Credited', creditedOn: 'Oct 02, 2024', reason: 'Zero absences, zero lates' },
];

export const MyEarnedRewards = () => {
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 font-['League_Spartan']">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Trophy size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#3E3B6F]">My Earned Rewards</h2>
            <p className="text-gray-500 font-medium">Automatic leave credits earned through your performance.</p>
          </div>
        </div>
        <div className="bg-[#3E3B6F] px-6 py-3 rounded-2xl shadow-xl shadow-[#3E3B6F]/20 flex items-center gap-3 border border-white/10">
          <Flame size={24} className="text-orange-400 fill-orange-400 animate-pulse" />
          <div>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none mb-1">Current Streak</p>
            <p className="text-xl font-bold text-white leading-none">5 Month Streak!</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-indigo-50 text-[#3E3B6F] rounded-2xl"><Award size={24}/></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Earned</p>
            <p className="text-2xl font-bold text-gray-900">8.5 Days</p>
            <p className="text-[10px] text-gray-400 font-medium">All-time lifetime value</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><TrendingUp size={24}/></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">This Year (2025)</p>
            <p className="text-2xl font-bold text-emerald-600">3.0 Days</p>
            <p className="text-[10px] text-emerald-500 font-bold uppercase">On Track ✓</p>
          </div>
        </div>
        <div className="bg-[#3E3B6F] p-6 rounded-[32px] shadow-lg shadow-[#3E3B6F]/20 flex items-center gap-5 text-white relative overflow-hidden">
          <div className="p-4 bg-white/10 text-[#E8D5A3] rounded-2xl relative z-10"><Star size={24}/></div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Achievement Level</p>
            <p className="text-2xl font-bold text-white">Silver Tier</p>
            <p className="text-[10px] text-[#E8D5A3] font-bold uppercase tracking-tighter">1 month to Gold</p>
          </div>
          <Star size={120} className="absolute -right-8 -bottom-8 opacity-5 -rotate-12" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Progress & Recent */}
        <div className="lg:col-span-4 space-y-8">
          {/* Current Progress Tracker */}
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                <Clock size={18} className="text-[#3E3B6F]" /> Feb 2025 Progress
              </h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase">15 Days Left</span>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl text-emerald-700 border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-bold">No unpaid leave (0 days)</span>
                  </div>
                  <span className="text-[9px] font-bold uppercase">Pass</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl text-red-700 border border-red-100">
                  <div className="flex items-center gap-3">
                    <XCircle size={16} />
                    <span className="text-xs font-bold">Late occurrences (2/0)</span>
                  </div>
                  <span className="text-[9px] font-bold uppercase">Fail</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl text-emerald-700 border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-bold">No unapproved absence</span>
                  </div>
                  <span className="text-[9px] font-bold uppercase">Pass</span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 text-center space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Projected Status</p>
                <p className="text-xl font-bold text-red-500 uppercase">Not Eligible</p>
                <p className="text-[10px] text-gray-400 italic">Try again next month to keep streak alive!</p>
              </div>
            </div>
          </div>

          {/* Gamification Streak Visual */}
          <div className="bg-indigo-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl">
             <div className="relative z-10 space-y-6">
                <h4 className="text-lg font-bold">Streak Journey</h4>
                <div className="flex items-center justify-between px-2">
                   {[1,2,3,4,5,6].map(i => (
                     <div key={i} className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          i <= 5 ? 'bg-orange-500 border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-white/10 border-white/10'
                        }`}>
                          {i <= 5 ? <Flame size={18} className="fill-white" /> : <Star size={16} className="text-white/20" />}
                        </div>
                        <span className={`text-[8px] font-bold uppercase ${i <= 5 ? 'text-white' : 'text-white/20'}`}>M{i}</span>
                     </div>
                   ))}
                </div>
                <div className="p-4 bg-white/10 rounded-2xl border border-white/10 flex items-center gap-3">
                   <Zap size={20} className="text-[#E8D5A3]" />
                   <p className="text-[11px] font-medium leading-relaxed">
                     Next milestone: <span className="text-[#E8D5A3] font-bold">6 month streak</span>. Achieve it to upgrade your badge to Gold and unlock premium perks.
                   </p>
                </div>
             </div>
             <Flame size={200} className="absolute -right-12 -bottom-12 opacity-5 -rotate-12" />
          </div>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                <History size={18} className="text-gray-400" /> Reward History
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Period</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rule Applied</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Award</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-8 py-5 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_HISTORY.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-gray-900">{row.period}</p>
                        <p className="text-[10px] text-gray-400 font-medium">Credited {row.creditedOn}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-medium text-gray-700">{row.rule}</p>
                        <p className="text-[10px] text-indigo-500 font-bold uppercase">{row.reason}</p>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="text-sm font-bold text-[#3E3B6F] whitespace-nowrap">{row.award}</span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <CheckCircle2 size={10} /> {row.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <button className="p-2 text-gray-300 hover:text-[#3E3B6F] transition-all">
                           <ChevronRight size={18} />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start gap-4">
             <Info className="text-amber-500 shrink-0 mt-0.5" size={20} />
             <div>
               <h5 className="text-sm font-bold text-amber-900 mb-1">How rewards work?</h5>
               <p className="text-xs text-amber-800/70 leading-relaxed font-medium">
                 Incentive rewards are automatically calculated at the end of each period based on verified attendance data. If eligible, credits are added to your balance immediately after the Payroll Lock event.
               </p>
               <button className="mt-3 text-[10px] font-bold text-[#3E3B6F] hover:underline uppercase tracking-widest flex items-center gap-1">
                 View Eligibility Rules <ChevronRight size={12} />
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
