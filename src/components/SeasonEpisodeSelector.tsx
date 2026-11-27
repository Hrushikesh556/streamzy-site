import React, { useState, useEffect } from 'react';
import { MediaItem, SeasonDetail, EpisodeItem, SeasonSummary } from '../types';
import { tmdb, TMDB_IMAGE, SERVERS } from '../services/tmdb';
import { EpisodeGridSkeleton } from './SkeletonLoaders';
import { LazyImage } from './LazyImage';
import { useApp } from '../context/AppContext';
import {
  Play,
  Layers,
  Search,
  Calendar,
  Clock,
  Star,
  ChevronDown,
  LayoutGrid,
  List,
  Sparkles,
  Server,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface SeasonEpisodeSelectorProps {
  tvItem: MediaItem;
  currentSeason?: number;
  currentEpisode?: number;
  onSelectEpisode?: (seasonNumber: number, episodeNumber: number, serverIndex?: number) => void;
  showServerSelector?: boolean;
  selectedServerIndex?: number;
  onSelectServer?: (serverIndex: number) => void;
  variant?: 'modal' | 'embedded' | 'page';
}

export const SeasonEpisodeSelector: React.FC<SeasonEpisodeSelectorProps> = ({
  tvItem,
  currentSeason = 1,
  currentEpisode = 1,
  onSelectEpisode,
  showServerSelector = false,
  selectedServerIndex = 0,
  onSelectServer,
  variant = 'embedded',
}) => {
  const { openPlayer, setPlayerEpisode, setPlayerServer } = useApp();

  // Normalize seasons list
  const seasons: SeasonSummary[] = (tvItem.seasons && tvItem.seasons.length > 0
    ? tvItem.seasons.filter((s) => s.season_number > 0)
    : Array.from({ length: tvItem.number_of_seasons || 1 }, (_, i) => ({
        id: i + 1,
        season_number: i + 1,
        name: `Season ${i + 1}`,
        episode_count: 10,
        overview: '',
        poster_path: tvItem.poster_path,
        air_date: tvItem.first_air_date || null,
      }))) as SeasonSummary[];

  const [activeSeason, setActiveSeason] = useState<number>(currentSeason || 1);
  const [seasonDetail, setSeasonDetail] = useState<SeasonDetail | null>(null);
  const [loadingEpisodes, setLoadingEpisodes] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'cards' | 'grid'>('cards');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync active season when currentSeason prop changes
  useEffect(() => {
    if (currentSeason && currentSeason > 0) {
      setActiveSeason(currentSeason);
    }
  }, [currentSeason]);

  // Fetch season episodes whenever activeSeason or tvItem.id changes
  useEffect(() => {
    let isMounted = true;
    const fetchEpisodes = async () => {
      setLoadingEpisodes(true);
      try {
        const data = await tmdb.getSeason(tvItem.id, activeSeason);
        if (isMounted) {
          setSeasonDetail(data);
        }
      } catch (err) {
        console.warn(`Failed to fetch season ${activeSeason} episodes for show ${tvItem.id}`, err);
        // Fallback dummy episodes if TMDB season endpoint fails
        if (isMounted) {
          const matchedSummary = seasons.find((s) => s.season_number === activeSeason);
          const count = matchedSummary?.episode_count || 12;
          const dummyEpisodes: EpisodeItem[] = Array.from({ length: count }, (_, i) => ({
            id: Number(`${tvItem.id}${activeSeason}${i + 1}`),
            name: `Episode ${i + 1}`,
            overview: `Stream Season ${activeSeason} Episode ${i + 1} of ${tvItem.name || 'series'}.`,
            episode_number: i + 1,
            season_number: activeSeason,
            air_date: matchedSummary?.air_date || null,
            still_path: tvItem.backdrop_path || tvItem.poster_path,
            vote_average: tvItem.vote_average || 8.0,
            runtime: 45,
          }));
          setSeasonDetail({
            id: activeSeason,
            name: `Season ${activeSeason}`,
            overview: '',
            poster_path: matchedSummary?.poster_path || tvItem.poster_path,
            season_number: activeSeason,
            air_date: matchedSummary?.air_date || null,
            episodes: dummyEpisodes,
          });
        }
      } finally {
        if (isMounted) setLoadingEpisodes(false);
      }
    };

    fetchEpisodes();
    return () => {
      isMounted = false;
    };
  }, [tvItem.id, activeSeason]);

  const handleEpisodeClick = (seasonNum: number, episodeNum: number) => {
    if (onSelectEpisode) {
      onSelectEpisode(seasonNum, episodeNum, selectedServerIndex);
    } else {
      openPlayer(tvItem, 'tv', seasonNum, episodeNum);
    }
  };

  const filteredEpisodes = (seasonDetail?.episodes || []).filter((ep) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      ep.name.toLowerCase().includes(query) ||
      ep.overview.toLowerCase().includes(query) ||
      String(ep.episode_number) === query ||
      `ep ${ep.episode_number}`.includes(query) ||
      `episode ${ep.episode_number}`.includes(query)
    );
  });

  const activeSeasonSummary = seasons.find((s) => s.season_number === activeSeason);

  return (
    <div
      className={`rounded-2xl border transition-all ${
        variant === 'modal'
          ? 'bg-zinc-950/80 border-white/10 p-4 sm:p-5'
          : variant === 'page'
          ? 'bg-zinc-900/60 border-white/10 p-6 sm:p-8 shadow-xl'
          : 'bg-zinc-900/40 border-white/10 p-5 sm:p-6'
      }`}
    >
      {/* Top Header & Season Selector Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-sm sm:text-base">
            <Layers className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>Select Season & Episode</span>
          </div>

          {/* Season Dropdown on Small Screens / Quick Select */}
          <div className="relative inline-block">
            <select
              value={activeSeason}
              onChange={(e) => setActiveSeason(Number(e.target.value))}
              aria-label="Select Season"
              className="appearance-none bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs sm:text-sm pl-4 pr-9 py-2 rounded-xl border border-white/15 focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer shadow-sm"
            >
              {seasons.map((s) => (
                <option key={`season-opt-${s.season_number}`} value={s.season_number} className="bg-zinc-900 text-white">
                  {s.name || `Season ${s.season_number}`} ({s.episode_count || 'All'} Episodes)
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* View Mode & Search Filter */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Episode search input */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search episode # or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/80 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Toggle between Detailed Cards and Compact Grid */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              title="Detailed Cards View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'cards' ? 'bg-cyan-500 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Compact Number Grid View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-cyan-500 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Season Pills (Quick 1-Click Season Switch) */}
      <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar border-b border-white/5">
        {seasons.map((s) => {
          const isSelected = s.season_number === activeSeason;
          return (
            <button
              key={`season-pill-${s.season_number}`}
              type="button"
              onClick={() => setActiveSeason(s.season_number)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-zinc-800/60 hover:bg-zinc-700/80 text-zinc-300 border-white/10 hover:border-white/20'
              }`}
            >
              <span>Season {s.season_number}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-black/30 text-cyan-100' : 'bg-black/40 text-zinc-400'
                }`}
              >
                {s.episode_count || 'Ep'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Server selector strip if enabled */}
      {showServerSelector && (
        <div className="py-3 flex items-center gap-2 flex-wrap border-b border-white/5">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span>Server:</span>
          </span>
          {SERVERS.map((srv, idx) => {
            const isCurrent = (selectedServerIndex ?? 0) === idx;
            return (
              <button
                key={`srv-pick-${srv.name}`}
                type="button"
                onClick={() => onSelectServer?.(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  isCurrent
                    ? 'bg-cyan-500 text-white border-cyan-400 shadow-sm'
                    : 'bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 border-white/10'
                }`}
              >
                <span>{srv.name}</span>
                <span className="text-[10px] opacity-75 font-mono">({srv.quality})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Episodes Content Section */}
      <div className="pt-4">
        {loadingEpisodes ? (
          <EpisodeGridSkeleton />
        ) : filteredEpisodes.length === 0 ? (
          <div className="text-center py-10 space-y-2 text-zinc-400">
            <p className="text-sm font-semibold">No episodes match your search query.</p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-cyan-400 hover:underline font-bold"
            >
              Clear filter
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Compact Number Grid View */
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5">
            {filteredEpisodes.map((ep) => {
              const isPlaying = activeSeason === currentSeason && ep.episode_number === currentEpisode;
              return (
                <button
                  key={`ep-grid-${ep.id}-${ep.episode_number}`}
                  type="button"
                  onClick={() => handleEpisodeClick(activeSeason, ep.episode_number)}
                  className={`p-2.5 rounded-xl text-center font-bold transition-all relative group border flex flex-col items-center justify-center gap-0.5 ${
                    isPlaying
                      ? 'bg-cyan-500 text-white border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)] ring-2 ring-cyan-400'
                      : 'bg-zinc-800/60 hover:bg-zinc-700/90 text-zinc-200 border-white/10 hover:border-cyan-500/40'
                  }`}
                >
                  <span className="text-xs">EP</span>
                  <span className="text-base font-black">{ep.episode_number}</span>
                  {isPlaying ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  ) : (
                    <Play className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          /* Detailed Cards View */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredEpisodes.map((ep) => {
              const isPlaying = activeSeason === currentSeason && ep.episode_number === currentEpisode;
              const stillUrl = ep.still_path
                ? `${TMDB_IMAGE.W500}${ep.still_path}`
                : tvItem.backdrop_path
                ? `${TMDB_IMAGE.W500}${tvItem.backdrop_path}`
                : 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop&q=80';

              const runtimeStr = ep.runtime ? `${ep.runtime} min` : '45 min';

              return (
                <div
                  key={`ep-card-${ep.id}-${ep.episode_number}`}
                  onClick={() => handleEpisodeClick(activeSeason, ep.episode_number)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleEpisodeClick(activeSeason, ep.episode_number);
                    }
                  }}
                  className={`p-3 rounded-xl border transition-all text-left flex gap-3.5 items-start cursor-pointer group ${
                    isPlaying
                      ? 'bg-zinc-800/90 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                      : 'bg-zinc-800/40 hover:bg-zinc-800/70 border-white/10 hover:border-cyan-500/40'
                  }`}
                >
                  {/* Episode Still with play overlay */}
                  <div className="relative w-28 sm:w-32 aspect-video rounded-lg overflow-hidden bg-zinc-950 shrink-0 border border-white/10">
                    <LazyImage
                      src={stillUrl}
                      alt={ep.name}
                      wrapperClassName="w-full h-full"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                        isPlaying
                          ? 'bg-cyan-900/60 opacity-100'
                          : 'bg-black/40 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {isPlaying ? (
                        <div className="flex items-center gap-1">
                          <span className="w-1 h-3 bg-white animate-pulse" />
                          <span className="w-1 h-4 bg-white animate-pulse delay-75" />
                          <span className="w-1 h-2 bg-white animate-pulse delay-150" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                          <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                        </div>
                      )}
                    </div>

                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-mono text-zinc-300">
                      {runtimeStr}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-extrabold text-cyan-400 uppercase tracking-wider">
                        Episode {ep.episode_number}
                      </span>
                      {isPlaying && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                          Playing
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {ep.name || `Episode ${ep.episode_number}`}
                    </h4>

                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {ep.overview || 'Stream this episode in full HD quality with multi-server options.'}
                    </p>

                    {ep.air_date && (
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium pt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{ep.air_date}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeasonEpisodeSelector;
