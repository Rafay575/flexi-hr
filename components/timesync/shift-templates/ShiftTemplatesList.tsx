import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Clock,
  Coffee,
  UserCheck,
  ChevronRight,
  Copy,
  History,
  Power,
  Settings2,
  Calendar,
  Moon,
  Sun,
  LayoutGrid,
  Zap,
  ArrowRight,
  Download,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { api } from '@/components/api/client';
import { useNavigate } from 'react-router-dom';

// ------------------------------
// Types & Config (unchanged)
// ------------------------------
type ShiftType = 'FIXED' | 'FLEXI' | 'ROTATING' | 'SPLIT' | 'RAMZAN';
type ShiftStatus = 'ACTIVE' | 'INACTIVE';

interface ShiftTemplate {
  id: string;
  code: string;
  name: string;
  type: ShiftType;
  timing: string;
  breakTime: string;
  grace: { in: number; out: number };
  employeeCount: number;
  status: ShiftStatus;
}

const TYPE_CONFIG: Record<ShiftType, { label: string; color: string; icon: React.ReactNode }> = {
  FIXED: { label: 'Fixed', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <Sun size={12} /> },
  FLEXI: { label: 'Flexi', color: 'bg-green-50 text-green-600 border-green-100', icon: <Zap size={12} /> },
  ROTATING: { label: 'Rotating', color: 'bg-purple-50 text-purple-600 border-purple-100', icon: <LayoutGrid size={12} /> },
  SPLIT: { label: 'Split', color: 'bg-orange-50 text-orange-600 border-orange-100', icon: <Settings2 size={12} /> },
  RAMZAN: { label: 'Ramzan', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: <Moon size={12} /> },
};

// ------------------------------
// Helper functions
// ------------------------------
const formatTime12h = (time24: string): string => {
  if (!time24) return '';
  const [hour, minute] = time24.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
};

const transformApiShift = (apiShift: any): ShiftTemplate => {
  // Map API category to our ShiftType – add more mappings if needed
  const typeMapping: Record<string, ShiftType> = {
    FIXED: 'FIXED',
    FLEXI: 'FLEXI',
    ROTATING: 'ROTATING',
    SPLIT: 'SPLIT',
    RAMZAN: 'RAMZAN',
  };
  const shiftType: ShiftType = typeMapping[apiShift.category] || 'FIXED';

  // Build timing string from shift_start/end_time
  const start = formatTime12h(apiShift.timing?.shift_start_time);
  const end = formatTime12h(apiShift.timing?.shift_end_time);
  const timing = start && end ? `${start} - ${end}` : apiShift.timing?.total_duration_display || '—';

  // Sum break durations from the "breaks" array
  const totalBreakMinutes = apiShift.breaks?.reduce((acc: number, b: any) => acc + (b.duration_minutes || 0), 0) || 0;
  const breakTime = totalBreakMinutes > 0 ? `${totalBreakMinutes} min` : '—';

  // Grace policy
  const graceIn = apiShift.grace_buffer?.grace_in_minutes ?? 0;
  const graceOut = apiShift.grace_buffer?.grace_out_minutes ?? 0;

  // Status: treat "published" or non‑null published_at as ACTIVE, otherwise INACTIVE
  const isActive = apiShift.status === 'published' || !!apiShift.published_at;
  const status: ShiftStatus = isActive ? 'ACTIVE' : 'INACTIVE';

  // Employee count is not provided by this endpoint → default to 0
  const employeeCount = 0;

  return {
    id: `ST-${apiShift.id}`,
    code: apiShift.shift_code || '',
    name: apiShift.display_name || '',
    type: shiftType,
    timing,
    breakTime,
    grace: { in: graceIn, out: graceOut },
    employeeCount,
    status,
  };
};

