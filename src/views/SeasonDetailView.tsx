import React, { useEffect, useState } from 'react';
import { tmdb, TMDB_IMAGE, extractIdFromSlug, SERVERS } from '../services/tmdb';
import { SEO, updateHeadTags, getOrigin } from '../services/seo';
import { MediaItem, SeasonDetail } from '../types';
import { useApp } from '../context/AppContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  Play,
  Calendar,
  Star,
  Layers,
  ArrowLeft,
  ArrowRight,
  Tv,
  Search,
  Server,
  Zap,
} from 'lucide-react';

interface SeasonDetailViewProps {
  slug: string;
  seasonNumber: string;
}

export const SeasonDetailView: React.FC<SeasonDetailViewProps> = ({ slug, seasonNumber }) => {
  const { openPlayer } = useApp();
  const seasonNum = parseInt(seasonNumber || '1', 10);

  const [tv, setTv] = useState<MediaItem | null>(null);
  const [season, setSeason] = useState<SeasonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServerIdx, setSelectedServerIdx] = useState(0);

  useEffect(() => {
    // Set immediate readable title and canonical tag
    updateHeadTags(SEO.getInitialSeasonSEO(slug, seasonNum, getOrigin()));

    const loadSeasonData = async () => {
      setLoading(true);
      try {
        const tvData = await tmdb.resolveItemBySlug(slug, 'tv');
        if (tvData) {
          setTv(tvData);
          const seasonData = await tmdb.getSeason(tvData.id, seasonNum);
          setSeason(seasonData);
          updateHeadTags(SEO.getSeasonSEO(tvData, seasonData, getOrigin(), slug));
        } else {
          updateHeadTags(SEO.get404SEO(getOrigin()));
        }
      } catch (err) {
        console.error('Season load error', err);
        updateHeadTags(SEO.get404SEO(getOrigin()));
      } finally {
        setLoading(false);
      }
    };

    loadSeasonData();
  }, [slug, seasonNum]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-64 bg-zinc-800 rounded-md" />
        <div className="h-96 w-full bg-zinc-900 rounded-3xl" />
      </div>
    );
  }

  if (!tv || !season) {
    return (
      <div className="text-center py-24 space-y-4">
        <Tv className="w-16 h-16 text-zinc-600 mx-auto" />
        <h1 className="text-2xl font-black text-white">Season Not Found</h1>
        <a
          href={`/tv/${slug}`}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs"
        >
          Back to Show Overview
        </a>
      </div>
    );
  }

  const showName = tv.name || 'TV Series';
  const totalSeasons = tv.number_of_seasons || 1;

  const filteredEpisodes = (season.episodes || []).filter((ep) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      ep.name.toLowerCase().includes(q) ||
      ep.overview.toLowerCase().includes(q) ||
      String(ep.episode_number) === q
    );
  });

  return (
    <div className="space-y-10">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { name: 'TV Shows', url: '/tv-shows' },
          { name: showName, url: `/tv/${slug}` },
          { name: `Season ${seasonNum}`, url: `/tv/${slug}/season/${seasonNum}` },
        ]}
      />

      {/* Season Presentation Header */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-950/90 border border-white/10 flex flex-col md:flex-row gap-6 items-start">
        {season.poster_path && (
          <img
            src={`${TMDB_IMAGE.W300}${season.poster_path}`}
            alt={`${showName} Season ${seasonNum}`}
            className="w-36 aspect-[2/3] rounded-xl object-cover border border-white/15 shrink-0 shadow-lg"
          />
        )}

        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <a href={`/tv/${slug}`} className="hover:underline">
              {showName}
            </a>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {showName} — Season {seasonNum}
          </h1>

          <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300 font-semibold flex-wrap">
            <span>{season.episodes?.length || 0} Episodes</span>
            <span>•</span>
            <span>Air Date: {season.air_date || 'N/A'}</span>
          </div>

          <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
            {season.overview || `Episode guide and overview for ${showName} Season ${seasonNum}. Stream episodes and view release dates.`}
          </p>

          {/* Quick Season Navigation Buttons */}
          <div className="flex items-center gap-2 pt-3 flex-wrap">
            {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((sNum) => (
              <a
                key={`s-jump-${sNum}`}
                href={`/tv/${slug}/season/${sNum}`}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                  sNum === seasonNum
                    ? 'bg-cyan-500 text-white border-cyan-400 shadow-sm'
                    : 'bg-white/5 hover:bg-white/15 text-zinc-300 border-white/10'
                }`}
              >
                Season {sNum}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Episodes List Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-black text-white">Episodes in Season {seasonNum}</h2>
            <p className="text-xs text-zinc-400 font-medium">Select any episode to begin streaming in HD</p>
          </div>

          {/* Search Episode input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search episode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredEpisodes.length > 0 ? (
            filteredEpisodes.map((ep) => (
              <div
                key={ep.id}
                className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-white/10 flex flex-col md:flex-row gap-5 items-start sm:items-center justify-between group hover:border-cyan-500/40 transition-colors"
              >
                {/* Thumbnail still */}
                <div className="relative w-full md:w-56 aspect-video rounded-xl bg-zinc-950 overflow-hidden shrink-0">
                  <img
                    src={
                      ep.still_path
                        ? `${TMDB_IMAGE.W500}${ep.still_path}`
                        : 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop&q=80'
                    }
                    alt={`Episode ${ep.episode_number}: ${ep.name}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-black text-cyan-400">
                    EP {ep.episode_number}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {ep.episode_number}. {ep.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {ep.air_date || 'N/A'}
                    </span>
                    {ep.runtime && <span>• {ep.runtime} min</span>}
                    {ep.vote_average > 0 && (
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400" /> {ep.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                    {ep.overview || 'No episode description available.'}
                  </p>
                </div>

                {/* Play CTA */}
                <div className="flex flex-col gap-2 shrink-0 self-start md:self-center">
                  <button
                    type="button"
                    onClick={() => openPlayer(tv, 'tv', seasonNum, ep.episode_number)}
                    className="px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs flex items-center gap-2 transition-transform hover:scale-105 shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Watch S{seasonNum} E{ep.episode_number}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-zinc-500 text-sm py-8 text-center">No episodes match your search query.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SeasonDetailView;
