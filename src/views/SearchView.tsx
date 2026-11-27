import React, { useEffect, useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { tmdb } from '../services/tmdb';
import { SEO, updateHeadTags, getOrigin } from '../services/seo';
import { MediaItem } from '../types';
import { MediaCard } from '../components/MediaCard';
import { MediaGridSkeleton } from '../components/SkeletonLoaders';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Pagination } from '../components/Pagination';
import { Search, Film, Tv, Sparkles } from 'lucide-react';

export const SearchView: React.FC = () => {
  const { pathname, searchParams, navigate } = useRouter();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const typeFilter = searchParams.get('type') || 'all'; // all | movie | tv

  const [inputVal, setInputVal] = useState(query);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInputVal(query);
    updateHeadTags(SEO.getSearchSEO(query, getOrigin(), page));

    if (!query.trim()) {
      setItems([]);
      setTotalPages(1);
      setTotalResults(0);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      try {
        let res;
        if (typeFilter === 'movie') {
          res = await tmdb.searchByType('movie', query.trim(), page);
        } else if (typeFilter === 'tv') {
          res = await tmdb.searchByType('tv', query.trim(), page);
        } else {
          res = await tmdb.searchMulti(query.trim(), page);
        }

        if (res && res.results) {
          const filtered = res.results.filter(
            (i) => (i.media_type === 'movie' || i.media_type === 'tv' || !i.media_type) && i.poster_path
          );
          setItems(filtered);
          setTotalPages(res.total_pages || 1);
          setTotalResults(res.total_results || 0);
        }
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query, page, typeFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(inputVal.trim())}`);
    }
  };

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ name: 'Search', url: '/search' }]} />

      {/* Search Input Hero Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-white/10 space-y-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {query ? `Search Results for "${query}"` : 'Search Movies & TV Shows'}
        </h1>

        <form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search by movie title, actor, director, genre..."
              className="w-full bg-zinc-950 border border-white/15 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-sm transition-colors shadow-md shrink-0"
          >
            Search
          </button>
        </form>

        {query && (
          <div className="flex items-center justify-between flex-wrap gap-3 pt-2 text-xs text-zinc-400">
            <span>Found ~{totalResults} matches</span>

            {/* Filter types */}
            <div className="flex items-center gap-1.5">
              <a
                href={`/search?q=${encodeURIComponent(query)}&type=all`}
                className={`px-3 py-1 rounded-full border transition-colors ${
                  typeFilter === 'all'
                    ? 'bg-cyan-500 text-white border-cyan-400 font-bold'
                    : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                }`}
              >
                All
              </a>
              <a
                href={`/search?q=${encodeURIComponent(query)}&type=movie`}
                className={`px-3 py-1 rounded-full border transition-colors ${
                  typeFilter === 'movie'
                    ? 'bg-cyan-500 text-white border-cyan-400 font-bold'
                    : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                }`}
              >
                Movies
              </a>
              <a
                href={`/search?q=${encodeURIComponent(query)}&type=tv`}
                className={`px-3 py-1 rounded-full border transition-colors ${
                  typeFilter === 'tv'
                    ? 'bg-cyan-500 text-white border-cyan-400 font-bold'
                    : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                }`}
              >
                TV Shows
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Results Grid */}
      {loading ? (
        <MediaGridSkeleton
          count={12}
          columnsClass="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        />
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5 space-y-3">
          <Search className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No results found for "{query}"</h3>
          <p className="text-xs text-zinc-400">Please check your spelling or try popular search terms.</p>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 text-center space-y-2">
          <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-white">Looking for something to watch?</h3>
          <p className="text-xs text-zinc-400">Enter a keyword above to find movies, TV shows, cast, and franchises.</p>
        </div>
      )}

      {/* Pagination */}
      {query && <Pagination currentPage={page} totalPages={totalPages} baseUrl={pathname} />}
    </div>
  );
};
