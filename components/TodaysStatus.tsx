
import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  Coffee, 
  AlertTriangle, 
  CheckCircle2, 
  Smartphone, 
  History,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

export const TodaysStatus: React.FC = () => {
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState('4h 32m');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {/* MAIN STATUS CARD */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Today's Attendance</h3>
              <p className="text-sm text-gray-500 font-medium">Friday, January 10, 2025</p>
            </div>
            <div className="bg-primary-gradient text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              Morning Shift
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-10">
              {/* Primary Visual Status */}
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-green-100 bg-green-50/30 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-green-200">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-2xl font-bold text-green-700">✓ PRESENT</h4>
                <p className="text-green-600 font-medium text-sm">Working Internally</p>
                <div className="mt-6 space-y-1">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Elapsed Today</p>
                  <p className="text-3xl font-bold text-gray-800 tracking-tighter">{elapsedTime}</p>
                </div>
              </div>

              {/* Punch Data */}
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600 shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Punch In</p>
                      <p className="text-base font-bold text-gray-800">9:02 AM</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Smartphone size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-500">Mobile-Geo ✓</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-green-500" />
                        <span className="text-[11px] text-green-600 font-medium">Office HQ (verified)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 opacity-40">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-400 shrink-0">
                      <ArrowRight size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Punch Out</p>
                      <p className="text-base font-bold text-gray-800">--:--</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-gray-400 uppercase tracking-widest">Progress (Expected 9h)</span>
                    <span className="text-[#3E3B6F]">52%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary-gradient h-full w-[52%] rounded-full shadow-sm"></div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2 font-medium">Remaining: <span className="text-gray-800 font-bold">4h 28m</span></p>
                </div>

                <button className="w-full bg-red-50 text-red-600 border border-red-200 py-3 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all shadow-sm">
                  Punch Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BREAK TRACKER */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Coffee className="text-orange-500" size={20} /> Break Tracker
            </h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Allocation: 60m</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 w-full bg-orange-50/50 rounded-xl p-4 border border-orange-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-orange-800">Lunch Break</span>
                <span className="text-[10px] font-bold bg-orange-200 text-orange-800 px-2 py-0.5 rounded uppercase">12:00 - 13:00</span>
              </div>
              <p className="text-xs text-orange-700">Currently: <span className="font-bold">{isBreakActive ? 'In Progress' : 'Not Taken'}</span></p>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              {!isBreakActive ? (
                <button 
                  onClick={() => setIsBreakActive(true)}
                  className="flex-1 md:flex-none px-8 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-all shadow-md shadow-orange-100"
                >
                  Start Break
                </button>
              ) : (
                <button 
                  onClick={() => setIsBreakActive(false)}
                  className="flex-1 md:flex-none px-8 py-2.5 bg-gray-800 text-white rounded-xl font-bold text-sm hover:bg-gray-900 transition-all"
                >
                  End Break
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SIDEBAR COLUMNS */}
      <div className="space-y-6">
        {/* SHIFT DETAILS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="text-primary" size={18} /> Shift Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Scheduled</span>
              <span className="font-bold text-gray-800">09:00 - 18:00</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Grace In</span>
              <span className="font-bold text-orange-500">15 min (9:15)</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Grace Out</span>
              <span className="font-bold text-orange-500">15 min (17:45)</span>
            </div>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <History className="text-gray-400" size={18} /> Today's Timeline
          </h3>
          <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
            <div className="relative">
              <div className="absolute -left-[22px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm ring-4 ring-green-50"></div>
              <div>
                <p className="text-xs font-bold text-gray-800">9:02 AM - Punch In</p>
                <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin size={10} /> Office HQ
                </p>
              </div>
            </div>

            <div className="relative opacity-60">
              <div className="absolute -left-[22px] top-1 w-4 h-4 rounded-full bg-orange-400 border-2 border-white shadow-sm ring-4 ring-orange-50"></div>
              <div>
                <p className="text-xs font-bold text-gray-800">12:15 PM - Break Start</p>
              </div>
            </div>

            <div className="relative opacity-60">
              <div className="absolute -left-[22px] top-1 w-4 h-4 rounded-full bg-orange-400 border-2 border-white shadow-sm ring-4 ring-orange-50"></div>
              <div>
                <p className="text-xs font-bold text-gray-800">12:58 PM - Break End</p>
                <p className="text-[10px] text-gray-500 mt-1">Duration: 43 min</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-[22px] top-1 w-4 h-4 rounded-full bg-white border-2 border-gray-200 shadow-sm ring-4 ring-gray-50"></div>
              <div>
                <p className="text-xs font-bold text-gray-400">Punch Out (Pending)</p>
              </div>
            </div>
          </div>
        </div>

        {/* ALERTS & ACTIONS */}
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex gap-3">
            <AlertTriangle className="text-orange-500 shrink-0" size={18} />
            <p className="text-xs text-orange-800 font-medium">You arrived <span className="font-bold text-red-600">2 minutes late</span>, but it's within your 15m grace period.</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col gap-2 shadow-sm">
             <button className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors group">
               <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Request Regularization</span>
               <History size={14} className="text-gray-400 group-hover:text-primary" />
             </button>
             <button className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors group">
               <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Report Issue</span>
               <MessageSquare size={14} className="text-gray-400 group-hover:text-red-500" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
