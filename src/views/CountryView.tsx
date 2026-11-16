import React, { useEffect, useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { tmdb, COUNTRY_MAP } from '../services/tmdb';
import { SEO, updateHeadTags, getOrigin } from '../services/seo';
import { MediaItem } from '../types';
import { MediaCard } from '../components/MediaCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Pagination } from '../components/Pagination';
import { Globe, Film } from 'lucide-react';

interface CountryViewProps {
  countryCode: string;
}

export const CountryView: React.FC<CountryViewProps> = ({ countryCode }) => {
  const { pathname, searchParams } = useRouter();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const cleanCode = (countryCode || '').toLowerCase();
  const country = COUNTRY_MAP[cleanCode] || { code: 'IN', name: 'Global', lang: undefined };

  const [items, setItems] = useState<MediaItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const title = `${country.name} Movies & TV Shows`;
  const desc = `Explore popular movies and television series originating from ${country.name}. Browse latest cinema releases, local language hits, and top rated productions.`;

  useEffect(() => {
    updateHeadTags(
      SEO.getDirectorySEO(
        `${country.name} Movies & TV Shows - Popular & Latest Titles`,
        desc,
        pathname,
        getOrigin(),
        page
      )
    );

    const loadCountryData = async () => {
      setLoading(true);
      try {
        const res = await tmdb.discover('movie', {
          withOriginalLanguage: country.lang,
          page,
          sortBy: 'popularity.desc',
        });
        if (res && res.results) {
          setItems(res.results.filter((i) => i.poster_path));
          setTotalPages(res.total_pages || 1);
        }
      } catch (err) {
        console.error('Country fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    loadCountryData();
  }, [countryCode, country, page, pathname]);

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { name: 'Countries', url: '/movies' },
          { name: country.name, url: `/country/${cleanCode}` },
        ]}
      />

      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-950/90 border border-white/10 space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider">
          <Globe className="w-5 h-5" />
          <span>Regional Cinema</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{title}</h1>
        <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">{desc}</p>

        {/* Other country links */}
        <div className="pt-3 flex flex-wrap gap-2">
          {Object.entries(COUNTRY_MAP).map(([code, c]) => (
            <a
              key={code}
              href={`/country/${code}`}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                code === cleanCode
                  ? 'bg-cyan-500 text-white border-cyan-400'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
              }`}
            >
              {c.name}
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
          <h3 className="text-lg font-bold text-white">No Titles Found for {country.name}</h3>
        </div>
      )}

      {/* Crawlable Pagination */}
      <Pagination currentPage={page} totalPages={totalPages} baseUrl={pathname} />
    </div>
  );
};
