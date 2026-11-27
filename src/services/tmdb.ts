import { MediaItem, SeasonDetail, KeywordItem, PlatformConfig } from '../types';

const API_KEY = '05902896074695709d7763505bb88b4d';
const BASE_URL = 'https://api.themoviedb.org/3';

export const TMDB_IMAGE = {
  W500: 'https://image.tmdb.org/t/p/w500',
  ORIGINAL: 'https://image.tmdb.org/t/p/original',
  W300: 'https://image.tmdb.org/t/p/w300',
  W780: 'https://image.tmdb.org/t/p/w780',
};

export const GENRE_MAP: Record<string, { id: number; name: string; type: 'movie' | 'tv' | 'both' }> = {
  action: { id: 28, name: 'Action', type: 'both' },
  adventure: { id: 12, name: 'Adventure', type: 'both' },
  animation: { id: 16, name: 'Animation', type: 'both' },
  comedy: { id: 35, name: 'Comedy', type: 'both' },
  crime: { id: 80, name: 'Crime', type: 'both' },
  documentary: { id: 99, name: 'Documentary', type: 'both' },
  drama: { id: 18, name: 'Drama', type: 'both' },
  family: { id: 10751, name: 'Family', type: 'both' },
  fantasy: { id: 14, name: 'Fantasy', type: 'movie' },
  horror: { id: 27, name: 'Horror', type: 'both' },
  mystery: { id: 9648, name: 'Mystery', type: 'both' },
  romance: { id: 10749, name: 'Romance', type: 'both' },
  scifi: { id: 878, name: 'Sci-Fi', type: 'both' },
  'sci-fi': { id: 878, name: 'Sci-Fi', type: 'both' },
  thriller: { id: 53, name: 'Thriller', type: 'both' },
  war: { id: 10752, name: 'War', type: 'both' },
  western: { id: 37, name: 'Western', type: 'both' },
};

export const COUNTRY_MAP: Record<string, { code: string; name: string; lang?: string }> = {
  india: { code: 'IN', name: 'India', lang: 'hi' },
  usa: { code: 'US', name: 'United States', lang: 'en' },
  uk: { code: 'GB', name: 'United Kingdom', lang: 'en' },
  korea: { code: 'KR', name: 'South Korea', lang: 'ko' },
  japan: { code: 'JP', name: 'Japan', lang: 'ja' },
  france: { code: 'FR', name: 'France', lang: 'fr' },
  spain: { code: 'ES', name: 'Spain', lang: 'es' },
  germany: { code: 'DE', name: 'Germany', lang: 'de' },
  italy: { code: 'IT', name: 'Italy', lang: 'it' },
  canada: { code: 'CA', name: 'Canada', lang: 'en' },
};

export const NETWORK_MAP: Record<string, { id: number; name: string; region: string }> = {
  netflix: { id: 213, name: 'Netflix', region: 'US' },
  'amazon-prime': { id: 1024, name: 'Amazon Prime Video', region: 'US' },
  'apple-tv-plus': { id: 2552, name: 'Apple TV+', region: 'US' },
  hbo: { id: 49, name: 'HBO', region: 'US' },
  'disney-plus': { id: 2739, name: 'Disney+', region: 'US' },
  hulu: { id: 453, name: 'Hulu', region: 'US' },
};

export const COLLECTIONS_DATA: Record<string, { name: string; query: string; description: string }> = {
  marvel: {
    name: 'Marvel Cinematic Universe',
    query: 'Marvel Avengers',
    description: 'Explore the complete Marvel Cinematic Universe films and superhero blockbusters in chronological franchise order.',
  },
  'star-wars': {
    name: 'Star Wars Universe',
    query: 'Star Wars',
    description: 'Journey across a galaxy far, far away with the complete Star Wars saga, spin-offs, and series.',
  },
  'harry-potter': {
    name: 'Wizarding World & Harry Potter',
    query: 'Harry Potter',
    description: 'Step into Hogwarts with the complete Harry Potter collection and Fantastic Beasts fantasy adventures.',
  },
  'fast-and-furious': {
    name: 'Fast & Furious Saga',
    query: 'Fast & Furious',
    description: 'High-octane street racing, high-stakes heists, and global action across the Fast Saga franchise.',
  },
  'jurassic-park': {
    name: 'Jurassic Park & Jurassic World',
    query: 'Jurassic',
    description: 'Experience prehistoric thrills and dinosaur adventures across the Jurassic franchise.',
  },
};

