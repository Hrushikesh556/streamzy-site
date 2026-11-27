import React from 'react';

export const MediaCardSkeleton: React.FC = () => (
  <div
    aria-hidden="true"
    className="flex flex-col bg-[#12121a] rounded-xl overflow-hidden border border-white/5"
  >
    {/* 2:3 Poster frame */}
    <div className="relative aspect-[2/3] w-full skeleton-shimmer">
      <div className="absolute top-2.5 left-2.5 w-7 h-4 rounded bg-white/10" />
    </div>

    {/* Card footer */}
    <div className="p-3 space-y-2">
      <div className="h-3.5 w-4/5 rounded-md skeleton-shimmer" />
      <div className="flex items-center justify-between">
        <div className="h-3 w-10 rounded skeleton-shimmer" />
        <div className="h-3 w-11 rounded skeleton-shimmer" />
      </div>
    </div>
  </div>
);

interface MediaGridSkeletonProps {
  count?: number;
  columnsClass?: string;
}

export const MediaGridSkeleton: React.FC<MediaGridSkeletonProps> = ({
  count = 18,
  columnsClass = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4',
}) => (
  <div className={`grid ${columnsClass}`} aria-busy="true" aria-label="Loading titles">
    {Array.from({ length: count }).map((_, i) => (
      <MediaCardSkeleton key={i} />
    ))}
  </div>
);

export const ContentRowSkeleton: React.FC<{ count?: number }> = ({ count = 7 }) => (
  <div className="flex gap-4 overflow-hidden pb-4" aria-busy="true" aria-label="Loading row">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="shrink-0 w-36 sm:w-44 md:w-48">
        <MediaCardSkeleton />
      </div>
    ))}
  </div>
);

export const HeroSkeleton: React.FC = () => (
  <section aria-busy="true" aria-label="Loading featured titles" className="w-full mb-10">
    <div className="relative w-full h-[65vh] min-h-[500px] max-h-[760px] rounded-2xl lg:rounded-3xl overflow-hidden bg-zinc-950 border border-white/10">
      <div className="absolute inset-0 skeleton-shimmer opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end max-w-7xl">
          <div className="lg:col-span-8 space-y-4 max-w-3xl">
            {/* Badges */}
            <div className="flex items-center gap-2">
              <div className="h-6 w-36 rounded-full skeleton-shimmer" />
              <div className="h-6 w-20 rounded-full skeleton-shimmer" />
              <div className="h-6 w-24 rounded-full skeleton-shimmer" />
            </div>

            {/* Title */}
            <div className="space-y-2.5">
              <div className="h-3.5 w-44 rounded skeleton-shimmer" />
              <div className="h-10 sm:h-14 w-4/5 rounded-xl skeleton-shimmer" />
            </div>

            {/* Meta stats */}
            <div className="flex items-center gap-3">
              <div className="h-7 w-28 rounded-full skeleton-shimmer" />
              <div className="h-4 w-12 rounded skeleton-shimmer" />
              <div className="h-4 w-32 rounded skeleton-shimmer" />
            </div>

            {/* Overview */}
            <div className="space-y-2 max-w-2xl">
              <div className="h-4 w-full rounded skeleton-shimmer" />
              <div className="h-4 w-5/6 rounded skeleton-shimmer" />
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 pt-2">
              <div className="h-12 w-36 rounded-full skeleton-shimmer" />
              <div className="h-12 w-28 rounded-full skeleton-shimmer" />
              <div className="h-12 w-28 rounded-full skeleton-shimmer" />
              <div className="h-12 w-12 rounded-full skeleton-shimmer" />
            </div>
          </div>

          {/* Floating poster placeholder */}
          <div className="hidden lg:flex lg:col-span-4 justify-end items-end pb-2">
            <div className="w-[200px] aspect-[2/3] rounded-2xl skeleton-shimmer border border-white/10" />
          </div>
        </div>
      </div>
    </div>

    {/* Desktop thumbnail bar skeleton */}
    <div className="hidden md:grid grid-cols-8 gap-2 mt-3 px-1">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-13 rounded-xl bg-zinc-900/50 border border-white/5 p-1.5 flex items-center gap-2"
        >
          <div className="w-7 h-10 rounded-md skeleton-shimmer shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 w-full rounded skeleton-shimmer" />
            <div className="h-2 w-8 rounded skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const DetailPageSkeleton: React.FC = () => (
  <div className="space-y-10" aria-busy="true" aria-label="Loading details">
    {/* Breadcrumbs */}
    <div className="h-4 w-64 rounded-md skeleton-shimmer" />

    {/* Hero Detail Presentation Card */}
    <div className="rounded-3xl overflow-hidden border border-white/10 bg-zinc-950/90 p-6 sm:p-10 lg:p-14">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
        {/* Poster */}
        <div className="w-48 sm:w-64 lg:w-72 aspect-[2/3] rounded-2xl skeleton-shimmer border border-white/10 shrink-0 mx-auto md:mx-0" />

        {/* Details Column */}
        <div className="flex-1 w-full space-y-5">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-20 rounded-full skeleton-shimmer" />
            <div className="h-6 w-28 rounded-full skeleton-shimmer" />
            <div className="h-6 w-36 rounded-full skeleton-shimmer" />
          </div>

          {/* H1 Title */}
          <div className="h-10 sm:h-14 w-3/4 rounded-xl skeleton-shimmer" />

          {/* Meta row */}
          <div className="flex flex-wrap gap-4">
            <div className="h-4 w-16 rounded skeleton-shimmer" />
            <div className="h-4 w-20 rounded skeleton-shimmer" />
            <div className="h-4 w-14 rounded skeleton-shimmer" />
            <div className="h-4 w-36 rounded skeleton-shimmer" />
          </div>

          {/* Genre chips */}
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-20 rounded-full skeleton-shimmer" />
            <div className="h-6 w-24 rounded-full skeleton-shimmer" />
            <div className="h-6 w-16 rounded-full skeleton-shimmer" />
          </div>

          {/* Storyline */}
          <div className="space-y-2 pt-2">
            <div className="h-3 w-20 rounded skeleton-shimmer" />
            <div className="h-4 w-full rounded skeleton-shimmer" />
            <div className="h-4 w-11/12 rounded skeleton-shimmer" />
            <div className="h-4 w-3/4 rounded skeleton-shimmer" />
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
            <div className="h-12 w-40 rounded-full skeleton-shimmer" />
            <div className="h-12 w-36 rounded-full skeleton-shimmer" />
            <div className="h-12 w-32 rounded-full skeleton-shimmer" />
            <div className="h-12 w-12 rounded-full skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>

    {/* Cast Roster Skeleton */}
    <section className="space-y-4">
      <div className="h-7 w-48 rounded-lg skeleton-shimmer" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="p-3 rounded-xl bg-zinc-900/50 border border-white/5 space-y-2.5 flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-full skeleton-shimmer" />
            <div className="h-3 w-24 rounded skeleton-shimmer" />
            <div className="h-2.5 w-16 rounded skeleton-shimmer" />
          </div>
        ))}
      </div>
    </section>

    {/* Recommendations Row Skeleton */}
    <section className="space-y-4">
      <div className="h-7 w-56 rounded-lg skeleton-shimmer" />
      <ContentRowSkeleton count={6} />
    </section>
  </div>
);

