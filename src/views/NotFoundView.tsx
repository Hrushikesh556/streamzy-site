import React, { useEffect } from 'react';
import { SEO, updateHeadTags, getOrigin } from '../services/seo';
import { Film, Home, Search, Sparkles } from 'lucide-react';

export const NotFoundView: React.FC = () => {
  useEffect(() => {
    updateHeadTags(SEO.get404SEO(getOrigin()));
  }, []);

  return (
    <div className="text-center py-20 sm:py-32 max-w-xl mx-auto space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
        <Film className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-widest text-cyan-400">Error 404</span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">Page Not Found</h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          The link you followed may be broken, or the title might have been removed. Explore popular movies or use search to find what you are looking for.
        </p>
      </div>

      <div className="flex items-center justify-center flex-wrap gap-3 pt-2">
        <a
          href="/"
          className="px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
        >
          <Home className="w-4 h-4" /> Go to Homepage
        </a>
        <a
          href="/search"
          className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/10 transition-colors"
        >
          <Search className="w-4 h-4" /> Search Streamzy
        </a>
        <a
          href="/trending"
          className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/10 transition-colors"
        >
          <Sparkles className="w-4 h-4" /> Trending Titles
        </a>
      </div>
    </div>
  );
};
