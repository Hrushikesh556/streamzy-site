import React from 'react';
import { BreadcrumbItem } from '../types';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center flex-wrap gap-2 text-sm text-zinc-400">
      <a
        href="/"
        className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors py-1 px-1.5 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </a>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={item.url + index}>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-white truncate max-w-xs sm:max-w-md" aria-current="page">
                {item.name}
              </span>
            ) : (
              <a
                href={item.url}
                className="hover:text-cyan-400 transition-colors py-1 px-1.5 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                {item.name}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
