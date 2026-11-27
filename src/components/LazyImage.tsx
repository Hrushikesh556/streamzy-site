import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface LazyImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  fallbackSrc?: string;
  priority?: boolean;
  wrapperClassName?: string;
  rootMargin?: string;
}

const DEFAULT_FALLBACK =
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=342&auto=format&fit=crop&q=75';

function normalizeSrc(src: string | undefined, fallbackSrc: string): string {
  if (!src || src.endsWith('/null') || src.endsWith('/undefined')) {
    return fallbackSrc;
  }
  return src;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  priority = false,
  wrapperClassName = '',
  className = '',
  alt = '',
  rootMargin = '250px 0px',
  ...imgProps
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const resolvedInitialSrc = normalizeSrc(src, fallbackSrc);
  const prevSrcRef = useRef<string>(resolvedInitialSrc);

  const [shouldLoad, setShouldLoad] = useState<boolean>(priority);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [currentSrc, setCurrentSrc] = useState<string>(resolvedInitialSrc);

  useEffect(() => {
    if (priority && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [priority, shouldLoad]);

  useEffect(() => {
    const nextSrc = normalizeSrc(src, fallbackSrc);
    if (prevSrcRef.current !== nextSrc) {
      prevSrcRef.current = nextSrc;
      setCurrentSrc(nextSrc);
      setIsLoaded(false);
    }
  }, [src, fallbackSrc]);

  useEffect(() => {
    if (priority || shouldLoad) return;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin, threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [priority, shouldLoad, rootMargin]);

  // Immediately reveal cached images whose load event already completed before listener attachment
  useLayoutEffect(() => {
    if (!shouldLoad) return;
    const img = imgRef.current;
    if (img && img.complete) {
      if (img.naturalWidth > 0) {
        setIsLoaded(true);
      } else if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
      } else {
        setIsLoaded(true);
      }
    }
  }, [shouldLoad, currentSrc, fallbackSrc]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${wrapperClassName} ${
        !isLoaded ? 'skeleton-shimmer' : ''
      }`}
    >
      {shouldLoad && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'low'}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            if (fallbackSrc && currentSrc !== fallbackSrc) {
              setCurrentSrc(fallbackSrc);
            } else {
              setIsLoaded(true);
            }
          }}
          className={`${className} transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...imgProps}
        />
      )}
    </div>
  );
};

export default LazyImage;
