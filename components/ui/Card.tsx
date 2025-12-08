import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-slate-100 overflow-hidden ${className}`}>
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};