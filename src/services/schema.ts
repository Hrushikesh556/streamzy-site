import { MediaItem, SeasonDetail, BreadcrumbItem } from '../types';
import { TMDB_IMAGE, createSlug } from './tmdb';

export const getBaseOrigin = (): string => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'https://streamzy.site';
};

/**
 * Generate Schema.org BreadcrumbList JSON-LD
 */
export function generateBreadcrumbSchema(
  breadcrumbs: BreadcrumbItem[],
  origin: string = getBaseOrigin()
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((b, index) => {
      const itemUrl = b.url.startsWith('http') ? b.url : `${origin}${b.url}`;
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: b.name,
        item: itemUrl,
      };
    }),
  };
}

/**
 * Generate Schema.org Movie JSON-LD
 */
export function generateMovieSchema(
  movie: MediaItem,
  origin: string = getBaseOrigin(),
  slug?: string
): Record<string, any> {
  const title = movie.title || movie.original_title || 'Movie';
  const itemSlug = slug || createSlug(movie);
  const canonicalUrl = `${origin}/movie/${itemSlug}`;
  
  const posterUrl = movie.poster_path ? `${TMDB_IMAGE.ORIGINAL}${movie.poster_path}` : undefined;
  const backdropUrl = movie.backdrop_path ? `${TMDB_IMAGE.ORIGINAL}${movie.backdrop_path}` : undefined;
  const images = [posterUrl, backdropUrl].filter(Boolean) as string[];

  const director = movie.credits?.crew?.find((c) => c.job === 'Director')?.name;
  const actors = (movie.credits?.cast || []).slice(0, 10).map((c) => ({
    '@type': 'Person',
    name: c.name,
  }));

  const productionCompanies = (movie.production_companies || []).map((p) => ({
    '@type': 'Organization',
    name: p.name,
  }));

  const trailerVideo = (movie.videos?.results || []).find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    '@id': `${canonicalUrl}#movie`,
    url: canonicalUrl,
    name: title,
    alternateName: movie.original_title && movie.original_title !== title ? movie.original_title : undefined,
    description: movie.overview || `Watch details, cast, trailers, and streaming information for ${title}.`,
    image: images.length > 0 ? (images.length === 1 ? images[0] : images) : undefined,
    datePublished: movie.release_date || undefined,
    dateCreated: movie.release_date || undefined,
    inLanguage: movie.original_language || 'en',
    genre: (movie.genres || []).map((g) => g.name),
    duration: movie.runtime ? `PT${movie.runtime}M` : undefined,
    actor: actors.length > 0 ? actors : undefined,
    director: director ? { '@type': 'Person', name: director } : undefined,
    productionCompany: productionCompanies.length > 0 ? productionCompanies : undefined,
  };

  if (movie.vote_count && movie.vote_count > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(movie.vote_average.toFixed(1)),
      bestRating: 10,
      worstRating: 1,
      ratingCount: movie.vote_count,
    };
  }

  if (trailerVideo) {
    schema.trailer = {
      '@type': 'VideoObject',
      name: `${title} - Official Trailer`,
      description: `Watch the official trailer for ${title}.`,
      thumbnailUrl: posterUrl || backdropUrl,
      embedUrl: `https://www.youtube.com/embed/${trailerVideo.key}`,
      uploadDate: movie.release_date || new Date().toISOString().split('T')[0],
    };
  }

  return schema;
}

/**
 * Generate Schema.org TVSeries JSON-LD
 */