export const SeasonDetailSkeleton: React.FC = () => (
  <div className="space-y-10" aria-busy="true" aria-label="Loading season guide">
    <div className="h-4 w-72 rounded-md skeleton-shimmer" />

    {/* Season Header Banner */}
    <div className="p-6 sm:p-10 rounded-3xl bg-zinc-900/60 border border-white/10 flex flex-col md:flex-row gap-6 items-start">
      <div className="w-36 aspect-[2/3] rounded-xl skeleton-shimmer shrink-0" />
      <div className="flex-1 w-full space-y-3">
        <div className="h-3.5 w-32 rounded skeleton-shimmer" />
        <div className="h-9 w-2/3 rounded-xl skeleton-shimmer" />
        <div className="h-4 w-48 rounded skeleton-shimmer" />
        <div className="space-y-2 pt-1 max-w-2xl">
          <div className="h-4 w-full rounded skeleton-shimmer" />
          <div className="h-4 w-4/5 rounded skeleton-shimmer" />
        </div>
        <div className="flex gap-2 pt-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-7 w-20 rounded-xl skeleton-shimmer" />
          ))}
        </div>
      </div>
    </div>

    {/* Episode List Skeleton */}
    <div className="space-y-4">
      <div className="h-7 w-60 rounded-lg skeleton-shimmer" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-white/10 flex flex-col md:flex-row gap-5 items-start md:items-center"
        >
          <div className="w-full md:w-56 aspect-video rounded-xl skeleton-shimmer shrink-0" />
          <div className="flex-1 w-full space-y-2.5">
            <div className="h-5 w-1/2 rounded skeleton-shimmer" />
            <div className="h-3.5 w-40 rounded skeleton-shimmer" />
            <div className="h-3.5 w-full rounded skeleton-shimmer" />
            <div className="h-3.5 w-5/6 rounded skeleton-shimmer" />
          </div>
          <div className="h-10 w-36 rounded-full skeleton-shimmer shrink-0" />
        </div>
      ))}
    </div>
  </div>
);

export const EpisodeGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-6" aria-busy="true">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="p-3 rounded-xl bg-zinc-800/30 border border-white/5 flex gap-3.5 items-start"
      >
        <div className="w-28 sm:w-32 aspect-video rounded-lg skeleton-shimmer shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-4/5 rounded skeleton-shimmer" />
          <div className="h-3 w-full rounded skeleton-shimmer" />
          <div className="h-3 w-2/3 rounded skeleton-shimmer" />
        </div>
      </div>
    ))}
  </div>
);
