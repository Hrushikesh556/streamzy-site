import React, { useState, useEffect, useMemo } from 'react';
import { SEO, updateHeadTags, getOrigin } from '../services/seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  FileCode,
  Copy,
  Check,
  Download,
  Globe,
  RefreshCw,
  Search,
  CheckCircle2,
  ExternalLink,
  Layers,
  Film,
  Tv,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useRouter } from '../context/RouterContext';
import {
  SitemapUrlEntry,
  getStaticSitemapEntries,
  fetchDynamicMediaSitemapEntries,
  generateSitemapXml,
  getSitemapSummary,
  downloadSitemapXml,
  copySitemapToClipboard,
} from '../services/sitemap';

export const SitemapView: React.FC = () => {
  const { showToast } = useApp();
  const { pathname } = useRouter();
  const [viewMode, setViewMode] = useState<'html' | 'xml'>(() => (pathname === '/sitemap.xml' ? 'xml' : 'html'));
  const [includeDynamic, setIncludeDynamic] = useState<boolean>(true);
  const [loadingDynamic, setLoadingDynamic] = useState<boolean>(false);
  const [entries, setEntries] = useState<SitemapUrlEntry[]>(() => getStaticSitemapEntries());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copied, setCopied] = useState<boolean>(false);

  // Set page SEO metadata
  useEffect(() => {
    updateHeadTags(
      SEO.getDirectorySEO(
        'Sitemap Index - Search Engine XML Feed & Route Index',
        'Complete Google-compliant XML sitemap and directory index of all public movies, TV shows, genres, release years, platforms, and legal pages.',
        '/sitemap',
        getOrigin()
      )
    );
  }, []);

  // Fetch dynamic items if toggle is active
  useEffect(() => {
    let isMounted = true;
    const staticEntries = getStaticSitemapEntries(getOrigin());

    if (!includeDynamic) {
      setEntries(staticEntries);
      return;
    }

    setLoadingDynamic(true);
    fetchDynamicMediaSitemapEntries(getOrigin())
      .then((dynamicEntries) => {
        if (isMounted) {
          setEntries([...staticEntries, ...dynamicEntries]);
        }
      })
      .catch((err) => {
        console.warn('Error crawling dynamic media routes:', err);
        if (isMounted) {
          setEntries(staticEntries);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoadingDynamic(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [includeDynamic]);

  // Generate XML content memoized
  const xmlContent = useMemo(() => {
    return generateSitemapXml(entries);
  }, [entries]);

  // Summary statistics
  const summary = useMemo(() => {
    return getSitemapSummary(entries);
  }, [entries]);

  // Filtered entries for HTML view
  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      const matchesSearch =
        !searchQuery.trim() ||
        (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.loc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [entries, searchQuery, selectedCategory]);

  const handleCopyXml = async () => {
    const success = await copySitemapToClipboard(xmlContent);
    if (success) {
      setCopied(true);
      showToast('Sitemap XML copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } else {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleDownloadXml = () => {
    downloadSitemapXml(xmlContent, 'sitemap.xml');
    showToast('Downloaded sitemap.xml', 'success');
  };

  const categories = ['All', ...Object.keys(summary.categories)];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs items={[{ name: 'Sitemap', url: '/sitemap' }]} />

      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl backdrop-blur-md">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider">
            <Globe className="w-4 h-4" />
            <span>Search Engine Index & Feed</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Sitemap Directory & XML Feed
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Crawls and provides a strictly structured sitemap conforming to sitemaps.org 0.9 standards. 
            Indexed <span className="text-cyan-300 font-bold">{summary.totalUrls}</span> canonical URLs with priority and change frequencies.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Mode Switcher */}
          <div className="flex items-center bg-zinc-950 p-1.5 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode('html')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'html' ? 'bg-cyan-500 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Interactive Index
            </button>
            <button
              type="button"
              onClick={() => setViewMode('xml')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'xml' ? 'bg-cyan-500 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              XML Feed
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownloadXml}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/10 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download .XML</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-1">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Total URLs</span>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            {summary.totalUrls}
            {loadingDynamic && <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-1">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Category Hubs</span>
          <div className="text-2xl font-black text-cyan-400">
            {Object.keys(summary.categories).length}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-1">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Protocol</span>
          <div className="text-sm font-mono font-bold text-emerald-400 pt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            sitemaps.org 0.9
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-1">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Dynamic Crawl</span>
          <div className="pt-0.5">
            <button
              type="button"
              onClick={() => setIncludeDynamic(!includeDynamic)}
              className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                includeDynamic
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                  : 'bg-zinc-800 text-zinc-400 border-white/10'
              }`}
            >
              {includeDynamic ? 'Live TMDB Included' : 'Static Only'}
            </button>
          </div>
        </div>
      </div>

      {/* Main View Mode Container */}
      {viewMode === 'html' ? (
        <div className="space-y-6">
          {/* Filters and Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-white/10">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  {cat} {cat !== 'All' && `(${summary.categories[cat] || 0})`}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search indexed routes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Results Grid / Table */}
          <div className="rounded-2xl bg-zinc-900/40 border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950/80 border-b border-white/10 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Route / Title</th>
                    <th className="py-3.5 px-4">Canonical URL</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Change Freq</th>
                    <th className="py-3.5 px-4 text-right">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredEntries.map((item, idx) => (
                    <tr key={`${item.loc}-${idx}`} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <a
                          href={item.loc}
                          className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                        >
                          <span>{item.title || item.loc}</span>
                          <ExternalLink className="w-3 h-3 text-zinc-500" />
                        </a>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-zinc-400 select-all max-w-[280px] truncate">
                        {item.loc}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-semibold text-[10px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400 capitalize">
                        {item.changefreq || 'weekly'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-cyan-300">
                        {item.priority !== undefined ? item.priority.toFixed(2) : '0.80'}
                      </td>
                    </tr>
                  ))}

                  {filteredEntries.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-zinc-500">
                        No routes match your search filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* XML Feed Mode */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-white/10">
            <div className="text-xs text-zinc-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Valid XML 1.0 feed ready for Google Search Console, Bing Webmaster, and Yandex.</span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleCopyXml}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied XML!' : 'Copy XML Feed'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadXml}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors border border-white/10"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Save sitemap.xml</span>
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl bg-black border border-white/10 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-950 border-b border-white/10 text-xs font-mono text-zinc-400">
              <span>sitemap.xml ({summary.totalUrls} URLs)</span>
              <span className="text-[10px] text-zinc-500">UTF-8 • text/xml</span>
            </div>
            <pre className="p-5 text-xs font-mono text-cyan-300 overflow-x-auto max-h-[640px] leading-relaxed selection:bg-cyan-900 selection:text-white">
              {xmlContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
export default SitemapView;
