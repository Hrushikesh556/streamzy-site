import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MediaItem, WatchlistItem, ContinueWatchItem } from '../types';

interface ToastInfo {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface PlayerState {
  isOpen: boolean;
  item: MediaItem | null;
  type: 'movie' | 'tv';
  serverIndex: number;
  season: number;
  episode: number;
  isTrailer: boolean;
  trailerKey?: string;
}

interface AppContextType {
  watchlist: WatchlistItem[];
  continueWatch: ContinueWatchItem[];
  recentSearches: string[];
  addToWatchlist: (item: MediaItem, type: 'movie' | 'tv') => void;
  removeFromWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
  toggleWatchlist: (item: MediaItem, type: 'movie' | 'tv') => void;
  addContinueWatch: (item: MediaItem, type: 'movie' | 'tv', season?: number, episode?: number) => void;
  removeContinueWatch: (id: number) => void;
  clearContinueWatch: () => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  playerState: PlayerState;
  openPlayer: (item: MediaItem, type?: 'movie' | 'tv', season?: number, episode?: number) => void;
  openTrailer: (item: MediaItem, type?: 'movie' | 'tv', key?: string) => void;
  closePlayer: () => void;
  setPlayerServer: (idx: number) => void;
  setPlayerEpisode: (season: number, episode: number) => void;
  quickViewItem: { item: MediaItem | null; type: 'movie' | 'tv'; isOpen: boolean };
  openQuickView: (item: MediaItem, type?: 'movie' | 'tv') => void;
  closeQuickView: () => void;
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  isBloggerExportOpen: boolean;
  setIsBloggerExportOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('fm_watchlist') || '[]');
    } catch {
      return [];
    }
  });

  const [continueWatch, setContinueWatch] = useState<ContinueWatchItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('fm_continue') || '[]');
    } catch {
      return [];
    }
  });

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('fm_searches') || '[]');
    } catch {
      return [];
    }
  });

  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [isBloggerExportOpen, setIsBloggerExportOpen] = useState(false);

  const [playerState, setPlayerState] = useState<PlayerState>({
    isOpen: false,
    item: null,
    type: 'movie',
    serverIndex: 0,
    season: 1,
    episode: 1,
    isTrailer: false,
  });

  const [quickViewItem, setQuickViewItem] = useState<{
    item: MediaItem | null;
    type: 'movie' | 'tv';
    isOpen: boolean;
  }>({
    item: null,
    type: 'movie',
    isOpen: false,
  });

  useEffect(() => {
    localStorage.setItem('fm_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('fm_continue', JSON.stringify(continueWatch));
  }, [continueWatch]);

  useEffect(() => {
    localStorage.setItem('fm_searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const isInWatchlist = (id: number) => {
    return watchlist.some((w) => w.id === id);
  };

  const addToWatchlist = (item: MediaItem, type: 'movie' | 'tv') => {
    if (isInWatchlist(item.id)) return;
    const title = item.title || item.name || 'Untitled';
    const year = (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A';
    const newItem: WatchlistItem = {
      id: item.id,
      type,
      title,
      poster_path: item.poster_path,
      vote_average: item.vote_average,
      year,
      addedAt: Date.now(),
    };
    setWatchlist((prev) => [newItem, ...prev]);
    showToast(`Added "${title}" to My List`, 'success');
  };

  const removeFromWatchlist = (id: number) => {
    const item = watchlist.find((w) => w.id === id);
    setWatchlist((prev) => prev.filter((w) => w.id !== id));
    if (item) {
      showToast(`Removed "${item.title}" from My List`, 'info');
    }
  };

  const toggleWatchlist = (item: MediaItem, type: 'movie' | 'tv') => {
    if (isInWatchlist(item.id)) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist(item, type);
    }
  };

  const addContinueWatch = (item: MediaItem, type: 'movie' | 'tv', season = 1, episode = 1) => {
    const title = item.title || item.name || 'Untitled';
    const randomProgress = Math.floor(Math.random() * 45) + 20; // 20% - 65% demo progress
    const newItem: ContinueWatchItem = {
      id: item.id,
      type,
      title,
      poster: item.poster_path || item.backdrop_path,
      progress: randomProgress,
      season,
      episode,
    };
    setContinueWatch((prev) => [newItem, ...prev.filter((c) => c.id !== item.id)].slice(0, 12));
  };

  const removeContinueWatch = (id: number) => {
    setContinueWatch((prev) => prev.filter((c) => c.id !== id));
    showToast('Removed from Continue Watching', 'info');
  };

  const clearContinueWatch = () => {
    setContinueWatch([]);
    showToast('Continue Watching history cleared', 'info');
  };

  const addRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => [trimmed, ...prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const openPlayer = (item: MediaItem, type: 'movie' | 'tv' = 'movie', season = 1, episode = 1) => {
    const resolvedType = (item.media_type as 'movie' | 'tv') || type;
    setPlayerState({
      isOpen: true,
      item,
      type: resolvedType,
      serverIndex: 0,
      season,
      episode,
      isTrailer: false,
    });
    setQuickViewItem((prev) => ({ ...prev, isOpen: false }));
    addContinueWatch(item, resolvedType, season, episode);
    document.body.style.overflow = 'hidden';
  };

  const openTrailer = (item: MediaItem, type: 'movie' | 'tv' = 'movie', key?: string) => {
    const resolvedType = (item.media_type as 'movie' | 'tv') || type;
    setPlayerState({
      isOpen: true,
      item,
      type: resolvedType,
      serverIndex: 0,
      season: 1,
      episode: 1,
      isTrailer: true,
      trailerKey: key,
    });
    setQuickViewItem((prev) => ({ ...prev, isOpen: false }));
    document.body.style.overflow = 'hidden';
  };

  const closePlayer = () => {
    setPlayerState((prev) => ({ ...prev, isOpen: false, item: null }));
    document.body.style.overflow = 'auto';
  };

  const setPlayerServer = (serverIndex: number) => {
    setPlayerState((prev) => ({ ...prev, serverIndex }));
  };

  const setPlayerEpisode = (season: number, episode: number) => {
    setPlayerState((prev) => ({ ...prev, season, episode }));
    if (playerState.item) {
      addContinueWatch(playerState.item, playerState.type, season, episode);
    }
  };

  const openQuickView = (item: MediaItem, type: 'movie' | 'tv' = 'movie') => {
    setQuickViewItem({
      item,
      type: (item.media_type as 'movie' | 'tv') || type,
      isOpen: true,
    });
    document.body.style.overflow = 'hidden';
  };

  const closeQuickView = () => {
    setQuickViewItem((prev) => ({ ...prev, isOpen: false }));
    document.body.style.overflow = 'auto';
  };

  return (
    <AppContext.Provider
      value={{
        watchlist,
        continueWatch,
        recentSearches,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        toggleWatchlist,
        addContinueWatch,
        removeContinueWatch,
        clearContinueWatch,
        addRecentSearch,
        clearRecentSearches,
        playerState,
        openPlayer,
        openTrailer,
        closePlayer,
        setPlayerServer,
        setPlayerEpisode,
        quickViewItem,
        openQuickView,
        closeQuickView,
        toasts,
        showToast,
        isBloggerExportOpen,
        setIsBloggerExportOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
