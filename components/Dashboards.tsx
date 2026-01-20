import React from "react";
import {
  TrendingUp,
  HandCoins,
  AlertCircle,
  Calendar,
  Download,
  Users,
  ArrowUpRight,
  Play,
  BarChart2,
  PieChart,
  Activity,
  FileText,
  History,
  ExternalLink,
  Shield,
  Check,
  X,
  Eye,
  Search,
  Percent,
  Bot,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import StatCard from "./StatCard";
import { EmployeePayroll, PayrollSummary, PayrollStatus } from "../types";
import StatusBadge from "./StatusBadge";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
  }).format(amount);
};
// In your Dashboards.tsx or wherever you're using StatCard

// You need to create metric objects that match the StatMetric interface
const metrics = [
  {
    id: "total",
    label: "Total Employees",
    value: "485",
    color: "blue", // or whatever color key you have in getIconBg
    trend: "+12 joined this month",
    trendUp: true,
  },
  {
    id: "gross",
    label: "Gross Payroll",
    value: formatCurrency(45200000),
    color: "success",
    trend: "+3.1% vs Dec",
    trendUp: true,
  },
  {
    id: "net",
    label: "Net Disbursement",
    value: formatCurrency(38500000),
    color: "blue",
    trend: "+2.8% vs Dec",
    trendUp: true,
  },
  {
    id: "deductions",
    label: "Total Deductions",
    value: formatCurrency(6700000),
    color: "error",
    trend: "+0.5% vs Dec",
    trendUp: false, // Since it's an increase in deductions, trendUp should be false
  },
] as const;