export function generateTVSeriesSchema(
  tv: MediaItem,
  origin: string = getBaseOrigin(),
  slug?: string
): Record<string, any> {
  const title = tv.name || tv.original_name || 'TV Show';
  const itemSlug = slug || createSlug(tv);
  const canonicalUrl = `${origin}/tv/${itemSlug}`;

  const posterUrl = tv.poster_path ? `${TMDB_IMAGE.ORIGINAL}${tv.poster_path}` : undefined;
  const backdropUrl = tv.backdrop_path ? `${TMDB_IMAGE.ORIGINAL}${tv.backdrop_path}` : undefined;
  const images = [posterUrl, backdropUrl].filter(Boolean) as string[];

  const actors = (tv.credits?.cast || []).slice(0, 10).map((c) => ({
    '@type': 'Person',
    name: c.name,
  }));

  const networks = (tv.networks || []).map((n) => ({
    '@type': 'Organization',
    name: n.name,
  }));

  const seasonsList = (tv.seasons || [])
    .filter((s) => s.season_number > 0)
    .map((s) => ({
      '@type': 'TVSeason',
      seasonNumber: s.season_number,
      name: s.name,
      numberOfEpisodes: s.episode_count,
      url: `${origin}/tv/${itemSlug}/season/${s.season_number}`,
    }));

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    '@id': `${canonicalUrl}#tvseries`,
    url: canonicalUrl,
    name: title,
    alternateName: tv.original_name && tv.original_name !== title ? tv.original_name : undefined,
    description: tv.overview || `Explore seasons, episodes, cast, and trailers for ${title}.`,
    image: images.length > 0 ? (images.length === 1 ? images[0] : images) : undefined,
    startDate: tv.first_air_date || undefined,
    endDate: tv.last_air_date || undefined,
    inLanguage: tv.original_language || 'en',
    numberOfSeasons: tv.number_of_seasons || (tv.seasons ? tv.seasons.length : undefined),
    numberOfEpisodes: tv.number_of_episodes || undefined,
    genre: (tv.genres || []).map((g) => g.name),
    actor: actors.length > 0 ? actors : undefined,
    productionCompany: networks.length > 0 ? networks : undefined,
    containsSeason: seasonsList.length > 0 ? seasonsList : undefined,
  };

  if (tv.vote_count && tv.vote_count > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(tv.vote_average.toFixed(1)),
      bestRating: 10,
      worstRating: 1,
      ratingCount: tv.vote_count,
    };
  }

  return schema;
}

/**
 * Generate Schema.org TVSeason JSON-LD
 */
export function generateTVSeasonSchema(
  tv: MediaItem,
  season: SeasonDetail,
  origin: string = getBaseOrigin(),
  slug?: string
): Record<string, any> {
  const showName = tv.name || 'TV Show';
  const itemSlug = slug || createSlug(tv);
  const seasonTitle = `${showName} Season ${season.season_number}`;
  const canonicalUrl = `${origin}/tv/${itemSlug}/season/${season.season_number}`;

  const posterUrl = season.poster_path
    ? `${TMDB_IMAGE.ORIGINAL}${season.poster_path}`
    : tv.poster_path
    ? `${TMDB_IMAGE.ORIGINAL}${tv.poster_path}`
    : undefined;

  const episodes = (season.episodes || []).map((ep) => ({
    '@type': 'TVEpisode',
    episodeNumber: ep.episode_number,
    name: ep.name,
    description: ep.overview || undefined,
    datePublished: ep.air_date || undefined,
    image: ep.still_path ? `${TMDB_IMAGE.W500}${ep.still_path}` : undefined,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'TVSeason',
    '@id': `${canonicalUrl}#season`,
    url: canonicalUrl,
    name: seasonTitle,
    description:
      season.overview ||
      `Episode guide, air dates, and overview for ${seasonTitle}, featuring ${season.episodes?.length || 0} episodes.`,
    seasonNumber: season.season_number,
    numberOfEpisodes: season.episodes?.length,
    image: posterUrl,
    startDate: season.air_date || undefined,
    partOfSeries: {
      '@type': 'TVSeries',
      name: showName,
      url: `${origin}/tv/${itemSlug}`,
    },
    episode: episodes.length > 0 ? episodes : undefined,
  };
}

/**
 * Generate Schema.org ItemList JSON-LD for collections, genres, or category listings
 */
export function generateItemListSchema(
  listName: string,
  items: MediaItem[],
  origin: string = getBaseOrigin(),
  listUrl?: string
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url: listUrl ? (listUrl.startsWith('http') ? listUrl : `${origin}${listUrl}`) : undefined,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 24).map((item, index) => {
      const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');
      const slug = createSlug(item);
      const title = item.title || item.name || 'Title';
      const poster = item.poster_path ? `${TMDB_IMAGE.W500}${item.poster_path}` : undefined;
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: `${origin}/${type === 'tv' ? 'tv' : 'movie'}/${slug}`,
        name: title,
        image: poster,
      };
    }),
  };
}

