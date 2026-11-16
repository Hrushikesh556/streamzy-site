import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SEO, updateHeadTags, getOrigin } from '../services/seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { MediaCard } from '../components/MediaCard';
import { Heart, Trash2, Film, Sparkles } from 'lucide-react';

export const WatchlistView: React.FC = () => {
  const { watchlist, clearWatchlist } = useApp();

  useEffect(() => {
    updateHeadTags(
      SEO.getDirectorySEO(
        'My Saved Watchlist',
        'Access your saved movies and TV series across sessions stored locally in your browser.',
        '/watchlist',
        getOrigin()
      )
    );
  }, []);

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ name: 'My Watchlist', url: '/watchlist' }]} />

      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-cyan-400" />
            <span>Personal Collection</span>
          </div>
          <h1 className="text-3xl font-black text-white">My Watchlist</h1>
          <p className="text-xs text-zinc-400">
            {watchlist.length} saved title{watchlist.length === 1 ? '' : 's'} saved to your device.
          </p>
        </div>

        {watchlist.length > 0 && (
          <button
            type="button"
            onClick={clearWatchlist}
            className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>
        )}
      </div>

      {/* Watchlist Grid */}
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {watchlist.map((item) => (
            <MediaCard key={item.id} item={item} type={item.media_type || 'movie'} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-zinc-900/20 rounded-3xl border border-white/5 space-y-3">
          <Heart className="w-12 h-12 text-zinc-600 mx-auto" />
          <h2 className="text-lg font-bold text-white">Your Watchlist is Empty</h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Click the heart icon on any movie or TV show to save it to your personal watchlist for easy access later.
          </p>
          <div className="pt-2">
            <a
              href="/trending"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs shadow-md transition-colors"
            >
              <Sparkles className="w-4 h-4" /> Explore Trending Titles
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
