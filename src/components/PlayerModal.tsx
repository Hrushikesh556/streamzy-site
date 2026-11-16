import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SERVERS, TMDB_IMAGE, createSlug } from '../services/tmdb';
import {
  X,
  Play,
  Heart,
  Check,
  Share2,
  Copy,
  Star,
  Server,
  Film,
  Clock,
  Zap,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SeasonEpisodeSelector } from './SeasonEpisodeSelector';

export const PlayerModal: React.FC = () => {
  const {
    playerState,
    closePlayer,
    setPlayerServer,
    setPlayerEpisode,
    isInWatchlist,
    toggleWatchlist,
    showToast,
    openPlayer,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'episodes' | 'overview' | 'cast' | 'similar'>('overview');
  const [reloadKey, setReloadKey] = useState(0);

  if (!playerState.isOpen || !playerState.item) return null;

  const { item, type, serverIndex, season, episode, isTrailer, trailerKey } = playerState;
  const title = item.title || item.name || 'Untitled';
  const year = (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A';
  const inWatchlist = isInWatchlist(item.id);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'NR';
  const runtimeStr = item.runtime ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}m` : null;

  // Compute player URL
  let embedUrl = '';
  if (isTrailer && trailerKey) {
    embedUrl = `https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1`;
  } else {
    const currentServer = SERVERS[serverIndex] || SERVERS[0];
    embedUrl =
      type === 'movie'
        ? currentServer.movie(item.id)
        : currentServer.tv(item.id, season, episode);
  }

  const handleCopyLink = () => {
    const slug = createSlug(item);
    const fullUrl = `${window.location.origin}/${type === 'tv' ? 'tv' : 'movie'}/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    showToast('Direct link copied to clipboard!', 'info');
  };

  const handleShareTwitter = () => {
    const slug = createSlug(item);
    const fullUrl = `${window.location.origin}/${type === 'tv' ? 'tv' : 'movie'}/${slug}`;
    const text = encodeURIComponent(`Watch "${title}" (${year}) on Streamzy!`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(fullUrl)}`, '_blank');
  };

  const handlePrevEpisode = () => {
    if (episode > 1) {
      setPlayerEpisode(season, episode - 1);
      showToast(`Switched to Season ${season} Episode ${episode - 1}`, 'info');
    }
  };

  const handleNextEpisode = () => {
    setPlayerEpisode(season, episode + 1);
    showToast(`Switched to Season ${season} Episode ${episode + 1}`, 'info');
  };

  const handleReloadPlayer = () => {
    setReloadKey((prev) => prev + 1);
    showToast('Refreshing player stream...', 'info');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="player-modal-title"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Top Header Bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-[#0a0a0f]/95 border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3 truncate max-w-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
          <div className="truncate">
            <h2 id="player-modal-title" className="text-base sm:text-lg font-black text-white truncate flex items-center gap-2">
              <span>{isTrailer ? `Trailer: ${title}` : title}</span>
              {type === 'tv' && !isTrailer && (
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
                  S{season} E{episode}
                </span>
              )}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Reload Stream button */}
          {!isTrailer && (
            <button
              type="button"
              onClick={handleReloadPlayer}
              title="Reload / Refresh Stream"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={closePlayer}
            aria-label="Close player"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-transform hover:rotate-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Video Player Frame Container */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-white/10">
          <iframe
            key={`stream-frame-${reloadKey}-${serverIndex}-${season}-${episode}`}
            src={embedUrl}
            title={`${title} stream player`}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="w-full h-full border-0"
          />
        </div>

        {/* Server & TV Fast Controls Bar */}
        {!isTrailer && (
          <div className="space-y-3">
            {/* Top Server Selection Strip */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    Streaming Servers ({SERVERS.length})
                  </span>
                  <span className="text-[11px] text-zinc-400 hidden sm:inline">
                    • Switch if current server is slow
                  </span>
                </div>

                {/* TV Series Fast Prev / Next Controls */}
                {type === 'tv' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrevEpisode}
                      disabled={episode <= 1}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all ${
                        episode <= 1
                          ? 'opacity-40 cursor-not-allowed bg-zinc-800 text-zinc-500 border-transparent'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-white border-white/10'
                      }`}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev Ep</span>
                    </button>

                    <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-1 rounded-lg">
                      S{season}:E{episode}
                    </span>

                    <button
                      type="button"
                      onClick={handleNextEpisode}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400 flex items-center gap-1 transition-all shadow-sm"
                    >
                      <span>Next Ep</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* 8 Streaming Server Options */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {SERVERS.map((srv, idx) => {
                  const isSelected = serverIndex === idx;
                  return (
                    <button
                      key={srv.name}
                      type="button"
                      onClick={() => setPlayerServer(idx)}
                      className={`p-2 rounded-xl text-left transition-all border relative flex flex-col justify-between gap-1 group ${
                        isSelected
                          ? 'bg-gradient-to-b from-cyan-500/20 to-blue-600/30 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                          : 'bg-zinc-950/60 hover:bg-zinc-800/80 text-zinc-300 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black truncate">{srv.name}</span>
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'
                          }`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-cyan-400 font-bold">{srv.quality}</span>
                        <span className="text-zinc-400">{srv.badge}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Title, Metadata & Social Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{title}</h1>
            <div className="flex items-center gap-3 text-sm text-zinc-400 mt-1 flex-wrap font-medium">
              <span>{year}</span>
              <span>•</span>
              <span className="uppercase text-cyan-400 font-bold">{type}</span>
              {runtimeStr && (
                <>
                  <span>•</span>
                  <span>{runtimeStr}</span>
                </>
              )}
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {rating}
              </span>
            </div>
          </div>

          {/* Social and Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleWatchlist(item, type)}
              className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all ${
                inWatchlist
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              }`}
            >
              {inWatchlist ? <Check className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
              <span>{inWatchlist ? 'In My List' : 'Add to List'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy link"
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors border border-white/15"
            >
              <Copy className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleShareTwitter}
              title="Share on Twitter"
              className="p-2.5 rounded-full bg-white/10 hover:bg-[#1DA1F2] text-zinc-300 hover:text-white transition-colors border border-white/15"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabbed Info View: Episodes / Overview / Cast / Similar */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 flex-wrap">
            {type === 'tv' && (
              <button
                type="button"
                onClick={() => setActiveTab('episodes')}
                className={`py-2 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'episodes'
                    ? 'border-cyan-400 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Seasons & Episodes</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-cyan-400 text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Story & Info
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cast')}
              className={`py-2 px-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'cast'
                  ? 'border-cyan-400 text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Cast & Crew
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('similar')}
              className={`py-2 px-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'similar'
                  ? 'border-cyan-400 text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Similar Titles
            </button>
          </div>

          {/* Tab Panes */}
          {activeTab === 'episodes' && type === 'tv' && (
            <div className="py-2">
              <SeasonEpisodeSelector
                tvItem={item}
                currentSeason={season}
                currentEpisode={episode}
                onSelectEpisode={(s, ep) => {
                  setPlayerEpisode(s, ep);
                  showToast(`Now playing S${s} E${ep}`, 'success');
                }}
                variant="modal"
              />
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
              <p>{item.overview || 'No synopsis available.'}</p>
              {item.genres && item.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {item.genres.map((g) => (
                    <a
                      key={g.id}
                      href={`/genres/${g.name.toLowerCase()}`}
                      className="px-3 py-1 rounded-full bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 text-xs font-semibold border border-white/10 text-zinc-300 transition-colors"
                    >
                      {g.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'cast' && (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {item.credits?.cast && item.credits.cast.length > 0 ? (
                item.credits.cast.slice(0, 12).map((cast) => (
                  <div key={cast.id} className="shrink-0 w-24 text-center space-y-2">
                    <img
                      src={
                        cast.profile_path
                          ? `${TMDB_IMAGE.W300}${cast.profile_path}`
                          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
                      }
                      alt={cast.name}
                      className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-white/10"
                    />
                    <div className="text-xs font-bold text-white truncate">{cast.name}</div>
                    <div className="text-[10px] text-zinc-400 truncate">{cast.character}</div>
                  </div>
                ))
              ) : (
                <div className="text-zinc-500 text-sm">Cast information not available.</div>
              )}
            </div>
          )}

          {activeTab === 'similar' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {item.similar?.results && item.similar.results.length > 0 ? (
                item.similar.results.slice(0, 6).map((sim) => (
                  <button
                    key={sim.id}
                    onClick={() => openPlayer(sim, type)}
                    className="text-left group space-y-1.5"
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 border border-white/10 group-hover:border-cyan-500 transition-colors">
                      <img
                        src={`${TMDB_IMAGE.W300}${sim.poster_path}`}
                        alt={sim.title || sim.name || 'Poster'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="text-xs font-bold text-white truncate group-hover:text-cyan-400">
                      {sim.title || sim.name}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-zinc-500 text-sm col-span-full">No similar titles available.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;