export const PayrollOfficerDashboard: React.FC<{
  summary: PayrollSummary | null;
}> = ({ summary }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-4">
            <div className="bg-primary text-white p-3 rounded-lg">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Current Period: Jan 2025
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <span className="font-medium text-primary uppercase text-[10px] tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                  Active Cycle
                </span>
                Cutoff: Jan 25, 2025 • Pay Date: Jan 31, 2025
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block mr-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                Days to Cutoff
              </p>
              <p className="text-xl font-black text-primary">04 Days</p>
            </div>
            <button className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
              <Play size={16} fill="currentColor" /> Start Payroll Run
            </button>
            <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-400">
              <Calendar size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <StatCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-6 flex items-center justify-between">
              Pending Actions
              <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-black">
                20 TOTAL
              </span>
            </h4>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                  Critical Exceptions (12)
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertCircle size={16} className="text-red-500" />
                      <span className="text-sm font-semibold text-gray-700">
                        Missing Bank Accounts
                      </span>
                    </div>
                    <span className="text-xs font-bold text-red-600">08</span>
                  </div>
                  <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertCircle size={16} className="text-orange-500" />
                      <span className="text-sm font-semibold text-gray-700">
                        Tax Slab Errors
                      </span>
                    </div>
                    <span className="text-xs font-bold text-orange-600">
                      04
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                  Workflow Approvals (08)
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Activity size={16} className="text-blue-500" />
                      <span className="text-sm font-semibold text-gray-700">
                        Loan Applications
                      </span>
                    </div>
                    <span className="text-xs font-bold text-blue-600">05</span>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ArrowUpRight size={16} className="text-purple-500" />
                      <span className="text-sm font-semibold text-gray-700">
                        Final Settlements
                      </span>
                    </div>
                    <span className="text-xs font-bold text-purple-600">
                      03
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-3 text-sm font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
              View Action Center
            </button>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b flex items-center justify-between">
              <h4 className="font-bold text-gray-800">Recent Payroll Runs</h4>
              <button className="text-primary text-sm font-bold hover:underline">
                Full History
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">
                    <th className="px-6 py-4">Run ID</th>
                    <th className="px-6 py-4">Period</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Employees</th>
                    <th className="px-6 py-4 text-right">Gross Total</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {[
                    {
                      id: "RUN-492",
                      period: "Dec 2024",
                      status: PayrollStatus.Published,
                      emps: 473,
                      gross: 43800000,
                    },
                    {
                      id: "RUN-491",
                      period: "Nov 2024",
                      status: PayrollStatus.Published,
                      emps: 468,
                      gross: 42500000,
                    },
                    {
                      id: "RUN-490",
                      period: "Oct 2024",
                      status: PayrollStatus.Published,
                      emps: 465,
                      gross: 42200000,
                    },
                  ].map((run) => (
                    <tr
                      key={run.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-primary">
                        {run.id}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{run.period}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={run.status} />
                      </td>
                      <td className="px-6 py-4 text-right font-medium">
                        {run.emps}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold">
                        {formatCurrency(run.gross)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1 hover:bg-gray-100 rounded text-gray-400">
                          <Download size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ManagerTeamDashboard: React.FC<{
  employees: EmployeePayroll[];
}> = ({ employees }) => {
  const teamEmployees = employees.slice(0, 12); // Mock 12 direct reports
  const teamGross = teamEmployees.reduce(
    (acc, curr) => acc + curr.basicSalary + curr.allowances,
    0,
  );
  const avgSalary = teamGross / teamEmployees.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            Team Payroll Overview
          </h3>
          <p className="text-sm text-gray-500">
            Managing{" "}
            <span className="font-bold text-primary">12 Direct Reports</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-all">
            <BarChart2 size={16} className="text-primary" /> Cost Reports
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Users size={20} />
              </div>
              <span className="text-[10px] font-black text-green-600 uppercase">
                11 Active
              </span>
            </div>
            <p className="text-xs font-black text-gray-400 uppercase mb-1">
              Total Team
            </p>
            <h4 className="text-2xl font-black text-gray-800">12</h4>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <TrendingUp size={20} />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase">
                Monthly
              </span>
            </div>
            <p className="text-xs font-black text-gray-400 uppercase mb-1">
              Team Gross
            </p>
            <h4 className="text-2xl font-black text-gray-800">
              {formatCurrency(teamGross)}
            </h4>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <HandCoins size={20} />
              </div>
              <span className="text-[10px] font-black text-blue-600 uppercase">
                Avg {formatCurrency(avgSalary / 1000)}K
              </span>
            </div>
            <p className="text-xs font-black text-gray-400 uppercase mb-1">
              Avg Salary
            </p>
            <h4 className="text-2xl font-black text-gray-800">
              {formatCurrency(avgSalary)}
            </h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase mb-3">
              Team Approvals
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500">Loans</span>
                <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  02
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500">Leaves</span>
                <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  03
                </span>
              </div>
            </div>
          </div>
          <button className="mt-4 text-[10px] font-black text-primary uppercase hover:underline">
            Go to Inbox
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h4 className="font-bold text-gray-800">Team Members Payroll</h4>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search team..."
                  className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary w-40"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4 text-right">Gross Pay</th>
                    <th className="px-6 py-4">Last Paid</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {teamEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold text-xs">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">
                              {emp.name}
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">
                              {emp.designation}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-gray-700">
                        {formatCurrency(emp.basicSalary + emp.allowances)}
                      </td>
                      <td className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">
                        31 Dec 24
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={emp.status} />
                      </td>
                      <td className="px-6 py-4 text-right space-x-1">
                        <button
                          title="View Details"
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md transition-all"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          title="Payroll History"
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md transition-all"
                        >
                          <History size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h4 className="font-black text-[10px] text-gray-400 uppercase tracking-widest mb-6 flex items-center justify-between">
              Approval Inbox
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </h4>
            <div className="space-y-4">
              {[
                {
                  name: "Arsalan Khan",
                  type: "Loan Req",
                  amount: 50000,
                  icon: HandCoins,
                  color: "text-blue-600",
                },
                {
                  name: "Saira Ahmed",
                  type: "Salary Adj",
                  amount: 15000,
                  icon: Percent,
                  color: "text-purple-600",
                },
                {
                  name: "Umar Farooq",
                  type: "Loan Req",
                  amount: 30000,
                  icon: HandCoins,
                  color: "text-blue-600",
                },
              ].map((req, i) => (
                <div
                  key={i}
                  className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gray-50 ${req.color}`}>
                        <req.icon size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-800">
                          {req.name}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">
                          {req.type}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs font-black text-gray-900">
                      {formatCurrency(req.amount)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-1.5 bg-green-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-600 flex items-center justify-center gap-1">
                      <Check size={12} strokeWidth={3} /> Approve
                    </button>
                    <button className="py-1.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-100 flex items-center justify-center gap-1">
                      <X size={12} strokeWidth={3} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h5 className="font-black text-[10px] text-gray-400 uppercase tracking-widest mb-6">
              Team Cost Analysis
            </h5>
            <div className="space-y-6">
              <div className="h-24 flex items-end justify-between gap-1 px-2">
                {[60, 45, 80, 55, 90, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary/20 rounded-t-sm group relative"
                  >
                    <div
                      className="absolute inset-x-0 bottom-0 bg-primary rounded-t-sm transition-all"
                      style={{ height: `${h}%` }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-gray-400">
                <span>Budget</span>
                <span className="text-primary">{formatCurrency(3000000)}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-gray-400">
                <span>Actual</span>
                <span className="text-green-600">
                  {formatCurrency(teamGross)}
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: "80%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EmployeeESSDashboard: React.FC<{
  employee: EmployeePayroll | null;
}> = ({ employee }) => {
  const personalGross = 125000;
  const personalDeductions = 18750;
  const personalNet = personalGross - personalDeductions;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            My Payroll Dashboard
          </h3>
          <p className="text-sm text-gray-500">
            Welcome back,{" "}
            <span className="font-bold text-primary">
              {employee?.name || "Jane Doe"}
            </span>{" "}
            (EMP-1001)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50">
            <Shield size={16} className="text-primary" /> Tax Certificates
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90">
            <FileText size={16} /> Jan 2025 Draft
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-primary to-primary/90 rounded-2xl shadow-xl overflow-hidden relative">
            <div className="p-8 relative z-10 text-white">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-accent text-[10px] font-black uppercase tracking-[2px] mb-1">
                    Latest Confirmed Payslip
                  </p>
                  <h4 className="text-xl font-bold">December 2024</h4>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/5">
                    <Download size={18} />
                  </button>
                  <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/5">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
                <div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Gross Pay
                  </p>
                  <p className="text-lg font-bold">
                    {formatCurrency(personalGross)}
                  </p>
                </div>
                <div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Deductions
                  </p>
                  <p className="text-lg font-bold text-red-300">
                    {formatCurrency(personalDeductions)}
                  </p>
                </div>
                <div>
                  <p className="text-accent text-[10px] font-bold uppercase tracking-widest mb-1">
                    Net Pay
                  </p>
                  <p className="text-2xl font-black text-accent">
                    {formatCurrency(personalNet)}
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          </div>

          {/* AI Explainer Widget */}
          <div className="bg-white border-2 border-primary/10 rounded-2xl p-6 relative overflow-hidden group shadow-sm">
            <div className="relative z-10 flex items-start gap-4">
              <div className="p-3 bg-primary text-white rounded-xl shadow-lg animate-pulse shrink-0">
                <Bot size={20} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h5 className="font-black text-sm uppercase text-primary tracking-tight">
                    Smart Payslip Insights
                  </h5>
                  <Sparkles size={14} className="text-accent" />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Your net pay increased by{" "}
                  <span className="font-black text-payroll-earning">
                    PKR 6,000
                  </span>{" "}
                  this month. This is primarily due to{" "}
                  <span className="underline decoration-accent underline-offset-2">
                    22 hours of overtime
                  </span>{" "}
                  recorded.
                </p>
                <button className="text-[10px] font-black text-primary uppercase flex items-center gap-1 hover:underline">
                  See Detailed Explanation <ChevronRight size={12} />
                </button>
              </div>
            </div>
            <div className="absolute right-[-10px] top-[-10px] text-primary/[0.03] rotate-12 group-hover:scale-110 transition-transform">
              <PieChart size={120} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-2">
                YTD Gross
              </p>
              <h5 className="text-lg font-bold text-gray-800 tracking-tight">
                {formatCurrency(1500000)}
              </h5>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-2">
                Tax Paid
              </p>
              <h5 className="text-lg font-bold text-purple-600 tracking-tight">
                {formatCurrency(187500)}
              </h5>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-2">
                Active Loan
              </p>
              <h5 className="text-lg font-bold text-orange-600 tracking-tight">
                {formatCurrency(50000)}
              </h5>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-2">
                PF Balance
              </p>
              <h5 className="text-lg font-bold text-blue-600 tracking-tight">
                {formatCurrency(225000)}
              </h5>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h5 className="font-bold text-gray-800 flex items-center gap-2">
                <BarChart2 size={18} className="text-primary" /> 6-Month Salary
                Trend
              </h5>
              <div className="flex gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary/20"></span>{" "}
                  Gross
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary"></span> Net
                </span>
              </div>
            </div>
            <div className="h-48 flex items-end justify-between gap-4">
              {[80, 82, 85, 90, 95, 100].map((val, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <div
                    className="w-full bg-primary/10 rounded-t-lg relative flex flex-col justify-end overflow-hidden"
                    style={{ height: `${val}%` }}
                  >
                    <div
                      className="w-full bg-primary rounded-t-lg transition-all"
                      style={{ height: "75%" }}
                    ></div>
                    <div className="absolute inset-x-0 top-0 h-4 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">
                    {["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h5 className="font-bold text-gray-800 mb-4 uppercase text-xs tracking-widest">
              Quick Operations
            </h5>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-primary hover:text-white transition-all group">
                <History
                  size={20}
                  className="text-primary group-hover:text-white"
                />
                <span className="text-[10px] font-bold uppercase">History</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-primary hover:text-white transition-all group">
                <HandCoins
                  size={20}
                  className="text-primary group-hover:text-white"
                />
                <span className="text-[10px] font-bold uppercase">
                  Loan Req
                </span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-primary hover:text-white transition-all group">
                <Shield
                  size={20}
                  className="text-primary group-hover:text-white"
                />
                <span className="text-[10px] font-bold uppercase">EOBI/PF</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-primary hover:text-white transition-all group">
                <FileText
                  size={20}
                  className="text-primary group-hover:text-white"
                />
                <span className="text-[10px] font-bold uppercase">Policy</span>
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between">
              <h5 className="font-bold text-gray-800 text-xs uppercase tracking-widest">
                Payslip Archive
              </h5>
              <button className="text-[10px] font-bold text-primary hover:underline">
                See All
              </button>
            </div>
            <div className="divide-y">
              {["November", "October", "September"].map((month, i) => (
                <div
                  key={month}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <FileText size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-700">
                        {month} 2024
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase font-black">
                        Disbursed on 30th
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-300 hover:text-primary">
                    <Download size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