export const PLATFORMS: PlatformConfig[] = [
  { id: '', name: 'All', code: 'all', region: 'IN' },
  { id: '8', name: 'Netflix', code: 'netflix', region: 'IN', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
  { id: '119', name: 'Prime', code: 'prime', region: 'IN', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png' },
  { id: '337', name: 'Disney+', code: 'disney', region: 'IN', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg' },
  { id: '350', name: 'Apple TV+', code: 'apple', region: 'US', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg', invert: true },
  { id: '531', name: 'Max', code: 'max', region: 'US', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Max_logo.svg' },
  { id: '15', name: 'Hulu', code: 'hulu', region: 'US', logo: 'https://www.svgrepo.com/download/354004/hulu.svg' },
  { id: '232', name: 'ZEE5', code: 'zee5', region: 'IN', color: '#9B30FF' },
  { id: '315', name: 'hoichoi', code: 'hoichoi', region: 'IN', color: '#E91E63' },
  { id: '611', name: 'ULLU', code: 'ullu', region: 'IN', color: '#FF6B00' },
  { id: '300', name: 'ALTBalaji', code: 'alt', region: 'IN', color: '#FF0055' },
];

export interface ServerItem {
  name: string;
  badge: string;
  quality: string;
  speed: string;
  vip?: boolean;
  icon?: string;
  movie: (id: number) => string;
  tv: (id: number, s: number, e: number) => string;
}

export const SERVERS: ServerItem[] = [
  {
    name: '111Movies.net',
    badge: 'VIP (No ADS) ⭐',
    quality: '4K Ultra',
    speed: 'Fastest',
    vip: true,
    movie: (id: number) => `https://111movies.net/movie/${id}`,
    tv: (id: number, s: number, e: number) => `https://111movies.net/tv/${id}/${s}/${e}`,
  },
  {
    name: 'VidFast',
    badge: 'VIP (No ADS) ⭐',
    quality: '4K HDR',
    speed: 'Ultra',
    vip: true,
    movie: (id: number) => `https://vidfast.pro/movie/${id}?autoPlay=true`,
    tv: (id: number, s: number, e: number) => `https://vidfast.pro/tv/${id}/${s}/${e}?autoPlay=true`,
  },
  {
    name: 'VidLink',
    badge: 'VIP (No ADS) ⭐',
    quality: '4K HDR',
    speed: 'Ultra',
    vip: true,
    movie: (id: number) => `https://vidlink.pro/movie/${id}`,
    tv: (id: number, s: number, e: number) => `https://vidlink.pro/tv/${id}/${s}/${e}`,
  },
  {
    name: 'Vidnest',
    badge: 'VIP (No ADS) ⭐',
    quality: '1080p HD',
    speed: 'Fastest',
    vip: true,
    movie: (id: number) => `https://vidnest.fun/movie/${id}`,
    tv: (id: number, s: number, e: number) => `https://vidnest.fun/tv/${id}/${s}/${e}`,
  },
  {
    name: 'MappleTV',
    badge: 'VIP (No ADS) ⭐',
    quality: '4K Ultra',
    speed: 'Fast',
    vip: true,
    movie: (id: number) => `https://mappletv.uk/watch/movie/${id}`,
    tv: (id: number, s: number, e: number) => `https://mappletv.uk/watch/tv/${id}-${s}-${e}`,
  },
  {
    name: 'VidCore.io',
    badge: 'VIP (No ADS) ⭐',
    quality: '4K Ultra',
    speed: 'Fast',
    vip: true,
    movie: (id: number) => `https://vidcore.io/embed/movie/${id}`,
    tv: (id: number, s: number, e: number) => `https://vidcore.io/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'RiveStream',
    badge: 'VIP (No ADS) ⭐',
    quality: '1080p HD',
    speed: 'Fast',
    vip: true,
    movie: (id: number) => `https://rivestream.org/embed?type=movie&id=${id}`,
    tv: (id: number, s: number, e: number) => `https://rivestream.org/embed?type=tv&id=${id}&season=${s}&episode=${e}`,
  },
  {
    name: 'EmbedBandit',
    badge: 'Fast CDN',
    quality: '1080p HD',
    speed: 'Fast',
    movie: (id: number) => `https://embedbandit.com/embed/movie/${id}`,
    tv: (id: number, s: number, e: number) => `https://embedbandit.com/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'VidSrc.su',
    badge: 'Multi-Sub',
    quality: '1080p HD',
    speed: 'Fast',
    movie: (id: number) => `https://vidsrc.su/embed/movie/${id}`,
    tv: (id: number, s: number, e: number) => `https://vidsrc.su/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'VidSrc.sh',
    badge: 'Fast Mirror',
    quality: '1080p HD',
    speed: 'Fast',
    movie: (id: number) => `https://vidsrc.sh/embed/movie/${id}`,
    tv: (id: number, s: number, e: number) => `https://vidsrc.sh/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'VidSrc.mov',
    badge: 'Multi-Lang',
    quality: '1080p HD',
    speed: 'Stable',
    movie: (id: number) => `https://vidsrc.mov/embed/movie/${id}`,
    tv: (id: number, s: number, e: number) => `https://vidsrc.mov/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'VidSrc.fyi',
    badge: 'Stable',
    quality: '1080p HD',
    speed: 'Stable',
    movie: (id: number) => `https://vidsrc.fyi/embed/movie/${id}`,
    tv: (id: number, s: number, e: number) => `https://vidsrc.fyi/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'VidSrc.buzz',
    badge: 'Cloud Mirror',
    quality: '1080p HD',
    speed: 'Fast',
    movie: (id: number) => `https://vidsrc.buzz/embed/movie/${id}`,
    tv: (id: number, s: number, e: number) => `https://vidsrc.buzz/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'VidSrc.cc',
    badge: 'Multi-Audio',
    quality: '4K Ultra',
    speed: 'Fast',
    movie: (id: number) => `https://vidsrc.cc/v2/embed/movie/${id}`,
    tv: (id: number, s: number, e: number) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'AutoEmbed',
    badge: 'Multi-Sub',
    quality: '1080p HD',
    speed: 'Fast',
    movie: (id: number) => `https://autoembed.co/movie/tmdb/${id}`,
    tv: (id: number, s: number, e: number) => `https://autoembed.co/tv/tmdb/${id}-${s}-${e}`,
  },
  {
    name: 'NontonGo',
    badge: 'Fast Mirror',
    quality: '1080p HD',
    speed: 'Fast',
    movie: (id: number) => `https://www.nontongo.win/embed/movie/${id}`,
    tv: (id: number, s: number, e: number) => `https://www.nontongo.win/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'VidAPI.xyz',
    badge: 'Multi-Host',
    quality: '4K Ultra',
    speed: 'Fast',
    movie: (id: number) => `https://vidapi.xyz/embed/movie/${id}`,
    tv: (id: number, s: number, e: number) => `https://vidapi.xyz/embed/tv/${id}&s=${s}&e=${e}`,
  },
  {
    name: 'EmbedMaster',
    badge: 'Multi-Host',
    quality: '1080p HD',
    speed: 'Stable',
    movie: (id: number) => `https://embedmaster.link/embed/movie/${id}`,
    tv: (id: number, s: number, e: number) => `https://embedmaster.link/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'MultiEmbed',
    badge: 'Global Mirror',
    quality: '1080p HD',
    speed: 'Fast',
    movie: (id: number) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    tv: (id: number, s: number, e: number) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
  },
  {
    name: '2Embed',
    badge: 'Cloud Mirror',
    quality: '1080p HD',
    speed: 'Stable',
    movie: (id: number) => `https://www.2embed.cc/embed/${id}`,
    tv: (id: number, s: number, e: number) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
  },
  {
    name: 'SmashyStream',
    badge: 'Multi-Host',
    quality: '1080p HD',
    speed: 'Fast',
    movie: (id: number) => `https://embed.smashystream.com/playere.php?tmdb=${id}`,
    tv: (id: number, s: number, e: number) => `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    name: 'VixSrc (Italian)',
    badge: 'Italiano',
    quality: '1080p HD',
    speed: 'Fast',
    movie: (id: number) => `https://vixsrc.to/movie/${id}`,
    tv: (id: number, s: number, e: number) => `https://vixsrc.to/tv/${id}/${s}/${e}`,
  },
  {
    name: 'Frembed (French)',
    badge: 'Français',
    quality: '1080p HD',
    speed: 'Fast',
    movie: (id: number) => `https://frembed.live/api/film.php?id=${id}`,
    tv: (id: number, s: number, e: number) => `https://frembed.live/api/serie.php?id=${id}&sa=${s}&epi=${e}`,
  },
];

// Slug generator: creates SEO friendly URLs e.g. "spider-man-brand-new-day-2026-634649"
export function createSlug(item: MediaItem): string {
  const title = item.title || item.name || 'title';
  const year = (item.release_date || item.first_air_date || '').split('-')[0] || '';
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  const idPart = item.id ? `-${item.id}` : '';
  return year ? `${cleanTitle}-${year}${idPart}` : `${cleanTitle}${idPart}`;
}

export function extractIdFromSlug(slug: string): number | null {
  const match = slug.match(/-(\d+)$/);
  if (match) {
    return parseInt(match[1], 10);
  }
  // Try extracting just the number if whole string is number
  if (/^\d+$/.test(slug)) {
    return parseInt(slug, 10);
  }
  return null;
}

// In-memory cache for API requests
const cache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchTMDB<T>(endpoint: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      url.searchParams.set(key, String(val));
    }
  });

  const cacheKey = url.toString();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`TMDB HTTP error ${res.status}`);
    }
    const data = await res.json();
    cache.set(cacheKey, { timestamp: Date.now(), data });
    return data as T;
  } catch (err) {
    console.error(`TMDB fetch error for ${endpoint}:`, err);
    throw err;
  }
}

