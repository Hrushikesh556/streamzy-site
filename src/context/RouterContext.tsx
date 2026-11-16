import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RouterContextType {
  path: string;
  pathname: string;
  searchParams: URLSearchParams;
  navigate: (to: string, options?: { replace?: boolean }) => void;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  pathname: '/',
  searchParams: new URLSearchParams(),
  navigate: () => {},
});

export const useRouter = () => useContext(RouterContext);

export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUrl, setCurrentUrl] = useState(() => window.location.pathname + window.location.search);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentUrl(window.location.pathname + window.location.search);
    };

    // Global interceptor for standard <a href="..."> links to keep client-side speed while keeping real hrefs
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      // Only handle internal links without special keys/attributes
      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('//') &&
        (!targetAttr || targetAttr === '_self') &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey &&
        e.button === 0
      ) {
        e.preventDefault();
        navigate(href);
      }
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  const navigate = (to: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      window.history.replaceState({}, '', to);
    } else {
      window.history.pushState({}, '', to);
    }
    setCurrentUrl(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const parsedUrl = new URL(currentUrl, window.location.origin);

  return (
    <RouterContext.Provider
      value={{
        path: currentUrl,
        pathname: parsedUrl.pathname,
        searchParams: parsedUrl.searchParams,
        navigate,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};
