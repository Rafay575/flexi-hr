import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav className={`flex items-center text-sm text-slate-500 ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight size={14} className="mx-2 text-slate-400" />}
            {item.href && !isLast ? (
              <Link to={item.href} className="hover:text-primary-600 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={`font-medium ${isLast ? 'text-slate-700' : ''}`}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};