import React, { Suspense, lazy, useEffect } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AppProvider, useApp } from './context/AppContext';
import { SEO, updateHeadTags, getOrigin } from './services/seo';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './views/HomeView';
import { MediaGridSkeleton } from './components/SkeletonLoaders';

// Lazy-loaded modals (not parsed until user opens them)
const PlayerModal = lazy(() => import('./components/PlayerModal').then((m) => ({ default: m.PlayerModal })));
const QuickViewModal = lazy(() => import('./components/QuickViewModal').then((m) => ({ default: m.QuickViewModal })));
const BloggerExportModal = lazy(() => import('./components/BloggerExportModal').then((m) => ({ default: m.BloggerExportModal })));

// Lazy-loaded secondary route views
const MoviesView = lazy(() => import('./views/MoviesView').then((m) => ({ default: m.MoviesView })));
const TVShowsView = lazy(() => import('./views/TVShowsView').then((m) => ({ default: m.TVShowsView })));
const GenreView = lazy(() => import('./views/GenreView').then((m) => ({ default: m.GenreView })));
const YearView = lazy(() => import('./views/YearView').then((m) => ({ default: m.YearView })));
const CountryView = lazy(() => import('./views/CountryView').then((m) => ({ default: m.CountryView })));
const NetworkView = lazy(() => import('./views/NetworkView').then((m) => ({ default: m.NetworkView })));
const CollectionView = lazy(() => import('./views/CollectionView').then((m) => ({ default: m.CollectionView })));
const MovieDetailView = lazy(() => import('./views/MovieDetailView').then((m) => ({ default: m.MovieDetailView })));
const TVDetailView = lazy(() => import('./views/TVDetailView').then((m) => ({ default: m.TVDetailView })));
const SeasonDetailView = lazy(() => import('./views/SeasonDetailView').then((m) => ({ default: m.SeasonDetailView })));
const SearchView = lazy(() => import('./views/SearchView').then((m) => ({ default: m.SearchView })));
const InfoPageView = lazy(() => import('./views/InfoPageView').then((m) => ({ default: m.InfoPageView })));
const WatchlistView = lazy(() => import('./views/WatchlistView').then((m) => ({ default: m.WatchlistView })));
const SitemapView = lazy(() => import('./views/SitemapView').then((m) => ({ default: m.SitemapView })));
const NotFoundView = lazy(() => import('./views/NotFoundView').then((m) => ({ default: m.NotFoundView })));

const RouteFallback: React.FC = () => (
  <div className="space-y-8" aria-busy="true" aria-label="Loading page">
    <div className="h-44 sm:h-52 w-full rounded-3xl skeleton-shimmer border border-white/10" />
    <MediaGridSkeleton count={6} />
  </div>
);

