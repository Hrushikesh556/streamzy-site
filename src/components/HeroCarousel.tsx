import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MediaItem } from '../types';
import { tmdb, TMDB_IMAGE, createSlug, GENRE_MAP } from '../services/tmdb';
import { useApp } from '../context/AppContext';
import {
  Play,
  Info,
  Heart,
  Check,
  Star,
  ChevronLeft,
  ChevronRight,
  Pause,
  Sparkles,
  Flame,
  Volume2,
  Tv,
  Film,
  Zap,
} from 'lucide-react';

interface HeroCarouselProps {
  items?: MediaItem[];
  isHomeH1?: boolean;
  autoPlayInterval?: number;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  items: initialItems,
  isHomeH1 = true,
  autoPlayInterval = 6000,
}) => {
  const [slides, setSlides] = useState<MediaItem[]>(initialItems && initialItems.length > 0 ? initialItems.slice(0, 8) : []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialItems || initialItems.length === 0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const { isInWatchlist, toggleWatchlist, openPlayer, openTrailer } = useApp();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const [progress, setProgress] = useState(0);

  // Fetch trending movies if not supplied
  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      setSlides(initialItems.slice(0, 8));
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const fetchTrendingMovies = async () => {
      setIsLoading(true);
      try {
        const res = await tmdb.getTrending('movie', 'day', 1);
        if (isMounted && res.results && res.results.length > 0) {
          setSlides(res.results.slice(0, 8));
        } else {
          // Fallback to trending all week
          const fallbackRes = await tmdb.getTrending('all', 'week', 1);
          if (isMounted && fallbackRes.results) {
            setSlides(fallbackRes.results.slice(0, 8));
          }
        }
      } catch (err) {
        console.error('Failed to load hero trending movies:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchTrendingMovies();
    return () => {
      isMounted = false;
    };
  }, [initialItems]);

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [slides.length]);

  const goToSlide = (idx: number) => {
    if (idx === currentIndex) return;
    setCurrentIndex(idx);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  // Auto-play timer and smooth progress indicator
  useEffect(() => {
    if (slides.length <= 1 || !isPlaying || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    startTimeRef.current = Date.now();
    const updateFreq = 50; // update progress every 50ms

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / autoPlayInterval) * 100);
      setProgress(pct);

      if (elapsed >= autoPlayInterval) {
        nextSlide();
      }
    }, updateFreq);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, isPlaying, isHovered, currentIndex, autoPlayInterval, nextSlide]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  // Helper to map genre IDs to names
  const getGenreNames = (genreIds?: number[]): string[] => {
    if (!genreIds || genreIds.length === 0) return [];
    const idToName: Record<number, string> = {};
    Object.values(GENRE_MAP).forEach((g) => {
      idToName[g.id] = g.name;
    });
    return genreIds
      .map((id) => idToName[id])
      .filter(Boolean)
      .slice(0, 3);
  };

  if (isLoading) {
    return (
      <div className="relative w-full h-[62vh] min-h-[460px] max-h-[720px] rounded-2xl lg:rounded-3xl bg-zinc-900/60 border border-white/10 animate-pulse flex items-center justify-center mb-10 overflow-hidden">
        <div className="flex flex-col items-center gap-3 text-zinc-500">
          <Film className="w-10 h-10 animate-bounce text-cyan-400" />
          <span className="text-sm font-semibold tracking-wider uppercase text-zinc-400">Loading Trending Movies...</span>
        </div>
      </div>
    );
  }

  if (!slides || slides.length === 0) return null;

  const current = slides[currentIndex];
  const type = (current.media_type as 'movie' | 'tv') || 'movie';
  const title = current.title || current.name || 'Trending Movie';
  const releaseDate = current.release_date || current.first_air_date || '';
  const year = releaseDate ? releaseDate.split('-')[0] : '2026';
  const rating = current.vote_average ? current.vote_average.toFixed(1) : '8.5';
  const votesCount = current.vote_count ? current.vote_count.toLocaleString() : null;
  const inWatchlist = isInWatchlist(current.id);
  const slug = createSlug(current);
  const detailUrl = type === 'tv' ? `/tv/${slug}` : `/movie/${slug}`;
  const genres = getGenreNames(current.genre_ids);

  const backdropUrl = current.backdrop_path
    ? `${TMDB_IMAGE.ORIGINAL}${current.backdrop_path}`
    : current.poster_path
    ? `${TMDB_IMAGE.ORIGINAL}${current.poster_path}`
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600&auto=format&fit=crop&q=80';

  const posterUrl = current.poster_path
    ? `${TMDB_IMAGE.W500}${current.poster_path}`
    : null;

  return (
    <section
      aria-label="Trending Hero Carousel"
      className="relative w-full mb-10 select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Main Stage Frame */}
      <div className="relative w-full h-[65vh] min-h-[500px] max-h-[760px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl bg-zinc-950 border border-white/10">
        {/* Animated Background Art with Zoom */}
        <div
          key={`bg-${current.id}-${currentIndex}`}
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105 group-hover:scale-100 animate-in fade-in"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        >
          {/* Multi-layered cinematic gradient shadows for high legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-transparent w-full md:w-[75%] lg:w-[65%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-black/40" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-zinc-950/60" />
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14 z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end max-w-7xl">
            {/* Left Column: Badges, Title, Overview, CTAs */}
            <div className="lg:col-span-8 space-y-4 max-w-3xl">
              {/* Badges Bar */}
              <div className="flex items-center flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
                <span className="bg-gradient-to-r from-rose-600 to-red-600 text-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-red-400/30">
                  <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
                  <span>#{currentIndex + 1} Trending Today</span>
                </span>

                <span className="bg-zinc-900/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full">
                  {type === 'tv' ? 'TV Series' : 'Movie'}
                </span>

                <span className="bg-amber-400/10 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-full text-[11px] font-mono">
                  4K ULTRA HD
                </span>

                {genres.map((genre) => (
                  <span
                    key={genre}
                    className="hidden sm:inline-block bg-white/10 text-zinc-200 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] border border-white/10"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Title & SEO Heading */}
              {isHomeH1 ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-400 font-extrabold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Trending Now On Streamzy</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                    {title}
                  </h1>
                </div>
              ) : (
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                  {title}
                </h2>
              )}

              {/* Meta stats & Ratings */}
              <div className="flex items-center gap-3 text-sm text-zinc-300 font-semibold flex-wrap">
                <div className="flex items-center gap-1.5 text-amber-400 bg-black/50 px-3 py-1 rounded-full border border-amber-400/30 backdrop-blur-md shadow-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{rating}</span>
                  {votesCount && <span className="text-zinc-400 text-xs font-normal">({votesCount} votes)</span>}
                </div>

                <span className="text-zinc-500">•</span>
                <span className="text-zinc-200 font-medium">{year}</span>

                <span className="text-zinc-500">•</span>
                <span className="text-cyan-400 font-medium flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Fast Cloud Servers
                </span>
              </div>

              {/* Overview Synopsis */}
              <p className="text-sm sm:text-base text-zinc-300/90 leading-relaxed line-clamp-2 sm:line-clamp-3 max-w-2xl drop-shadow">
                {current.overview ||
                  'Stream the latest trending blockbuster movie with high quality multi-server mirrors, complete cast listings, full season guides, and official trailers.'}
              </p>

              {/* Primary Action Buttons */}
              <div className="flex items-center gap-3 pt-3 flex-wrap">
                {/* Watch Stream Button */}
                <button
                  type="button"
                  onClick={() => openPlayer(current, type)}
                  className="px-6 sm:px-7 py-3.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm sm:text-base flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(225,29,72,0.5)] border border-red-400/30"
                >
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                  <span>Stream Now</span>
                </button>

                {/* Watch Trailer Button */}
                <button
                  type="button"
                  onClick={() => openTrailer(current, type)}
                  className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center gap-2 backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95"
                  title="Play Official YouTube Trailer"
                >
                  <Film className="w-4 h-4 text-cyan-400" />
                  <span>Trailer</span>
                </button>

                {/* More Details Link */}
                <a
                  href={detailUrl}
                  className="px-5 py-3.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white font-bold text-sm flex items-center gap-2 backdrop-blur-md border border-zinc-700 transition-all hover:scale-105 active:scale-95"
                >
                  <Info className="w-4 h-4 text-zinc-400" />
                  <span>Details</span>
                </a>

                {/* Watchlist Toggle */}
                <button
                  type="button"
                  onClick={() => toggleWatchlist(current, type)}
                  title={inWatchlist ? 'Remove from My List' : 'Add to My List'}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                    inWatchlist
                      ? 'bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.6)] border border-cyan-400'
                      : 'bg-zinc-900/80 hover:bg-zinc-800 text-white border border-white/20 hover:border-white/40'
                  } backdrop-blur-md`}
                >
                  {inWatchlist ? <Check className="w-5 h-5" /> : <Heart className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Right Column: Floating Poster preview on large screens */}
            {posterUrl && (
              <div className="hidden lg:flex lg:col-span-4 justify-end items-end pb-2">
                <a
                  href={detailUrl}
                  className="relative group/poster block rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 transition-all duration-300 transform group-hover/poster:-translate-y-2 hover:border-cyan-400 max-w-[200px]"
                >
                  <img
                    src={posterUrl}
                    alt={title}
                    className="w-full h-auto object-cover aspect-[2/3]"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/poster:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <Play className="w-3.5 h-3.5 fill-white" /> View Movie
                    </span>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Carousel Arrow Controls (Left / Right) */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center border border-white/15 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 shadow-xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center border border-white/15 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 shadow-xl"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Top-Right Pause/Play Toggle & Slide Counter */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-30 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause Auto-Play' : 'Resume Auto-Play'}
            aria-label={isPlaying ? 'Pause Auto-Play' : 'Resume Auto-Play'}
            className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-zinc-300 hover:text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-all active:scale-90"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          </button>

          <div className="px-3 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-md text-xs font-mono text-zinc-300">
            <span className="font-bold text-white">{currentIndex + 1}</span> / {slides.length}
          </div>
        </div>

        {/* Bottom Slide Pagination Indicators & Live Progress Bar */}
        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-10 z-30 flex items-center gap-1.5 bg-black/60 p-2 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
          {slides.map((s, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={`dot-${s.id}-${idx}`}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Jump to slide ${idx + 1}: ${s.title || s.name || 'Movie'}`}
                className={`relative h-2 rounded-full transition-all overflow-hidden ${
                  isActive ? 'w-8 bg-zinc-700' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
              >
                {isActive && (
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-red-500 transition-all duration-75"
                    style={{ width: `${isPlaying && !isHovered ? progress : 100}%` }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Global Progress Bar at the very bottom edge of the banner */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-rose-500 to-red-600 transition-all duration-75"
            style={{
              width: `${((currentIndex + (isPlaying && !isHovered ? progress / 100 : 0)) / slides.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Thumbnail Bar on Desktop for quick browsing */}
      <div className="hidden md:grid grid-cols-8 gap-2 mt-3 px-1">
        {slides.map((slide, idx) => {
          const isSelected = idx === currentIndex;
          const thumbPoster = slide.poster_path ? `${TMDB_IMAGE.W300}${slide.poster_path}` : null;
          return (
            <button
              key={`thumb-${slide.id}-${idx}`}
              type="button"
              onClick={() => goToSlide(idx)}
              className={`relative rounded-xl overflow-hidden p-1.5 transition-all text-left flex items-center gap-2 border ${
                isSelected
                  ? 'bg-zinc-800/90 border-cyan-500 shadow-md ring-1 ring-cyan-500 scale-[1.02]'
                  : 'bg-zinc-900/40 hover:bg-zinc-800/50 border-white/5 opacity-60 hover:opacity-100'
              }`}
            >
              {thumbPoster && (
                <img
                  src={thumbPoster}
                  alt=""
                  className="w-7 h-10 object-cover rounded-md flex-shrink-0"
                  loading="lazy"
                />
              )}
              <div className="truncate flex-1 min-w-0">
                <p className="text-[11px] font-bold text-white truncate">{slide.title || slide.name}</p>
                <div className="flex items-center gap-1 text-[10px] text-amber-400">
                  <Star className="w-2.5 h-2.5 fill-amber-400" />
                  <span>{slide.vote_average ? slide.vote_average.toFixed(1) : '8.0'}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default HeroCarousel;
