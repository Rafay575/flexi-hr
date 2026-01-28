import React, { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  List as ListIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  AlertCircle,
  X,
  TrendingUp,
  MapPin,
  ExternalLink,
  ChevronDown,
  CalendarDays,
  FileText,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

type ViewMode = "Timeline" | "Calendar" | "List";
type StatusType =
  | "PRESENT"
  | "LATE"
  | "MISSING"
  | "LEAVE"
  | "HOLIDAY"
  | "WEEKLY_OFF"
  | "SHORT_DAY"
  | "HALF_DAY"
  | "ABSENT";

interface AttendanceDay {
  id: string;
  date: Date;
  status: StatusType;
  inTime: string;
  outTime: string;
  method: string;
  workHours: string;
  breakTime: string;
  notes?: string;
  extra?: string; // e.g. overtime or extra mins
  location?: string;
  policyImpact?: string;
  shift?: string;
  graceInMins?: number;
  requiredHours?: string;
}

// --- helpers
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

const fmtLong = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });

const fmtShort = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

const generateMockData = (): AttendanceDay[] => {
  const data: AttendanceDay[] = [];
  const today = new Date();

  // fixed events for “variety”
  // index = days ago
  const specialMap: Record<number, Partial<AttendanceDay> & { status: StatusType }> = {
    1: { status: "LATE", inTime: "09:25 AM", notes: "Late 25m (grace exceeded 10m)", workHours: "7h 40m", breakTime: "1h 00m" },
    2: { status: "MISSING", outTime: "--", workHours: "--", breakTime: "--", notes: "Missing Out Punch (needs regularization)" },
    3: { status: "ABSENT", inTime: "--", outTime: "--", workHours: "--", breakTime: "--", notes: "Absent (No punch)" },
    5: { status: "LEAVE", inTime: "--", outTime: "--", workHours: "--", breakTime: "--", notes: "Annual Leave (Approved)" },
    7: { status: "HOLIDAY", inTime: "--", outTime: "--", workHours: "--", breakTime: "--", notes: "Public Holiday" },
    8: { status: "SHORT_DAY", outTime: "04:30 PM", workHours: "6h 30m", breakTime: "0h 45m", notes: "Short Day (Early Exit)" },
    10: { status: "HALF_DAY", inTime: "09:05 AM", outTime: "01:10 PM", workHours: "3h 35m", breakTime: "0h 15m", notes: "Half Day (Approved)" },
    13: { status: "ABSENT", inTime: "--", outTime: "--", workHours: "--", breakTime: "--", notes: "Absent (No punch)" },
    16: { status: "HOLIDAY", inTime: "--", outTime: "--", workHours: "--", breakTime: "--", notes: "Company Holiday" },
    20: { status: "LATE", inTime: "09:18 AM", notes: "Late 18m (within grace 15m? net 3m)", workHours: "8h 00m", breakTime: "1h 00m" },
    24: { status: "MISSING", outTime: "--", workHours: "--", breakTime: "--", notes: "Missing Out Punch (field visit)" },
  };

  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);

    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // base default
    let record: AttendanceDay = {
      id: `day-${i}`,
      date: d,
      status: "PRESENT",
      inTime: "09:02 AM",
      outTime: "06:15 PM",
      method: i % 2 === 0 ? "Mobile-Geo" : "Device",
      workHours: "8h 13m",
      breakTime: "1h 00m",
      notes: "On Time",
      extra: i === 0 ? "15m" : undefined,
      location: i % 2 === 0 ? "Office HQ (verified)" : "Office Device",
      shift: "Morning Shift (09:00 - 18:00)",
      graceInMins: 15,
      requiredHours: "9h",
      policyImpact: "No deductions applied.",
    };

    // weekend -> weekly off unless special overrides
    if (isWeekend) {
      record = {
        ...record,
        status: "WEEKLY_OFF",
        inTime: "--",
        outTime: "--",
        workHours: "--",
        breakTime: "--",
        notes: "Weekly Off",
        policyImpact: "Not applicable.",
      };
    }

    // apply special overrides
    if (specialMap[i]) {
      record = {
        ...record,
        ...specialMap[i],
      } as AttendanceDay;
    }

    // add policy impacts by status (more “logical”)
    if (record.status === "LATE") {
      record.policyImpact = "Late mark recorded. If grace exceeded, penalty may apply and regularization might be required.";
    }
    if (record.status === "MISSING") {
      record.policyImpact = "Missing punch. Regularization required to complete attendance for the day.";
    }
    if (record.status === "ABSENT") {
      record.policyImpact = "Absent day. You can apply leave (if eligible) or raise an issue if this is incorrect.";
    }
    if (record.status === "SHORT_DAY") {
      record.policyImpact = "Short hours may trigger short-day/partial deduction depending on policy rules.";
    }
    if (record.status === "HALF_DAY") {
      record.policyImpact = "Half day is recorded. Ensure leave / approval exists to avoid deduction.";
    }
    if (record.status === "LEAVE") {
      record.policyImpact = "Leave recorded. No attendance punches required.";
    }
    if (record.status === "HOLIDAY") {
      record.policyImpact = "Holiday recorded. No attendance punches required.";
    }
    if (record.status === "WEEKLY_OFF") {
      record.policyImpact = "Weekly off. No punches needed.";
    }

    data.push(record);
  }

  return data;
};

