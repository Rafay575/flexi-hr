import React from "react";
import { Search, Bell, HelpCircle, Settings, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LayoutGrid } from "lucide-react";
import Lucide from "@/components/ui/Lucide";
import { modules } from "@/lib/sidebarData";
import { useSelector, useDispatch } from "react-redux";
interface DashboardHeaderProps {
  userName: string;
  onMenuClick: () => void;
}
import type { RootState, AppDispatch } from "./../redux/store/store";
import { setActiveNavItem } from "@/redux/slices/navItemSlice";
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
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-neutral-secondary hover:bg-neutral-border rounded-lg"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-3xl font-bold text-flexi-primary tracking-tight">
            Good morning, {userName}!
          </h1>
        </div>
        <p className="text-sm text-neutral-secondary font-medium mt-1 hidden md:block opacity-80">
          Here's what's happening at Flexi HRMS today.
        </p>
      </div>

      <div className="flex items-start gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="p-3 bg-white border  rounded-full text-flexi-gray hover:text-flexi-navy hover:bg-gray-50 transition-all shadow-xl">
              <AvatarFallback className="rounded-lg">
                <LayoutGrid className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-160 bg-white  p-4 px-6" align="end">
            <div className="mb-3 font-medium">HRMS Modules</div>
            <div className="w-full mt-3 border-t border-slate-200/60 dark:border-darkmode-400"></div>
            <div className="grid grid-cols-5 mt-5 gap-8 pb-5 8 ">
              {modules.map((item, i) =>
                item.admin == false ? (
                  <div
                    key={i}
                    className="col-span-1  flex justify-center items-center flex-col  intro-y"
                  >
                    <div
                      className={`relative  w-12 h-12 ${
                        currentModule === item.id ? "bg-[#1E1B4B] text-[#F3B997]" : ""
                      } duration-500 ease-in-out transition-all  mb-2 zoom-in  justify-center rounded-full border border-slate-200 dark:border-darkmode-400 flex flex-col items-center shadow-xl`}
                      onClick={() => handleModuleChange(item.id)}
                    >
                      <Lucide icon={item.icon} title="Zap Icon" />
                    </div>
                    <span className={`text-[10px]  font-semibold  w-full text-center  ${
                        currentModule === item.id ? " text-[#F3B997] font-bold" : ""
                      }`}>
                      {item.name}
                    </span>
                  </div>
                ) : null
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Apps Dropdown */}

        {/* Settings Dropdown */}
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="p-3 border  bg-white rounded-full text-flexi-gray hover:text-flexi-navy hover:bg-gray-50 transition-all shadow-xl">
              <AvatarFallback className="rounded-lg">
                <Settings className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-160 bg-white  p-4 px-6" align="end">
            <div className="mb-3 font-medium">HRMS Modules</div>
            <div className="w-full mt-3 border-t border-slate-200/60 dark:border-darkmode-400"></div>
            <div className="grid grid-cols-5 mt-5 gap-8 pb-5 8 ">
              {modules.map((item, i) =>
                item.admin == true ? (
                  <div
                    key={i}
                    className="col-span-1  flex justify-center items-center flex-col  intro-y"
                  >
                    <div
                      className={`relative  w-12 h-12 ${
                        currentModule === item.id ? "bg-[#1E1B4B] text-[#F3B997]" : ""
                      } duration-500 ease-in-out transition-all  mb-2 zoom-in  justify-center rounded-full border border-slate-200 dark:border-darkmode-400 flex flex-col items-center shadow-xl`}
                      onClick={() => handleModuleChange(item.id)}
                    >
                      <Lucide icon={item.icon} title="Zap Icon" />
                    </div>
                    <span className={`text-[10px]  font-semibold  w-full text-center  ${
                        currentModule === item.id ? " text-[#F3B997] font-bold" : ""
                      }`}>
                      {item.name}
                    </span>
                  </div>
                ) : null
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="p-3 rounded-full bg-[#1E1B4B] text-white flex items-center justify-center text-xs font-bold  cursor-pointer shadow-xl border-2 border-white">
          HR
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;