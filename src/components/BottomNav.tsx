import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useApp } from '../context/AppContext';
import { Home, Film, Tv, Heart, Search } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { pathname, navigate } = useRouter();
  const { watchlist } = useApp();

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0c12]/95 backdrop-blur-2xl border-t border-white/10 px-2 py-2 flex items-center justify-around"
    >
      <a
        href="/"
        className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-xl transition-colors ${
          pathname === '/' ? 'text-cyan-400 font-black' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Home className={`w-5 h-5 ${pathname === '/' ? 'text-cyan-400 stroke-[2.5]' : ''}`} />
        <span>Home</span>
      </a>

      <a
        href="/movies"
        className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-xl transition-colors ${
          pathname.startsWith('/movies') ? 'text-cyan-400 font-black' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Film className={`w-5 h-5 ${pathname.startsWith('/movies') ? 'text-cyan-400 stroke-[2.5]' : ''}`} />
        <span>Movies</span>
      </a>

      <a
        href="/tv-shows"
        className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-xl transition-colors ${
          pathname.startsWith('/tv-shows') ? 'text-cyan-400 font-black' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Tv className={`w-5 h-5 ${pathname.startsWith('/tv-shows') ? 'text-cyan-400 stroke-[2.5]' : ''}`} />
        <span>TV Shows</span>
      </a>

      <a
        href="/watchlist"
        className={`relative flex flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-xl transition-colors ${
          pathname === '/watchlist' ? 'text-cyan-400 font-black' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Heart className={`w-5 h-5 ${pathname === '/watchlist' ? 'text-cyan-400 stroke-[2.5]' : ''}`} />
        <span>My List</span>
        {watchlist.length > 0 && (
          <span className="absolute top-1 right-3 w-3.5 h-3.5 rounded-full bg-cyan-500 text-white text-[9px] font-black flex items-center justify-center">
            {watchlist.length}
          </span>
        )}
      </a>

      <a
        href="/search"
        className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-xl transition-colors ${
          pathname.startsWith('/search') ? 'text-cyan-400 font-black' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Search className={`w-5 h-5 ${pathname.startsWith('/search') ? 'text-cyan-400 stroke-[2.5]' : ''}`} />
        <span>Search</span>
      </a>
    </nav>
  );
};
