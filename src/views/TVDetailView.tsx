import React, { useEffect, useState } from 'react';
import { tmdb, TMDB_IMAGE, createSlug } from '../services/tmdb';
import { SEO, updateHeadTags, getOrigin } from '../services/seo';
import { MediaItem } from '../types';
import { useApp } from '../context/AppContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { MediaCard } from '../components/MediaCard';
import { ContentRow } from '../components/ContentRow';
import { SeasonEpisodeSelector } from '../components/SeasonEpisodeSelector';
import {
  Play,
  Youtube,
  Heart,
  Check,
  Star,
  Tv,
  Calendar,
  Layers,
  Globe,
  User,
  Share2,
  Copy,
  ChevronRight,
  Zap,
  ExternalLink,
  Server,
  Sparkles,
} from 'lucide-react';

interface TVDetailViewProps {
  slug: string;
}

export const TVDetailView: React.FC<TVDetailViewProps> = ({ slug }) => {
  const { isInWatchlist, toggleWatchlist, openPlayer, openTrailer, showToast } = useApp();

  const [tv, setTv] = useState<MediaItem | null>(null);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Set immediate readable title and canonical tag from slug
    updateHeadTags(SEO.getInitialMediaSEO(slug, 'tv', getOrigin()));

    const loadTV = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await tmdb.resolveItemBySlug(slug, 'tv');
        if (data) {
          setTv(data);
          updateHeadTags(SEO.getTVSEO(data, getOrigin(), slug));

          // Fetch or extract recommendations
          setLoadingRecommendations(true);
          let recs = data.recommendations?.results?.filter((i) => i.poster_path) || [];
          if (recs.length < 6 && data.id) {
            try {
              const res = await tmdb.getRecommendations('tv', data.id);
              if (res.results && res.results.length > 0) {
                recs = res.results.filter((i) => i.poster_path);
              }
            } catch (recErr) {
              console.warn('TMDB TV recommendations fallback to similar', recErr);
              if (data.similar?.results) {
                recs = data.similar.results.filter((i) => i.poster_path);
              }
            }
          }
          setRecommendations(recs);
          setLoadingRecommendations(false);
        } else {
          setError(true);
          updateHeadTags(SEO.get404SEO(getOrigin()));
        }
      } catch (err) {
        console.error('Failed to load TV detail', err);
        setError(true);
        updateHeadTags(SEO.get404SEO(getOrigin()));
      } finally {
        setLoading(false);
      }
    };

    loadTV();
  }, [slug]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-64 bg-zinc-800 rounded-md" />
        <div className="h-96 w-full bg-zinc-900 rounded-3xl" />
      </div>
    );
  }

  if (error || !tv) {
    return (
      <div className="text-center py-24 space-y-4">
        <Tv className="w-16 h-16 text-zinc-600 mx-auto" />
        <h1 className="text-2xl font-black text-white">TV Show Not Found</h1>
        <p className="text-sm text-zinc-400">The requested series could not be found or has moved.</p>
        <a
          href="/tv-shows"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs transition-colors"
        >
          Browse All TV Shows
        </a>
      </div>
    );
  }

  const name = tv.name || tv.original_name || 'TV Show';
  const year = (tv.first_air_date || '').split('-')[0] || '2026';
  const inWatchlist = isInWatchlist(tv.id);
  const rating = tv.vote_average ? tv.vote_average.toFixed(1) : 'NR';
  const mainGenre = tv.genres && tv.genres.length > 0 ? tv.genres[0].name : 'Drama';

  const trailerVideo = tv.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );

  const backdropUrl = tv.backdrop_path
    ? `${TMDB_IMAGE.ORIGINAL}${tv.backdrop_path}`
    : 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1600&auto=format&fit=crop&q=80';

  const posterUrl = tv.poster_path
    ? `${TMDB_IMAGE.W500}${tv.poster_path}`
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Show link copied to clipboard!', 'info');
  };

  return (
    <div className="space-y-10">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { name: 'TV Shows', url: '/tv-shows' },
          { name: mainGenre, url: `/genres/${mainGenre.toLowerCase()}` },
          { name: `${name} (${year})`, url: `/tv/${slug}` },
        ]}
      />

      {/* Hero Presentation Header */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-xs"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[#060608]/85 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 lg:p-14 flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          {/* Poster Column */}
          <div className="w-48 sm:w-64 lg:w-72 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl bg-zinc-900 border border-white/15 shrink-0 mx-auto md:mx-0">
            <img
              src={posterUrl}
              alt={`${name} ${year} series poster`}
              className="w-full h-full object-cover"
              width="300"
              height="450"
            />
          </div>

          {/* Details Column */}
          <div className="flex-1 space-y-5">
            <div className="flex items-center flex-wrap gap-2 text-xs font-bold">
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                TV Series
              </span>
              <span className="bg-white/10 text-zinc-300 border border-white/15 px-3 py-1 rounded-full">
                {tv.number_of_seasons || 1} Season{tv.number_of_seasons !== 1 ? 's' : ''} ({tv.number_of_episodes || ''} Episodes)
              </span>
              <span className="flex items-center gap-1 bg-amber-400/10 text-amber-400 border border-amber-400/30 px-3 py-1 rounded-full font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {rating} / 10
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              {name}
            </h1>

            {/* Metadata line */}
            <div className="flex items-center flex-wrap gap-4 text-xs sm:text-sm font-semibold text-zinc-300">
              <a href={`/year/${year}`} className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors">
                <Calendar className="w-4 h-4 text-cyan-400" /> {year}
              </a>
              <span>•</span>
              <span className="flex items-center gap-1.5 uppercase">
                <Globe className="w-4 h-4 text-cyan-400" /> {tv.original_language || 'EN'}
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{tv.status || 'Active Series'}</span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {tv.genres?.map((g) => (
                <a
                  key={g.id}
                  href={`/genres/${g.name.toLowerCase()}`}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 text-zinc-300 border border-white/10 transition-colors"
                >
                  {g.name}
                </a>
              ))}
            </div>

            {/* Storyline */}
            <div className="space-y-1.5 pt-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Synopsis</h3>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl">
                {tv.overview || 'Explore official storyline, episodes guide, verified cast, and streaming providers.'}
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex items-center flex-wrap gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => openPlayer(tv, 'tv', 1, 1)}
                className="px-7 py-3.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white font-extrabold text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(0,172,193,0.5)] transition-transform hover:scale-105"
              >
                <Play className="w-4 h-4 fill-white" /> Watch S1 E1
              </button>

              {trailerVideo && (
                <button
                  type="button"
                  onClick={() => openTrailer(tv, 'tv', trailerVideo.key)}
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center gap-2 border border-white/15 backdrop-blur-md transition-colors"
                >
                  <Youtube className="w-4 h-4 text-red-500" /> Watch Trailer
                </button>
              )}

              <button
                type="button"
                onClick={() => toggleWatchlist(tv, 'tv')}
                className={`px-5 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all ${
                  inWatchlist
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/15 text-white border border-white/15'
                }`}
              >
                {inWatchlist ? <Check className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                <span>{inWatchlist ? 'In My List' : 'Add to List'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                title="Copy link"
                className="p-3.5 rounded-full bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white border border-white/15 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Seasons & Episodes Fast Streamer */}
      <section className="space-y-4">
        <SeasonEpisodeSelector
          tvItem={tv}
          currentSeason={1}
          currentEpisode={1}
          showServerSelector={true}
          onSelectEpisode={(s, ep, srvIdx) => {
            openPlayer(tv, 'tv', s, ep);
          }}
          variant="page"
        />
      </section>

      {/* Seasons Overview Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-2xl font-black text-white">All Seasons Directory</h2>
          </div>
          <span className="text-xs text-zinc-400 font-semibold">
            {tv.seasons?.filter((s) => s.season_number > 0).length || 1} Total Seasons
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tv.seasons && tv.seasons.length > 0 ? (
            tv.seasons
              .filter((s) => s.season_number > 0)
              .map((s) => (
                <a
                  key={s.id}
                  href={`/tv/${slug}/season/${s.season_number}`}
                  className="p-4 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/10 hover:border-cyan-500/50 transition-all group flex gap-4 items-center"
                >
                  <div className="w-16 h-24 rounded-lg bg-zinc-950 overflow-hidden shrink-0">
                    <img
                      src={
                        s.poster_path
                          ? `${TMDB_IMAGE.W300}${s.poster_path}`
                          : posterUrl
                      }
                      alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {s.name}
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium">
                      {s.episode_count} Episodes • {s.air_date ? s.air_date.split('-')[0] : 'N/A'}
                    </p>
                    <span className="text-xs text-cyan-400 font-bold flex items-center gap-1 pt-1">
                      Explore Season Guide <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </a>
              ))
          ) : (
            <div className="text-zinc-500 text-sm">No season breakdown available.</div>
          )}
        </div>
      </section>

      {/* Cast & Crew */}
      {tv.credits?.cast && tv.credits.cast.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            <h2 className="text-2xl font-black text-white">Cast Roster</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tv.credits.cast.slice(0, 12).map((cast) => (
              <div
                key={cast.id}
                className="p-3 rounded-xl bg-zinc-900/50 border border-white/5 space-y-2 text-center"
              >
                <img
                  src={
                    cast.profile_path
                      ? `${TMDB_IMAGE.W300}${cast.profile_path}`
                      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
                  }
                  alt={cast.name}
                  loading="lazy"
                  className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-white/10"
                />
                <div>
                  <h4 className="text-xs font-bold text-white truncate">{cast.name}</h4>
                  <p className="text-[11px] text-zinc-400 truncate">{cast.character}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommended for You / More Like This Horizontal List */}
      {(recommendations.length > 0 || loadingRecommendations) && (
        <ContentRow
          title="Recommended For You"
          items={recommendations}
          type="tv"
          isLoading={loadingRecommendations}
          showRank={false}
          icon={<Sparkles className="w-5 h-5 text-cyan-400" />}
          seeAllLink={`/genres/${mainGenre.toLowerCase()}`}
        />
      )}

      {/* Similar TV Series */}
      {tv.similar?.results && tv.similar.results.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tv className="w-5 h-5 text-cyan-400" />
              <h2 className="text-2xl font-black text-white">More Shows Like {name}</h2>
            </div>
            <a
              href={`/genres/${mainGenre.toLowerCase()}`}
              className="text-xs font-bold text-cyan-400 hover:text-white flex items-center gap-1"
            >
              More in {mainGenre} <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tv.similar.results
              .filter((i) => i.poster_path)
              .slice(0, 12)
              .map((sim) => (
                <MediaCard key={sim.id} item={sim} type="tv" />
              ))}
          </div>
        </section>
      )}
    </div>
  );
};