const RouteDispatcher: React.FC = () => {
  const { pathname } = useRouter();

  // Normalize path
  const path = pathname.replace(/\/+$/, '') || '/';

  // 1. Root Home
  if (path === '/') {
    return <HomeView />;
  }

  // 2. Core Categories
  if (path === '/movies') {
    return <MoviesView category="popular" />;
  }
  if (path === '/new') {
    return <MoviesView category="new" />;
  }
  if (path === '/trending') {
    return <MoviesView category="trending" />;
  }
  if (path === '/top-rated') {
    return <MoviesView category="top-rated" />;
  }
  if (path === '/now-playing') {
    return <MoviesView category="now-playing" />;
  }
  if (path === '/upcoming') {
    return <MoviesView category="upcoming" />;
  }

  if (path === '/tv-shows') {
    return <TVShowsView />;
  }
  if (path === '/airing-today') {
    return <TVShowsView isAiringToday={true} />;
  }

  // 3. Genres
  if (path === '/genres') {
    return <GenreView />;
  }
  const genreMatch = path.match(/^\/genres\/([a-zA-Z0-9_-]+)$/);
  if (genreMatch) {
    return <GenreView genreSlug={genreMatch[1]} />;
  }

  // 4. Release Years
  const yearMatch = path.match(/^\/year\/([0-9]{4})$/);
  if (yearMatch) {
    return <YearView year={yearMatch[1]} />;
  }

  // 5. Countries
  const countryMatch = path.match(/^\/country\/([a-zA-Z0-9_-]+)$/);
  if (countryMatch) {
    return <CountryView countryCode={countryMatch[1]} />;
  }

  // 6. Networks / Platforms
  const networkMatch = path.match(/^\/network\/([a-zA-Z0-9_-]+)$/);
  if (networkMatch) {
    return <NetworkView networkSlug={networkMatch[1]} />;
  }

  // 7. Collections
  if (path === '/collections') {
    return <CollectionView />;
  }
  const collectionMatch = path.match(/^\/collections\/([a-zA-Z0-9_-]+)$/);
  if (collectionMatch) {
    return <CollectionView collectionSlug={collectionMatch[1]} />;
  }

  // 8. TV Season Detail: /tv/:slug/season/:seasonNumber
  const tvSeasonMatch = path.match(/^\/tv\/([a-zA-Z0-9_-]+)\/season\/([0-9]+)$/);
  if (tvSeasonMatch) {
    return <SeasonDetailView slug={tvSeasonMatch[1]} seasonNumber={tvSeasonMatch[2]} />;
  }

  // 9. TV Show Detail: /tv/:slug
  const tvMatch = path.match(/^\/tv\/([a-zA-Z0-9_-]+)$/);
  if (tvMatch) {
    return <TVDetailView slug={tvMatch[1]} />;
  }

  // 10. Movie Detail: /movie/:slug
  const movieMatch = path.match(/^\/movie\/([a-zA-Z0-9_-]+)$/);
  if (movieMatch) {
    return <MovieDetailView slug={movieMatch[1]} />;
  }

  // 11. Search
  if (path === '/search') {
    return <SearchView />;
  }

  // 12. Watchlist
  if (path === '/watchlist') {
    return <WatchlistView />;
  }

  // 13. Sitemap
  if (path === '/sitemap' || path === '/sitemap.xml') {
    return <SitemapView />;
  }

  // 14. Static Info Pages
  if (path === '/pages/about') {
    return <InfoPageView pageType="about" />;
  }
  if (path === '/pages/contact') {
    return <InfoPageView pageType="contact" />;
  }
  if (path === '/pages/privacy') {
    return <InfoPageView pageType="privacy" />;
  }
  if (path === '/pages/terms') {
    return <InfoPageView pageType="terms" />;
  }
  if (path === '/pages/dmca') {
    return <InfoPageView pageType="dmca" />;
  }

  // 15. 404 Fallback
  return <NotFoundView />;
};

const RouteMetadataWatcher: React.FC = () => {
  const { pathname, searchParams } = useRouter();

  useEffect(() => {
    // Dynamically update document title, meta description, and canonical tags for current route
    const config = SEO.getRouteSEO(pathname, searchParams, getOrigin());
    updateHeadTags(config);
  }, [pathname, searchParams]);

  return null;
};

const MainLayout: React.FC = () => {
  const { toasts, playerState, quickViewItem, isBloggerExportOpen } = useApp();
  const toast = toasts && toasts.length > 0 ? toasts[toasts.length - 1] : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#060608] text-white selection:bg-cyan-500 selection:text-white font-['Outfit',sans-serif]">
      {/* Route Metadata Synchronizer */}
      <RouteMetadataWatcher />

      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area with padding for BottomNav on mobile */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-12">
        <Suspense fallback={<RouteFallback />}>
          <RouteDispatcher />
        </Suspense>
      </main>

      {/* Global Footer with crawlable links */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Floating Modals (loaded on demand) */}
      <Suspense fallback={null}>
        {playerState.isOpen && <PlayerModal />}
        {quickViewItem.isOpen && <QuickViewModal />}
        {isBloggerExportOpen && <BloggerExportModal />}
      </Suspense>

      {/* Toast Notification Container */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-20 md:bottom-6 right-6 z-50 px-5 py-3 rounded-2xl text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-200 border ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
              : toast.type === 'error'
              ? 'bg-red-950/90 text-red-300 border-red-500/40'
              : 'bg-zinc-900/90 text-cyan-300 border-cyan-500/40'
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <RouterProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </RouterProvider>
  );
}

export default App;
