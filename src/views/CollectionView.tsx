import React, { useEffect, useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { tmdb, COLLECTIONS_DATA } from '../services/tmdb';
import { SEO, updateHeadTags, getOrigin } from '../services/seo';
import { MediaItem } from '../types';
import { MediaCard } from '../components/MediaCard';
import { MediaGridSkeleton } from '../components/SkeletonLoaders';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Sparkles, Layers, Film } from 'lucide-react';

interface CollectionViewProps {
  collectionSlug?: string;
}

export const CollectionView: React.FC<CollectionViewProps> = ({ collectionSlug }) => {
  const { pathname } = useRouter();
  const cleanSlug = (collectionSlug || '').toLowerCase();
  const collectionInfo = cleanSlug ? COLLECTIONS_DATA[cleanSlug] : null;

  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (collectionInfo) {
      updateHeadTags(
        SEO.getDirectorySEO(
          `${collectionInfo.name} Movies in Order`,
          collectionInfo.description,
          pathname,
          getOrigin()
        )
      );
    } else {
      updateHeadTags(
        SEO.getDirectorySEO(
          'Popular Movie Collections & Franchises',
          'Explore major film sagas, cinematic universes, and franchises including Marvel, Star Wars, Harry Potter, and Fast & Furious.',
          '/collections',
          getOrigin()
        )
      );
    }

    const loadCollectionData = async () => {
      setLoading(true);
      try {
        if (collectionInfo) {
          const res = await tmdb.searchByType('movie', collectionInfo.query, 1);
          if (res && res.results) {
            // Sort roughly by release date
            const sorted = res.results
              .filter((i) => i.poster_path)
              .sort((a, b) => {
                const da = a.release_date || '9999';
                const db = b.release_date || '9999';
                return da.localeCompare(db);
              });
            setItems(sorted);
          }
        }
      } catch (err) {
        console.error('Collection fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    if (collectionInfo) {
      loadCollectionData();
    }
  }, [cleanSlug, collectionInfo, pathname]);

  // All collections directory
  if (!cleanSlug || !collectionInfo) {
    return (
      <div className="space-y-8">
        <Breadcrumbs items={[{ name: 'Movie Franchises', url: '/collections' }]} />

        <div className="p-8 rounded-3xl bg-zinc-900/60 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Cinematic Universes & Sagas</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Popular Movie Franchises</h1>
          <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
            Follow legendary film sagas and blockbusters in chronological franchise order.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(COLLECTIONS_DATA).map(([slug, col]) => (
            <a
              key={slug}
              href={`/collections/${slug}`}
              className="p-6 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Franchise</span>
                <Sparkles className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                  {col.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">{col.description}</p>
              </div>
              <div className="text-xs font-bold text-cyan-400 flex items-center gap-1 pt-2 border-t border-white/5">
                Explore Universe →
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  // Specific collection view
  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { name: 'Collections', url: '/collections' },
          { name: collectionInfo.name, url: `/collections/${cleanSlug}` },
        ]}
      />

      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/80 via-zinc-900/80 to-cyan-950/80 border border-white/10 space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-5 h-5" />
          <span>Curated Franchise Order</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{collectionInfo.name}</h1>
        <p className="text-sm text-zinc-300 max-w-3xl leading-relaxed">{collectionInfo.description}</p>

        {/* Other collections */}
        <div className="pt-3 flex flex-wrap gap-2">
          {Object.entries(COLLECTIONS_DATA)
            .filter(([s]) => s !== cleanSlug)
            .map(([s, c]) => (
              <a
                key={s}
                href={`/collections/${s}`}
                className="px-3.5 py-1 rounded-full text-xs font-bold bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-colors"
              >
                {c.name}
              </a>
            ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <MediaGridSkeleton count={12} />
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item, idx) => (
            <MediaCard key={item.id} item={item} type="movie" rank={idx + 1} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5">
          <Film className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Movies Found in {collectionInfo.name}</h3>
        </div>
      )}
    </div>
  );
};
