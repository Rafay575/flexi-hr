import React, { useEffect, useMemo, useState } from "react";
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
  ChevronLeft,
  ChevronRight,
  Check,
  X,
} from "lucide-react";

/**
 * TimeSyncDashboard (fully working with dummy data)
 * - Date navigation works (prev/next + date picker)
 * - Role switch works (employee/manager)
 * - Break tracker works (start/end + auto timeline events)
 * - Punch out works (updates status + timeline + progress)
 * - Approvals approve/reject works (updates list + counters)
 * - Consistent colors (brand = #3E3B6F)
 */

type RoleView = "employee" | "manager";
type ApprovalType = "Regularization" | "Leave" | "Overtime";
type ApprovalStatus = "Pending" | "Approved" | "Rejected";

type ApprovalItem = {
  id: string;
  type: ApprovalType;
  employee: string;
  reason: any;
  dateLabel: string;
  status: ApprovalStatus;
  time?: string; // e.g. "17:58" or "2h 00m"
};

type TeamStatus = "Present" | "Late" | "Absent" | "On Break" | "Remote";

type TeamMember = {
  id: string;
  name: string;
  dept: string;
  status: TeamStatus;
  punchIn?: string;
  location?: string;
};

type TimelineEventType = "PUNCH_IN" | "BREAK_START" | "BREAK_END" | "PUNCH_OUT" | "NOTE";

type TimelineEvent = {
  id: string;
  time: string; // "09:02"
  label: string;
  meta?: string;
  type: TimelineEventType;
};

const BRAND = "#3E3B6F";

// -----------------------------
// helpers
// -----------------------------
const pad2 = (n: number) => String(n).padStart(2, "0");

function toISODate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function formatDayLabel(d: Date) {
  // "Fri, Jan 10"
  const wd = d.toLocaleDateString(undefined, { weekday: "short" });
  const mon = d.toLocaleDateString(undefined, { month: "short" });
  const day = d.getDate();
  return `${wd}, ${mon} ${day}`;
}

function formatLongLabel(d: Date) {
  // "Friday, January 10, 2025"
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function hmToMinutes(hm: string) {
  // "09:02" -> 542
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
}

function minutesToHm(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${pad2(h)}:${pad2(m)}`;
}

function minutesToHuman(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h <= 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function seededNumber(seed: string) {
  // simple deterministic hash -> 0..1
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // normalize
  return (h >>> 0) / 4294967295;
}

function pick<T>(arr: T[], seed: string) {
  const n = seededNumber(seed);
  return arr[Math.floor(n * arr.length) % arr.length];
}

// -----------------------------
// UI pills
// -----------------------------
function Pill({
  label,
  tone,
}: {
  label: string;
  tone: "brand" | "green" | "orange" | "gray" | "blue" | "red";
}) {
  const map: Record<typeof tone, string> = {
    brand: `bg-[${BRAND}]/10 text-[${BRAND}] border-[${BRAND}]/20`,
    green: "bg-green-100 text-green-700 border-green-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    red: "bg-red-100 text-red-700 border-red-200",
  };

  // Tailwind doesn't parse dynamic colors well; keep BRAND as class strings with inline style fallback.
  const isBrand = tone === "brand";

  return (
    <span
      className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${
        isBrand ? "" : map[tone]
      }`}
      style={
        isBrand
          ? {
              backgroundColor: `${BRAND}14`,
              color: BRAND,
              borderColor: `${BRAND}22`,
            }
          : undefined
      }
    >
      {label}
    </span>
  );
}

function StatusTone(s: TeamStatus): "green" | "orange" | "red" | "blue" | "gray" {
  if (s === "Present") return "green";
  if (s === "Late") return "orange";
  if (s === "Absent") return "red";
  if (s === "On Break") return "orange";
  if (s === "Remote") return "blue";
  return "gray";
}

