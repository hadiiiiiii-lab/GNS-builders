import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const PageTransitionOverlay: React.FC = () => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const prevPathnameRef = useRef<string>(location.pathname);
  const isFirstMountRef = useRef<boolean>(true);
  const safetyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Skip transition on initial direct page load / refresh
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      prevPathnameRef.current = location.pathname;
      return;
    }

    // Skip if pathname hasn't actually changed (e.g. search param changes on /properties)
    if (prevPathnameRef.current === location.pathname) {
      return;
    }
    prevPathnameRef.current = location.pathname;

    // Check reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Just a brief 150ms fade or no overlay
      window.scrollTo(0, 0);
      focusMainHeading();
      return;
    }

    // Start transition
    setIsTransitioning(true);
    setIsFadingOut(false);

    // Scroll to top immediately as new route renders underneath
    window.scrollTo(0, 0);

    // Start fade out at ~600ms, complete by ~800ms
    const fadeTimer = window.setTimeout(() => {
      setIsFadingOut(true);
    }, 600);

    const endTimer = window.setTimeout(() => {
      setIsTransitioning(false);
      setIsFadingOut(false);
      focusMainHeading();
    }, 800);

    // Hard safety timeout: ensure screen is never covered
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    safetyTimeoutRef.current = window.setTimeout(() => {
      setIsTransitioning(false);
      setIsFadingOut(false);
    }, 900);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    };
  }, [location.pathname]);

  const focusMainHeading = () => {
    // Move accessibility focus to main heading
    requestAnimationFrame(() => {
      const heading = document.querySelector('main h1') as HTMLElement;
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    });
  };

  if (!isTransitioning) return null;

  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-[#FAF9F5] transition-opacity duration-200 ease-out ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center justify-center p-6">
        {/* Architectural sketch animation */}
        <svg
          className="w-24 h-24 text-[#1A1918]"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Foundation Line (draws first) */}
          <line
            x1="12"
            y1="85"
            x2="88"
            y2="85"
            stroke="#1A1918"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="animate-draw-foundation"
          />

          {/* Foundation Anchor Dots */}
          <circle cx="12" cy="85" r="1.5" fill="#BFA054" />
          <circle cx="88" cy="85" r="1.5" fill="#BFA054" />

          {/* Structural Columns & Floor Plates (draws second) */}
          <path
            d="M 28 85 L 28 42 M 50 85 L 50 22 M 72 85 L 72 54 M 28 68 L 72 68 M 28 54 L 72 54 M 28 42 L 50 42"
            stroke="#1A1918"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-draw-structure"
          />

          {/* Rooflines & Tower Crowns (draws third) */}
          <path
            d="M 24 42 L 52 42 M 46 22 L 76 22 M 68 54 L 76 54 M 50 18 L 50 22"
            stroke="#BFA054"
            strokeWidth="1.4"
            strokeLinecap="round"
            className="animate-draw-roof"
          />
        </svg>

        <span className="mt-3 text-[10px] font-mono uppercase tracking-[0.25em] text-[#7A7771]">
          GNS
        </span>
      </div>
    </div>
  );
};

export default PageTransitionOverlay;
