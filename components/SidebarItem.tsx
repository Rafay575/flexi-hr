
import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  isActive?: boolean;
  isPro?: boolean;
  badgeCount?: number;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isCollapsed,
  isActive,
  isPro,
  badgeCount,
  onClick,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = (e: React.MouseEvent) => {
    if (children) {
      e.stopPropagation();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="w-full">
      <div
        onClick={onClick || toggleOpen}
        title={isCollapsed ? label : undefined}
        className={`
          flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all relative group
          ${isActive ? 'bg-white/10 text-[#E8D5A3] border-l-4 border-[#E8D5A3]' : 'text-white/70 hover:bg-white/5 hover:text-white'}
          ${isCollapsed ? 'justify-center px-0' : ''}
        `}
      >
        <div className="flex-shrink-0">{icon}</div>
        
        {!isCollapsed && (
          <div className="flex-1 flex items-center justify-between min-w-0">
            <span className="text-sm font-medium truncate">{label}</span>
            <div className="flex items-center gap-1.5 ml-2">
              {isPro && (
                <span className="text-[9px] bg-purple-500 text-white px-1.5 py-0.5 rounded-full font-bold tracking-tight">PRO</span>
              )}
              {badgeCount !== undefined && badgeCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 font-bold">
                  {badgeCount}
                </span>
              )}
              {children && (
                isOpen ? <ChevronDown size={14} className="opacity-50" /> : <ChevronRight size={14} className="opacity-50" />
              )}
            </div>
          </div>
        )}

        {isCollapsed && badgeCount !== undefined && badgeCount > 0 && (
          <span className="absolute top-1 right-2 bg-red-500 w-2 h-2 rounded-full ring-2 ring-[#3E3B6F]"></span>
        )}
      </div>
      
      {!isCollapsed && isOpen && children && (
        <div className="bg-black/10 py-1">
          {children}
        </div>
      )}
    </div>
  );
};

// Fixed: Added isPro prop to SidebarSubItem to match usage in App.tsx
export const SidebarSubItem: React.FC<{ label: string; onClick?: () => void; isActive?: boolean; badgeCount?: number; isPro?: boolean }> = ({ label, onClick, isActive, badgeCount, isPro }) => (
  <div
    onClick={onClick}
    className={`pl-11 pr-4 py-2 text-xs cursor-pointer transition-colors flex items-center justify-between ${
      isActive ? 'text-[#E8D5A3] font-medium' : 'text-white/50 hover:text-white'
    }`}
  >
    <div className="flex items-center gap-2">
      <span>{label}</span>
      {isPro && (
        <span className="text-[8px] bg-purple-500 text-white px-1 rounded-full font-bold">PRO</span>
      )}
    </div>
    {badgeCount !== undefined && badgeCount > 0 && (
      <span className="bg-red-500 text-white text-[9px] min-w-[16px] h-[16px] flex items-center justify-center rounded-full px-1 font-bold">
        {badgeCount}
      </span>
    )}
  </div>
);