function ApprovalTone(s: ApprovalStatus): "orange" | "green" | "red" {
  if (s === "Pending") return "orange";
  if (s === "Approved") return "green";
  return "red";
}

// -----------------------------
// Dummy data generator per date
// -----------------------------
function buildDummyForDate(dateISO: string) {
  const names = ["Ahsan Ali", "Hira Noor", "Saad Khan", "Zainab Fatima", "Umair Shah", "Ahmed Khan"];
  const depts = ["IT", "HR", "Ops", "Admin", "Finance", "Support"];

  const seedBase = dateISO;

  // punch in (09:00 to 09:20)
  const punchInMin = 9 * 60 + Math.floor(seededNumber(seedBase + "punchin") * 21);
  const punchIn = minutesToHm(punchInMin);

  // late flag (after 09:15)
  const isLate = punchInMin > 9 * 60 + 15;

  // approvals count (2..5)
  const approvalsCount = 3 + Math.floor(seededNumber(seedBase + "aprc") * 3);

  const approvalTypes: ApprovalType[] = ["Regularization", "Leave", "Overtime"];
  const approvalReasons = {
    Regularization: ["Missed punch out", "Missed punch in", "Device battery issue", "Meeting went long"],
    Leave: ["Medical appointment", "Family emergency", "Personal work", "Half day request"],
    Overtime: ["Deployment support", "Incident handling", "Server maintenance", "Release window"],
  } as const;

  const approvals: ApprovalItem[] = Array.from({ length: approvalsCount }).map((_, idx) => {
    const employee = pick(names, seedBase + "aprn" + idx);
    const type = pick(approvalTypes, seedBase + "aprt" + idx);
    const reason = pick([...approvalReasons[type]], seedBase + "aprr" + idx);


    const id = `APR-${1000 + Math.floor(seededNumber(seedBase + "apid" + idx) * 900)}`;

    const time =
      type === "Overtime"
        ? `${1 + Math.floor(seededNumber(seedBase + "ot" + idx) * 3)}h ${pad2(
            Math.floor(seededNumber(seedBase + "otm" + idx) * 60)
          )}m`
        : type === "Regularization"
        ? `${pad2(16 + Math.floor(seededNumber(seedBase + "rgH" + idx) * 3))}:${pad2(
            Math.floor(seededNumber(seedBase + "rgM" + idx) * 60)
          )}`
        : undefined;

    return {
      id,
      type,
      employee,
      reason,
      dateLabel: formatDayLabel(new Date(dateISO)),
      status: "Pending",
      time,
    };
  });

  const team: TeamMember[] = Array.from({ length: 6 }).map((_, idx) => {
    const name = names[idx % names.length];
    const dept = depts[idx % depts.length];
    const statusPool: TeamStatus[] = ["Present", "Late", "Absent", "Remote"];
    const baseStatus = pick(statusPool, seedBase + "tmS" + idx);

    const status: TeamStatus =
      name === "Saad Khan" && seededNumber(seedBase + "break") > 0.6 ? "On Break" : baseStatus;

    const punchInT =
      status === "Absent"
        ? undefined
        : minutesToHm(9 * 60 + Math.floor(seededNumber(seedBase + "tmin" + idx) * 25));

    const location =
      status === "Remote" ? "WFH - Verified" : status === "Absent" ? undefined : "Office HQ";

    return {
      id: `T${idx + 1}`,
      name,
      dept,
      status,
      punchIn: punchInT,
      location,
    };
  });

  // monthly stats (simple deterministic)
  const present = 14 + Math.floor(seededNumber(seedBase + "mP") * 6);
  const late = Math.floor(seededNumber(seedBase + "mL") * 5);
  const leaves = Math.floor(seededNumber(seedBase + "mLv") * 3);
  const overtimeHours = 2 + Math.floor(seededNumber(seedBase + "mOT") * 10);

  return {
    punchIn,
    isLate,
    approvals,
    team,
    monthStats: {
      present,
      late,
      leaves,
      overtime: `${overtimeHours}h`,
    },
  };
}