/**
 * Generate Schema.org WebSite JSON-LD
 */
export function generateWebSiteSchema(origin: string = getBaseOrigin()): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Streamzy',
    alternateName: ['Streamzy Official', 'Streamzy Movies', 'Streamzy TV', 'Streamzy Free'],
    url: origin,
    description: 'Streamzy is the ultimate free online streaming discovery platform. Watch trending movies, TV shows, official trailers, and complete series online on Streamzy.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${origin}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Helper function to inject or replace JSON-LD schemas into document head
 */
export function injectJsonLdSchema(
  schemas: Record<string, any> | (Record<string, any> | undefined | null)[] | null | undefined,
  dataAttribute: string = 'data-dynamic'
): void {
  if (typeof document === 'undefined') return;

  // Clean up any previously injected schemas with this tag
  const existingScripts = document.querySelectorAll(`script[type="application/ld+json"][${dataAttribute}="true"]`);
  existingScripts.forEach((s) => s.remove());

  if (!schemas) return;

  const list = Array.isArray(schemas) ? schemas.filter(Boolean) : [schemas];
  if (list.length === 0) return;

  list.forEach((schemaData) => {
    if (!schemaData) return;
    try {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute(dataAttribute, 'true');
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);
    } catch (err) {
      console.warn('Failed to inject JSON-LD schema:', err);
    }
  });
}

/**
 * Unified Helper: Generate and dynamically inject JSON-LD schemas based on active view type
 */
export function generateAndInjectSchema(
  viewType: 'movie' | 'tv' | 'season' | 'directory' | 'home' | 'breadcrumbs',
  data: any,
  options: {
    origin?: string;
    breadcrumbs?: BreadcrumbItem[];
    slug?: string;
    extraSchemas?: Record<string, any>[];
  } = {}
): void {
  const origin = options.origin || getBaseOrigin();
  const schemas: Record<string, any>[] = [];

  // Add View-specific schema
  switch (viewType) {
    case 'movie':
      if (data) {
        schemas.push(generateMovieSchema(data as MediaItem, origin, options.slug));
      }
      break;
    case 'tv':
      if (data) {
        schemas.push(generateTVSeriesSchema(data as MediaItem, origin, options.slug));
      }
      break;
    case 'season':
      if (data && data.tv && data.season) {
        schemas.push(generateTVSeasonSchema(data.tv, data.season, origin, options.slug));
      }
      break;
    case 'directory':
      if (data && data.name && Array.isArray(data.items)) {
        schemas.push(generateItemListSchema(data.name, data.items, origin, data.url));
      }
      break;
    case 'home':
      schemas.push(generateWebSiteSchema(origin));
      break;
    case 'breadcrumbs':
      break;
  }

  // Add BreadcrumbList schema if provided
  if (options.breadcrumbs && options.breadcrumbs.length > 0) {
    schemas.push(generateBreadcrumbSchema(options.breadcrumbs, origin));
  }

  // Add any extra custom schemas
  if (options.extraSchemas && options.extraSchemas.length > 0) {
    schemas.push(...options.extraSchemas);
  }

  // Inject into document.head
  injectJsonLdSchema(schemas);
}
