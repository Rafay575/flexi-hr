import React, { useMemo, useState } from "react";
import {
  Clock,
  MapPin,
  Coffee,
  AlertTriangle,
  CheckCircle2,
  Smartphone,
  History,
  MessageSquare,
  ArrowRight,
  Users,
  ClipboardCheck,
  FileText,
  Briefcase,
  ShieldAlert,
  CalendarDays,
  Timer,
  TrendingUp,
} from "lucide-react";

type RoleView = "employee" | "manager";

type ApprovalItem = {
  id: string;
  type: "Regularization" | "Leave" | "Overtime";
  employee: string;
  reason: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
  time?: string;
};

type TeamMember = {
  id: string;
  name: string;
  dept: string;
  status: "Present" | "Late" | "Absent" | "On Break" | "Remote";
  punchIn?: string;
  location?: string;
};

export const TimeSyncDashboard: React.FC = () => {
  const [roleView, setRoleView] = useState<RoleView>("employee");

  const [isBreakActive, setIsBreakActive] = useState(false);
  const [elapsedTime] = useState("4h 32m");

  const approvals: ApprovalItem[] = useMemo(
    () => [
      {
        id: "APR-1023",
        type: "Regularization",
        employee: "Ahsan Ali",
        reason: "Missed punch out (meeting went long)",
        date: "Fri, Jan 10",
        status: "Pending",
        time: "17:58",
      },
      {
        id: "APR-1024",
        type: "Leave",
        employee: "Hira Noor",
        reason: "Medical appointment",
        date: "Mon, Jan 13",
        status: "Pending",
      },
      {
        id: "APR-1025",
        type: "Overtime",
        employee: "Saad Khan",
        reason: "Deployment support",
        date: "Thu, Jan 09",
        status: "Pending",
        time: "2h 00m",
      },
    ],
    []
  );

  const team: TeamMember[] = useMemo(
    () => [
      { id: "T1", name: "Ahsan Ali", dept: "IT", status: "Late", punchIn: "09:18", location: "Office HQ" },
      { id: "T2", name: "Hira Noor", dept: "HR", status: "Present", punchIn: "08:57", location: "Office HQ" },
      { id: "T3", name: "Saad Khan", dept: "Ops", status: "On Break", punchIn: "09:03", location: "Office HQ" },
      { id: "T4", name: "Umair Shah", dept: "Finance", status: "Remote", punchIn: "09:01", location: "WFH - Verified" },
      { id: "T5", name: "Zainab Fatima", dept: "Admin", status: "Absent" },
    ],
    []
  );

  const pill = (label: string, tone: "green" | "orange" | "gray" | "blue" | "red") => {
    const map = {
      green: "bg-green-100 text-green-700 border-green-200",
      orange: "bg-orange-100 text-orange-700 border-orange-200",
      gray: "bg-gray-100 text-gray-700 border-gray-200",
      blue: "bg-blue-100 text-blue-700 border-blue-200",
      red: "bg-red-100 text-red-700 border-red-200",
    };
    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${map[tone]} uppercase tracking-widest`}>
        {label}
      </span>
    );
  };

  const statusTone = (s: TeamMember["status"]) => {
    if (s === "Present") return "green";
    if (s === "Late") return "orange";
    if (s === "Absent") return "red";
    if (s === "On Break") return "orange";
    return "blue"; // Remote
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">HR Time Sync</h2>
          <p className="text-sm text-gray-500 font-medium">Attendance, breaks, regularization, and approvals</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white border border-gray-200 rounded-xl p-1 shadow-sm flex">
            <button
              onClick={() => setRoleView("employee")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                roleView === "employee" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Employee View
            </button>
            <button
              onClick={() => setRoleView("manager")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                roleView === "manager" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Manager View
            </button>
          </div>

          <button className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm">
            <CalendarDays size={16} className="inline -mt-0.5 mr-2" />
            Change Date
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT (MAIN) */}
        <div className="lg:col-span-2 space-y-6">
          {/* MAIN STATUS CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Today's Attendance</h3>
                <p className="text-sm text-gray-500 font-medium">Friday, January 10, 2025</p>
              </div>
              <div className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
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

                  {/* employee quick actions */}
                  {roleView === "employee" && (
                    <div className="mt-6 w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button className="px-3 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800">
                        Add Missing Punch
                      </button>
                      <button className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-50">
                        Apply Leave
                      </button>
                      <button className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-50">
                        Request OT
                      </button>
                    </div>
                  )}
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
                      <span className="text-gray-900">52%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-gray-900 h-full w-[52%] rounded-full shadow-sm"></div>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-2 font-medium">
                      Remaining: <span className="text-gray-800 font-bold">4h 28m</span>
                    </p>
                  </div>

                  <button className="w-full bg-red-50 text-red-600 border border-red-200 py-3 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all shadow-sm">
                    Punch Out
                  </button>

                  {/* Employee policy hints */}
                  {roleView === "employee" && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Policy Check</p>
                        {pill("Geo OK", "green")}
                      </div>
                      <div className="mt-3 space-y-2 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <Timer size={14} className="text-gray-400" />
                          <span>
                            Minimum daily hours: <span className="font-bold text-gray-900">9h</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldAlert size={14} className="text-gray-400" />
                          <span>
                            Any missed punch will require <span className="font-bold text-gray-900">regularization</span>.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
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
                  <span className="text-[10px] font-bold bg-orange-200 text-orange-800 px-2 py-0.5 rounded uppercase">
                    12:00 - 13:00
                  </span>
                </div>
                <p className="text-xs text-orange-700">
                  Currently: <span className="font-bold">{isBreakActive ? "In Progress" : "Not Taken"}</span>
                </p>
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
                    className="flex-1 md:flex-none px-8 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all"
                  >
                    End Break
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* EMPLOYEE: MONTH SUMMARY + REQUESTS */}
          {roleView === "employee" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="text-gray-900" size={18} /> Monthly Summary
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Present</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">16</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Late</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">3</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leaves</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">1</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Overtime</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">4h</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4 font-medium">
                  Tip: keep late marks under policy to avoid regularization.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="text-gray-900" size={18} /> My Requests
                </h3>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-gray-200 bg-white flex items-start justify-between">
                    <div>
                      <p className="text-xs font-black text-gray-900">Regularization</p>
                      <p className="text-[11px] text-gray-500 mt-1">Jan 08 • Missed punch out</p>
                    </div>
                    {pill("Pending", "orange")}
                  </div>

                  <div className="p-4 rounded-xl border border-gray-200 bg-white flex items-start justify-between">
                    <div>
                      <p className="text-xs font-black text-gray-900">Leave</p>
                      <p className="text-[11px] text-gray-500 mt-1">Jan 13 • Half day</p>
                    </div>
                    {pill("Approved", "green")}
                  </div>

                  <div className="pt-2">
                    <button className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition">
                      Create New Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MANAGER: TEAM + APPROVALS */}
          {roleView === "manager" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* TEAM LIVE STATUS */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Users className="text-gray-900" size={18} /> Team Live Status
                </h3>

                <div className="space-y-3">
                  {team.slice(0, 5).map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white">
                      <div>
                        <p className="text-xs font-black text-gray-900">{m.name}</p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {m.dept}
                          {m.punchIn ? ` • Punch In: ${m.punchIn}` : ""}
                          {m.location ? ` • ${m.location}` : ""}
                        </p>
                      </div>
                      {pill(m.status, statusTone(m.status) as any)}
                    </div>
                  ))}
                </div>

                <button className="mt-4 w-full bg-white border border-gray-200 py-2.5 rounded-xl font-bold text-sm text-gray-800 hover:bg-gray-50">
                  View Full Team
                </button>
              </div>

              {/* PENDING APPROVALS */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ClipboardCheck className="text-gray-900" size={18} /> Pending Approvals
                </h3>

                <div className="space-y-3">
                  {approvals.map((a) => (
                    <div key={a.id} className="p-4 rounded-xl border border-gray-200 bg-white">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black text-gray-900">
                            {a.type} • {a.employee}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-1">
                            {a.date}
                            {a.time ? ` • ${a.time}` : ""} • {a.reason}
                          </p>
                        </div>
                        {pill(a.status, "orange")}
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button className="py-2 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700">
                          Approve
                        </button>
                        <button className="py-2 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold hover:bg-red-600 hover:text-white">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-4 w-full bg-gray-900 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800">
                  Go to Approvals
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          {/* SHIFT DETAILS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="text-gray-900" size={18} /> Shift Details
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
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Break Policy</span>
                <span className="font-bold text-gray-800">60 min/day</span>
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
                <div className="absolute -left-[22px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm ring-4 ring-green-50" />
                <div>
                  <p className="text-xs font-bold text-gray-800">9:02 AM - Punch In</p>
                  <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin size={10} /> Office HQ
                  </p>
                </div>
              </div>

              <div className="relative opacity-60">
                <div className="absolute -left-[22px] top-1 w-4 h-4 rounded-full bg-orange-400 border-2 border-white shadow-sm ring-4 ring-orange-50" />
                <div>
                  <p className="text-xs font-bold text-gray-800">12:15 PM - Break Start</p>
                </div>
              </div>

              <div className="relative opacity-60">
                <div className="absolute -left-[22px] top-1 w-4 h-4 rounded-full bg-orange-400 border-2 border-white shadow-sm ring-4 ring-orange-50" />
                <div>
                  <p className="text-xs font-bold text-gray-800">12:58 PM - Break End</p>
                  <p className="text-[10px] text-gray-500 mt-1">Duration: 43 min</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[22px] top-1 w-4 h-4 rounded-full bg-white border-2 border-gray-200 shadow-sm ring-4 ring-gray-50" />
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
              <p className="text-xs text-orange-800 font-medium">
                You arrived <span className="font-bold text-red-600">2 minutes late</span>, but it’s within your 15m grace period.
              </p>
            </div>

            {/* Manager extra exceptions */}
            {roleView === "manager" && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-xs font-black text-gray-900 flex items-center gap-2">
                  <Briefcase size={14} className="text-gray-900" />
                  Exceptions Today
                </h4>
                <div className="mt-3 space-y-2 text-xs text-gray-600">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span>Missed Punch</span>
                    {pill("2", "orange")}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span>Geo Mismatch</span>
                    {pill("1", "red")}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span>Short Hours</span>
                    {pill("3", "orange")}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col gap-2 shadow-sm">
              <button className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors group">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                  {roleView === "employee" ? "Request Regularization" : "View Regularizations"}
                </span>
                <History size={14} className="text-gray-400 group-hover:text-gray-900" />
              </button>
              <button className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors group">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                  {roleView === "employee" ? "Report Issue" : "Team Issues"}
                </span>
                <MessageSquare size={14} className="text-gray-400 group-hover:text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
