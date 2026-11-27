import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../context/RouterContext';
import { useApp } from '../context/AppContext';
import { tmdb, createSlug } from '../services/tmdb';
import { MediaItem } from '../types';
import {
  Search,
  Mic,
  MicOff,
  Film,
  Tv,
  Flame,
  Star,
  Clock,
  Heart,
  ChevronDown,
  Layers,
  Sparkles,
  X,
  History,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { pathname, navigate } = useRouter();
  const { watchlist, addRecentSearch, recentSearches } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MediaItem[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBrowseMenuOpen, setIsBrowseMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search debounce
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await tmdb.searchMulti(searchQuery.trim(), 1);
        if (res && res.results) {
          setSuggestions(
            res.results
              .filter((i) => (i.media_type === 'movie' || i.media_type === 'tv') && i.poster_path)
              .slice(0, 6)
          );
        }
      } catch (err) {
        console.error('Search suggestion error', err);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside search
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    addRecentSearch(query);
    setIsSearchOpen(false);
    setMobileSearchActive(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      addRecentSearch(transcript);
      setIsSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(transcript)}`);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#060608]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl py-3'
          : 'bg-[#060608]/90 backdrop-blur-xl border-b border-white/10 shadow-md py-3.5'
      }`}
    >
      <div className="max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Main Nav */}
        <div className="flex items-center gap-6 lg:gap-8">
          <a
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="Streamzy Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(0,172,193,0.5)] group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 fill-white text-cyan-900" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                STREAM<span className="text-cyan-400">ZY</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold -mt-1 hidden sm:block">
                Free Streaming &amp; Guide
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-zinc-300">
            <a
              href="/"
              className={`px-3 py-1.5 rounded-full transition-colors ${
                pathname === '/' ? 'text-cyan-400 bg-cyan-500/10 font-bold' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </a>
            <a
              href="/movies"
              className={`px-3 py-1.5 rounded-full transition-colors ${
                pathname.startsWith('/movies') ? 'text-cyan-400 bg-cyan-500/10 font-bold' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              Movies
            </a>
            <a
              href="/tv-shows"
              className={`px-3 py-1.5 rounded-full transition-colors ${
                pathname.startsWith('/tv-shows') ? 'text-cyan-400 bg-cyan-500/10 font-bold' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              TV Shows
            </a>
            <a
              href="/trending"
              className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
                pathname === '/trending' ? 'text-cyan-400 bg-cyan-500/10 font-bold' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Trending
            </a>
            <a
              href="/top-rated"
              className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
                pathname === '/top-rated' ? 'text-cyan-400 bg-cyan-500/10 font-bold' : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-yellow-400" />
              Top Rated
            </a>

            {/* Categorized Browse Mega Dropdown */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => setIsBrowseMenuOpen(!isBrowseMenuOpen)}
                onMouseEnter={() => setIsBrowseMenuOpen(true)}
                className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1 text-zinc-300"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Browse
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </button>

              {/* Dropdown Menu */}
              {isBrowseMenuOpen && (
                <div
                  onMouseLeave={() => setIsBrowseMenuOpen(false)}
                  className="absolute top-full left-0 mt-2 w-[720px] bg-[#0e0e14] border border-white/10 rounded-2xl shadow-2xl p-6 grid grid-cols-4 gap-6 z-50 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  {/* Genres */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Genres
                    </h4>
                    <ul className="space-y-1.5 text-xs text-zinc-400">
                      <li><a href="/genres/action" className="hover:text-white hover:translate-x-1 transition-all block">Action Movies</a></li>
                      <li><a href="/genres/comedy" className="hover:text-white hover:translate-x-1 transition-all block">Comedy</a></li>
                      <li><a href="/genres/horror" className="hover:text-white hover:translate-x-1 transition-all block">Horror</a></li>
                      <li><a href="/genres/scifi" className="hover:text-white hover:translate-x-1 transition-all block">Sci-Fi & Fantasy</a></li>
                      <li><a href="/genres/drama" className="hover:text-white hover:translate-x-1 transition-all block">Drama</a></li>
                      <li><a href="/genres/animation" className="hover:text-white hover:translate-x-1 transition-all block">Animation / Anime</a></li>
                      <li><a href="/genres" className="text-cyan-400 font-bold hover:underline block pt-1">All Genres →</a></li>
                    </ul>
                  </div>

                  {/* Countries */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5" /> Regions
                    </h4>
                    <ul className="space-y-1.5 text-xs text-zinc-400">
                      <li><a href="/country/india" className="hover:text-white hover:translate-x-1 transition-all block">Indian Cinema</a></li>
                      <li><a href="/country/korea" className="hover:text-white hover:translate-x-1 transition-all block">Korean Drama (K-Drama)</a></li>
                      <li><a href="/country/usa" className="hover:text-white hover:translate-x-1 transition-all block">Hollywood / USA</a></li>
                      <li><a href="/country/japan" className="hover:text-white hover:translate-x-1 transition-all block">Japanese Anime / Cinema</a></li>
                      <li><a href="/country/uk" className="hover:text-white hover:translate-x-1 transition-all block">British Films</a></li>
                      <li><a href="/country/france" className="hover:text-white hover:translate-x-1 transition-all block">European Cinema</a></li>
                    </ul>
                  </div>

                  {/* Networks / Platforms */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                      <Tv className="w-3.5 h-3.5" /> Platforms
                    </h4>
                    <ul className="space-y-1.5 text-xs text-zinc-400">
                      <li><a href="/network/netflix" className="hover:text-white hover:translate-x-1 transition-all block">Netflix Originals</a></li>
                      <li><a href="/network/amazon-prime" className="hover:text-white hover:translate-x-1 transition-all block">Amazon Prime</a></li>
                      <li><a href="/network/disney-plus" className="hover:text-white hover:translate-x-1 transition-all block">Disney+</a></li>
                      <li><a href="/network/hbo" className="hover:text-white hover:translate-x-1 transition-all block">HBO Max</a></li>
                      <li><a href="/network/apple-tv-plus" className="hover:text-white hover:translate-x-1 transition-all block">Apple TV+</a></li>
                      <li><a href="/network/hulu" className="hover:text-white hover:translate-x-1 transition-all block">Hulu Series</a></li>
                    </ul>
                  </div>

                  {/* Years & Curated Collections */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Curated
                    </h4>
                    <ul className="space-y-1.5 text-xs text-zinc-400">
                      <li><a href="/year/2026" className="hover:text-white hover:translate-x-1 transition-all block font-semibold text-cyan-400">2026 New Releases</a></li>
                      <li><a href="/year/2025" className="hover:text-white hover:translate-x-1 transition-all block">2025 Hits</a></li>
                      <li><a href="/collections/marvel" className="hover:text-white hover:translate-x-1 transition-all block">Marvel Universe</a></li>
                      <li><a href="/collections/star-wars" className="hover:text-white hover:translate-x-1 transition-all block">Star Wars Saga</a></li>
                      <li><a href="/collections/harry-potter" className="hover:text-white hover:translate-x-1 transition-all block">Harry Potter World</a></li>
                      <li><a href="/collections" className="text-cyan-400 font-bold hover:underline block pt-1">All Franchises →</a></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right: Search Bar, Watchlist Counter, Netlify/Blogger Template export */}
        <div className="flex items-center gap-3">
          {/* Desktop Search Bar */}
          <div ref={searchContainerRef} className="relative hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="flex items-center bg-white/5 border border-white/10 focus-within:border-cyan-500 rounded-full px-3.5 py-1.5 w-64 lg:w-80 transition-all duration-300 focus-within:w-96 backdrop-blur-md">
                <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0 cursor-pointer" onClick={() => handleSearchSubmit()} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search movies, TV shows, actors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  className="bg-transparent border-none text-white text-sm focus:outline-none w-full placeholder-zinc-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-zinc-500 hover:text-zinc-300 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  title="Voice Search"
                  className={`ml-1.5 p-1 rounded-full text-zinc-400 hover:text-cyan-400 transition-colors ${
                    isListening ? 'text-red-500 animate-pulse' : ''
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
            </form>

            {/* Search Suggestions Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-full right-0 mt-2 w-96 max-w-[90vw] bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in duration-200">
                {/* Live autocomplete results */}
                {suggestions.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-[10px] font-black uppercase tracking-wider text-zinc-400 border-b border-white/5">
                      Top Matches
                    </div>
                    <div className="divide-y divide-white/5">
                      {suggestions.map((item) => {
                        const slug = createSlug(item);
                        const url = item.media_type === 'tv' ? `/tv/${slug}` : `/movie/${slug}`;
                        const year = (item.release_date || item.first_air_date || '').split('-')[0];
                        return (
                          <a
                            key={item.id}
                            href={url}
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors"
                          >
                            <img
                              src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                              alt={item.title || item.name || 'Poster'}
                              loading="lazy"
                              decoding="async"
                              width={40}
                              height={56}
                              className="w-10 h-14 object-cover rounded-md shrink-0 bg-zinc-800"
                            />
                            <div className="min-w-0 flex-1">
                              <h5 className="text-sm font-bold text-white truncate">
                                {item.title || item.name}
                              </h5>
                              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                                <span className="bg-cyan-500/20 text-cyan-400 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                                  {item.media_type}
                                </span>
                                <span>{year}</span>
                                <span className="text-amber-400 font-semibold">★ {item.vote_average?.toFixed(1)}</span>
                              </div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="p-3 bg-zinc-900/40 border-t border-white/5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1">
                      <History className="w-3 h-3" /> Recent Searches
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSearchQuery(term);
                            navigate(`/search?q=${encodeURIComponent(term)}`);
                            setIsSearchOpen(false);
                          }}
                          className="text-xs bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 text-zinc-300 px-2.5 py-1 rounded-full transition-colors border border-white/5"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Search Icon Toggle */}
          <button
            type="button"
            onClick={() => setMobileSearchActive(!mobileSearchActive)}
            className="sm:hidden p-2 rounded-full bg-white/5 text-zinc-300 hover:text-white"
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* My List / Watchlist Button */}
          <a
            href="/watchlist"
            className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors"
            title="My Watchlist"
          >
            <Heart className={`w-4 h-4 ${watchlist.length > 0 ? 'text-red-400 fill-red-400' : ''}`} />
            {watchlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                {watchlist.length}
              </span>
            )}
          </a>
        </div>
      </div>

      {/* Mobile Search Overlay Bar */}
      {mobileSearchActive && (
        <div className="sm:hidden px-4 pt-3 pb-2 bg-[#0a0a0f] border-b border-white/10 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              autoFocus
              placeholder="Search movies & shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-white/15 rounded-full pl-4 pr-10 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="absolute right-3 text-cyan-400 p-1"
              aria-label="Submit search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
};
