import React, { useEffect, useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { tmdb } from '../services/tmdb';
import { SEO, updateHeadTags, getOrigin } from '../services/seo';
import { MediaItem } from '../types';
import { MediaCard } from '../components/MediaCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Pagination } from '../components/Pagination';
import { Calendar, Film } from 'lucide-react';

interface YearViewProps {
  year: string;
}

export const YearView: React.FC<YearViewProps> = ({ year }) => {
  const { pathname, searchParams } = useRouter();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const numericYear = parseInt(year || '2026', 10);

  const [items, setItems] = useState<MediaItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const title = `${numericYear} Movies & TV Shows`;
  const desc = `Explore popular movies and television series released in ${numericYear}. Browse top rated cinema, box office hits, and newly premiered films.`;

  useEffect(() => {
    updateHeadTags(
      SEO.getDirectorySEO(
        `${numericYear} Movies & TV Shows - Latest & Popular Titles`,
        desc,
        pathname,
        getOrigin(),
        page
      )
    );

    const loadYearData = async () => {
      setLoading(true);
      try {
        const res = await tmdb.discover('movie', {
          year: numericYear,
          page,
          sortBy: 'popularity.desc',
        });
        if (res && res.results) {
          setItems(res.results.filter((i) => i.poster_path));
          setTotalPages(res.total_pages || 1);
        }
      } catch (err) {
        console.error('Year fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    loadYearData();
  }, [numericYear, page, pathname]);

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { name: 'Release Years', url: '/movies' },
          { name: `${numericYear} Releases`, url: `/year/${numericYear}` },
        ]}
      />

      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-950/90 border border-white/10 space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider">
          <Calendar className="w-5 h-5" />
          <span>Release Year Archive</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{title}</h1>
        <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">{desc}</p>

        {/* Adjacent Year links for crawling */}
        <div className="pt-3 flex flex-wrap gap-2">
          {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((yr) => (
            <a
              key={yr}
              href={`/year/${yr}`}
              className={`px-3.5 py-1 rounded-full text-xs font-bold border transition-colors ${
                yr === numericYear
                  ? 'bg-cyan-500 text-white border-cyan-400'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
              }`}
            >
              {yr}
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
          <h3 className="text-lg font-bold text-white">No Movies Found for {numericYear}</h3>
        </div>
      )}

      {/* Crawlable Pagination */}
      <Pagination currentPage={page} totalPages={totalPages} baseUrl={pathname} />
    </div>
  );
};