export const tmdb = {
  // Discovery & Feeds
  async getTrending(type: 'movie' | 'tv' | 'all' = 'movie', timeWindow: 'day' | 'week' = 'week', page = 1) {
    return fetchTMDB<{ results: MediaItem[]; page: number; total_pages: number; total_results: number }>(
      `/trending/${type}/${timeWindow}`,
      { page }
    );
  },

  async getNowPlaying(page = 1) {
    return fetchTMDB<{ results: MediaItem[]; page: number; total_pages: number }>(
      '/movie/now_playing',
      { page }
    );
  },

  async getTopRated(type: 'movie' | 'tv' = 'movie', page = 1) {
    return fetchTMDB<{ results: MediaItem[]; page: number; total_pages: number }>(
      `/${type}/top_rated`,
      { page }
    );
  },

  async getUpcoming(page = 1) {
    return fetchTMDB<{ results: MediaItem[]; page: number; total_pages: number }>(
      '/movie/upcoming',
      { page }
    );
  },

  async getAiringToday(page = 1) {
    return fetchTMDB<{ results: MediaItem[]; page: number; total_pages: number }>(
      '/tv/airing_today',
      { page }
    );
  },

  async getPopular(type: 'movie' | 'tv' = 'movie', page = 1) {
    return fetchTMDB<{ results: MediaItem[]; page: number; total_pages: number }>(
      `/${type}/popular`,
      { page }
    );
  },

  // Discover with filters
  async discover(type: 'movie' | 'tv', options: {
    page?: number;
    sortBy?: string;
    withGenres?: string;
    year?: number;
    minRating?: number;
    withOriginalLanguage?: string;
    withWatchProviders?: string;
    watchRegion?: string;
  } = {}) {
    const params: Record<string, string | number | undefined> = {
      page: options.page || 1,
      sort_by: options.sortBy || 'popularity.desc',
      with_genres: options.withGenres,
      'vote_average.gte': options.minRating,
      with_original_language: options.withOriginalLanguage,
      with_watch_providers: options.withWatchProviders,
      watch_region: options.watchRegion,
    };

    if (options.year) {
      if (type === 'movie') {
        params['primary_release_year'] = options.year;
      } else {
        params['first_air_date_year'] = options.year;
      }
    }

    return fetchTMDB<{ results: MediaItem[]; page: number; total_pages: number; total_results: number }>(
      `/discover/${type}`,
      params
    );
  },

  // Details
  async getMovie(id: number) {
    return fetchTMDB<MediaItem>(`/movie/${id}`, {
      append_to_response: 'credits,similar,recommendations,videos',
    });
  },

  async getTVShow(id: number) {
    return fetchTMDB<MediaItem>(`/tv/${id}`, {
      append_to_response: 'credits,similar,recommendations,videos',
    });
  },

  async getRecommendations(type: 'movie' | 'tv', id: number, page = 1) {
    return fetchTMDB<{ results: MediaItem[]; page: number; total_pages: number; total_results: number }>(
      `/${type}/${id}/recommendations`,
      { page }
    );
  },

  async getSimilar(type: 'movie' | 'tv', id: number, page = 1) {
    return fetchTMDB<{ results: MediaItem[]; page: number; total_pages: number; total_results: number }>(
      `/${type}/${id}/similar`,
      { page }
    );
  },

  async getSeason(tvId: number, seasonNumber: number) {
    return fetchTMDB<SeasonDetail>(`/tv/${tvId}/season/${seasonNumber}`);
  },

  // Keywords
  async getKeywords(id: number, type: 'movie' | 'tv' = 'movie') {
    const data = await fetchTMDB<{ keywords?: KeywordItem[]; results?: KeywordItem[] }>(
      `/${type}/${id}/keywords`
    );
    return data.keywords || data.results || [];
  },

  // Search
  async searchMulti(query: string, page = 1) {
    return fetchTMDB<{ results: MediaItem[]; page: number; total_pages: number; total_results: number }>(
      '/search/multi',
      { query, page }
    );
  },

  async searchByType(type: 'movie' | 'tv', query: string, page = 1) {
    return fetchTMDB<{ results: MediaItem[]; page: number; total_pages: number; total_results: number }>(
      `/search/${type}`,
      { query, page }
    );
  },

  // Search resolver by slug
  async resolveItemBySlug(slug: string, type: 'movie' | 'tv'): Promise<MediaItem | null> {
    const id = extractIdFromSlug(slug);
    if (id) {
      try {
        return type === 'movie' ? await this.getMovie(id) : await this.getTVShow(id);
      } catch (e) {
        console.warn('ID lookup failed, trying title search fallback', e);
      }
    }

    // Fallback: extract title words and search
    const cleanQuery = slug.replace(/-(\d{4})$/, '').replace(/-/g, ' ').trim();
    const searchRes = await this.searchByType(type, cleanQuery, 1);
    if (searchRes.results && searchRes.results.length > 0) {
      const topId = searchRes.results[0].id;
      return type === 'movie' ? await this.getMovie(topId) : await this.getTVShow(topId);
    }

    return null;
  },

  // Home curated rows
  async getHomeRows() {
    const [nowPlaying, topRated, bengali, hindi, korean, action, webseries] = await Promise.allSettled([
      this.getNowPlaying(1),
      this.getTopRated('movie', 1),
      this.discover('movie', { withOriginalLanguage: 'bn' }),
      this.discover('movie', { withOriginalLanguage: 'hi' }),
      this.discover('tv', { withOriginalLanguage: 'ko' }),
      this.discover('movie', { withGenres: '28,53' }),
      this.discover('tv', { sortBy: 'popularity.desc' }),
    ]);

    return {
      nowPlaying: nowPlaying.status === 'fulfilled' ? nowPlaying.value.results : [],
      topRated: topRated.status === 'fulfilled' ? topRated.value.results : [],
      bengali: bengali.status === 'fulfilled' ? bengali.value.results : [],
      hindi: hindi.status === 'fulfilled' ? hindi.value.results : [],
      korean: korean.status === 'fulfilled' ? korean.value.results : [],
      action: action.status === 'fulfilled' ? action.value.results : [],
      webseries: webseries.status === 'fulfilled' ? webseries.value.results : [],
    };
  },
};
