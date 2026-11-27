import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from '../context/RouterContext';
import { tmdb, GENRE_MAP } from '../services/tmdb';
import { SEO, updateHeadTags, getOrigin } from '../services/seo';
import { MediaItem } from '../types';
import { MediaCard } from '../components/MediaCard';
import { MediaGridSkeleton } from '../components/SkeletonLoaders';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Pagination } from '../components/Pagination';
import {
  Film,
  Filter,
  SlidersHorizontal,
  Star,
  Calendar,
  Tag,
  Flame,
  X,
  Sparkles,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';

interface MoviesViewProps {
  category?: 'popular' | 'new' | 'trending' | 'top-rated' | 'now-playing' | 'upcoming';
}

const MOVIE_GENRE_OPTIONS = [
  { id: '', name: 'All Genres', slug: 'all' },
  { id: '28', name: 'Action', slug: 'action' },
  { id: '12', name: 'Adventure', slug: 'adventure' },
  { id: '16', name: 'Animation', slug: 'animation' },
  { id: '35', name: 'Comedy', slug: 'comedy' },
  { id: '80', name: 'Crime', slug: 'crime' },
  { id: '99', name: 'Documentary', slug: 'documentary' },
  { id: '18', name: 'Drama', slug: 'drama' },
  { id: '10751', name: 'Family', slug: 'family' },
  { id: '14', name: 'Fantasy', slug: 'fantasy' },
  { id: '27', name: 'Horror', slug: 'horror' },
  { id: '9648', name: 'Mystery', slug: 'mystery' },
  { id: '10749', name: 'Romance', slug: 'romance' },
  { id: '878', name: 'Sci-Fi', slug: 'sci-fi' },
  { id: '53', name: 'Thriller', slug: 'thriller' },
  { id: '10752', name: 'War', slug: 'war' },
  { id: '37', name: 'Western', slug: 'western' },
];

export const MoviesView: React.FC<MoviesViewProps> = ({ category = 'popular' }) => {
  const { pathname, searchParams, navigate } = useRouter();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const rawGenre = searchParams.get('genre') || '';
  const selectedYear = searchParams.get('year') || '';

  const [items, setItems] = useState<MediaItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Resolve genre ID and Name from ID or Slug
  const { resolvedGenreId, activeGenreName } = useMemo(() => {
    if (!rawGenre) return { resolvedGenreId: '', activeGenreName: '' };
    
    // If it's already an ID number
    if (/^\d+$/.test(rawGenre)) {
      const match = MOVIE_GENRE_OPTIONS.find((g) => g.id === rawGenre);
      return {
        resolvedGenreId: rawGenre,
        activeGenreName: match ? match.name : `Genre ${rawGenre}`,
      };
    }

    // If it's a slug string (e.g. "action", "sci-fi")
    const cleanSlug = rawGenre.toLowerCase();
    const match = MOVIE_GENRE_OPTIONS.find((g) => g.slug === cleanSlug || g.name.toLowerCase() === cleanSlug);
    if (match) {
      return { resolvedGenreId: match.id, activeGenreName: match.name };
    }

    // Fallback to GENRE_MAP
    const genreMapEntry = GENRE_MAP[cleanSlug];
    if (genreMapEntry) {
      return {
        resolvedGenreId: String(genreMapEntry.id),
        activeGenreName: genreMapEntry.name,
      };
    }

    return { resolvedGenreId: '', activeGenreName: '' };
  }, [rawGenre]);

  // Handle changing genre filter
  const handleGenreChange = (newGenreId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newGenreId) {
      params.set('genre', newGenreId);
    } else {
      params.delete('genre');
    }
    // Reset to first page when changing filters
    params.delete('page');

    const queryString = params.toString();
    navigate(queryString ? `${pathname}?${queryString}` : pathname);
  };

  // Clear all filters
  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('genre');
    params.delete('year');
    params.delete('page');
    const queryString = params.toString();
    navigate(queryString ? `${pathname}?${queryString}` : pathname);
  };

  // Configuration based on category
  const getCategoryConfig = () => {
    switch (category) {
      case 'new':
        return {
          title: 'New Movie Releases',
          desc: 'Discover the latest cinema releases, newly premiered titles, and brand-new movies in 2026.',
          h1: 'New Movie Releases',
          icon: <Calendar className="w-5 h-5" />,
          badge: 'Latest Premiere',
        };
      case 'trending':
        return {
          title: 'Trending Movies This Week',
          desc: 'Explore the most watched and talked-about movies trending globally right now. Filter by genre tags to find trending action, sci-fi, comedy, and more.',
          h1: 'Trending Movies',
          icon: <Flame className="w-5 h-5 text-amber-400" />,
          badge: 'Global Hype',
        };
      case 'top-rated':
        return {
          title: 'Top Rated Movies of All Time',
          desc: 'Browse critically acclaimed masterpieces, award winners, and highest user-rated films.',
          h1: 'Top Rated Movies',
          icon: <Star className="w-5 h-5 text-amber-400" />,
          badge: 'Critic Acclaimed',
        };
      case 'now-playing':
        return {
          title: 'Now Playing in Theatres',
          desc: 'Explore movies currently showing in theatres and on authorized premiere streaming platforms.',
          h1: 'Now Playing Movies',
          icon: <Film className="w-5 h-5" />,
          badge: 'In Theatres',
        };
      case 'upcoming':
        return {
          title: 'Upcoming Movies 2026',
          desc: 'Preview upcoming cinema releases, official trailers, release dates, and cast lists.',
          h1: 'Upcoming Movies',
          icon: <Calendar className="w-5 h-5" />,
          badge: 'Coming Soon',
        };
      default:
        return {
          title: 'Popular Movies Directory',
          desc: 'Explore popular movies across all genres, release years, ratings, and countries.',
          h1: 'Popular Movies',
          icon: <Film className="w-5 h-5" />,
          badge: 'Popular Catalog',
        };
    }
  };

  const config = getCategoryConfig();

  useEffect(() => {
    let dynamicTitle = config.title;
    let dynamicDesc = config.desc;

    if (activeGenreName || selectedYear) {
      const filterParts = [activeGenreName, selectedYear].filter(Boolean).join(' • ');
      dynamicTitle = `${config.h1} (${filterParts}) - Page ${page}`;
      dynamicDesc = `Browse ${config.h1.toLowerCase()} filtered by ${filterParts} on Streamzy.`;
    }

    updateHeadTags(
      SEO.getDirectorySEO(dynamicTitle, dynamicDesc, pathname, getOrigin(), page)
    );

    const loadMovies = async () => {
      setLoading(true);
      try {
        let res;
        if (category === 'now-playing') {
          if (resolvedGenreId) {
            res = await tmdb.discover('movie', {
              page,
              withGenres: resolvedGenreId,
              sortBy: 'popularity.desc',
              year: selectedYear ? parseInt(selectedYear, 10) : undefined,
            });
          } else {
            res = await tmdb.getNowPlaying(page);
          }
        } else if (category === 'top-rated') {
          if (resolvedGenreId) {
            res = await tmdb.discover('movie', {
              page,
              withGenres: resolvedGenreId,
              sortBy: 'vote_average.desc',
              minRating: 7,
              year: selectedYear ? parseInt(selectedYear, 10) : undefined,
            });
          } else {
            res = await tmdb.getTopRated('movie', page);
          }
        } else if (category === 'upcoming') {
          if (resolvedGenreId) {
            res = await tmdb.discover('movie', {
              page,
              withGenres: resolvedGenreId,
              sortBy: 'popularity.desc',
              year: selectedYear ? parseInt(selectedYear, 10) : 2026,
            });
          } else {
            res = await tmdb.getUpcoming(page);
          }
        } else if (category === 'trending') {
          if (resolvedGenreId) {
            // TMDB Trending endpoint does not accept genre filtering;
            // discover with popularity.desc & withGenres delivers trending genre results perfectly!
            res = await tmdb.discover('movie', {
              page,
              withGenres: resolvedGenreId,
              sortBy: 'popularity.desc',
              year: selectedYear ? parseInt(selectedYear, 10) : undefined,
            });
          } else {
            res = await tmdb.getTrending('movie', 'week', page);
          }
        } else {
          // Default discover with filters
          res = await tmdb.discover('movie', {
            page,
            withGenres: resolvedGenreId,
            year: selectedYear ? parseInt(selectedYear, 10) : undefined,
          });
        }

        if (res && res.results) {
          setItems(res.results.filter((i) => i.poster_path));
          setTotalPages(Math.min(res.total_pages || 1, 500));
        }
      } catch (err) {
        console.error('Movies fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [category, page, resolvedGenreId, activeGenreName, selectedYear, pathname]);

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { name: 'Movies', url: '/movies' },
          ...(category !== 'popular' ? [{ name: config.h1, url: pathname }] : []),
          ...(activeGenreName ? [{ name: activeGenreName, url: `${pathname}?genre=${resolvedGenreId}` }] : []),
        ]}
      />

      {/* Directory Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-950/90 border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider">
            {config.icon}
            <span>Streamzy Cinema Directory</span>
          </div>

          {activeGenreName && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold animate-fadeIn">
              <Tag className="w-3.5 h-3.5" />
              <span>Tag: {activeGenreName}</span>
              <button
                onClick={handleClearFilters}
                className="ml-1 hover:text-white transition-colors"
                title="Clear genre filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>{config.h1}</span>
            {activeGenreName && (
              <span className="text-cyan-400 text-2xl sm:text-3xl font-extrabold">
                • {activeGenreName}
              </span>
            )}
          </h1>
          <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed mt-2">{config.desc}</p>
        </div>

        {/* Filter Controls Bar: Filter by Genre Dropdown + Quick Tag Chips */}
        <div className="pt-2 border-t border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Filter by Genre Selector */}
            <div className="flex items-center gap-3 flex-wrap">
              <label
                htmlFor="genre-filter-dropdown"
                className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 uppercase tracking-wide"
              >
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                <span>Filter by Genre:</span>
              </label>

              <div className="relative inline-block min-w-[200px]">
                <select
                  id="genre-filter-dropdown"
                  value={resolvedGenreId}
                  onChange={(e) => handleGenreChange(e.target.value)}
                  className="w-full appearance-none bg-zinc-950/90 border border-white/15 hover:border-cyan-500/50 focus:border-cyan-500 text-white text-xs font-semibold rounded-xl px-3.5 py-2 pr-9 focus:outline-none transition-all shadow-inner cursor-pointer"
                >
                  {MOVIE_GENRE_OPTIONS.map((g) => (
                    <option key={g.id || 'all'} value={g.id} className="bg-zinc-950 text-white">
                      {g.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {resolvedGenreId && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium border border-white/10 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Genre</span>
                </button>
              )}
            </div>

            {/* Quick 2026 Year Filter Tag */}
            <div className="flex items-center gap-2">
              <a
                href="/year/2026"
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3" />
                <span>2026 Releases</span>
              </a>
            </div>
          </div>

          {/* Quick Tag Pills for One-Click Filtering */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin pt-1">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mr-1 flex-shrink-0 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>Popular Tags:</span>
            </span>

            {MOVIE_GENRE_OPTIONS.slice(0, 10).map((g) => {
              const isSelected = resolvedGenreId === g.id;
              return (
                <button
                  key={g.id || 'all'}
                  type="button"
                  onClick={() => handleGenreChange(g.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                    isSelected
                      ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/25'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/5'
                  }`}
                >
                  {g.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header / Status */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
        <p>
          {loading ? (
            <span>Loading {config.h1.toLowerCase()}...</span>
          ) : (
            <span>
              Showing <strong className="text-white">{items.length}</strong> {config.h1.toLowerCase()}
              {activeGenreName && (
                <>
                  {' '}
                  in <strong className="text-cyan-400">{activeGenreName}</strong>
                </>
              )}
              {page > 1 && <> (Page {page})</>}
            </span>
          )}
        </p>
      </div>

      {/* Movie Grid */}
      {loading ? (
        <MediaGridSkeleton count={18} />
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item, idx) => (
            <MediaCard key={item.id} item={item} type="movie" rank={(page - 1) * 20 + idx + 1} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5 space-y-3">
          <Film className="w-12 h-12 text-zinc-600 mx-auto mb-1" />
          <h3 className="text-lg font-bold text-white">No Movies Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            No trending titles found matching the {activeGenreName ? `"${activeGenreName}"` : ''} filter.
          </p>
          {resolvedGenreId && (
            <button
              onClick={handleClearFilters}
              className="mt-2 px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-colors"
            >
              Reset to All Genres
            </button>
          )}
        </div>
      )}

      {/* Crawlable Pagination */}
      <Pagination currentPage={page} totalPages={totalPages} baseUrl={pathname} />
    </div>
  );
};

