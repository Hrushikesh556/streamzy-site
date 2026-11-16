import { GENRE_MAP, COUNTRY_MAP, NETWORK_MAP, COLLECTIONS_DATA, tmdb, createSlug } from './tmdb';
import { getOrigin, buildCanonicalUrl } from './seo';
import { MediaItem } from '../types';

export interface SitemapUrlEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  title?: string;
  category: 'Core' | 'Genres' | 'Years' | 'Countries' | 'Networks' | 'Collections' | 'Static Pages' | 'Movies' | 'TV Shows';
}

export interface SitemapSummary {
  totalUrls: number;
  categories: Record<string, number>;
  generatedAt: string;
}

/**
 * Escapes XML special characters according to XML 1.0 specifications.
 */
export function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Retrieves all deterministic static application routes.
 */
export function getStaticSitemapEntries(origin: string = getOrigin()): SitemapUrlEntry[] {
  const baseOrigin = origin || getOrigin();
  const today = new Date().toISOString().split('T')[0];

  // 1. Core Hub & Discovery Routes
  const coreRoutes: SitemapUrlEntry[] = [
    {
      loc: buildCanonicalUrl('/', undefined, baseOrigin),
      lastmod: today,
      changefreq: 'daily',
      priority: 1.0,
      title: 'Home Discovery Hub',
      category: 'Core',
    },
    {
      loc: buildCanonicalUrl('/movies', undefined, baseOrigin),
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9,
      title: 'Popular Movies',
      category: 'Core',
    },
    {
      loc: buildCanonicalUrl('/tv-shows', undefined, baseOrigin),
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9,
      title: 'Popular TV Shows',
      category: 'Core',
    },
    {
      loc: buildCanonicalUrl('/trending', undefined, baseOrigin),
      lastmod: today,
      changefreq: 'daily',
      priority: 0.85,
      title: 'Trending This Week',
      category: 'Core',
    },
    {
      loc: buildCanonicalUrl('/new', undefined, baseOrigin),
      lastmod: today,
      changefreq: 'daily',
      priority: 0.85,
      title: 'New Movie Releases',
      category: 'Core',
    },
    {
      loc: buildCanonicalUrl('/top-rated', undefined, baseOrigin),
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
      title: 'Top Rated Movies of All Time',
      category: 'Core',
    },
    {
      loc: buildCanonicalUrl('/now-playing', undefined, baseOrigin),
      lastmod: today,
      changefreq: 'daily',
      priority: 0.8,
      title: 'Now Playing in Theatres',
      category: 'Core',
    },
    {
      loc: buildCanonicalUrl('/upcoming', undefined, baseOrigin),
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
      title: 'Upcoming Cinema Releases',
      category: 'Core',
    },
    {
      loc: buildCanonicalUrl('/airing-today', undefined, baseOrigin),
      lastmod: today,
      changefreq: 'daily',
      priority: 0.8,
      title: 'TV Shows Airing Today',
      category: 'Core',
    },
    {
      loc: buildCanonicalUrl('/genres', undefined, baseOrigin),
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
      title: 'All Movie & TV Genres Directory',
      category: 'Core',
    },
    {
      loc: buildCanonicalUrl('/collections', undefined, baseOrigin),
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
      title: 'Movie Franchises & Sagas',
      category: 'Core',
    },
    {
      loc: buildCanonicalUrl('/watchlist', undefined, baseOrigin),
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.5,
      title: 'Personal Saved Watchlist',
      category: 'Core',
    },
  ];

  // 2. Genre Catalogs
  const genreRoutes: SitemapUrlEntry[] = Object.keys(GENRE_MAP).map((slug) => ({
    loc: buildCanonicalUrl(`/genres/${slug}`, undefined, baseOrigin),
    lastmod: today,
    changefreq: 'weekly',
    priority: 0.75,
    title: `${GENRE_MAP[slug].name} Movies & TV`,
    category: 'Genres',
  }));

  // 3. Multi-Year Archives
  const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2015, 2010, 2000, 1990];
  const yearRoutes: SitemapUrlEntry[] = years.map((yr) => ({
    loc: buildCanonicalUrl(`/year/${yr}`, undefined, baseOrigin),
    lastmod: today,
    changefreq: 'weekly',
    priority: 0.7,
    title: `${yr} Cinema Releases Archive`,
    category: 'Years',
  }));

  // 4. Country & Regional Cinema Catalogs
  const countryRoutes: SitemapUrlEntry[] = Object.keys(COUNTRY_MAP).map((code) => ({
    loc: buildCanonicalUrl(`/country/${code}`, undefined, baseOrigin),
    lastmod: today,
    changefreq: 'weekly',
    priority: 0.7,
    title: `${COUNTRY_MAP[code].name} Cinema & Shows`,
    category: 'Countries',
  }));

  // 5. Streaming Networks & Broadcast Platforms
  const networkRoutes: SitemapUrlEntry[] = Object.keys(NETWORK_MAP).map((slug) => ({
    loc: buildCanonicalUrl(`/network/${slug}`, undefined, baseOrigin),
    lastmod: today,
    changefreq: 'weekly',
    priority: 0.7,
    title: `${NETWORK_MAP[slug].name} Streaming Catalog`,
    category: 'Networks',
  }));

  // 6. Curated Franchises & Sagas
  const collectionRoutes: SitemapUrlEntry[] = Object.keys(COLLECTIONS_DATA).map((slug) => ({
    loc: buildCanonicalUrl(`/collections/${slug}`, undefined, baseOrigin),
    lastmod: today,
    changefreq: 'weekly',
    priority: 0.75,
    title: `${COLLECTIONS_DATA[slug].name} Franchise`,
    category: 'Collections',
  }));

  // 7. Informational & Legal Pages
  const staticPages: SitemapUrlEntry[] = [
    {
      loc: buildCanonicalUrl('/pages/about', undefined, baseOrigin),
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.6,
      title: 'About Streamzy',
      category: 'Static Pages',
    },
    {
      loc: buildCanonicalUrl('/pages/contact', undefined, baseOrigin),
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.6,
      title: 'Contact Support & Inquiries',
      category: 'Static Pages',
    },
    {
      loc: buildCanonicalUrl('/pages/privacy', undefined, baseOrigin),
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.5,
      title: 'Privacy and Policy',
      category: 'Static Pages',
    },
    {
      loc: buildCanonicalUrl('/pages/terms', undefined, baseOrigin),
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.5,
      title: 'Terms and Conditions',
      category: 'Static Pages',
    },
    {
      loc: buildCanonicalUrl('/pages/dmca', undefined, baseOrigin),
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.5,
      title: 'DMCA Copyright Notice',
      category: 'Static Pages',
    },
    {
      loc: buildCanonicalUrl('/sitemap', undefined, baseOrigin),
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.6,
      title: 'Sitemap Index Directory',
      category: 'Static Pages',
    },
  ];

  return [
    ...coreRoutes,
    ...genreRoutes,
    ...yearRoutes,
    ...countryRoutes,
    ...networkRoutes,
    ...collectionRoutes,
    ...staticPages,
  ];
}

