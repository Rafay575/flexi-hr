import React from 'react';
import { Breadcrumbs } from './Breadcrumbs';

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  breadcrumbs, 
  actions 
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="space-y-2">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-2" />}
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">{title}</h1>
        {description && <p className="text-base text-slate-500 font-medium max-w-2xl">{description}</p>}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};