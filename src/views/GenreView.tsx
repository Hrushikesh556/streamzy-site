import React, { useEffect, useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { tmdb, GENRE_MAP } from '../services/tmdb';
import { SEO, updateHeadTags, getOrigin } from '../services/seo';
import { MediaItem } from '../types';
import { MediaCard } from '../components/MediaCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Pagination } from '../components/Pagination';
import { Sparkles, Layers, Flame, Film } from 'lucide-react';

interface GenreViewProps {
  genreSlug?: string;
}

export const GenreView: React.FC<GenreViewProps> = ({ genreSlug }) => {
  const { pathname, searchParams } = useRouter();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const cleanSlug = (genreSlug || '').toLowerCase();
  const genreMeta = cleanSlug ? GENRE_MAP[cleanSlug] : null;

  const [items, setItems] = useState<MediaItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (genreMeta) {
      updateHeadTags(
        SEO.getGenreSEO(genreMeta.name, cleanSlug, getOrigin(), page)
      );
    } else {
      updateHeadTags(
        SEO.getDirectorySEO(
          'Movie & TV Genres Directory',
          'Browse movies and television shows by genre: Action, Comedy, Horror, Sci-Fi, Drama, Animation, and more.',
          '/genres',
          getOrigin(),
          page
        )
      );
    }

    const loadGenreContent = async () => {
      setLoading(true);
      try {
        if (genreMeta) {
          const res = await tmdb.discover('movie', {
            withGenres: String(genreMeta.id),
            page,
          });
          if (res && res.results) {
            setItems(res.results.filter((i) => i.poster_path));
            setTotalPages(res.total_pages || 1);
          }
        }
      } catch (err) {
        console.error('Genre fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    if (genreMeta) {
      loadGenreContent();
    }
  }, [cleanSlug, genreMeta, page]);

  // If viewing all genres directory `/genres`
  if (!cleanSlug || !genreMeta) {
    return (
      <div className="space-y-8">
        <Breadcrumbs items={[{ name: 'Genres Directory', url: '/genres' }]} />

        <div className="p-8 rounded-3xl bg-zinc-900/60 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Categories & Themes</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Movie & TV Genres Directory</h1>
          <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
            Select a genre below to explore popular blockbusters, critically acclaimed classics, new releases, and curated collections.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Object.entries(GENRE_MAP).map(([slug, g]) => (
            <a
              key={slug}
              href={`/genres/${slug}`}
              className="p-5 rounded-2xl bg-zinc-900/60 hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group flex flex-col justify-between aspect-video"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Genre</span>
                <Sparkles className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                  {g.name}
                </h3>
                <span className="text-xs text-zinc-400 mt-1 block">Explore films & series →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  // Specific genre view `/genres/action`, `/genres/comedy` etc.
  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { name: 'Genres', url: '/genres' },
          { name: `${genreMeta.name} Movies`, url: `/genres/${cleanSlug}` },
        ]}
      />

      {/* Genre Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-950/90 border border-white/10 space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Curated Genre Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{genreMeta.name} Movies</h1>
        <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
          Explore {genreMeta.name.toLowerCase()} movies across different years, ratings, and countries. Browse top rated masterpieces, newly premiered {genreMeta.name.toLowerCase()} titles, and trending box office hits.
        </p>

        {/* Related genres internal links */}
        <div className="pt-3 flex flex-wrap gap-2">
          {Object.entries(GENRE_MAP)
            .filter(([s]) => s !== cleanSlug)
            .slice(0, 8)
            .map(([s, g]) => (
              <a
                key={s}
                href={`/genres/${s}`}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 text-zinc-300 border border-white/10 transition-colors"
              >
                {g.name}
              </a>
            ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl bg-zinc-900 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item, idx) => (
            <MediaCard key={item.id} item={item} type="movie" rank={(page - 1) * 20 + idx + 1} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5">
          <Film className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Movies Found in {genreMeta.name}</h3>
        </div>
      )}

      {/* Crawlable Pagination */}
      <Pagination currentPage={page} totalPages={totalPages} baseUrl={pathname} />
    </div>
  );
};
