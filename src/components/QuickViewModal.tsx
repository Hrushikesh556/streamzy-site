import React from 'react';
import { useApp } from '../context/AppContext';
import { TMDB_IMAGE, createSlug } from '../services/tmdb';
import { X, Play, Youtube, Heart, Check, Star, Calendar, ExternalLink } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { quickViewItem, closeQuickView, isInWatchlist, toggleWatchlist, openPlayer, openTrailer } = useApp();

  if (!quickViewItem.isOpen || !quickViewItem.item) return null;

  const { item, type } = quickViewItem;
  const title = item.title || item.name || 'Untitled';
  const year = (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A';
  const inWatchlist = isInWatchlist(item.id);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'NR';
  const slug = createSlug(item);
  const detailUrl = type === 'tv' ? `/tv/${slug}` : `/movie/${slug}`;

  const posterUrl = item.poster_path
    ? `${TMDB_IMAGE.W500}${item.poster_path}`
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl bg-[#0f0f15] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-white/20 text-white flex items-center justify-center border border-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Poster Column */}
        <div className="w-full md:w-2/5 aspect-[2/3] md:aspect-auto relative bg-zinc-900 shrink-0">
          <img src={posterUrl} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-transparent to-transparent" />
        </div>

        {/* Info Column */}
        <div className="p-6 md:p-8 flex flex-col justify-between flex-1 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-cyan-500/20 text-cyan-400 font-bold uppercase text-[10px] px-2 py-0.5 rounded border border-cyan-500/30">
                {type === 'tv' ? 'TV Series' : 'Movie'}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {rating}
              </span>
              <span className="text-xs text-zinc-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {year}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {title}
            </h2>

            <p className="text-sm text-zinc-300 leading-relaxed line-clamp-4">
              {item.overview || 'Explore complete movie information, official trailers, verified cast, and authorized streaming options.'}
            </p>

            {item.genres && item.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-2.5 py-0.5 rounded-full text-[11px] bg-white/5 border border-white/10 text-zinc-300"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => openPlayer(item, type)}
              className="px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 transition-transform hover:scale-105 shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Watch Stream
            </button>

            <button
              type="button"
              onClick={() => openTrailer(item, type)}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/10 transition-colors"
            >
              <Youtube className="w-3.5 h-3.5 text-red-500" /> Trailer
            </button>

            <a
              href={detailUrl}
              onClick={closeQuickView}
              className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white font-bold text-xs flex items-center gap-1 border border-white/10 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Full Page
            </a>

            <button
              type="button"
              onClick={() => toggleWatchlist(item, type)}
              title={inWatchlist ? 'Remove from My List' : 'Add to My List'}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                inWatchlist
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white'
              } border border-white/15`}
            >
              {inWatchlist ? <Check className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
