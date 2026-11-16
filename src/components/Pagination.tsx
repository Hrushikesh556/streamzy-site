import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, baseUrl }) => {
  const maxPages = Math.min(totalPages || 1, 500); // TMDB API caps discover pages at 500
  if (maxPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const url = new URL(baseUrl, window.location.origin);
    if (page === 1) {
      url.searchParams.delete('page');
    } else {
      url.searchParams.set('page', String(page));
    }
    const cleanSearch = url.searchParams.toString();
    return cleanSearch ? `${url.pathname}?${cleanSearch}` : url.pathname;
  };

  // Compute pagination range
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2;

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(maxPages - 1, currentPage + delta);

    pages.push(1);

    if (rangeStart > 2) {
      pages.push('...');
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < maxPages - 1) {
      pages.push('...');
    }

    if (maxPages > 1) {
      pages.push(maxPages);
    }

    return pages;
  };

  return (
    <nav aria-label="Pagination Navigation" className="flex items-center justify-center gap-1.5 my-10 flex-wrap">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <a
          href={createPageUrl(currentPage - 1)}
          className="px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-300 bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 border border-white/10 flex items-center gap-1 transition-colors"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </a>
      ) : (
        <span className="px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-600 bg-zinc-900 border border-white/5 cursor-not-allowed flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Previous
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 py-1 text-xs text-zinc-500">
                ...
              </span>
            );
          }

          const pageNum = Number(p);
          const isActive = pageNum === currentPage;

          return (
            <a
              key={pageNum}
              href={createPageUrl(pageNum)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-9 h-9 rounded-xl text-xs font-black flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(0,172,193,0.5)] border border-cyan-400'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10'
              }`}
            >
              {pageNum}
            </a>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < maxPages ? (
        <a
          href={createPageUrl(currentPage + 1)}
          className="px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-300 bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 border border-white/10 flex items-center gap-1 transition-colors"
          aria-label="Go to next page"
        >
          Next <ChevronRight className="w-4 h-4" />
        </a>
      ) : (
        <span className="px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-600 bg-zinc-900 border border-white/5 cursor-not-allowed flex items-center gap-1">
          Next <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
};