// -----------------------------
// Component
// -----------------------------
export const TimeSyncDashboard: React.FC = () => {
  const [roleView, setRoleView] = useState<RoleView>("employee");

  // date selection
  const [selectedDateISO, setSelectedDateISO] = useState<string>(() => toISODate(new Date()));
  const selectedDate = useMemo(() => new Date(selectedDateISO), [selectedDateISO]);

  // day state (changes with date)
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [breakStartMin, setBreakStartMin] = useState<number | null>(null);
  const [breakTotalMin, setBreakTotalMin] = useState(0);

  const [punchOutMin, setPunchOutMin] = useState<number | null>(null);

  // build deterministic data for the date
  const base = useMemo(() => buildDummyForDate(selectedDateISO), [selectedDateISO]);

  // approvals state is interactive
  const [approvals, setApprovals] = useState<ApprovalItem[]>(base.approvals);

  // when date changes -> reset interactive day state
  useEffect(() => {
    setApprovals(base.approvals);
    setIsBreakActive(false);
    setBreakStartMin(null);
    setBreakTotalMin(0);
    setPunchOutMin(null);
  }, [base.approvals, selectedDateISO]);

  const shift = useMemo(
    () => ({
      start: "09:00",
      end: "18:00",
      expectedMin: 9 * 60,
      graceInMin: 15,
      graceOutMin: 15,
      breakPolicyMin: 60,
    }),
    []
  );

  // “now” simulation for demo: move across the day based on seed (10:30 to 17:30)
  const simulatedNowMin = useMemo(() => {
    const r = seededNumber(selectedDateISO + "now");
    const min = 10 * 60 + 30 + Math.floor(r * (7 * 60)); // 10:30 -> 17:30
    return min;
  }, [selectedDateISO]);

  const punchInMin = useMemo(() => hmToMinutes(base.punchIn), [base.punchIn]);

  const workMinutesSoFar = useMemo(() => {
    const endMin = punchOutMin ?? simulatedNowMin;
    const raw = Math.max(0, endMin - punchInMin);
    const minusBreak = Math.max(0, raw - breakTotalMin - (isBreakActive && breakStartMin != null ? endMin - breakStartMin : 0));
    return minusBreak;
  }, [punchInMin, simulatedNowMin, punchOutMin, breakTotalMin, isBreakActive, breakStartMin]);

  const progressPct = useMemo(() => {
    const pct = (workMinutesSoFar / shift.expectedMin) * 100;
    return clamp(Math.round(pct), 0, 100);
  }, [workMinutesSoFar, shift.expectedMin]);

  const remainingMin = useMemo(() => Math.max(0, shift.expectedMin - workMinutesSoFar), [shift.expectedMin, workMinutesSoFar]);

  const attendanceStatus = useMemo(() => {
    if (punchOutMin != null) return { label: "✓ PUNCHED OUT", sub: "Day completed", tone: "gray" as const };
    if (isBreakActive) return { label: "☕ ON BREAK", sub: "Break in progress", tone: "orange" as const };
    return { label: "✓ PRESENT", sub: "Working internally", tone: "green" as const };
  }, [isBreakActive, punchOutMin]);

  const timeline = useMemo<TimelineEvent[]>(() => {
    const events: TimelineEvent[] = [];

    events.push({
      id: "e1",
      time: base.punchIn,
      label: "Punch In",
      meta: "Office HQ (verified)",
      type: "PUNCH_IN",
    });

    // if break started at some time
    if (breakStartMin != null) {
      events.push({
        id: "e2",
        time: minutesToHm(breakStartMin),
        label: "Break Start",
        type: "BREAK_START",
      });
    }

    // if break ended (total recorded but not active)
    if (breakTotalMin > 0 && !isBreakActive && breakStartMin == null) {
      // if they ended break, we store only total; show a fake event window around 12:15..12:15+total
      const start = 12 * 60 + 15;
      events.push({
        id: "e2x",
        time: minutesToHm(start),
        label: "Break Start",
        type: "BREAK_START",
      });
      events.push({
        id: "e3x",
        time: minutesToHm(start + breakTotalMin),
        label: "Break End",
        meta: `Duration: ${minutesToHuman(breakTotalMin)}`,
        type: "BREAK_END",
      });
    }

    if (!isBreakActive && breakStartMin == null && breakTotalMin === 0) {
      // show a soft “expected” placeholder
      events.push({
        id: "e2p",
        time: "12:15",
        label: "Break (optional)",
        meta: "Not taken yet",
        type: "NOTE",
      });
    }

    if (punchOutMin != null) {
      events.push({
        id: "e4",
        time: minutesToHm(punchOutMin),
        label: "Punch Out",
        type: "PUNCH_OUT",
      });
    } else {
      events.push({
        id: "e4p",
        time: "--:--",
        label: "Punch Out (Pending)",
        type: "NOTE",
      });
    }

    return events;
  }, [base.punchIn, breakStartMin, breakTotalMin, isBreakActive, punchOutMin]);

  // team is base team, but reflect break if employee view toggles break
  const team = useMemo<TeamMember[]>(() => {
    if (roleView !== "manager") return base.team;
    // if manager, show one person "On Break" when breakActive
    const copy = [...base.team];
    if (isBreakActive) {
      copy[2] = { ...copy[2], status: "On Break" };
    }
    return copy;
  }, [base.team, roleView, isBreakActive]);

  const overdueApprovals = useMemo(() => {
    // Dummy "overdue" logic: count pending regularizations as critical
    return approvals.filter((a) => a.status === "Pending" && a.type === "Regularization").length;
  }, [approvals]);

  const approvalsPendingCount = useMemo(() => approvals.filter((a) => a.status === "Pending").length, [approvals]);

  // actions
  const changeDate = (nextISO: string) => setSelectedDateISO(nextISO);

  const prevDay = () => changeDate(toISODate(addDays(selectedDate, -1)));
  const nextDay = () => changeDate(toISODate(addDays(selectedDate, +1)));

  const startBreak = () => {
    if (punchOutMin != null) return;
    if (isBreakActive) return;
    // start at simulatedNow for demo
    setIsBreakActive(true);
    setBreakStartMin(simulatedNowMin);
  };

  const endBreak = () => {
    if (!isBreakActive) return;
    const endMin = simulatedNowMin;
    if (breakStartMin != null) {
      const used = Math.max(0, endMin - breakStartMin);
      setBreakTotalMin((p) => p + used);
    }
    setIsBreakActive(false);
    setBreakStartMin(null);
  };

  const punchOut = () => {
    if (punchOutMin != null) return;
    // if break active, end it automatically
    if (isBreakActive) endBreak();
    setPunchOutMin(simulatedNowMin);
  };

  const approveItem = (id: string) => {
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: "Approved" } : a)));
  };

  const rejectItem = (id: string) => {
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: "Rejected" } : a)));
  };

  const bulkApprovePending = () => {
    setApprovals((prev) => prev.map((a) => (a.status === "Pending" ? { ...a, status: "Approved" } : a)));
  };

  // derived UI bits
  const isWithinGrace = useMemo(() => {
    const lateByMin = Math.max(0, punchInMin - hmToMinutes(shift.start));
    return lateByMin > 0 && lateByMin <= shift.graceInMin;
  }, [punchInMin, shift.start, shift.graceInMin]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">HR Time Sync</h2>
          <p className="text-sm text-gray-500 font-medium">Attendance, breaks, regularization, and approvals</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* role switch */}
          <div className="bg-white border border-gray-200 rounded-xl p-1 shadow-sm flex">
            <button
              onClick={() => setRoleView("employee")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                roleView === "employee" ? "text-white shadow-sm" : "text-gray-700 hover:bg-gray-50"
              }`}
              style={roleView === "employee" ? { backgroundColor: BRAND } : undefined}
            >
              Employee View
            </button>
            <button
              onClick={() => setRoleView("manager")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                roleView === "manager" ? "text-white shadow-sm" : "text-gray-700 hover:bg-gray-50"
              }`}
              style={roleView === "manager" ? { backgroundColor: BRAND } : undefined}
            >
              Manager View
            </button>
          </div>

          {/* date controls */}
          <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm flex items-center gap-2">
            <button
              onClick={prevDay}
              className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              title="Previous day"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex flex-col px-1">
              <div className="flex items-center gap-2">
                <CalendarDays size={16} style={{ color: BRAND }} />
                <span className="text-sm font-black text-gray-900">{formatDayLabel(selectedDate)}</span>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Sim time: {minutesToHm(simulatedNowMin)}
              </span>
            </div>

            <input
              type="date"
              value={selectedDateISO}
              onChange={(e) => changeDate(e.target.value)}
              className="ml-2 text-xs font-bold border border-gray-200 rounded-lg px-2 py-2 text-gray-700"
              title="Pick a date"
            />

            <button
              onClick={nextDay}
              className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              title="Next day"
            >
              <ChevronRight size={16} />
            </button>
          </div>
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
                <p className="text-sm text-gray-500 font-medium">{formatLongLabel(selectedDate)}</p>
              </div>
              <div
                className="text-white px-3 py-1 rounded-full text-xs font-black shadow-sm uppercase tracking-widest"
                style={{ backgroundColor: BRAND }}
              >
                Morning Shift
              </div>
            </div>

            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-10">
                {/* Primary Visual Status */}
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 bg-gray-50/40 rounded-2xl p-8 text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 shadow-lg"
                    style={{
                      backgroundColor:
                        attendanceStatus.tone === "green"
                          ? "#22c55e"
                          : attendanceStatus.tone === "orange"
                          ? "#f97316"
                          : "#111827",
                    }}
                  >
                    <CheckCircle2 size={32} />
                  </div>

                  <h4
                    className="text-2xl font-black tracking-tight"
                    style={{
                      color:
                        attendanceStatus.tone === "green"
                          ? "#15803d"
                          : attendanceStatus.tone === "orange"
                          ? "#9a3412"
                          : "#111827",
                    }}
                  >
                    {attendanceStatus.label}
                  </h4>
                  <p className="text-gray-600 font-medium text-sm">{attendanceStatus.sub}</p>

                  <div className="mt-6 space-y-1">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Worked So Far</p>
                    <p className="text-3xl font-black text-gray-900 tracking-tighter">{minutesToHuman(workMinutesSoFar)}</p>
                  </div>

                  {/* employee quick actions */}
                  {roleView === "employee" && (
                    <div className="mt-6 w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        className="px-3 py-2 rounded-xl text-white text-xs font-black uppercase tracking-widest hover:opacity-95"
                        style={{ backgroundColor: BRAND }}
                      >
                        Add Missing Punch
                      </button>
                      <button className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-800 hover:bg-gray-50">
                        Apply Leave
                      </button>
                      <button className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-800 hover:bg-gray-50">
                        Request OT
                      </button>
                    </div>
                  )}
                </div>

                {/* Punch Data */}
                <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: `${BRAND}12`, color: BRAND }}>
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Punch In</p>
                        <p className="text-base font-black text-gray-900">{base.punchIn}</p>

                        <div className="flex items-center gap-1.5 mt-1">
                          <Smartphone size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500 font-medium">Mobile-Geo ✓</span>
                        </div>

                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin size={12} className="text-green-500" />
                          <span className="text-[11px] text-green-700 font-bold">Office HQ (verified)</span>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          {base.isLate ? <Pill label="Late" tone="orange" /> : <Pill label="On Time" tone="green" />}
                          {isWithinGrace && <Pill label="Within Grace" tone="brand" />}
                        </div>
                      </div>
                    </div>

                    <div className={`flex items-start gap-4 ${punchOutMin == null ? "opacity-50" : ""}`}>
                      <div className="p-2 bg-gray-100 rounded-lg text-gray-500 shrink-0">
                        <ArrowRight size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Punch Out</p>
                        <p className="text-base font-black text-gray-900">{punchOutMin == null ? "--:--" : minutesToHm(punchOutMin)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-xs font-black mb-2">
                      <span className="text-gray-400 uppercase tracking-widest">Progress (Expected 9h)</span>
                      <span className="text-gray-900">{progressPct}%</span>
                    </div>

                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="h-full rounded-full shadow-sm" style={{ width: `${progressPct}%`, backgroundColor: BRAND }} />
                    </div>

                    <p className="text-[11px] text-gray-500 mt-2 font-medium">
                      Remaining: <span className="text-gray-900 font-black">{minutesToHuman(remainingMin)}</span>
                    </p>
                  </div>

                  <button
                    onClick={punchOut}
                    disabled={punchOutMin != null}
                    className={`w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 ${
                      punchOutMin != null
                        ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                        : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white"
                    }`}
                  >
                    <ArrowRight size={16} />
                    {punchOutMin != null ? "Punched Out" : "Punch Out"}
                  </button>

                  {/* Employee policy hints */}
                  {roleView === "employee" && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-black text-gray-700 uppercase tracking-widest">Policy Check</p>
                        <Pill label="Geo OK" tone="green" />
                      </div>
                      <div className="mt-3 space-y-2 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <Timer size={14} className="text-gray-400" />
                          <span>
                            Minimum daily hours: <span className="font-black text-gray-900">9h</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldAlert size={14} className="text-gray-400" />
                          <span>
                            Any missed punch will require <span className="font-black text-gray-900">regularization</span>.
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Coffee size={14} className="text-gray-400" />
                          <span>
                            Break policy: <span className="font-black text-gray-900">{shift.breakPolicyMin} min/day</span>
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
              <h3 className="font-black text-gray-800 flex items-center gap-2">
                <Coffee className="text-orange-500" size={20} /> Break Tracker
              </h3>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Used: {minutesToHuman(breakTotalMin)} / {shift.breakPolicyMin}m
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 w-full bg-orange-50/50 rounded-xl p-4 border border-orange-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-black text-orange-900">Lunch Break</span>
                  <span className="text-[10px] font-black bg-orange-200 text-orange-900 px-2 py-0.5 rounded uppercase tracking-widest">
                    12:00 - 13:00
                  </span>
                </div>

                <p className="text-xs text-orange-800 font-medium">
                  Status:{" "}
                  <span className="font-black">
                    {punchOutMin != null ? "Day ended" : isBreakActive ? "In Progress" : "Not Taken"}
                  </span>
                </p>

                {isBreakActive && breakStartMin != null && (
                  <p className="text-[11px] text-orange-900 mt-2 font-black">
                    Started at {minutesToHm(breakStartMin)} • Live: {minutesToHuman(Math.max(0, simulatedNowMin - breakStartMin))}
                  </p>
                )}
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                {!isBreakActive ? (
                  <button
                    onClick={startBreak}
                    disabled={punchOutMin != null}
                    className={`flex-1 md:flex-none px-8 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-md ${
                      punchOutMin != null
                        ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none"
                        : "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-100"
                    }`}
                  >
                    Start Break
                  </button>
                ) : (
                  <button
                    onClick={endBreak}
                    className="flex-1 md:flex-none px-8 py-2.5 bg-gray-900 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all"
                  >
                    End Break
                  </button>
                )}
              </div>
            </div>

            {breakTotalMin > shift.breakPolicyMin && (
              <div className="mt-4 bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3">
                <AlertTriangle className="text-red-500 shrink-0" size={18} />
                <p className="text-xs text-red-800 font-medium">
                  Break policy exceeded by{" "}
                  <span className="font-black">{minutesToHuman(breakTotalMin - shift.breakPolicyMin)}</span>. This may trigger a policy warning.
                </p>
              </div>
            )}
          </div>

          {/* EMPLOYEE: MONTH SUMMARY + REQUESTS */}
          {roleView === "employee" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp style={{ color: BRAND }} size={18} /> Monthly Summary
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Present</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{base.monthStats.present}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Late</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{base.monthStats.late}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Leaves</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{base.monthStats.leaves}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Overtime</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">{base.monthStats.overtime}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-4 font-medium">
                  Tip: keep late marks under policy to avoid regularization.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">
                  <FileText style={{ color: BRAND }} size={18} /> My Requests
                </h3>

                <div className="space-y-3">
                  {/* show first 2 approvals as "my requests" demo */}
                  {approvals.slice(0, 2).map((a) => (
                    <div key={a.id} className="p-4 rounded-xl border border-gray-200 bg-white flex items-start justify-between">
                      <div>
                        <p className="text-xs font-black text-gray-900">{a.type}</p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {a.dateLabel} • {a.reason}
                        </p>
                      </div>
                      <Pill label={a.status} tone={ApprovalTone(a.status)} />
                    </div>
                  ))}

                  <div className="pt-2">
                    <button
                      className="w-full text-white py-2.5 rounded-xl font-black text-sm uppercase tracking-widest hover:opacity-95 transition"
                      style={{ backgroundColor: BRAND }}
                    >
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
                <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">
                  <Users style={{ color: BRAND }} size={18} /> Team Live Status
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
                      <Pill label={m.status} tone={StatusTone(m.status)} />
                    </div>
                  ))}
                </div>

                <button className="mt-4 w-full bg-white border border-gray-200 py-2.5 rounded-xl font-black text-sm text-gray-800 hover:bg-gray-50 uppercase tracking-widest">
                  View Full Team
                </button>
              </div>

              {/* PENDING APPROVALS */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-gray-800 flex items-center gap-2">
                    <ClipboardCheck style={{ color: BRAND }} size={18} /> Pending Approvals
                  </h3>

                  <button
                    onClick={bulkApprovePending}
                    disabled={approvalsPendingCount === 0}
                    className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition ${
                      approvalsPendingCount === 0
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-green-600 text-white border-green-600 hover:bg-green-700"
                    }`}
                  >
                    <Check size={14} className="inline -mt-0.5 mr-1" />
                    Approve All
                  </button>
                </div>

                <div className="space-y-3">
                  {approvals
                    .filter((a) => a.status === "Pending")
                    .slice(0, 4)
                    .map((a) => (
                      <div key={a.id} className="p-4 rounded-xl border border-gray-200 bg-white">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-black text-gray-900">
                              {a.type} • {a.employee}
                            </p>
                            <p className="text-[11px] text-gray-500 mt-1">
                              {a.dateLabel}
                              {a.time ? ` • ${a.time}` : ""} • {a.reason}
                            </p>
                          </div>
                          <Pill label={a.status} tone="orange" />
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <button
                            onClick={() => approveItem(a.id)}
                            className="py-2 rounded-xl bg-green-600 text-white text-xs font-black uppercase tracking-widest hover:bg-green-700 flex items-center justify-center gap-2"
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button
                            onClick={() => rejectItem(a.id)}
                            className="py-2 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white flex items-center justify-center gap-2"
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      </div>
                    ))}

                  {approvalsPendingCount === 0 && (
                    <div className="p-10 text-center opacity-40">
                      <CheckCircle2 size={44} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-sm font-black uppercase tracking-widest text-gray-500">No pending approvals</p>
                    </div>
                  )}
                </div>

                <button
                  className="mt-4 w-full text-white py-2.5 rounded-xl font-black text-sm uppercase tracking-widest hover:opacity-95"
                  style={{ backgroundColor: BRAND }}
                >
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
            <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">
              <Clock style={{ color: BRAND }} size={18} /> Shift Details
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Scheduled</span>
                <span className="font-black text-gray-900">{shift.start} - {shift.end}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Grace In</span>
                <span className="font-black text-orange-600">{shift.graceInMin} min</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Grace Out</span>
                <span className="font-black text-orange-600">{shift.graceOutMin} min</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Break Policy</span>
                <span className="font-black text-gray-900">{shift.breakPolicyMin} min/day</span>
              </div>
            </div>
          </div>

          {/* TIMELINE */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-black text-gray-800 mb-6 flex items-center gap-2">
              <History className="text-gray-400" size={18} /> Today's Timeline
            </h3>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
              {timeline.map((e) => {
                const dot =
                  e.type === "PUNCH_IN"
                    ? { bg: "#22c55e", ring: "ring-green-50" }
                    : e.type === "BREAK_START" || e.type === "BREAK_END"
                    ? { bg: "#fb923c", ring: "ring-orange-50" }
                    : e.type === "PUNCH_OUT"
                    ? { bg: BRAND, ring: "" }
                    : { bg: "#ffffff", ring: "ring-gray-50" };

                const isPlaceholder = e.time === "--:--";

                return (
                  <div key={e.id} className={`relative ${isPlaceholder ? "opacity-60" : ""}`}>
                    <div
                      className="absolute -left-[22px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ring-4"
                      style={{
                        backgroundColor: dot.bg,
                        borderColor: isPlaceholder ? "#e5e7eb" : "#ffffff",
                      }}
                    />
                    <div>
                      <p className="text-xs font-black text-gray-900">
                        {e.time} {e.time !== "--:--" ? "-" : ""} {e.label}
                      </p>
                      {e.meta && (
                        <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1 font-medium">
                          {e.type === "PUNCH_IN" ? <MapPin size={10} /> : null}
                          {e.meta}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ALERTS & ACTIONS */}
          <div className="space-y-4">
            {(base.isLate || isWithinGrace) && (
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex gap-3">
                <AlertTriangle className="text-orange-500 shrink-0" size={18} />
                <p className="text-xs text-orange-900 font-medium">
                  You arrived{" "}
                  <span className="font-black">
                    {Math.max(0, punchInMin - hmToMinutes(shift.start))} minutes late
                  </span>
                  {isWithinGrace ? ", but it’s within grace." : "."}
                </p>
              </div>
            )}

            {roleView === "manager" && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-xs font-black text-gray-900 flex items-center gap-2">
                  <Briefcase size={14} style={{ color: BRAND }} />
                  Exceptions Today
                </h4>
                <div className="mt-3 space-y-2 text-xs text-gray-700">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="font-medium">Pending Approvals</span>
                    <Pill label={String(approvalsPendingCount)} tone="orange" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="font-medium">Critical (Regularization)</span>
                    <Pill label={String(overdueApprovals)} tone={overdueApprovals > 0 ? "red" : "green"} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="font-medium">Break Used</span>
                    <Pill
                      label={minutesToHuman(breakTotalMin)}
                      tone={breakTotalMin > shift.breakPolicyMin ? "red" : "green"}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col gap-2 shadow-sm">
              <button className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors group">
                <span className="text-xs font-black text-gray-600 uppercase tracking-widest">
                  {roleView === "employee" ? "Request Regularization" : "View Regularizations"}
                </span>
                <History size={14} className="text-gray-400 group-hover:text-gray-900" />
              </button>
              <button className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors group">
                <span className="text-xs font-black text-gray-600 uppercase tracking-widest">
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
