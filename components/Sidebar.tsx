import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
Activity,
AlertTriangle,
ArrowRightLeft,
BarChart3,
Bell,
BookUser,
Briefcase,
Building2,
Calendar,
CalendarCheck,
CalendarClock,
CalendarDays,
CalendarRange,
CheckCircle2,
ChevronDown,
ChevronRight,
ClipboardList,
Clock,
Coffee,
Cpu,
Database,
DollarSign,
ExternalLink,
FileBarChart,
FileCheck,
FileText,
Fingerprint,
GitBranch,
GitFork,
GitMerge,
History,
Inbox,
Layers,
LayoutDashboard,
LayoutTemplate,
LineChart,
LogOut,
MapPin,
Menu,
Moon,
Puzzle,
Search,
Settings,
Settings2,
Shield,
ShieldAlert,
ShieldCheck,
Sliders,
Smartphone,
Table,
Target,
Timer,
Trophy,
TrendingUp,
UploadCloud,
User,
UserCheck,
UserCircle,
UserPlus,
Users,
Wallet,
Zap,
type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { modules } from "@/lib/sidebarData";
import { useAppSelector } from "@/redux/store/hooks";

// Map string icon names from `modules` → actual Lucide icon components
const ICON_MAP: Record<string, LucideIcon> = {
  Activity,
AlertTriangle,
ArrowRightLeft,
BarChart3,
Bell,
BookUser,
Briefcase,
Building2,
Calendar,
CalendarCheck,
CalendarClock,
CalendarDays,
CalendarRange,
CheckCircle2,
ChevronDown,
ChevronRight,
ClipboardList,
Clock,
Coffee,
Cpu,
Database,
DollarSign,
ExternalLink,
FileBarChart,
FileCheck,
FileText,
Fingerprint,
GitBranch,
GitFork,
GitMerge,
History,
Inbox,
Layers,
LayoutDashboard,
LayoutTemplate,
LineChart,
LogOut,
MapPin,
Menu,
Moon,
Puzzle,
Search,
Settings,
Settings2,
Shield,
ShieldAlert,
ShieldCheck,
Sliders,
Smartphone,
Table,
Target,
Timer,
Trophy,
TrendingUp,
UploadCloud,
User,
UserCheck,
UserCircle,
UserPlus,
Users,
Wallet,
Zap,
};

type RawSubMenu = {
  id: number;
  icon: string;
  title: string;
  pathname?: string;
  subMenu?: RawSubMenu[];
};

type RawMenuItem = {
  id: number;
  icon: string;
  title: string;
  pathname?: string;
  subMenu?: RawSubMenu[];
};

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  path?: string;
  subMenu?: NavItem[];
};

type BuildResult = {
  navItems: NavItem[];
  moduleName: string;
  moduleTagline?: string;
};

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

  const navItems: NavItem[] = (module.Menu || []).map((menuItem: RawMenuItem) => {
    const icon = ICON_MAP[menuItem.icon] || Zap;

    const subMenu: NavItem[] | undefined = menuItem.subMenu?.map((subItem: RawSubMenu) => ({
      id: subItem.id.toString(),
      label: subItem.title,
      path: subItem.pathname || "#",
      icon: ICON_MAP[subItem.icon] || Zap,
    }));

    return {
      id: menuItem.id.toString(),
      label: menuItem.title,
      icon,
      path: menuItem.pathname || undefined,
      subMenu,
    };
  });

  return {
    navItems,
    moduleName: module.name,
    moduleTagline: module.Menu?.[0]?.title,
  };
};

export const Sidebar: React.FC = () => {
  const location = useLocation();

  // Redux: which main module is selected (1 = Flexi HQ, 2 = PeopleHub, ...)
  const activeModuleId = useAppSelector((state) => state.navItem.activeNavItemId);

  const { navItems, moduleName, moduleTagline } = buildNavItemsFromModule(activeModuleId);

  // State to track which menus are open
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  // Toggle the dropdown for each item
  const toggleDropdown = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setOpenDropdowns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Check if any subitem of a parent is active
  const isSubItemActive = (item: NavItem): boolean => {
    if (!item.subMenu) return false;
    return item.subMenu.some((subItem) => location.pathname === subItem.path);
  };

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

        {navItems.map((item) => {
          const isDropdownOpen = openDropdowns.has(item.id);
          const isActive = isSubItemActive(item);

          return (
            <div key={item.id} className="space-y-1">
              {/* Parent row */}
              <div className="relative">
                <div
                  className={`group flex items-center justify-between w-full px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive || isDropdownOpen
                      ? "bg-white/10 text-white shadow-sm"
                      : "hover:bg-white/5 hover:text-white text-slate-400"
                  }`}
                >
                  {/* LEFT: label area (link if item.path exists) */}
                  {item.path ? (
                    <NavLink
                      to={item.path}
                      className="flex items-center gap-3 flex-1 min-w-0"
                      onClick={(e) => {
                        // allow navigation, but keep dropdown state unchanged
                        e.stopPropagation();
                      }}
                    >
                      <item.icon
                        size={20}
                        className={
                          isActive || isDropdownOpen
                            ? "text-brand-accent1"
                            : "text-slate-500 group-hover:text-white"
                        }
                      />
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => toggleDropdown(item.id, e)}
                      className="flex items-center gap-3 flex-1 min-w-0 text-left"
                    >
                      <item.icon
                        size={20}
                        className={
                          isActive || isDropdownOpen
                            ? "text-brand-accent1"
                            : "text-slate-500 group-hover:text-white"
                        }
                      />
                      <span className="truncate">{item.label}</span>
                    </button>
                  )}

                  {/* RIGHT: chevron toggle (always toggles if submenu exists) */}
                  {item.subMenu && item.subMenu.length > 0 && (
                    <button
                      type="button"
                      onClick={(e) => toggleDropdown(item.id, e)}
                      className="ml-2 p-1 rounded hover:bg-white/5"
                      aria-label="Toggle submenu"
                    >
                      <motion.div
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="flex items-center justify-center"
                      >
                        <ChevronDown
                          size={16}
                          className={
                            isActive || isDropdownOpen
                              ? "text-brand-accent1"
                              : "text-slate-500 group-hover:text-white"
                          }
                        />
                      </motion.div>
                    </button>
                  )}
                </div>
              </div>

              {/* Submenu - smooth dropdown */}
              <AnimatePresence initial={false}>
                {item.subMenu && item.subMenu.length > 0 && isDropdownOpen && (
                  <motion.div
                    key={`submenu-${item.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      initial={{ y: -4 }}
                      animate={{ y: 0 }}
                      exit={{ y: -4 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="ml-8 pl-2 border-l border-white/10 space-y-1"
                    >
                      {item.subMenu.map((subItem) => (
                        <NavLink
                          key={subItem.id}
                          to={subItem.path || "#"}
                          className={({ isActive }) =>
                            [
                              "group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ml-1",
                              isActive
                                ? "bg-white/10 text-white shadow-sm"
                                : "hover:bg-white/5 hover:text-white text-slate-400",
                            ].join(" ")
                          }
                        >
                          <span className="truncate">{subItem.label}</span>
                        </NavLink>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

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
