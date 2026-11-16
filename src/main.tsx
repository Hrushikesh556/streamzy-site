// Safeguard window.fetch in restricted iframe environments
try {
  if (typeof window !== 'undefined' && window.fetch) {
    const origFetch = window.fetch;
    const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (!desc || !desc.set || !desc.writable) {
      let activeFetch = typeof origFetch === 'function' ? origFetch.bind(window) : origFetch;
      try {
        Object.defineProperty(window, 'fetch', {
          get: () => activeFetch,
          set: (fn) => { activeFetch = fn; },
          configurable: true,
          enumerable: true,
        });
      } catch {
        // Fallback for proto
      }
    }
  }
} catch {
  // Ignore
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

