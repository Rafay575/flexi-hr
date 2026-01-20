import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Bell, ChevronDown, ChevronRight, LayoutDashboard, Calendar, FileText, 
  Users, CheckSquare, Settings, ShieldCheck, Clock, Plane, Gift, Database, 
  UserPlus, BarChart3, Bot, Layout, List, LogOut, Info, Zap, Sparkles, User as UserIcon,
  ShieldAlert, XCircle, Wallet, CreditCard, DollarSign, Briefcase, Play, Trophy,
  Sliders, Shield, ClipboardList, Activity, RefreshCw, History, UserCheck, PieChart,
  TrendingUp, Fingerprint, GitMerge, ListTree, Link2, Coins
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  isPro?: boolean;
  hrOnly?: boolean;
  managerOnly?: boolean;
  subItems?: NavItem[];
}

interface NavGroup {
  label: string;
  managerOnly?: boolean;
  hrOnly?: boolean;
  items: NavItem[];
}

const Plus = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const NAV_DATA: NavGroup[] = [
  {
    label: "Main",
    items: [{ id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> }]
  },
  {
    label: "MY LEAVE",
    items: [
      { id: 'my-balances', label: 'My Balances', icon: <Database size={20} /> },
      { id: 'apply-leave', label: 'Apply Leave', icon: <Zap size={20} /> },
      { id: 'my-earned-rewards', label: 'My Rewards', icon: <Trophy size={20} /> },
      { id: 'encashment', label: 'Encashment', icon: <Wallet size={20} /> },
      { id: 'my-requests', label: 'My Requests', icon: <List size={20} /> },
      { id: 'my-calendar', label: 'My Calendar', icon: <Calendar size={20} /> },
      { id: 'balance-ledger', label: 'Balance Ledger', icon: <FileText size={20} /> },
    ]
  },
  {
    label: "TEAM",
    managerOnly: true,
    items: [
      { id: 'team-calendar', label: 'Team Calendar', icon: <Calendar size={20} /> },
      { id: 'team-balances', label: 'Team Balances', icon: <Users size={20} /> },
      { id: 'pending-approvals', label: 'Pending Approvals', icon: <CheckSquare size={20} />, badge: 3 },
    ]
  },
  {
    label: "APPROVALS",
    items: [
      { id: 'approvals-inbox', label: 'Approvals Inbox', icon: <CheckSquare size={20} />, badge: 5 },
      { id: 'delegations', label: 'Delegations', icon: <UserPlus size={20} /> },
    ]
  },
  {
    label: "POLICY STUDIO",
    hrOnly: true,
    items: [
      { id: 'holiday-calendar', label: 'Holiday Calendar', icon: <Calendar size={20} /> },
      { id: 'leave-types', label: 'Leave Types', icon: <List size={20} /> },
      { id: 'eligibility', label: 'Eligibility Groups', icon: <Users size={20} /> },
      { id: 'employee-assignments', label: 'Leave Assignments', icon: <UserCheck size={20} /> },
      { id: 'accrual', label: 'Accrual Rules', icon: <Clock size={20} /> },
      { id: 'accrual-jobs', label: 'Accrual Jobs', icon: <Activity size={20} /> },
      { id: 'carry-forward-rules', label: 'Carry Forward', icon: <Zap size={20} /> },
      { id: 'year-end', label: 'Year-End Process', icon: <RefreshCw size={20} /> },
      { id: 'year-end-history', label: 'Year-End History', icon: <History size={20} /> },
      { id: 'blackout', label: 'Blackout Periods', icon: <ShieldAlert size={20} /> },
      { id: 'incentive-rules', label: 'Incentive Rules', icon: <Gift size={20} /> },
      { id: 'incentive-runs', label: 'Incentive Runs', icon: <Play size={20} /> },
      { id: 'balance-adjustments', label: 'Balance Adjustments', icon: <Sliders size={20} /> },
      { id: 'adjustment-approvals', label: 'Adjustment Approvals', icon: <Shield size={20} />, badge: 3 },
      { id: 'opening-balances', label: 'Opening Balances', icon: <ClipboardList size={20} /> },
      { id: 'rejection-reasons', label: 'Rejection Reasons', icon: <XCircle size={20} /> },
      { id: 'audit-logs', label: 'Audit Logs', icon: <ShieldCheck size={20} /> },
      { id: 'sla-monitor', label: 'SLA Monitor', icon: <BarChart3 size={20} />, isPro: true },
      { id: 'simulator', label: 'Simulator', icon: <Zap size={20} />, isPro: true },
    ]
  },
  {
    label: "COMP-OFF",
    items: [
      { id: 'co-credits', label: 'My Credits', icon: <Zap size={20} /> },
      { id: 'co-approvals', label: 'Credit Approvals', icon: <CheckSquare size={20} />, managerOnly: true, badge: 2 },
      { id: 'co-all', label: 'All Credits', icon: <Users size={20} />, hrOnly: true },
    ]
  },
  {
    label: "OFFICIAL DUTY",
    items: [
      { id: 'od-travel', label: 'My OD/Travel', icon: <Briefcase size={20} /> },
      { id: 'od-approvals', label: 'OD Approvals', icon: <CheckSquare size={20} />, managerOnly: true, badge: 1 },
      { id: 'od-reports', label: 'Travel Analytics', icon: <BarChart3 size={20} />, hrOnly: true, isPro: true },
    ]
  },
  {
    label: "AI ASSISTANT",
    items: [
      { id: 'ai-copilot', label: 'Policy Copilot', icon: <Bot size={20} />, isPro: true },
      { id: 'ai-risk', label: 'Coverage Risk', icon: <Sparkles size={20} />, isPro: true },
      { id: 'ai-anomalies', label: 'Anomaly Detection', icon: <Fingerprint size={20} />, isPro: true, badge: 8 },
    ]
  },
  {
    label: "PAYROLL LIQUIDATION",
    hrOnly: true,
    items: [
      { id: 'encashment-approvals', label: 'Encashment Approvals', icon: <DollarSign size={20} />, managerOnly: true, badge: 4 },
      { id: 'encashment-list', label: 'Encashment Requests', icon: <CreditCard size={20} />, badge: 8 },
      { id: 'payroll-periods', label: 'Payroll Periods', icon: <Coins size={20} /> },
    ]
  },
  {
    label: "REPORTS",
    items: [
      { id: 'reports', label: 'Report Generator', icon: <PieChart size={20} /> },
      { id: 'scheduled-reports', label: 'Scheduled Reports', icon: <Clock size={20} /> },
      { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
      { id: 'forecast', label: 'Forecast', icon: <TrendingUp size={20} />, isPro: true },
    ]
  },
  {
    label: "SETTINGS",
    items: [
      { id: 'notifications', label: 'Notification Settings', icon: <Bell size={20} /> },
      { id: 'notification-templates', label: 'Notification Templates', icon: <FileText size={20} />, hrOnly: true },
      { id: 'notification-logs', label: 'Delivery Logs', icon: <Activity size={20} />, hrOnly: true },
      { id: 'workflows', label: 'Workflows', icon: <GitMerge size={20} /> },
      { id: 'workflow-builder', label: 'Workflow Builder', icon: <Sliders size={20} />, hrOnly: true },
      { id: 'workflow-instances', label: 'Workflow Instances', icon: <ListTree size={20} />, hrOnly: true },
      { id: 'integrations', label: 'Integrations', icon: <Link2 size={20} />, hrOnly: true },
      { id: 'entitlements', label: 'Plan & Entitlements', icon: <ShieldCheck size={20} />, hrOnly: true },
    ]
  }
];

export const LeaveEaseShell: React.FC<{ children: React.ReactNode, activeId?: string, onNavigate?: (id: string) => void }> = ({ children, activeId, onNavigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ "MY LEAVE": true, "Main": true, "POLICY STUDIO": true, "COMP-OFF": true, "PAYROLL LIQUIDATION": true, "OFFICIAL DUTY": true, "REPORTS": true, "SETTINGS": true });
  const [activeItem, setActiveItem] = useState(activeId || 'dashboard');

  useEffect(() => {
    if (activeId) setActiveItem(activeId);
  }, [activeId]);

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleNav = (id: string) => {
    setActiveItem(id);
    if (onNavigate) onNavigate(id);
    if (window.innerWidth < 1024) setIsMobileOpen(false);
  };

  const SidebarItem = ({ item }: { item: NavItem }) => {
    const isActive = activeItem === item.id;
    return (
      <button
        onClick={() => handleNav(item.id)}
        className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all relative
          ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}
          ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`}
        title={isCollapsed ? item.label : ''}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#E8D5A3] rounded-r-full shadow-[0_0_8px_rgba(232,213,163,0.5)]" />
        )}
        <div className="flex items-center gap-3">
          <div className={`${isActive ? 'text-[#E8D5A3]' : ''} transition-colors`}>{item.icon}</div>
          {(!isCollapsed || isMobileOpen) && (
            <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
          )}
        </div>
        {(!isCollapsed || isMobileOpen) && (
          <div className="flex items-center gap-1.5">
            {item.isPro && (
              <span className="text-[10px] bg-[#4A4680] text-[#E8D5A3] px-1.5 py-0.5 rounded font-bold tracking-wider">PRO</span>
            )}
            {item.badge && (
              <span className="bg-[#EF4444] text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                {item.badge}
              </span>
            )}
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5] overflow-hidden font-['League_Spartan']">
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside 
        className={`fixed lg:relative z-50 h-full bg-[#3E3B6F] text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl
        ${isCollapsed ? 'w-16' : 'w-[280px]'} 
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-16 flex items-center px-4 border-b border-white/10 shrink-0 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E8D5A3] to-[#E8B4A0] flex items-center justify-center shrink-0">
            <Zap size={18} className="text-[#3E3B6F]" />
          </div>
          <div className={`ml-3 transition-opacity duration-300 ${isCollapsed && !isMobileOpen ? 'opacity-0 invisible' : 'opacity-100'}`}>
            <span className="text-xl font-bold tracking-tight">LeaveEase</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-hide custom-sidebar-scroll">
          {NAV_DATA.map((group, idx) => (
            <div key={idx} className="mb-6 px-3">
              {(!isCollapsed || isMobileOpen) ? (
                <button 
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between mb-2 px-2 text-[10px] font-bold text-white/30 tracking-[0.2em] uppercase hover:text-white/50 transition-colors"
                >
                  <span>{group.label}</span>
                  {expandedGroups[group.label] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              ) : (
                <div className="h-px bg-white/10 mb-4 mx-2" />
              )}
              
              {(expandedGroups[group.label] || isCollapsed) && (
                <div className="space-y-1">
                  {group.items.map(item => <SidebarItem key={item.id} item={item} />)}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-white/10 bg-[#373463]">
          <div className={`flex items-center gap-3 ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-accent-peach flex items-center justify-center text-[#3E3B6F] font-bold shrink-0">JD</div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">John Doe</p>
                <p className="text-[10px] text-white/40 truncate">Manager Access</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 px-4 lg:px-6 flex items-center justify-between shrink-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (window.innerWidth < 1024) setIsMobileOpen(true);
                else setIsCollapsed(!isCollapsed);
              }}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center text-sm font-medium text-gray-400 gap-2">
              <span onClick={() => handleNav('dashboard')} className="hover:text-gray-600 cursor-pointer">LeaveEase</span>
              <ChevronRight size={14} />
              <span className="text-gray-900 font-bold capitalize">{activeItem.replace('-', ' ')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="relative p-2 text-gray-400 hover:text-[#3E3B6F] transition-colors rounded-full hover:bg-gray-50">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold">3</span>
            </button>
            <div className="h-8 w-px bg-gray-200 mx-1" />
            <div className="w-8 h-8 rounded-full bg-[#3E3B6F] text-white flex items-center justify-center font-bold text-xs cursor-pointer">JD</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F5F5F5] custom-main-scroll">
          {children}
        </main>
      </div>

      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          .custom-sidebar-scroll::-webkit-scrollbar { width: 4px; }
          .custom-sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
          .custom-main-scroll::-webkit-scrollbar { width: 8px; }
          .custom-main-scroll::-webkit-scrollbar-track { background: transparent; }
          .custom-main-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; border: 2px solid #F5F5F5; }
        `}
      </style>
    </div>
  );
};