/**
 * Fetches dynamic popular/trending movies and TV shows from TMDB to generate detailed media sitemap entries.
 */
export async function fetchDynamicMediaSitemapEntries(origin: string = getOrigin()): Promise<SitemapUrlEntry[]> {
  const baseOrigin = origin || getOrigin();
  const today = new Date().toISOString().split('T')[0];
  const entries: SitemapUrlEntry[] = [];
  const seenIds = new Set<string>();

  try {
    const [trendingMovies, trendingTV, nowPlaying, topMovies] = await Promise.allSettled([
      tmdb.getTrending('movie', 'week', 1),
      tmdb.getTrending('tv', 'week', 1),
      tmdb.getNowPlaying(1),
      tmdb.getTopRated('movie', 1),
    ]);

    const addMovie = (item: MediaItem) => {
      const key = `movie-${item.id}`;
      if (!seenIds.has(key) && item.id) {
        seenIds.add(key);
        const slug = createSlug(item);
        const title = item.title || item.original_title || 'Movie';
        const year = (item.release_date || '').split('-')[0];
        const date = item.release_date || today;

        entries.push({
          loc: buildCanonicalUrl(`/movie/${slug}`, undefined, baseOrigin),
          lastmod: date,
          changefreq: 'weekly',
          priority: 0.8,
          title: `${title}${year ? ` (${year})` : ''}`,
          category: 'Movies',
        });
      }
    };

    const addTV = (item: MediaItem) => {
      const key = `tv-${item.id}`;
      if (!seenIds.has(key) && item.id) {
        seenIds.add(key);
        const slug = createSlug(item);
        const name = item.name || item.original_name || 'TV Show';
        const year = (item.first_air_date || '').split('-')[0];
        const date = item.first_air_date || today;

        entries.push({
          loc: buildCanonicalUrl(`/tv/${slug}`, undefined, baseOrigin),
          lastmod: date,
          changefreq: 'weekly',
          priority: 0.8,
          title: `${name}${year ? ` (${year})` : ''}`,
          category: 'TV Shows',
        });
      }
    };

    if (trendingMovies.status === 'fulfilled' && trendingMovies.value?.results) {
      trendingMovies.value.results.forEach(addMovie);
    }
    if (nowPlaying.status === 'fulfilled' && nowPlaying.value?.results) {
      nowPlaying.value.results.forEach(addMovie);
    }
    if (topMovies.status === 'fulfilled' && topMovies.value?.results) {
      topMovies.value.results.forEach(addMovie);
    }
    if (trendingTV.status === 'fulfilled' && trendingTV.value?.results) {
      trendingTV.value.results.forEach(addTV);
    }
  } catch (err) {
    console.warn('Failed to fetch dynamic TMDB sitemap items:', err);
  }

  return entries;
}

