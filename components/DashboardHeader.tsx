import React from 'react';
import { Search, Bell, HelpCircle, Settings, Menu } from 'lucide-react';

interface DashboardHeaderProps {
  userName: string;
  onMenuClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName, onMenuClick }) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3">
            <button onClick={onMenuClick} className="lg:hidden p-2 text-neutral-secondary hover:bg-neutral-border rounded-lg">
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

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted h-4 w-4" />
          <input
            type="text"
            placeholder="Search employees, actions..."
            className="pl-10 pr-4 py-2.5 w-64 rounded-lg border border-neutral-border bg-white text-label font-medium focus:outline-none focus:ring-2 focus:ring-flexi-primary/20 focus:border-flexi-primary transition-all placeholder:text-neutral-muted shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2.5 text-neutral-secondary hover:bg-white hover:shadow-sm rounded-full transition-all relative border border-transparent hover:border-neutral-border">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-flexi-coral rounded-full ring-2 ring-white"></span>
          </button>
          <button className="p-2.5 text-neutral-secondary hover:bg-white hover:shadow-sm rounded-full transition-all hidden sm:block border border-transparent hover:border-neutral-border">
            <HelpCircle className="h-5 w-5" />
          </button>
          <button className="p-2.5 text-neutral-secondary hover:bg-white hover:shadow-sm rounded-full transition-all hidden sm:block border border-transparent hover:border-neutral-border">
            <Settings className="h-5 w-5" />
          </button>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-flexi-primary to-flexi-secondary text-white flex items-center justify-center text-sm font-bold ml-2 cursor-pointer shadow-md border-2 border-white">
            HR
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;