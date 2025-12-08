
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Drawer: React.FC<DrawerProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children, 
  size = 'md' 
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Panel */}
      <div 
        className={`
          relative w-full ${sizeClasses[size]} bg-white h-full shadow-2xl transform transition-transform duration-300 flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
