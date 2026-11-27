import React, { useEffect, useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { tmdb, PLATFORMS } from '../services/tmdb';
import { SEO, updateHeadTags, getOrigin } from '../services/seo';
import { MediaItem } from '../types';
import { MediaCard } from '../components/MediaCard';
import { MediaGridSkeleton } from '../components/SkeletonLoaders';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Pagination } from '../components/Pagination';
import { Tv, Flame, Calendar, Sparkles } from 'lucide-react';

interface TVShowsViewProps {
  isAiringToday?: boolean;
}

export const TVShowsView: React.FC<TVShowsViewProps> = ({ isAiringToday = false }) => {
  const { pathname, searchParams } = useRouter();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [items, setItems] = useState<MediaItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const title = isAiringToday ? 'TV Shows Airing Today' : 'Popular TV Shows Directory';
  const desc = isAiringToday
    ? 'Discover television series and new drama episodes broadcasting today on global networks and streaming platforms.'
    : 'Explore popular TV shows, ongoing web series, anime, Korean drama, and critically acclaimed multi-season series.';

  useEffect(() => {
    updateHeadTags(
      SEO.getDirectorySEO(title, desc, pathname, getOrigin(), page)
    );

    const loadTV = async () => {
      setLoading(true);
      try {
        const res = isAiringToday ? await tmdb.getAiringToday(page) : await tmdb.getPopular('tv', page);
        if (res && res.results) {
          setItems(res.results.filter((i) => i.poster_path));
          setTotalPages(res.total_pages || 1);
        }
      } catch (err) {
        console.error('TV fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    loadTV();
  }, [isAiringToday, page, pathname]);

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { name: 'TV Shows', url: '/tv-shows' },
          ...(isAiringToday ? [{ name: 'Airing Today', url: '/airing-today' }] : []),
        ]}
      />

      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-950/90 border border-white/10 space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider">
          <Tv className="w-5 h-5" />
          <span>Television & Web Series</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{title}</h1>
        <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">{desc}</p>

        {/* Quick Platform Badges */}
        <div className="pt-3 flex flex-wrap gap-2">
          {PLATFORMS.filter((p) => p.code !== 'all').slice(0, 6).map((platform) => (
            <a
              key={platform.code}
              href={`/network/${platform.code}`}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 text-zinc-300 border border-white/10 transition-colors"
            >
              {platform.name}
            </a>
          ))}
          <a
            href="/country/korea"
            className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/30 hover:bg-pink-500/20 transition-colors"
          >
            Korean Drama (K-Drama)
          </a>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <MediaGridSkeleton count={18} />
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item, idx) => (
            <MediaCard key={item.id} item={item} type="tv" rank={(page - 1) * 20 + idx + 1} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5">
          <Tv className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No TV Shows Found</h3>
        </div>
      )}

      {/* Crawlable Pagination */}
      <Pagination currentPage={page} totalPages={totalPages} baseUrl={pathname} />
    </div>
  );
};
