import React from "react";
import { NavLink } from "react-router-dom";
import {
  Building2,
  GitFork,
  Users,
  MapPin,
  Wallet,
  ShieldCheck,
  LayoutDashboard,
  Settings,
  BookUser,
  Layers,
  FileText,
  UserCircle,
  UserPlus,
  ArrowRightLeft,
  LogOut,
  UploadCloud,
  type LucideIcon,
  Zap,
} from "lucide-react";

import { modules } from "@/lib/sidebarData";
import { useAppSelector } from "@/redux/store/hooks";

// Map string icon names from `modules` → actual Lucide icon components
const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Building2,
  Layers,
  GitFork,
  BookUser,
  Users,
  MapPin,
  Wallet,
  ShieldCheck,
  FileText,
  UserCircle,
  UserPlus,
  ArrowRightLeft,
  LogOut,
  UploadCloud,
  Zap,
};

type RawSubMenu = {
  id: number;
  icon: string;
  title: string;
  pathname?: string;
  subMenu?: RawSubMenu[];
};

type NavItem = {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
};

type BuildResult = {
  navItems: NavItem[];
  moduleName: string;
  moduleTagline?: string;
};

// ✅ Only use the CURRENT module; no fallback to first / previous module
const buildNavItemsFromModule = (moduleId: number | string): BuildResult => {
  const numericId = Number(moduleId);
  const module = modules.find((m) => m.id === numericId);

  if (!module) {
    return {
      navItems: [],
      moduleName: "Flexi HRMS",
      moduleTagline: undefined,
    };
  }

  const firstMenu = module.Menu?.[0];
  const rawItems = ((firstMenu?.subMenu ?? []) as RawSubMenu[]) || [];

  const navItems: NavItem[] = rawItems
    .filter(
      (node) => typeof node.pathname === "string" && node.pathname.length > 0
    )
    .map((node) => {
      const Icon = ICON_MAP[node.icon] ?? FileText;
      return {
        id: String(node.id),
        label: node.title,
        path: node.pathname as string,
        icon: Icon,
      };
    });

  return {
    navItems,
    moduleName: module.name,
    moduleTagline: firstMenu?.title,
  };
};


export const Sidebar: React.FC = () => {
  // Redux: which main module is selected (1 = Flexi HQ, 2 = PeopleHub, ...)
  const activeModuleId = useAppSelector(
    (state) => state.navItem.activeNavItemId
  );

  const { navItems, moduleName, moduleTagline } =
    buildNavItemsFromModule(activeModuleId);

  return (
    <aside className="w-64 bg-[#1E1B4B] text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-30 shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-accent1 to-brand-accent2 flex items-center justify-center text-brand-dark font-bold text-2xl shadow-lg">
            {moduleName?.charAt(0) ?? "F"}
          </div>
          <div>
            <span className="block font-bold text-white text-xl tracking-tight leading-none">
              {moduleName}
            </span>
            {moduleTagline && (
              <span className="text-[10px] font-medium text-brand-accent1 uppercase tracking-wider">
                {moduleTagline}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic nav items based on selected module */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
          Modules
        </p>

        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            // `end` so "/" doesn't stay active on every route
            end={item.path === "/"}
            className={({ isActive }) =>
              [
                "group flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-white/10 text-white shadow-sm"
                  : "hover:bg-white/5 hover:text-white text-slate-400",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={20}
                  className={
                    isActive
                      ? "text-brand-accent1"
                      : "text-slate-500 group-hover:text-white"
                  }
                />
                <span className="truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {navItems.length === 0 && (
          <div className="px-3 py-2 text-xs text-slate-500">
            No submodules configured for this module yet.
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors w-full">
          <Settings size={20} />
          System Settings
        </button>
      </div>
    </aside>
  );
};
