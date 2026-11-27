import React, { useEffect, useState } from 'react';
import { tmdb, PLATFORMS, TMDB_IMAGE, getCachedTMDBSync } from '../services/tmdb';
import { SEO, updateHeadTags, getOrigin } from '../services/seo';
import { MediaItem } from '../types';
import { useApp } from '../context/AppContext';
import { HeroCarousel } from '../components/HeroCarousel';
import { ContentRow } from '../components/ContentRow';
import {
  Flame,
  Film,
  Tv,
  Star,
  Sparkles,
  Clapperboard,
  Globe2,
  Trash2,
  Play,
  HelpCircle,
  Calendar,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { continueWatch, removeContinueWatch, clearContinueWatch, openPlayer } = useApp();

  const cachedTrending = getCachedTMDBSync<{ results: MediaItem[] }>('/trending/all/week', { page: 1 })?.results || [];
  const cachedNowPlaying = getCachedTMDBSync<{ results: MediaItem[] }>('/movie/now_playing', { page: 1 })?.results || [];
  const cachedPopularMovies = getCachedTMDBSync<{ results: MediaItem[] }>('/movie/popular', { page: 1 })?.results || [];

  const [trending, setTrending] = useState<MediaItem[]>(cachedTrending);
  const [nowPlaying, setNowPlaying] = useState<MediaItem[]>(cachedNowPlaying);
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>(cachedPopularMovies);
  const [popularTV, setPopularTV] = useState<MediaItem[]>([]);
  const [topRated, setTopRated] = useState<MediaItem[]>([]);
  const [upcoming, setUpcoming] = useState<MediaItem[]>([]);
  const [bengali, setBengali] = useState<MediaItem[]>([]);
  const [hindi, setHindi] = useState<MediaItem[]>([]);
  const [korean, setKorean] = useState<MediaItem[]>([]);
  const [action, setAction] = useState<MediaItem[]>([]);

  const [loadingTop, setLoadingTop] = useState(cachedTrending.length === 0);
  const [loadingBelowFold, setLoadingBelowFold] = useState(true);

  useEffect(() => {
    updateHeadTags(SEO.getHomeSEO(getOrigin()));

    let active = true;

    // Wave 1: Fire critical above-the-fold endpoints independently so Hero LCP never waits for slow rows
    const trendingReq = tmdb.getTrending('all', 'week', 1).then((res) => {
      if (!active) return;
      setTrending(res.results || []);
      setLoadingTop(false);
    }).catch((err) => {
      console.error('Trending load error', err);
      if (active) setLoadingTop(false);
    });

    tmdb.getNowPlaying(1).then((res) => {
      if (active) setNowPlaying(res.results || []);
    }).catch(() => {});

    tmdb.getPopular('movie', 1).then((res) => {
      if (active) setPopularMovies(res.results || []);
    }).catch(() => {});

    // Wave 2: Defer below-the-fold sections until after trending resolves / first paint
    let idleTimer: number | undefined;
    const loadBelowFold = async () => {
      if (!active) return;
      try {
        const tasks = [
          tmdb.getPopular('tv', 1).then((r) => active && setPopularTV(r.results || [])),
          tmdb.getTopRated('movie', 1).then((r) => active && setTopRated(r.results || [])),
          tmdb.getUpcoming(1).then((r) => active && setUpcoming(r.results || [])),
          tmdb.discover('movie', { withOriginalLanguage: 'bn' }).then((r) => active && setBengali(r.results || [])),
          tmdb.discover('movie', { withOriginalLanguage: 'hi' }).then((r) => active && setHindi(r.results || [])),
          tmdb.discover('tv', { withOriginalLanguage: 'ko' }).then((r) => active && setKorean(r.results || [])),
          tmdb.discover('movie', { withGenres: '28,53' }).then((r) => active && setAction(r.results || [])),
        ];
        await Promise.allSettled(tasks);
      } finally {
        if (active) setLoadingBelowFold(false);
      }
    };

    trendingReq.finally(() => {
      if (!active || typeof window === 'undefined') return;
      if ('requestIdleCallback' in window) {
        idleTimer = (window as any).requestIdleCallback(() => loadBelowFold(), { timeout: 250 });
      } else {
        idleTimer = globalThis.setTimeout(loadBelowFold, 60) as unknown as number;
      }
    });

    return () => {
      active = false;
      if (idleTimer !== undefined && typeof window !== 'undefined') {
        if ('cancelIdleCallback' in window) {
          (window as any).cancelIdleCallback(idleTimer);
        } else {
          clearTimeout(idleTimer);
        }
      }
    };
  }, []);

  return (
    <div id="home-view" className="space-y-10">
      {/* Trending Hero Carousel */}
      <HeroCarousel items={trending} isHomeH1={true} />

      {/* OTT Platform Direct Filter Navigation */}
      <section aria-label="Streaming Networks" className="px-1">
        <div className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Explore Major Platforms</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {PLATFORMS.map((platform) => (
            <a
              key={platform.code}
              href={platform.code === 'all' ? '/movies' : `/network/${platform.code}`}
              className="shrink-0 px-4 py-2 rounded-full bg-zinc-900/80 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-xs font-bold text-zinc-200 hover:text-cyan-300 transition-all flex items-center gap-2 shadow-sm"
            >
              {platform.logo ? (
                <img
                  src={platform.logo}
                  alt={platform.name}
                  loading="lazy"
                  decoding="async"
                  className={`h-4 max-w-[70px] object-contain ${platform.invert ? 'invert' : ''}`}
                />
              ) : (
                <span style={{ color: platform.color || 'white' }}>{platform.name}</span>
              )}
            </a>
          ))}
        </div>
      </section>

      {/* Continue Watching Section (if active history exists) */}
      {continueWatch && continueWatch.length > 0 && (
        <section className="mb-10 p-5 rounded-2xl bg-zinc-900/40 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-extrabold text-white">Continue Watching</h2>
            </div>
            <button
              onClick={clearContinueWatch}
              className="text-xs text-zinc-400 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear History
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {continueWatch.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  openPlayer(
                    { id: item.id, title: item.title, poster_path: item.poster } as any,
                    item.type,
                    item.season,
                    item.episode
                  )
                }
                className="shrink-0 w-56 group cursor-pointer bg-zinc-900 rounded-xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all"
              >
                <div className="relative aspect-video bg-zinc-950 overflow-hidden">
                  <img
                    src={`${TMDB_IMAGE.W342}${item.poster}`}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                    <div className="w-10 h-10 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div className="h-full bg-cyan-400" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                    <span className="text-[10px] text-zinc-400">
                      {item.type === 'tv' ? `S${item.season} E${item.episode}` : 'Movie'} • {item.progress}% watched
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeContinueWatch(item.id);
                    }}
                    className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Content Rows with crawlable links */}
      <ContentRow
        title="Trending This Week"
        items={trending}
        seeAllLink="/trending"
        icon={<Flame className="w-5 h-5" />}
        isLoading={loadingTop && trending.length === 0}
        isPriorityRow={true}
      />

      <ContentRow
        title="Now Playing in Theatres"
        items={nowPlaying}
        seeAllLink="/now-playing"
        icon={<Clapperboard className="w-5 h-5" />}
        type="movie"
        isLoading={loadingTop && nowPlaying.length === 0}
      />

      <ContentRow
        title="Popular Movies"
        items={popularMovies}
        seeAllLink="/movies"
        icon={<Film className="w-5 h-5" />}
        type="movie"
        isLoading={loadingTop && popularMovies.length === 0}
      />

      {/* Featured Collection Banner */}
      <section className="my-10 relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-r from-purple-950/80 via-zinc-900/90 to-cyan-950/80 p-8 sm:p-10 shadow-2xl [content-visibility:auto] [contain-intrinsic-size:0_260px]">
        <div className="max-w-xl space-y-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Curated Franchise
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            Marvel Cinematic Universe
          </h3>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Follow superheroes and cosmic adventures across the complete MCU saga in chronological viewing order.
          </p>
          <div className="pt-2">
            <a
              href="/collections/marvel"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(0,172,193,0.5)] transition-transform hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" /> Explore Marvel Collection
            </a>
          </div>
        </div>
      </section>

      <ContentRow
        title="Popular TV Shows"
        items={popularTV}
        seeAllLink="/tv-shows"
        icon={<Tv className="w-5 h-5" />}
        type="tv"
        isLoading={loadingBelowFold && popularTV.length === 0}
      />

      <ContentRow
        title="Top Rated Cinema"
        items={topRated}
        seeAllLink="/top-rated"
        icon={<Star className="w-5 h-5" />}
        type="movie"
        isLoading={loadingBelowFold && topRated.length === 0}
      />

      <ContentRow
        title="Upcoming Releases"
        items={upcoming}
        seeAllLink="/upcoming"
        icon={<Calendar className="w-5 h-5" />}
        type="movie"
        isLoading={loadingBelowFold && upcoming.length === 0}
      />

      {/* Language & Regional Showcases */}
      <ContentRow
        title="Bengali Cinema Hits"
        items={bengali}
        seeAllLink="/country/india"
        icon={<Globe2 className="w-5 h-5" />}
        type="movie"
        isLoading={loadingBelowFold && bengali.length === 0}
      />

      <ContentRow
        title="Hindi & Bollywood Films"
        items={hindi}
        seeAllLink="/country/india"
        icon={<Globe2 className="w-5 h-5" />}
        type="movie"
        isLoading={loadingBelowFold && hindi.length === 0}
      />

      <ContentRow
        title="Korean Dramas (K-Drama)"
        items={korean}
        seeAllLink="/country/korea"
        icon={<Globe2 className="w-5 h-5" />}
        type="tv"
        isLoading={loadingBelowFold && korean.length === 0}
      />

      <ContentRow
        title="Action & Thriller Blockbusters"
        items={action}
        seeAllLink="/genres/action"
        icon={<Flame className="w-5 h-5" />}
        type="movie"
        isLoading={loadingBelowFold && action.length === 0}
      />

      {/* FAQ Section with Clean Markup for Humans & SEO */}
      <section className="my-16 p-8 rounded-3xl bg-zinc-900/30 border border-white/10 space-y-6">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-black text-white">Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-2">
            <h3 className="font-bold text-white text-base">What movies and TV shows can I discover on Streamzy?</h3>
            <p className="text-zinc-400 leading-relaxed">
              Streamzy indexes thousands of official titles from TMDB, covering Hollywood blockbusters, Bollywood releases, Korean dramas, Japanese anime, European cinema, and independent productions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-2">
            <h3 className="font-bold text-white text-base">How do I browse by genre or release year?</h3>
            <p className="text-zinc-400 leading-relaxed">
              Use the top Browse menu or footer directory links to filter by Action, Comedy, Horror, Sci-Fi, and Drama, or select release years such as 2026, 2025, and 2024.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-2">
            <h3 className="font-bold text-white text-base">Can I save titles to my watchlist?</h3>
            <p className="text-zinc-400 leading-relaxed">
              Yes, click the heart icon on any card or detail page to add titles to your personal My List. Your watchlist is saved directly in your browser without requiring registration.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-2">
            <h3 className="font-bold text-white text-base">Are trailers and cast rosters officially verified?</h3>
            <p className="text-zinc-400 leading-relaxed">
              All metadata, official YouTube trailer IDs, cast listings, and director information are queried directly via the authorized TMDB API service.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
