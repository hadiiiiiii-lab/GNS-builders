import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

// Lazy-load the isolated 3D model component for optimal initial performance
const ArchitecturalModel3D = lazy(() => import('./ArchitecturalModel3D'));

// Clean, lightweight architectural fallback while 3D initializes
const ModelFallback: React.FC = () => (
  <div className="w-full h-[380px] sm:h-[460px] lg:h-[520px] flex items-center justify-center p-6 bg-[#F4F1EA]/60 rounded-xs border border-[#E6E4DF]/60">
    <div className="text-center space-y-3 opacity-60">
      <svg
        className="w-20 h-28 mx-auto text-[#162E52]"
        viewBox="0 0 80 110"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="8" y1="102" x2="72" y2="102" />
        <rect x="18" y="32" width="28" height="70" />
        <rect x="34" y="16" width="28" height="86" />
        <line x1="18" y1="52" x2="46" y2="52" />
        <line x1="18" y1="72" x2="46" y2="72" />
        <line x1="34" y1="36" x2="62" y2="36" />
        <line x1="34" y1="56" x2="62" y2="56" />
        <line x1="34" y1="76" x2="62" y2="76" />
      </svg>
      <span className="text-[11px] font-mono uppercase tracking-widest text-[#736F68]">
        Architectural Scale Model
      </span>
    </div>
  </div>
);

export const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative w-full min-h-[580px] lg:h-[82svh] lg:max-h-[820px] flex items-center bg-[#FAF9F5] border-b border-[#E6E4DF] overflow-hidden"
      aria-label="GNS Real Estate Dubai Overview"
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 py-16 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Short Headline, Brief Supporting Text, One Primary CTA */}
          <div className="lg:col-span-6 space-y-6 z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-normal text-[#1A1918] leading-[1.08] tracking-[-0.02em] font-heading text-balance">
              Find your place in Dubai.
            </h1>

            <p className="text-base sm:text-lg text-[#524F4B] font-normal leading-relaxed max-w-lg text-balance">
              Discover homes, investment properties and off-plan opportunities with GNS Real Estate.
            </p>

            <div className="pt-2">
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold tracking-wider uppercase text-white bg-[#162E52] hover:bg-[#22417C] rounded-xs shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-[#162E52]"
              >
                <span>Explore Properties</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#DEBF84]" />
              </Link>
            </div>
          </div>

          {/* Right Column: Refined 3D Architectural Scale Model */}
          <div className="lg:col-span-6 relative w-full flex items-center justify-center">
            <div className="w-full max-w-[560px] mx-auto">
              <Suspense fallback={<ModelFallback />}>
                <ArchitecturalModel3D />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
