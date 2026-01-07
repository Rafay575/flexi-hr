import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  Zap,
  ChevronDown,
  type LucideIcon,
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

type RawMenuItem = {
  id: number;
  icon: string;
  title: string;
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

  // Convert raw menu items to NavItem structure
  // Only show the main menu items (Geography, Company Dictionaries, Employee, etc.)
  const navItems: NavItem[] = (module.Menu || []).map((menuItem: RawMenuItem) => {
    const icon = ICON_MAP[menuItem.icon] || Zap;
    
    // Convert submenu items (Gender, Salutation, etc. for Employee menu)
    const subMenu: NavItem[] | undefined = menuItem.subMenu?.map((subItem: RawSubMenu) => ({
      id: subItem.id.toString(),
      label: subItem.title,
      path: subItem.pathname || "#",
      icon: ICON_MAP[subItem.icon] || Zap,
    }));

    return {
      id: menuItem.id.toString(),
      label: menuItem.title,
      icon: icon,
      subMenu: subMenu,
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
  const activeModuleId = useAppSelector(
    (state) => state.navItem.activeNavItemId
  );

  const { navItems, moduleName, moduleTagline } =
    buildNavItemsFromModule(activeModuleId);

  // State to track which menus are open
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  // Toggle the dropdown for each item
  const toggleDropdown = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    setOpenDropdowns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Check if any subitem of a parent is active
  const isSubItemActive = (item: NavItem): boolean => {
    if (!item.subMenu) return false;
    return item.subMenu.some(subItem => location.pathname === subItem.path);
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
              {/* Parent Menu Item - Always clickable to toggle dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => toggleDropdown(item.id, e)}
                  className={`group flex items-center justify-between w-full px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive || isDropdownOpen
                      ? "bg-white/10 text-white shadow-sm"
                      : "hover:bg-white/5 hover:text-white text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      size={20}
                      className={
                        isActive || isDropdownOpen
                          ? "text-brand-accent1"
                          : "text-slate-500 group-hover:text-white"
                      }
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    } ${isActive || isDropdownOpen
                      ? "text-brand-accent1" 
                      : "text-slate-500 group-hover:text-white"
                    }`}
                  />
                </button>
              </div>

              {/* Submenu - Animated dropdown */}
              {item.subMenu && item.subMenu.length > 0 && isDropdownOpen && (
                <div className="ml-8 pl-2 border-l border-white/10 space-y-1">
                  {item.subMenu.map((subItem) => (
                    <NavLink
                      key={subItem.id}
                      to={subItem.path}
                      className={({ isActive }) =>
                        [
                          "group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ml-1",
                          isActive
                            ? "bg-white/10 text-white shadow-sm"
                            : "hover:bg-white/5 hover:text-white text-slate-400",
                        ].join(" ")
                      }
                    >
                      {({ isActive }) => (
                        <>
                          
                          
                          <span className="truncate">{subItem.label}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
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