// ------------------------------
// Main Component
// ------------------------------
export const ShiftTemplatesList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<ShiftType | 'ALL'>('ALL');
  const [shifts, setShifts] = useState<ShiftTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  // Fetch data on mount
 useEffect(() => {
  const fetchShifts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/v1/shift-templates?per_page=15');
      const json = response.data;

      if (json?.success && Array.isArray(json.data)) {
        const transformed = json.data.map(transformApiShift);
        setShifts(transformed);
      } else {
        throw new Error('Invalid API response');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load shifts');
    } finally {
      setLoading(false);
    }
  };

  fetchShifts();
}, []);

  // Filter & search logic (same as before)
  const filteredShifts = useMemo(() => {
    return shifts.filter(shift => {
      const matchesSearch = shift.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shift.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'ALL' || shift.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [shifts, searchQuery, filterType]);

  // ------------------------------
  // Render
  // ------------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="animate-spin text-[#3E3B6F] mx-auto mb-4" size={32} />
          <p className="text-sm font-medium text-gray-500">Loading shift templates…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center bg-red-50 p-6 rounded-2xl border border-red-100">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={32} />
          <h3 className="text-sm font-black uppercase tracking-widest text-red-700 mb-2">Failed to load</h3>
          <p className="text-xs text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-white border border-red-200 rounded-xl text-xs font-bold text-red-700 hover:bg-red-50 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Shift Templates</h2>
          <p className="text-sm text-gray-500 font-medium italic">Configure core timing policies and attendance rules</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3E3B6F]" size={16} />
            <input
              type="text"
              placeholder="Search code or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium w-64 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5 focus:border-[#3E3B6F] transition-all shadow-sm"
            />
          </div>
          <button
          onClick={() => navigate('/timesync/shift-templates/new')}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={18} /> Create Shift
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
            filterType === 'ALL' ? 'bg-[#3E3B6F] text-white border-transparent shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
          }`}
        >
          All Shifts
        </button>
        {(['FIXED', 'FLEXI', 'ROTATING', 'SPLIT', 'RAMZAN'] as ShiftType[]).map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
              filterType === type ? 'bg-[#3E3B6F] text-white border-transparent shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {TYPE_CONFIG[type].icon}
            {TYPE_CONFIG[type].label}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col relative">
        <div className="overflow-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-20 bg-gray-50/90 backdrop-blur-md border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">Code & Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Timing Window</th>
                <th className="px-6 py-4 text-center">Break</th>
                <th className="px-6 py-4">Grace Policy</th>
                <th className="px-6 py-4 text-center">Employees</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredShifts.map((shift) => (
                <tr key={shift.id} className="group hover:bg-gray-50/80 transition-all cursor-default">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-[#3E3B6F]/10">
                        {shift.code}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{shift.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">ID: {shift.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${TYPE_CONFIG[shift.type].color}`}>
                      {TYPE_CONFIG[shift.type].icon}
                      {TYPE_CONFIG[shift.type].label}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                      <Clock size={14} className="text-blue-500" />
                      {shift.timing}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-bold text-gray-800">{shift.breakTime}</span>
                      <Coffee size={12} className="text-orange-400 mt-1" />
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3 text-[10px] font-bold">
                      <div className="bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">IN: {shift.grace.in}m</div>
                      <div className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-100">OUT: {shift.grace.out}m</div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#3E3B6F] bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                      <UserCheck size={14} /> {shift.employeeCount}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${shift.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${shift.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-400'}`}>
                        {shift.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 text-gray-400 hover:text-[#3E3B6F] hover:bg-white rounded-lg transition-all" title="Edit Template">
                        <Settings2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg transition-all" title="Clone Shift">
                        <Copy size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-white rounded-lg transition-all" title="Version History">
                        <History size={16} />
                      </button>
                      <div className="w-px h-4 bg-gray-200 mx-1"></div>
                      <button
                        className={`p-2 rounded-lg transition-all ${
                          shift.status === 'ACTIVE'
                            ? 'text-red-400 hover:bg-red-50 hover:text-red-600'
                            : 'text-green-400 hover:bg-green-50 hover:text-green-600'
                        }`}
                        title={shift.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      >
                        <Power size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredShifts.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center p-20 text-center opacity-30">
              <Clock size={64} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-black uppercase tracking-widest text-gray-500">No Shifts Found</h3>
              <p className="text-sm font-medium mt-2">Adjust your search or filters.</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Policies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Extended Breaks Active</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
              <Download size={14} /> Policy Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#3E3B6F]/5 text-[#3E3B6F] border border-[#3E3B6F]/10 rounded-xl text-xs font-bold hover:bg-[#3E3B6F]/10 transition-all">
              Manage Roster
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};