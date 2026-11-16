import React from 'react';
import { Film, ShieldCheck, Zap, Globe, Heart, ChevronRight, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="main-footer" className="bg-[#0b0b10] border-t border-white/10 mt-20 relative text-zinc-400">
      {/* Gradient glow top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand & Mission (Col 1-2) */}
          <div className="lg:col-span-2 space-y-4">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,172,193,0.5)]">
                <Film className="w-4 h-4 fill-white text-cyan-900" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                STREAM<span className="text-cyan-400">ZY</span>
              </span>
            </a>

            <p className="text-sm leading-relaxed text-zinc-400">
              Streamzy is the ultimate free online movies and TV series streaming guide. Explore millions of official TMDB titles, trailers, verified cast rosters, ratings, release calendars, and authorized streaming providers on Streamzy.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-zinc-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Metadata
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-zinc-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Fast Navigation
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-zinc-300">
                <Globe className="w-3.5 h-3.5 text-cyan-400" /> Global Cinema
              </span>
            </div>
          </div>

          {/* Quick Discover (Col 3) */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-6 after:h-0.5 after:bg-cyan-500">
              Discover
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/movies" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">Movies Directory</a></li>
              <li><a href="/tv-shows" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">TV Series</a></li>
              <li><a href="/trending" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">Trending This Week</a></li>
              <li><a href="/top-rated" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">Top Rated Films</a></li>
              <li><a href="/now-playing" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">In Theatres / Now Playing</a></li>
              <li><a href="/upcoming" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">Upcoming Releases</a></li>
              <li><a href="/airing-today" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">TV Airing Today</a></li>
            </ul>
          </div>

          {/* Popular Genres (Col 4) */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-6 after:h-0.5 after:bg-cyan-500">
              Top Genres
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/genres/action" className="hover:text-cyan-400 transition-colors">Action & Adventure</a></li>
              <li><a href="/genres/comedy" className="hover:text-cyan-400 transition-colors">Comedy Films</a></li>
              <li><a href="/genres/drama" className="hover:text-cyan-400 transition-colors">Drama Series</a></li>
              <li><a href="/genres/horror" className="hover:text-cyan-400 transition-colors">Horror & Thriller</a></li>
              <li><a href="/genres/scifi" className="hover:text-cyan-400 transition-colors">Sci-Fi & Fantasy</a></li>
              <li><a href="/genres/animation" className="hover:text-cyan-400 transition-colors">Animation & Anime</a></li>
              <li><a href="/genres" className="text-cyan-400 font-semibold hover:underline">All 16+ Genres →</a></li>
            </ul>
          </div>

          {/* Regions & Networks (Col 5) */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-6 after:h-0.5 after:bg-cyan-500">
              Browse By
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/country/india" className="hover:text-cyan-400 transition-colors">Indian Movies</a></li>
              <li><a href="/country/korea" className="hover:text-cyan-400 transition-colors">Korean Drama (K-Drama)</a></li>
              <li><a href="/country/usa" className="hover:text-cyan-400 transition-colors">Hollywood & US</a></li>
              <li><a href="/country/japan" className="hover:text-cyan-400 transition-colors">Japanese Cinema</a></li>
              <li><a href="/network/netflix" className="hover:text-cyan-400 transition-colors">Netflix Catalog</a></li>
              <li><a href="/network/amazon-prime" className="hover:text-cyan-400 transition-colors">Prime Video Catalog</a></li>
              <li><a href="/collections" className="hover:text-cyan-400 transition-colors font-semibold text-cyan-400">Popular Franchises →</a></li>
            </ul>
          </div>

          {/* Legal & Information (Col 6) */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-6 after:h-0.5 after:bg-cyan-500">
              Information
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/pages/about" className="hover:text-cyan-400 transition-colors">About Us</a></li>
              <li><a href="/pages/contact" className="hover:text-cyan-400 transition-colors">Contact Support</a></li>
              <li><a href="/pages/dmca" className="hover:text-cyan-400 transition-colors">DMCA Notice & Policy</a></li>
              <li><a href="/pages/privacy" className="hover:text-cyan-400 transition-colors">Privacy and Policy</a></li>
              <li><a href="/pages/terms" className="hover:text-cyan-400 transition-colors">Terms and Conditions</a></li>
            </ul>
          </div>
        </div>

        {/* Release Years Quick Directory Crawl Matrix */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Browse Movies by Release Year:
            </span>
            <span className="text-xs text-zinc-500">Historical & Future Calendars</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2010, 2000, 1990].map(
              (yr) => (
                <a
                  key={yr}
                  href={`/year/${yr}`}
                  className="px-3 py-1 rounded-md bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 text-zinc-300 border border-white/5 transition-colors"
                >
                  {yr} Movies
                </a>
              )
            )}
          </div>
        </div>

        {/* Informative SEO Content Box */}
        <div className="mt-10 p-6 rounded-2xl bg-zinc-900/30 border border-white/5 text-xs leading-relaxed space-y-2.5">
          <h3 className="text-sm font-bold text-white">About Streamzy - Watch Movies &amp; TV Shows Discovery Guide</h3>
          <p>
            Streamzy is built for cinema enthusiasts seeking fast movie streaming metadata, official HD trailers, verified cast rosters, runtime specifications, release schedules, and legitimate viewing provider information. Streamzy brings you curated collections across every genre, release year, network origin, and language.
          </p>
          <p className="text-zinc-500">
            Disclaimer: All movie and television data and images on Streamzy are supplied by TMDB under authorized APIs. Streamzy does not host copyrighted media files on its servers.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Streamzy. All rights reserved. Designed for Fast Streaming &amp; Modern Web Architecture.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4">
            <a href="/pages/about" className="hover:text-zinc-300 transition-colors">About Us</a>
            <a href="/pages/contact" className="hover:text-zinc-300 transition-colors">Contact</a>
            <a href="/pages/privacy" className="hover:text-zinc-300 transition-colors">Privacy and Policy</a>
            <a href="/pages/terms" className="hover:text-zinc-300 transition-colors">Terms and Conditions</a>
            <a href="/pages/dmca" className="hover:text-zinc-300 transition-colors">DMCA</a>
            <a href="/sitemap" className="hover:text-zinc-300 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
