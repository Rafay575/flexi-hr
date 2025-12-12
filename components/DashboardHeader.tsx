import React from "react";
import {
  Search,
  Bell,
  HelpCircle,
  Settings,
  Menu,
  LayoutGrid,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Lucide from "@/components/ui/Lucide";
import { modules } from "@/lib/sidebarData";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./../redux/store/store";
import { setActiveNavItem } from "@/redux/slices/navItemSlice";

interface DashboardHeaderProps {
  userName: string;
  onMenuClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  onMenuClick,
}) => {
  const currentModule = useSelector(
    (state: RootState) => state.navItem.activeNavItemId
  );
  const dispatch = useDispatch();

  const handleModuleChange = (id: number) => {
    dispatch(setActiveNavItem(id));
  };

  return (
    <header className="sticky top-0 z-30 bg-white">
      <div className="flex flex-col gap-4 px-4 py-4  border-b shadow-md border-slate-100 md:flex-row md:items-center md:justify-end">
        {/* LEFT: Page title + subtitle (Flexi HQ style) */}
      
      

        {/* RIGHT: Actions + module switchers + profile */}
        <div className="flex items-center gap-3">
          {/* Search icon (placeholder for future search) */}
          <button className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-[#1E1B4B] sm:flex">
            <Search className="h-4 w-4" />
          </button>

          {/* Notifications */}
          <button className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-[#1E1B4B] md:flex">
            <Bell className="h-4 w-4" />
          </button>

          {/* Help */}
          <button className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-[#1E1B4B] md:flex">
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Main HRMS modules (non-admin) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="p-3 bg-white border border-slate-200 rounded-full text-flexi-gray hover:text-[#1E1B4B] hover:bg-slate-50 shadow-sm cursor-pointer">
                <AvatarFallback className="rounded-lg">
                  <LayoutGrid className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-72 bg-white p-4 px-6 shadow-xl border border-slate-100 rounded-2xl"
              align="end"
            >
              <div className="mb-3 text-sm font-semibold text-slate-800">
                HRMS Modules
              </div>
              <div className="w-full mt-3 border-t border-slate-200/70" />
              <div className="grid grid-cols-4 mt-5 gap-6 pb-3">
                {modules.map((item, i) =>
                  item.admin === false ? (
                    <button
                      type="button"
                      key={i}
                      className="col-span-1 flex flex-col items-center text-center text-[10px] font-medium text-slate-600 focus:outline-none"
                      onClick={() => handleModuleChange(item.id)}
                    >
                      <div
                        className={`mb-2 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 shadow-md transition-all duration-300 ${
                          currentModule === item.id
                            ? "bg-[#1E1B4B] text-[#F3B997]"
                            : "bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Lucide icon={item.icon} title={item.name} />
                      </div>
                      <span
                        className={`w-full truncate ${
                          currentModule === item.id
                            ? "text-[#1E1B4B] font-semibold"
                            : ""
                        }`}
                      >
                        {item.name}
                      </span>
                    </button>
                  ) : null
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Admin modules */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="p-3 bg-white border border-slate-200 rounded-full text-flexi-gray hover:text-[#1E1B4B] hover:bg-slate-50 shadow-sm cursor-pointer">
                <AvatarFallback className="rounded-lg">
                  <Settings className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-72 bg-white p-4 px-6 shadow-xl border border-slate-100 rounded-2xl"
              align="end"
            >
              <div className="mb-3 text-sm font-semibold text-slate-800">
                Admin Center
              </div>
              <div className="w-full mt-3 border-t border-slate-200/70" />
              <div className="grid grid-cols-4 mt-5 gap-6 pb-3">
                {modules.map((item, i) =>
                  item.admin === true ? (
                    <button
                      type="button"
                      key={i}
                      className="col-span-1 flex flex-col items-center text-center text-[10px] font-medium text-slate-600 focus:outline-none"
                      onClick={() => handleModuleChange(item.id)}
                    >
                      <div
                        className={`mb-2 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 shadow-md transition-all duration-300 ${
                          currentModule === item.id
                            ? "bg-[#1E1B4B] text-[#F3B997]"
                            : "bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Lucide icon={item.icon} title={item.name} />
                      </div>
                      <span
                        className={`w-full truncate ${
                          currentModule === item.id
                            ? "text-[#1E1B4B] font-semibold"
                            : ""
                        }`}
                      >
                        {item.name}
                      </span>
                    </button>
                  ) : null
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile pill */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E1B4B] text-[11px] font-bold text-white cursor-pointer shadow-md border-2 border-white">
            HR
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