/**
 * Crawls all static and optional dynamic application routes into a unified list.
 */
export async function crawlApplicationRoutes(options: {
  origin?: string;
  includeDynamicMedia?: boolean;
} = {}): Promise<SitemapUrlEntry[]> {
  const origin = options.origin || getOrigin();
  const staticEntries = getStaticSitemapEntries(origin);

  if (options.includeDynamicMedia) {
    const dynamicEntries = await fetchDynamicMediaSitemapEntries(origin);
    return [...staticEntries, ...dynamicEntries];
  }

  return staticEntries;
}

/**
 * Generates an XML 1.0 sitemap string adhering strictly to the sitemaps.org 0.9 schema.
 */
export function generateSitemapXml(entries: SitemapUrlEntry[]): string {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
  ];

  for (const entry of entries) {
    lines.push('  <url>');
    lines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
    if (entry.lastmod) {
      lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
    }
    if (entry.changefreq) {
      lines.push(`    <changefreq>${escapeXml(entry.changefreq)}</changefreq>`);
    }
    if (typeof entry.priority === 'number') {
      lines.push(`    <priority>${entry.priority.toFixed(2)}</priority>`);
    }
    lines.push('  </url>');
  }

  lines.push('</urlset>');
  return lines.join('\n');
}

/**
 * Calculates high-level summary metrics from sitemap entries.
 */
export function getSitemapSummary(entries: SitemapUrlEntry[]): SitemapSummary {
  const categories: Record<string, number> = {};

  for (const entry of entries) {
    categories[entry.category] = (categories[entry.category] || 0) + 1;
  }

  return {
    totalUrls: entries.length,
    categories,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Triggers a browser download of the sitemap.xml file.
 */
export function downloadSitemapXml(xmlContent: string, filename = 'sitemap.xml'): void {
  if (typeof window === 'undefined') return;

  const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Copies XML content to the clipboard with modern fallback.
 */
export async function copySitemapToClipboard(xmlContent: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(xmlContent);
      return true;
    } catch {
      // Fallback
    }
  }

  if (typeof document !== 'undefined') {
    const textArea = document.createElement('textarea');
    textArea.value = xmlContent;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }

  return false;
}
