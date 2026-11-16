import { MediaItem, SeasonDetail, BreadcrumbItem } from '../types';
import { TMDB_IMAGE, GENRE_MAP, COUNTRY_MAP, NETWORK_MAP, COLLECTIONS_DATA } from './tmdb';
import {
  generateBreadcrumbSchema,
  generateMovieSchema,
  generateTVSeriesSchema,
  generateTVSeasonSchema,
  generateItemListSchema,
  generateWebSiteSchema,
  injectJsonLdSchema,
  generateAndInjectSchema,
  getBaseOrigin,
} from './schema';

export {
  generateBreadcrumbSchema,
  generateMovieSchema,
  generateTVSeriesSchema,
  generateTVSeasonSchema,
  generateItemListSchema,
  generateWebSiteSchema,
  injectJsonLdSchema,
  generateAndInjectSchema,
};

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl: string;
  ogImage?: string;
  ogType?: string;
  robots?: string;
  schema?: Record<string, any>[];
  breadcrumbs?: BreadcrumbItem[];
}

export function updateHeadTags(config: SEOConfig) {
  // Update document title
  document.title = config.title;

  const setMeta = (nameAttr: string, nameVal: string, content: string) => {
    let el = document.querySelector(`meta[${nameAttr}="${nameVal}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(nameAttr, nameVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  const setLink = (rel: string, href: string) => {
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  };

  // Base Meta
  setMeta('name', 'description', config.description);
  setMeta('name', 'robots', config.robots || 'index, follow, max-image-preview:large');
  
  if (config.keywords && config.keywords.length > 0) {
    setMeta('name', 'keywords', config.keywords.join(', '));
  }

  // Canonical & OG URL Normalization
  const canonical = buildCanonicalUrl(config.canonicalUrl, undefined, getOrigin());
  setLink('canonical', canonical);

  // Open Graph
  setMeta('property', 'og:title', config.title);
  setMeta('property', 'og:description', config.description);
  setMeta('property', 'og:url', canonical);
  setMeta('property', 'og:type', config.ogType || 'website');
  if (config.ogImage) {
    setMeta('property', 'og:image', config.ogImage);
  }

  // Twitter Card
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', config.title);
  setMeta('name', 'twitter:description', config.description);
  if (config.ogImage) {
    setMeta('name', 'twitter:image', config.ogImage);
  }

  // Prepare and inject JSON-LD schemas dynamically
  const schemas: Record<string, any>[] = [...(config.schema || [])];

  // Generate and append BreadcrumbList schema if breadcrumbs are present
  if (config.breadcrumbs && config.breadcrumbs.length > 0) {
    schemas.push(generateBreadcrumbSchema(config.breadcrumbs, getOrigin()));
  }

  // Inject into document head
  injectJsonLdSchema(schemas);
}

export const getOrigin = (): string => {
  return getBaseOrigin();
};

/**
 * Checks whether a given path is a paginated directory or catalog route.
 */
export function isPaginatedDirectoryRoute(pathname: string): boolean {
  const cleanPath = (pathname || '/').replace(/\/+$/, '') || '/';
  
  const directoryRoots = [
    '/movies',
    '/tv-shows',
    '/trending',
    '/new',
    '/top-rated',
    '/now-playing',
    '/upcoming',
    '/airing-today',
    '/genres',
  ];

  if (directoryRoots.includes(cleanPath)) {
    return true;
  }

  // Parameterized directory routes: /genres/:slug, /year/:yr, /country/:code, /network/:slug
  if (
    /^\/genres\/[a-zA-Z0-9_-]+$/.test(cleanPath) ||
    /^\/year\/[0-9]{4}$/.test(cleanPath) ||
    /^\/country\/[a-zA-Z0-9_-]+$/.test(cleanPath) ||
    /^\/network\/[a-zA-Z0-9_-]+$/.test(cleanPath)
  ) {
    return true;
  }

  return false;
}

/**
 * Normalizes and builds a strictly unique, clean canonical URL.
 * - Enforces absolute origin.
 * - Strips any hash fragments (e.g. #trailer, #section, #cast).
 * - Strips tracking/extraneous search parameters (utm_*, ref, fbclid, sort, filter, modal, etc.).
 * - Deduplicates query parameters.
 * - Preserves canonical pagination (page >= 2) for directory pages like /movies?page=2 and /search?q=query&page=2.
 * - Normalizes page=1 or non-directory routes by stripping page parameters completely.
 * - Ensures consistent path formatting without trailing slashes (except root '/').
 */
export function buildCanonicalUrl(
  pathOrUrl: string,
  params?: Record<string, string | number | boolean | null | undefined> | URLSearchParams,
  origin: string = getOrigin()
): string {
  try {
    const baseOrigin = (origin || getOrigin()).replace(/\/+$/, '');
    if (!pathOrUrl) {
      return `${baseOrigin}/`;
    }

    // 1. Strip hash fragments
    const withoutHash = pathOrUrl.split('#')[0].trim();

    // 2. Separate path from existing query string
    const [rawPath, rawQuery] = withoutHash.split('?');

    // 3. Normalize pathname
    let pathname = rawPath;
    if (pathname.startsWith('http://') || pathname.startsWith('https://')) {
      try {
        pathname = new URL(pathname).pathname;
      } catch {
        pathname = '/' + pathname.replace(/^https?:\/\/[^/]+/, '');
      }
    }

    if (!pathname.startsWith('/')) {
      pathname = '/' + pathname;
    }
    // Collapse consecutive slashes
    pathname = pathname.replace(/\/+/g, '/');
    // Remove trailing slash for subpaths
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }

    // 4. Parse existing and additional parameters
    const incomingParams = new URLSearchParams(rawQuery || '');

    if (params) {
      if (params instanceof URLSearchParams) {
        params.forEach((value, key) => {
          if (value !== undefined && value !== null && value !== '') {
            incomingParams.set(key, value);
          }
        });
      } else {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            incomingParams.set(key, String(value));
          } else {
            incomingParams.delete(key);
          }
        });
      }
    }

    // 5. Build canonical parameters based on route classification
    const canonicalParams = new URLSearchParams();
    const cleanPath = pathname === '/' ? '/' : pathname;

    if (cleanPath === '/search') {
      // For search route: allow 'q' (search query) and 'page' (if > 1)
      const qVal = incomingParams.get('q');
      if (qVal && qVal.trim()) {
        canonicalParams.set('q', qVal.trim());
      }
      const pageVal = incomingParams.get('page');
      if (pageVal !== null) {
        const pageNum = parseInt(pageVal, 10);
        if (!isNaN(pageNum) && pageNum > 1) {
          canonicalParams.set('page', String(pageNum));
        }
      }
    } else if (isPaginatedDirectoryRoute(cleanPath)) {
      // For paginated directory pages (e.g. /movies, /tv-shows, /genres/action, /year/2024, etc.):
      // Only canonicalize 'page' when page >= 2. Strip all unneeded filter/sort/tracking params.
      const pageVal = incomingParams.get('page');
      if (pageVal !== null) {
        const pageNum = parseInt(pageVal, 10);
        if (!isNaN(pageNum) && pageNum > 1) {
          canonicalParams.set('page', String(pageNum));
        }
      }
    }
    // For all other routes (media detail /movie/*, /tv/*, static /pages/*, /watchlist, /sitemap, root /),
    // no search parameters are canonical, so canonicalParams remains empty.

    // 6. Sort parameters alphabetically for deterministic canonical output
    canonicalParams.sort();

    const queryString = canonicalParams.toString();
    const finalPath = queryString ? `${cleanPath}?${queryString}` : cleanPath;

    return `${baseOrigin}${finalPath === '/' ? '/' : finalPath}`;
  } catch (err) {
    console.warn('Failed to construct canonical URL:', err);
    const cleanOrigin = (origin || getOrigin()).replace(/\/+$/, '');
    const cleanPath = (pathOrUrl || '/').split('#')[0].split('?')[0];
    return `${cleanOrigin}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`;
  }
}

export const SEO = {
  getHomeSEO(origin: string = getOrigin()): SEOConfig {
    return {
      title: 'Streamzy - Watch Movies & TV Shows Free Online | Streamzy Official',
      description: 'Streamzy is the ultimate free online streaming discovery platform. Watch trending movies, TV shows, official trailers, and complete series online on Streamzy.',
      canonicalUrl: buildCanonicalUrl('/', undefined, origin),
      ogType: 'website',
      keywords: [
        'streamzy',
        'streamzy official',
        'streamzy movies',
        'streamzy tv',
        'streamzy online',
        'watch on streamzy',
        'streamzy app',
        'free movies streaming',
        'watch series online',
        'hd movies',
        'top rated movies',
        'trending movies',
        'streaming guide',
      ],
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Streamzy',
          alternateName: ['Streamzy Official', 'Streamzy Movies', 'Streamzy TV', 'Streamzy Free Online'],
          url: origin,
          description: 'Streamzy is the premier streaming and discovery guide for movies and TV shows worldwide.',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${origin}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What movies and TV shows can I discover on Streamzy?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'You can discover thousands of popular, trending, top-rated, and upcoming movies and TV shows across Hollywood, Bollywood, Korean cinema, Anime, and global international releases.',
              },
            },
            {
              '@type': 'Question',
              name: 'How can I browse by genre or release year?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Navigate through dedicated genre pages such as Action, Comedy, Sci-Fi, Horror, Drama, and Romance, or filter through specific release years like 2026, 2025, and 2024.',
              },
            },
            {
              '@type': 'Question',
              name: 'Can I view official trailers and cast details?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, every movie and TV show page provides official trailers, verified cast & director lists, synopsis, ratings, and authorized streaming provider information.',
              },
            },
          ],
        },
      ],
    };
  },

  getMovieSEO(movie: MediaItem, origin: string = getOrigin(), slug: string): SEOConfig {
    const title = movie.title || movie.original_title || 'Movie';
    const year = (movie.release_date || '').split('-')[0] || '2026';
    const genreNames = (movie.genres || []).map((g) => g.name).join(', ');
    const desc = movie.overview 
      ? `Learn about ${title} (${year}), including its story, cast, genres (${genreNames || 'Cinema'}), ratings, and official viewing information. ${movie.overview.slice(0, 120)}...`
      : `Complete information, cast, ratings, and trailers for ${title} (${year}).`;

    const movieSchema = generateMovieSchema(movie, origin, slug);

    return {
      title: `${title} (${year}) - Cast, Story, Rating & Details | Streamzy`,
      description: desc,
      canonicalUrl: buildCanonicalUrl(`/movie/${slug}`, undefined, origin),
      ogImage: movie.backdrop_path ? `${TMDB_IMAGE.ORIGINAL}${movie.backdrop_path}` : (movie.poster_path ? `${TMDB_IMAGE.ORIGINAL}${movie.poster_path}` : undefined),
      ogType: 'video.movie',
      keywords: [
        title.toLowerCase(),
        `${title.toLowerCase()} ${year}`,
        `${title.toLowerCase()} cast`,
        `${title.toLowerCase()} trailer`,
        ...(movie.genres || []).map((g) => g.name.toLowerCase()),
      ],
      schema: [movieSchema],
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Movies', url: '/movies' },
        ...(movie.genres && movie.genres.length > 0 ? [{ name: movie.genres[0].name, url: `/genres/${movie.genres[0].name.toLowerCase()}` }] : []),
        { name: title, url: `/movie/${slug}` },
      ],
    };
  },

  getTVSEO(tv: MediaItem, origin: string = getOrigin(), slug: string): SEOConfig {
    const name = tv.name || tv.original_name || 'TV Show';
    const year = (tv.first_air_date || '').split('-')[0] || '2026';
    const genreNames = (tv.genres || []).map((g) => g.name).join(', ');
    const desc = tv.overview
      ? `Explore ${name} (${year}), featuring ${tv.number_of_seasons || 1} seasons, ${tv.number_of_episodes || ''} episodes, cast, genres (${genreNames || 'TV Series'}), and episode guides.`
      : `Complete series information, episodes, cast, and trailers for ${name} (${year}).`;

    const tvSchema = generateTVSeriesSchema(tv, origin, slug);

    return {
      title: `${name} (${year}) - Seasons, Cast, Episodes & Details | Streamzy`,
      description: desc,
      canonicalUrl: buildCanonicalUrl(`/tv/${slug}`, undefined, origin),
      ogImage: tv.backdrop_path ? `${TMDB_IMAGE.ORIGINAL}${tv.backdrop_path}` : undefined,
      ogType: 'video.tv_show',
      keywords: [
        name.toLowerCase(),
        `${name.toLowerCase()} season 1`,
        `${name.toLowerCase()} episodes`,
        `${name.toLowerCase()} tv series`,
      ],
      schema: [tvSchema],
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'TV Shows', url: '/tv-shows' },
        ...(tv.genres && tv.genres.length > 0 ? [{ name: tv.genres[0].name, url: `/genres/${tv.genres[0].name.toLowerCase()}` }] : []),
        { name: name, url: `/tv/${slug}` },
      ],
    };
  },

  getSeasonSEO(tv: MediaItem, season: SeasonDetail, origin: string = getOrigin(), slug: string): SEOConfig {
    const showName = tv.name || 'TV Show';
    const seasonTitle = `${showName} Season ${season.season_number}`;
    const desc = season.overview || `Episode guide and overview for ${seasonTitle}, featuring ${season.episodes?.length || 0} episodes, release dates, and story summaries.`;

    const seasonSchema = generateTVSeasonSchema(tv, season, origin, slug);

    return {
      title: `${seasonTitle} - Episode Guide & Overview | Streamzy`,
      description: desc,
      canonicalUrl: buildCanonicalUrl(`/tv/${slug}/season/${season.season_number}`, undefined, origin),
      ogImage: season.poster_path ? `${TMDB_IMAGE.ORIGINAL}${season.poster_path}` : undefined,
      ogType: 'video.tv_show',
      schema: [seasonSchema],
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'TV Shows', url: '/tv-shows' },
        { name: showName, url: `/tv/${slug}` },
        { name: `Season ${season.season_number}`, url: `/tv/${slug}/season/${season.season_number}` },
      ],
    };
  },

  getGenreSEO(genreName: string, genreSlug: string, origin: string = getOrigin(), page = 1): SEOConfig {
    const pageSuffix = page > 1 ? ` - Page ${page}` : '';
    return {
      title: `${genreName} Movies - Best ${genreName} Films to Explore${pageSuffix} | Streamzy`,
      description: `Explore ${genreName.toLowerCase()} movies across different years, ratings, and countries. Browse popular and highly rated ${genreName.toLowerCase()} films.`,
      canonicalUrl: buildCanonicalUrl(`/genres/${genreSlug}`, { page }, origin),
      ogType: 'website',
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${genreName} Movies & Shows`,
          description: `Curated collection of top ${genreName} movies and television series.`,
        },
      ],
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Genres', url: '/genres' },
        { name: genreName, url: `/genres/${genreSlug}` },
      ],
    };
  },

  getDirectorySEO(title: string, desc: string, path: string, origin: string = getOrigin(), page = 1): SEOConfig {
    const pageSuffix = page > 1 ? ` - Page ${page}` : '';
    return {
      title: `${title}${pageSuffix} | Streamzy`,
      description: desc,
      canonicalUrl: buildCanonicalUrl(path, { page }, origin),
      ogType: 'website',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: title, url: path },
      ],
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: title,
          description: desc,
        },
      ],
    };
  },

  getSearchSEO(query: string, origin: string = getOrigin(), page = 1): SEOConfig {
    const pageSuffix = page > 1 ? ` - Page ${page}` : '';
    return {
      title: query
        ? `Search Results for "${query}"${pageSuffix} | Streamzy`
        : `Search Movies & TV Shows${pageSuffix} | Streamzy`,
      description: query
        ? `Find movies, TV series, actors, and directors for query "${query}" with stream availability.`
        : 'Search movies, TV series, genres, actors, and directors across all streaming networks on Streamzy.',
      canonicalUrl: buildCanonicalUrl('/search', query ? { q: query, page } : { page }, origin),
      robots: 'noindex, follow',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Search', url: '/search' },
      ],
    };
  },

  getInitialMediaSEO(slug: string, type: 'movie' | 'tv', origin: string = getOrigin()): SEOConfig {
    const clean = slug.replace(/-(\d+)$/, '');
    const yearMatch = clean.match(/-((?:19|20)\d{2})$/);
    let year: string | undefined;
    let titleSlug = clean;
    if (yearMatch) {
      year = yearMatch[1];
      titleSlug = clean.slice(0, -yearMatch[0].length);
    }
    const title = titleSlug
      .split('-')
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') || (type === 'tv' ? 'TV Show' : 'Movie');

    const yearLabel = year ? ` (${year})` : '';

    return {
      title: `${title}${yearLabel} - Watch & Details | Streamzy`,
      description: `Watch official trailers, cast members, storyline, rating, and streaming guide for ${title}${yearLabel}.`,
      canonicalUrl: buildCanonicalUrl(`/${type === 'tv' ? 'tv' : 'movie'}/${slug}`, undefined, origin),
      ogType: type === 'tv' ? 'video.tv_show' : 'video.movie',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: type === 'tv' ? 'TV Shows' : 'Movies', url: type === 'tv' ? '/tv-shows' : '/movies' },
        { name: title, url: `/${type === 'tv' ? 'tv' : 'movie'}/${slug}` },
      ],
    };
  },

  getInitialSeasonSEO(slug: string, seasonNumber: string | number, origin: string = getOrigin()): SEOConfig {
    const clean = slug.replace(/-(\d+)$/, '');
    const title = clean
      .split('-')
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') || 'TV Show';

    return {
      title: `${title} Season ${seasonNumber} - Episode Guide & Overview | Streamzy`,
      description: `Complete episode guide, release dates, and story synopses for ${title} Season ${seasonNumber}.`,
      canonicalUrl: buildCanonicalUrl(`/tv/${slug}/season/${seasonNumber}`, undefined, origin),
      ogType: 'video.tv_show',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'TV Shows', url: '/tv-shows' },
        { name: title, url: `/tv/${slug}` },
        { name: `Season ${seasonNumber}`, url: `/tv/${slug}/season/${seasonNumber}` },
      ],
    };
  },

  get404SEO(origin: string = getOrigin()): SEOConfig {
    return {
      title: '404 - Page Not Found | Streamzy',
      description: 'The requested movie, TV show, or directory page does not exist or has been moved.',
      canonicalUrl: buildCanonicalUrl('/404', undefined, origin),
      robots: 'noindex, follow',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Not Found', url: '/404' },
      ],
    };
  },

  getRouteSEO(pathname: string, searchParams?: URLSearchParams, origin: string = getOrigin()): SEOConfig {
    const path = pathname.replace(/\/+$/, '') || '/';
    const page = parseInt(searchParams?.get('page') || '1', 10);
    const query = searchParams?.get('q') || '';

    // 1. Root
    if (path === '/') {
      return SEO.getHomeSEO(origin);
    }

    // 2. Core Movie Categories
    if (path === '/movies') {
      return SEO.getDirectorySEO('Popular Movies Directory', 'Explore popular movies across all genres, release years, ratings, and countries.', '/movies', origin, page);
    }
    if (path === '/new') {
      return SEO.getDirectorySEO('New Movie Releases', 'Discover newly released movies, latest theatrical debuts, and recently added cinema titles.', '/new', origin, page);
    }
    if (path === '/trending') {
      return SEO.getDirectorySEO('Trending Movies & TV Shows', 'Browse trending movies and viral television shows popular with viewers this week.', '/trending', origin, page);
    }
    if (path === '/top-rated') {
      return SEO.getDirectorySEO('Top Rated Movies of All Time', 'Explore critically acclaimed and highest rated movies according to worldwide audience reviews.', '/top-rated', origin, page);
    }
    if (path === '/now-playing') {
      return SEO.getDirectorySEO('Movies Playing in Theaters', 'Check out movies currently showing in theaters, recent premieres, and box office hits.', '/now-playing', origin, page);
    }
    if (path === '/upcoming') {
      return SEO.getDirectorySEO('Upcoming Movies & Future Releases', 'Preview upcoming movie trailers, announced release dates, and upcoming cinema blockbusters.', '/upcoming', origin, page);
    }

    // 3. TV Categories
    if (path === '/tv-shows') {
      return SEO.getDirectorySEO('Popular TV Shows Directory', 'Explore popular TV shows, ongoing web series, anime, Korean drama, and critically acclaimed multi-season series.', '/tv-shows', origin, page);
    }
    if (path === '/airing-today') {
      return SEO.getDirectorySEO('TV Shows Airing Today', 'Discover television series and new drama episodes broadcasting today on global networks and streaming platforms.', '/airing-today', origin, page);
    }

    // 4. Genres
    if (path === '/genres') {
      return SEO.getDirectorySEO('Movie & TV Genres Directory', 'Browse movies and television shows by genre: Action, Comedy, Horror, Sci-Fi, Drama, Animation, and more.', '/genres', origin, page);
    }
    const genreMatch = path.match(/^\/genres\/([a-zA-Z0-9_-]+)$/);
    if (genreMatch) {
      const slug = genreMatch[1].toLowerCase();
      const meta = GENRE_MAP[slug];
      const genreName = meta ? meta.name : slug.charAt(0).toUpperCase() + slug.slice(1);
      return SEO.getGenreSEO(genreName, slug, origin, page);
    }

    // 5. Release Years
    const yearMatch = path.match(/^\/year\/([0-9]{4})$/);
    if (yearMatch) {
      const yr = parseInt(yearMatch[1], 10);
      return SEO.getDirectorySEO(
        `${yr} Movies & TV Shows - Latest & Popular Titles`,
        `Explore popular movies and television series released in ${yr}. Browse top rated cinema, box office hits, and newly premiered films.`,
        `/year/${yr}`,
        origin,
        page
      );
    }

    // 6. Countries
    const countryMatch = path.match(/^\/country\/([a-zA-Z0-9_-]+)$/);
    if (countryMatch) {
      const code = countryMatch[1].toLowerCase();
      const c = COUNTRY_MAP[code] || { name: code.toUpperCase() };
      return SEO.getDirectorySEO(
        `${c.name} Movies & TV Shows - Popular & Latest Titles`,
        `Explore popular movies and television series originating from ${c.name}. Browse latest cinema releases, local language hits, and top rated productions.`,
        `/country/${code}`,
        origin,
        page
      );
    }

    // 7. Networks / Platforms
    const networkMatch = path.match(/^\/network\/([a-zA-Z0-9_-]+)$/);
    if (networkMatch) {
      const slug = networkMatch[1].toLowerCase();
      const net = NETWORK_MAP[slug] || { name: slug.charAt(0).toUpperCase() + slug.slice(1) };
      return SEO.getDirectorySEO(
        `${net.name} Movies & TV Shows - Streaming Catalog Guide`,
        `Explore popular movies and television series available on ${net.name}. Browse latest original releases, popular series, and top rated catalog titles.`,
        `/network/${slug}`,
        origin,
        page
      );
    }

    // 8. Collections
    if (path === '/collections') {
      return SEO.getDirectorySEO(
        'Popular Movie Collections & Franchises',
        'Explore major film sagas, cinematic universes, and franchises including Marvel, Star Wars, Harry Potter, and Fast & Furious.',
        '/collections',
        origin
      );
    }
    const collectionMatch = path.match(/^\/collections\/([a-zA-Z0-9_-]+)$/);
    if (collectionMatch) {
      const slug = collectionMatch[1].toLowerCase();
      const info = COLLECTIONS_DATA[slug];
      const title = info ? `${info.name} Movies in Order` : 'Movie Franchise Collection';
      const desc = info ? info.description : 'Explore movies in this franchise collection in chronological and release order.';
      return SEO.getDirectorySEO(title, desc, `/collections/${slug}`, origin);
    }

    // 9. TV Season Detail
    const tvSeasonMatch = path.match(/^\/tv\/([a-zA-Z0-9_-]+)\/season\/([0-9]+)$/);
    if (tvSeasonMatch) {
      return SEO.getInitialSeasonSEO(tvSeasonMatch[1], tvSeasonMatch[2], origin);
    }

    // 10. TV Show Detail
    const tvMatch = path.match(/^\/tv\/([a-zA-Z0-9_-]+)$/);
    if (tvMatch) {
      return SEO.getInitialMediaSEO(tvMatch[1], 'tv', origin);
    }

    // 11. Movie Detail
    const movieMatch = path.match(/^\/movie\/([a-zA-Z0-9_-]+)$/);
    if (movieMatch) {
      return SEO.getInitialMediaSEO(movieMatch[1], 'movie', origin);
    }

    // 12. Search
    if (path === '/search') {
      return SEO.getSearchSEO(query, origin, page);
    }

    // 13. Watchlist
    if (path === '/watchlist') {
      return SEO.getDirectorySEO(
        'My Saved Watchlist',
        'Access your saved movies and TV series across sessions stored locally in your browser.',
        '/watchlist',
        origin
      );
    }

    // 14. Sitemap
    if (path === '/sitemap' || path === '/sitemap.xml') {
      return SEO.getDirectorySEO(
        'Sitemap Index - All Routes & Directory Links',
        'Complete index of all public movie, TV show, genre, year, network, and collection pages for search engines and users.',
        '/sitemap',
        origin
      );
    }

    // 15. Static Info Pages
    if (path === '/pages/about') {
      return SEO.getDirectorySEO('About Streamzy', 'Learn about Streamzy, the premier online cinema directory and discovery platform powered by TMDB data.', '/pages/about', origin);
    }
    if (path === '/pages/contact') {
      return SEO.getDirectorySEO('Contact Us', 'Have a question, feedback, or metadata inquiry? Reach out to the Streamzy team.', '/pages/contact', origin);
    }
    if (path === '/pages/privacy') {
      return SEO.getDirectorySEO('Privacy and Policy', 'Read the official Streamzy privacy statement and learn how your browsing data is protected.', '/pages/privacy', origin);
    }
    if (path === '/pages/terms') {
      return SEO.getDirectorySEO('Terms and Conditions', 'Review the terms and conditions governing the use of the Streamzy discovery platform.', '/pages/terms', origin);
    }
    if (path === '/pages/dmca') {
      return SEO.getDirectorySEO('DMCA Disclaimer & Copyright Notice', 'Streamzy DMCA policy, copyright compliance notices, and authorized content takedown procedures.', '/pages/dmca', origin);
    }

    // 16. Fallback 404
    return SEO.get404SEO(origin);
  },
};
