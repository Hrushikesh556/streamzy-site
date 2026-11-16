import React, { useEffect, useState } from 'react';
import { tmdb, TMDB_IMAGE, createSlug } from '../services/tmdb';
import { SEO, updateHeadTags, getOrigin } from '../services/seo';
import { MediaItem } from '../types';
import { useApp } from '../context/AppContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { MediaCard } from '../components/MediaCard';
import { ContentRow } from '../components/ContentRow';
import {
  Play,
  Youtube,
  Heart,
  Check,
  Star,
  Clock,
  Calendar,
  Globe,
  Film,
  Building,
  User,
  Share2,
  Copy,
  ChevronRight,
  Zap,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface MovieDetailViewProps {
  slug: string;
}

export const MovieDetailView: React.FC<MovieDetailViewProps> = ({ slug }) => {
  const { isInWatchlist, toggleWatchlist, openPlayer, openTrailer, showToast } = useApp();

  const [movie, setMovie] = useState<MediaItem | null>(null);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Set immediate readable title and canonical tag from slug
    updateHeadTags(SEO.getInitialMediaSEO(slug, 'movie', getOrigin()));

    const loadMovie = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await tmdb.resolveItemBySlug(slug, 'movie');
        if (data) {
          setMovie(data);
          updateHeadTags(SEO.getMovieSEO(data, getOrigin(), slug));

          // Fetch or extract recommendations
          setLoadingRecommendations(true);
          let recs = data.recommendations?.results?.filter((i) => i.poster_path) || [];
          if (recs.length < 6 && data.id) {
            try {
              const res = await tmdb.getRecommendations('movie', data.id);
              if (res.results && res.results.length > 0) {
                recs = res.results.filter((i) => i.poster_path);
              }
            } catch (recErr) {
              console.warn('TMDB movie recommendations fallback to similar', recErr);
              if (data.similar?.results) {
                recs = data.similar.results.filter((i) => i.poster_path);
              }
            }
          }
          setRecommendations(recs);
          setLoadingRecommendations(false);
        } else {
          setError(true);
          updateHeadTags(SEO.get404SEO(getOrigin()));
        }
      } catch (err) {
        console.error('Failed to load movie detail', err);
        setError(true);
        updateHeadTags(SEO.get404SEO(getOrigin()));
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [slug]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-64 bg-zinc-800 rounded-md" />
        <div className="h-96 w-full bg-zinc-900 rounded-3xl" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="text-center py-24 space-y-4">
        <Film className="w-16 h-16 text-zinc-600 mx-auto" />
        <h1 className="text-2xl font-black text-white">Movie Not Found</h1>
        <p className="text-sm text-zinc-400">The requested movie title could not be found or has moved.</p>
        <a
          href="/movies"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs transition-colors"
        >
          Browse All Movies
        </a>
      </div>
    );
  }

  const title = movie.title || movie.original_title || 'Movie';
  const year = (movie.release_date || '').split('-')[0] || '2026';
  const inWatchlist = isInWatchlist(movie.id);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';
  const runtimeStr = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A';
  const director = movie.credits?.crew?.find((c) => c.job === 'Director');
  const mainGenre = movie.genres && movie.genres.length > 0 ? movie.genres[0].name : 'Cinema';

  const trailerVideo = movie.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );

  const backdropUrl = movie.backdrop_path
    ? `${TMDB_IMAGE.ORIGINAL}${movie.backdrop_path}`
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600&auto=format&fit=crop&q=80';

  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE.W500}${movie.poster_path}`
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Movie link copied to clipboard!', 'info');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Check out "${title}" (${year}) on Streamzy!`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  return (
    <div className="space-y-10">
      {/* Breadcrumbs with Schema.org hierarchy */}
      <Breadcrumbs
        items={[
          { name: 'Movies', url: '/movies' },
          { name: mainGenre, url: `/genres/${mainGenre.toLowerCase()}` },
          { name: `${title} (${year})`, url: `/movie/${slug}` },
        ]}
      />

      {/* Hero Movie Presentation Header */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl">
        {/* Backdrop Ambient Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-xs"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[#060608]/85 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 lg:p-14 flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          {/* Poster Column */}
          <div className="w-48 sm:w-64 lg:w-72 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl bg-zinc-900 border border-white/15 shrink-0 mx-auto md:mx-0">
            <img
              src={posterUrl}
              alt={`${title} ${year} movie poster`}
              className="w-full h-full object-cover"
              width="300"
              height="450"
            />
          </div>

          {/* Details Column */}
          <div className="flex-1 space-y-5">
            {/* Badges & Meta */}
            <div className="flex items-center flex-wrap gap-2 text-xs font-bold">
              <span className="bg-cyan-500 text-white px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Movie
              </span>
              <span className="bg-white/10 text-zinc-300 border border-white/15 px-3 py-1 rounded-full">
                4K Ultra HD
              </span>
              <span className="flex items-center gap-1 bg-amber-400/10 text-amber-400 border border-amber-400/30 px-3 py-1 rounded-full font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {rating} / 10 ({movie.vote_count} votes)
              </span>
            </div>

            {/* H1 Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              {title}
            </h1>

            {/* Metadata specs row */}
            <div className="flex items-center flex-wrap gap-4 text-xs sm:text-sm font-semibold text-zinc-300">
              <a href={`/year/${year}`} className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors">
                <Calendar className="w-4 h-4 text-cyan-400" /> {year}
              </a>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" /> {runtimeStr}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 uppercase">
                <Globe className="w-4 h-4 text-cyan-400" /> {movie.original_language || 'EN'}
              </span>
              {director && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-cyan-400" /> Directed by {director.name}
                  </span>
                </>
              )}
            </div>

            {/* Genre tags with crawlable links */}
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((g) => (
                <a
                  key={g.id}
                  href={`/genres/${g.name.toLowerCase()}`}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 text-zinc-300 border border-white/10 transition-colors"
                >
                  {g.name}
                </a>
              ))}
            </div>

            {/* Synopsis */}
            <div className="space-y-1.5 pt-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Storyline</h3>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl">
                {movie.overview || 'No official synopsis provided for this title.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center flex-wrap gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => openPlayer(movie, 'movie')}
                className="px-7 py-3.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white font-extrabold text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(0,172,193,0.5)] transition-transform hover:scale-105"
              >
                <Play className="w-4 h-4 fill-white" /> Watch Stream
              </button>

              {trailerVideo && (
                <button
                  type="button"
                  onClick={() => openTrailer(movie, 'movie', trailerVideo.key)}
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center gap-2 border border-white/15 backdrop-blur-md transition-colors"
                >
                  <Youtube className="w-4 h-4 text-red-500" /> Watch Trailer
                </button>
              )}

              <button
                type="button"
                onClick={() => toggleWatchlist(movie, 'movie')}
                className={`px-5 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all ${
                  inWatchlist
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/15 text-white border border-white/15'
                }`}
              >
                {inWatchlist ? <Check className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                <span>{inWatchlist ? 'In My List' : 'Add to List'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                title="Copy share link"
                className="p-3.5 rounded-full bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white border border-white/15 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleShareTwitter}
                title="Share on Twitter"
                className="p-3.5 rounded-full bg-white/5 hover:bg-[#1DA1F2] text-zinc-300 hover:text-white border border-white/15 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Cast & Crew */}
      {movie.credits?.cast && movie.credits.cast.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            <h2 className="text-2xl font-black text-white">Top Billed Cast</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movie.credits.cast.slice(0, 12).map((cast) => (
              <div
                key={cast.id}
                className="p-3 rounded-xl bg-zinc-900/50 border border-white/5 space-y-2 text-center"
              >
                <img
                  src={
                    cast.profile_path
                      ? `${TMDB_IMAGE.W300}${cast.profile_path}`
                      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
                  }
                  alt={cast.name}
                  loading="lazy"
                  className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-white/10"
                />
                <div>
                  <h4 className="text-xs font-bold text-white truncate">{cast.name}</h4>
                  <p className="text-[11px] text-zinc-400 truncate">{cast.character}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Production & Additional Specifications */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-zinc-900/30 border border-white/10 text-xs">
        <div className="space-y-2">
          <span className="font-bold text-zinc-400 uppercase tracking-wider block">Production Companies:</span>
          <div className="flex flex-wrap gap-2 text-zinc-300 font-medium">
            {movie.production_companies && movie.production_companies.length > 0
              ? movie.production_companies.map((p) => p.name).join(', ')
              : 'Independent Production'}
          </div>
        </div>

        <div className="space-y-2">
          <span className="font-bold text-zinc-400 uppercase tracking-wider block">Status & Release Info:</span>
          <p className="text-zinc-300 font-medium">
            Status: {movie.status || 'Released'} • Release Date: {movie.release_date || 'N/A'}
          </p>
        </div>
      </section>

      {/* SEO Section: About {Movie Name} */}
      <section className="p-6 sm:p-8 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-3">
        <h2 className="text-xl font-bold text-white">About {title} ({year})</h2>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          {title} is a {year} {mainGenre.toLowerCase()} film {director ? `directed by ${director.name}` : ''}. Starring {movie.credits?.cast?.slice(0, 3).map((c) => c.name).join(', ') || 'an ensemble cast'}. Rated {rating}/10 on TMDB with a runtime of {runtimeStr}. Discover verified synopsis, official high definition trailers, and authorized digital streaming information.
        </p>
      </section>

      {/* Recommended for You / More Like This Horizontal List */}
      {(recommendations.length > 0 || loadingRecommendations) && (
        <ContentRow
          title="Recommended For You"
          items={recommendations}
          type="movie"
          isLoading={loadingRecommendations}
          showRank={false}
          icon={<Sparkles className="w-5 h-5 text-cyan-400" />}
          seeAllLink={`/genres/${mainGenre.toLowerCase()}`}
        />
      )}

      {/* Similar Movies */}
      {movie.similar?.results && movie.similar.results.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-cyan-400" />
              <h2 className="text-2xl font-black text-white">More Titles Like {title}</h2>
            </div>
            <a
              href={`/genres/${mainGenre.toLowerCase()}`}
              className="text-xs font-bold text-cyan-400 hover:text-white flex items-center gap-1"
            >
              More in {mainGenre} <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movie.similar.results
              .filter((i) => i.poster_path)
              .slice(0, 12)
              .map((sim) => (
                <MediaCard key={sim.id} item={sim} type="movie" />
              ))}
          </div>
        </section>
      )}
    </div>
  );
};
