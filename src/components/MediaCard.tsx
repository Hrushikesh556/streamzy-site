import React from 'react';
import { MediaItem } from '../types';
import { TMDB_IMAGE, createSlug } from '../services/tmdb';
import { useApp } from '../context/AppContext';
import { LazyImage } from './LazyImage';
import { Play, Heart, Check, Info, Star } from 'lucide-react';

interface MediaCardProps {
  item: MediaItem;
  type?: 'movie' | 'tv';
  rank?: number;
  priority?: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, type = 'movie', rank, priority = false }) => {
  const { isInWatchlist, toggleWatchlist, openPlayer, openQuickView } = useApp();
  const resolvedType = (item.media_type as 'movie' | 'tv') || type;
  const title = item.title || item.name || 'Untitled';
  const year = (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'NR';
  const inWatchlist = isInWatchlist(item.id);
  const slug = createSlug(item);
  const detailUrl = resolvedType === 'tv' ? `/tv/${slug}` : `/movie/${slug}`;

  const isRecent = () => {
    const dateStr = item.release_date || item.first_air_date;
    if (!dateStr) return false;
    const itemDate = new Date(dateStr);
    const now = new Date();
    const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays < 90;
  };

  const posterUrl = item.poster_path
    ? `${TMDB_IMAGE.W342}${item.poster_path}`
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=342&auto=format&fit=crop&q=75';

  return (
    <article
      id={`media-card-${item.id}`}
      className="group relative flex flex-col bg-[#12121a] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_36px_rgba(0,0,0,0.85)] border border-white/5 hover:border-cyan-500/30"
    >
      <a
        href={detailUrl}
        className="block relative aspect-[2/3] overflow-hidden bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        aria-label={`${title} (${year}) - View details`}
      >
        <LazyImage
          src={posterUrl}
          alt={`${title} (${year}) movie poster`}
          priority={priority}
          width="300"
          height="450"
          wrapperClassName="w-full h-full"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106 group-hover:brightness-50"
        />

        {/* Rank Badge */}
        {rank && rank <= 10 && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-cyan-600 text-white text-[11px] font-black px-2 py-0.5 rounded shadow-md tracking-wider">
            #{rank}
          </span>
        )}

        {/* NEW Badge */}
        {isRecent() && (
          <span className="absolute top-2.5 right-2.5 z-10 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-md tracking-wider">
            NEW
          </span>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/95 via-black/40 to-transparent">
          {/* Top Actions */}
          <div className="flex justify-between items-center w-full">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWatchlist(item, resolvedType);
              }}
              title={inWatchlist ? 'Remove from My List' : 'Add to My List'}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                inWatchlist
                  ? 'bg-cyan-500 text-white'
                  : 'bg-black/70 text-zinc-300 hover:text-white hover:bg-cyan-600'
              } backdrop-blur-sm border border-white/20`}
            >
              {inWatchlist ? <Check className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
            </button>

            <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-black/70 px-2 py-0.5 rounded-full border border-amber-400/30 backdrop-blur-sm">
              <Star className="w-3 h-3 fill-amber-400" />
              {rating}
            </span>
          </div>

          {/* Center Play Button */}
          <div className="flex justify-center items-center my-auto">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openPlayer(item, resolvedType);
              }}
              title="Stream Now"
              className="w-12 h-12 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(0,172,193,0.7)] transition-transform duration-300 transform scale-90 hover:scale-110"
            >
              <Play className="w-5 h-5 ml-0.5 fill-white" />
            </button>
          </div>

          {/* Bottom Info & Quick Details Button */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wide block">
                {resolvedType === 'tv' ? 'TV Series' : 'Movie'}
              </span>
              <span className="text-xs text-zinc-300 font-medium truncate block">{year}</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openQuickView(item, resolvedType);
              }}
              title="Quick Overview"
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-200 transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </a>

      {/* Card Body Under Poster */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-1.5">
        <h3 className="text-sm font-bold text-white truncate hover:text-cyan-400 transition-colors">
          <a href={detailUrl} title={title}>
            {title}
          </a>
        </h3>
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>{year}</span>
          <span className="flex items-center gap-1 font-semibold text-amber-400">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {rating}
          </span>
        </div>
      </div>
    </article>
  );
};
