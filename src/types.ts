export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  last_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  media_type?: 'movie' | 'tv';
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  origin_country?: string[];
  original_language?: string;
  production_companies?: { id: number; name: string; logo_path: string | null }[];
  networks?: { id: number; name: string; logo_path: string | null }[];
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  similar?: {
    results: MediaItem[];
  };
  recommendations?: {
    results: MediaItem[];
  };
  videos?: {
    results: VideoItem[];
  };
  seasons?: SeasonSummary[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface VideoItem {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface SeasonSummary {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string | null;
}

export interface EpisodeItem {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  air_date: string | null;
  still_path: string | null;
  vote_average: number;
  runtime?: number;
}

export interface SeasonDetail {
  id: number;
  _id?: string;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  air_date: string | null;
  episodes: EpisodeItem[];
}

export interface WatchlistItem {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  vote_average: number;
  year: string;
  addedAt?: number;
}

export interface ContinueWatchItem {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster: string | null;
  progress: number;
  season?: number;
  episode?: number;
}

export interface KeywordItem {
  id: number;
  name: string;
}

export interface PlatformConfig {
  id: string;
  name: string;
  code: string;
  region: string;
  logo?: string;
  color?: string;
  invert?: boolean;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface RouteMatch {
  route: string;
  params: Record<string, string>;
  query: URLSearchParams;
}