const MOCK_DATA = generateMockData();

export const MyAttendanceTimeline: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("Timeline");
  const [selectedDay, setSelectedDay] = useState<AttendanceDay | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getStatusStyles = (status: StatusType) => {
    switch (status) {
      case "PRESENT":
        return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500", label: "PRESENT ✓" };
      case "LATE":
        return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500", label: "LATE ⚠️" };
      case "MISSING":
        return { bg: "bg-red-50", text: "text-red-700", border: "border-red-400 border-dashed", dot: "bg-red-500", label: "MISSING OUT ❌" };
      case "ABSENT":
        return { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-300 border-dashed", dot: "bg-rose-500", label: "ABSENT ⛔" };
      case "LEAVE":
        return { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500", label: "LEAVE" };
      case "HOLIDAY":
        return { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500", label: "HOLIDAY" };
      case "SHORT_DAY":
        return { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-500", label: "SHORT DAY" };
      case "HALF_DAY":
        return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500", label: "HALF DAY" };
      case "WEEKLY_OFF":
        return { bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-200", dot: "bg-gray-400", label: "WEEKLY OFF" };
      default:
        return { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-500", label: status };
    }
  };

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<null | { date: Date; record?: AttendanceDay }> = [];
    for (let i = 0; i < firstDay; i++) days.push(null);

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const record = MOCK_DATA.find((d) => sameDay(d.date, date));
      days.push({ date, record });
    }
    return days;
  }, [currentMonth]);

  const bottomPrimaryActionLabel = (day: AttendanceDay) => {
    if (day.status === "ABSENT") return "Apply Leave";
    if (day.status === "LATE" || day.status === "MISSING") return "Request Regularization";
    return "Trace Calculation";
  };

  const bottomPrimaryTone = (day: AttendanceDay) => {
    if (day.status === "ABSENT") return "bg-[#3E3B6F]";
    if (day.status === "LATE" || day.status === "MISSING") return "bg-red-600";
    return "bg-[#3E3B6F]";
  };

  const bottomPrimaryHint = (day: AttendanceDay) => {
    if (day.status === "ABSENT") return "Use this if you were absent and want to convert it into a leave day.";
    if (day.status === "LATE") return "Late beyond grace usually needs regularization/approval.";
    if (day.status === "MISSING") return "Missing punch must be regularized to complete attendance.";
    return "See how hours and policy were calculated for this day.";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">My Attendance</h2>
          <p className="text-sm text-gray-500 font-medium">Detailed log of your working hours and status</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-1 flex shadow-sm">
            {[
              { id: "Timeline", icon: <Clock size={14} /> },
              { id: "Calendar", icon: <CalendarIcon size={14} /> },
              { id: "List", icon: <ListIcon size={14} /> },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as ViewMode)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  viewMode === mode.id ? "bg-[#3E3B6F] text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {mode.icon} {mode.id}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <CalendarDays size={14} /> Jan 01 - Jan 31, 2025 <ChevronDown size={14} />
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-[#3E3B6F] text-white rounded-xl text-xs font-bold shadow-lg hover:opacity-90 transition-opacity">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* VIEW RENDERER */}
      <div className="min-h-[400px]">
        {viewMode === "Timeline" && (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">This Week</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="space-y-4">
              {MOCK_DATA.slice(0, 7).map((day) => {
                const styles = getStatusStyles(day.status);
                const needsAction = day.status === "LATE" || day.status === "MISSING" || day.status === "ABSENT";

                return (
                  <div
                    key={day.id}
                    onClick={() => setSelectedDay(day)}
                    className={`bg-white rounded-2xl border-2 ${styles.border} overflow-hidden hover:shadow-xl transition-all cursor-pointer group`}
                  >
                    <div className={`px-6 py-3 border-b border-gray-50 flex justify-between items-center ${styles.bg}`}>
                      <span className="text-sm font-bold text-gray-800">{fmtLong(day.date)}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${styles.text}`}>{styles.label}</span>
                    </div>

                    <div className="p-6 flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Punch Times</p>
                          <p className="text-sm font-bold text-gray-800">
                            {day.inTime} — {day.outTime}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-1 font-medium flex items-center gap-1">
                            <MapPin size={10} /> {day.location || day.method}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Hours / Break</p>
                          <p className="text-sm font-bold text-gray-800">
                            {day.workHours} <span className="text-gray-300 mx-1">|</span> {day.breakTime}
                          </p>
                          {day.extra && (
                            <p className="text-[10px] mt-1 font-bold text-[#3E3B6F]">Extra: {day.extra}</p>
                          )}
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Status Remarks</p>
                          <p className={`text-sm font-bold ${needsAction ? "text-red-600" : "text-gray-600"}`}>{day.notes}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {day.status === "ABSENT" ? (
                          <button className="px-4 py-2 bg-[#3E3B6F] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all">
                            Apply Leave
                          </button>
                        ) : day.status === "MISSING" || day.status === "LATE" ? (
                          <button className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all">
                            Regularize Now ⚠️
                          </button>
                        ) : (
                          <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all">
                            Trace Calculation
                          </button>
                        )}
                        <div className="p-2 text-gray-300 group-hover:text-[#3E3B6F] transition-colors">
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* quick legend */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-wrap gap-2 items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Legend</span>
              {(["PRESENT", "LATE", "MISSING", "ABSENT", "LEAVE", "HOLIDAY", "WEEKLY_OFF"] as StatusType[]).map((s) => {
                const st = getStatusStyles(s);
                return (
                  <span key={s} className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${st.bg} ${st.text} ${st.border}`}>
                    {s}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === "Calendar" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">{currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                  className="p-1.5 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                  className="p-1.5 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="py-2 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map((cell, i) => (
                <div
                  key={i}
                  onClick={() => cell?.record && setSelectedDay(cell.record)}
                  className={`min-h-[100px] p-2 border-r border-b border-gray-50 transition-colors ${
                    cell ? "cursor-pointer hover:bg-gray-50" : "bg-gray-50/20"
                  }`}
                >
                  {cell && (
                    <>
                      <span
                        className={`text-xs font-bold ${
                          sameDay(cell.date, new Date()) ? "bg-[#3E3B6F] text-white w-6 h-6 flex items-center justify-center rounded-full" : "text-gray-400"
                        }`}
                      >
                        {cell.date.getDate()}
                      </span>

                      {cell.record && (
                        <div className={`mt-2 p-1.5 rounded-lg border ${getStatusStyles(cell.record.status).border} ${getStatusStyles(cell.record.status).bg} space-y-1`}>
                          <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${getStatusStyles(cell.record.status).dot}`} />
                            <span className={`text-[8px] font-bold truncate ${getStatusStyles(cell.record.status).text}`}>{cell.record.status}</span>
                          </div>
                          <p className="text-[9px] text-gray-600 font-medium">{cell.record.inTime}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === "List" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">In Time</th>
                  <th className="px-6 py-4">Out Time</th>
                  <th className="px-6 py-4">Work Hours</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MOCK_DATA.map((day) => (
                  <tr key={day.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => setSelectedDay(day)}>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">{fmtShort(day.date)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusStyles(day.status).bg} ${getStatusStyles(day.status).text} border ${getStatusStyles(day.status).border}`}>
                        {day.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 tabular-nums">{day.inTime}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 tabular-nums">{day.outTime}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 tabular-nums">{day.workHours}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-300 group-hover:text-[#3E3B6F] transition-colors" title="Open details">
                        <ExternalLink size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL DRAWER */}
      {selectedDay && (
        <div className="fixed inset-0 z-[60] !m-0 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedDay(null)} />
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Calculation Trace</h3>
                <p className="text-sm text-gray-500">{fmtLong(selectedDay.date)}</p>
              </div>
              <button onClick={() => setSelectedDay(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* STATUS CARD */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${getStatusStyles(selectedDay.status).bg} ${getStatusStyles(selectedDay.status).border}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusStyles(selectedDay.status).dot}`} />
                  <span className={`font-bold ${getStatusStyles(selectedDay.status).text}`}>Status: {getStatusStyles(selectedDay.status).label}</span>
                </div>

                {(selectedDay.status === "LATE" || selectedDay.status === "MISSING" || selectedDay.status === "ABSENT") && (
                  <span className="text-[10px] font-black text-red-600 animate-pulse">ACTION REQUIRED</span>
                )}
              </div>

              {/* POLICY BOX */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <ShieldAlert size={18} className="text-gray-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Policy Impact</p>
                    <p className="text-sm font-medium text-gray-700 leading-relaxed">{selectedDay.policyImpact}</p>
                    <div className="pt-3 grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Required</p>
                        <p className="text-sm font-black text-gray-900 mt-1">{selectedDay.requiredHours || "9h"}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grace In</p>
                        <p className="text-sm font-black text-gray-900 mt-1">{selectedDay.graceInMins ?? 15}m</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shift</p>
                        <p className="text-[11px] font-bold text-gray-900 mt-1 leading-tight">Morning</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CALC TRACE */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp size={14} className="text-[#3E3B6F]" /> How it was calculated
                </h4>

                <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
                  <div className="p-5 flex justify-between items-center bg-white">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Applied Shift</p>
                      <p className="text-sm font-bold text-gray-800">{selectedDay.shift || "Morning Shift (9:00 AM - 6:00 PM)"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Location / Method</p>
                      <p className="text-sm font-bold text-gray-800">{selectedDay.location || selectedDay.method}</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-800">Punch In: {selectedDay.inTime}</p>
                      <div className="border-l-2 border-gray-200 ml-2 pl-3 space-y-1 py-1">
                        {selectedDay.status === "LATE" ? (
                          <>
                            <p className="text-[10px] text-red-500 font-bold">→ Late recorded</p>
                            <p className="text-[10px] text-orange-500 font-bold">→ Grace: {selectedDay.graceInMins ?? 15} min</p>
                            <p className="text-[10px] text-red-700 font-black">→ Action: Regularize if grace exceeded</p>
                          </>
                        ) : selectedDay.status === "ABSENT" ? (
                          <p className="text-[10px] text-rose-700 font-black">→ No punch found</p>
                        ) : selectedDay.status === "LEAVE" || selectedDay.status === "HOLIDAY" || selectedDay.status === "WEEKLY_OFF" ? (
                          <p className="text-[10px] text-gray-500 font-bold">→ Punch not required for this status</p>
                        ) : (
                          <p className="text-[10px] text-green-600 font-bold">→ On Time ✓</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-800">Punch Out: {selectedDay.outTime}</p>
                      <div className="border-l-2 border-gray-200 ml-2 pl-3 space-y-1 py-1">
                        {selectedDay.status === "MISSING" ? (
                          <p className="text-[10px] text-red-700 font-black">→ Missing punch out (Regularization required)</p>
                        ) : selectedDay.status === "SHORT_DAY" ? (
                          <p className="text-[10px] text-yellow-700 font-black">→ Early exit recorded (Short day)</p>
                        ) : selectedDay.status === "PRESENT" && selectedDay.extra ? (
                          <p className="text-[10px] text-blue-600 font-bold">→ Extra time recorded: {selectedDay.extra}</p>
                        ) : selectedDay.status === "LEAVE" || selectedDay.status === "HOLIDAY" || selectedDay.status === "WEEKLY_OFF" || selectedDay.status === "ABSENT" ? (
                          <p className="text-[10px] text-gray-500 font-bold">→ Not applicable</p>
                        ) : (
                          <p className="text-[10px] text-gray-500 font-medium">→ Standard exit</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* METRICS */}
                  <div className="p-5 bg-[#3E3B6F]/5">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Work Metrics</p>
                        <div className="space-y-1 text-xs font-medium text-gray-600">
                          <div className="flex justify-between">
                            <span>Work Hours:</span> <span className="text-gray-900 font-bold">{selectedDay.workHours}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Break:</span> <span className="text-gray-900 font-bold">{selectedDay.breakTime}</span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-gray-200 text-[#3E3B6F] font-bold">
                            <span>Net:</span> <span className="text-sm font-black">{selectedDay.workHours}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-l border-gray-200 pl-6 space-y-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">System Notes</p>
                        <div className="flex items-start gap-2">
                          <FileText size={14} className="text-gray-400 mt-0.5" />
                          <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                            {selectedDay.notes || "—"}
                          </p>
                        </div>
                        {selectedDay.status === "ABSENT" && (
                          <p className="text-[11px] text-rose-700 font-bold leading-relaxed">
                            Tip: If you were on approved leave, apply leave so this day won’t count as absent.
                          </p>
                        )}
                        {selectedDay.status === "MISSING" && (
                          <p className="text-[11px] text-red-700 font-bold leading-relaxed">
                            Tip: Add missing punch details in regularization (time + reason).
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* helpful hint */}
                <div className="p-4 rounded-2xl border border-gray-200 bg-white flex items-start gap-3">
                  <AlertCircle size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest">What should I do?</p>
                    <p className="text-sm font-medium text-gray-700 mt-1 leading-relaxed">{bottomPrimaryHint(selectedDay)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER ACTIONS (LOGICAL) */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
              <button
                className={`flex-1 px-6 py-3 ${bottomPrimaryTone(selectedDay)} text-white rounded-2xl font-bold text-sm shadow-lg hover:opacity-90 transition-opacity`}
                onClick={() => console.log(bottomPrimaryActionLabel(selectedDay), selectedDay.id)}
              >
                {bottomPrimaryActionLabel(selectedDay)}
              </button>

              <button
                className="flex-1 px-6 py-3 bg-white border border-gray-200 text-red-600 rounded-2xl font-bold text-sm shadow-sm hover:bg-red-50 transition-colors"
                onClick={() => console.log("Report Issue", selectedDay.id)}
              >
                Report Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
