import React, { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AppProvider, useApp } from './context/AppContext';
import { SEO, updateHeadTags, getOrigin } from './services/seo';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { PlayerModal } from './components/PlayerModal';
import { QuickViewModal } from './components/QuickViewModal';
import { BloggerExportModal } from './components/BloggerExportModal';

// Views
import { HomeView } from './views/HomeView';
import { MoviesView } from './views/MoviesView';
import { TVShowsView } from './views/TVShowsView';
import { GenreView } from './views/GenreView';
import { YearView } from './views/YearView';
import { CountryView } from './views/CountryView';
import { NetworkView } from './views/NetworkView';
import { CollectionView } from './views/CollectionView';
import { MovieDetailView } from './views/MovieDetailView';
import { TVDetailView } from './views/TVDetailView';
import { SeasonDetailView } from './views/SeasonDetailView';
import { SearchView } from './views/SearchView';
import { InfoPageView } from './views/InfoPageView';
import { WatchlistView } from './views/WatchlistView';
import { SitemapView } from './views/SitemapView';
import { NotFoundView } from './views/NotFoundView';

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
  const { toast } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#060608] text-white selection:bg-cyan-500 selection:text-white font-['Outfit',sans-serif]">
      {/* Route Metadata Synchronizer */}
      <RouteMetadataWatcher />

      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area with padding for BottomNav on mobile */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-12">
        <RouteDispatcher />
      </main>

      {/* Global Footer with crawlable links */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Floating Modals */}
      <PlayerModal />
      <QuickViewModal />
      <BloggerExportModal />

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
        <Analytics />
      </AppProvider>
    </RouterProvider>
  );
}

export default App;
