import React, { useRef } from 'react';
import { MediaItem } from '../types';
import { MediaCard } from './MediaCard';
import { MediaCardSkeleton } from './SkeletonLoaders';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ContentRowProps {
  title: string;
  items: MediaItem[];
  seeAllLink?: string;
  icon?: React.ReactNode;
  type?: 'movie' | 'tv';
  isLoading?: boolean;
  showRank?: boolean;
  isPriorityRow?: boolean;
}

export const ContentRow: React.FC<ContentRowProps> = ({
  title,
  items,
  seeAllLink,
  icon,
  type = 'movie',
  isLoading = false,
  showRank = true,
  isPriorityRow = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const offset = direction === 'left' ? -600 : 600;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <section
      className={`mb-10 relative ${
        isPriorityRow ? '' : '[content-visibility:auto] [contain-intrinsic-size:0_380px]'
      }`}
    >
      {/* Row Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-cyan-400">{icon}</span>}
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{title}</h2>
        </div>

        <div className="flex items-center gap-2">
          {seeAllLink && (
            <a
              href={seeAllLink}
              className="text-xs sm:text-sm font-bold text-cyan-400 hover:text-white transition-colors flex items-center gap-1 py-1 px-2.5 rounded-full hover:bg-white/5"
            >
              See All <ChevronRight className="w-4 h-4" />
            </a>
          )}

          {/* Nav buttons for desktop */}
          <div className="hidden sm:flex items-center gap-1 ml-2">
            <button
              onClick={() => scroll('left')}
              aria-label={`Scroll ${title} left`}
              className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-cyan-600 text-zinc-300 hover:text-white flex items-center justify-center transition-colors border border-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label={`Scroll ${title} right`}
              className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-cyan-600 text-zinc-300 hover:text-white flex items-center justify-center transition-colors border border-white/10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Row Content */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {isLoading ? (
          Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="shrink-0 w-36 sm:w-44 md:w-48">
              <MediaCardSkeleton />
            </div>
          ))
        ) : items && items.length > 0 ? (
          items.map((item, idx) => (
            <div key={item.id} className="shrink-0 w-36 sm:w-44 md:w-48 snap-start">
              <MediaCard
                item={item}
                type={type}
                rank={showRank ? idx + 1 : undefined}
                priority={isPriorityRow && idx < 4}
              />
            </div>
          ))
        ) : (
          <div className="text-zinc-500 text-sm py-4">No content available in this section.</div>
        )}
      </div>
    </section>
  );
};
