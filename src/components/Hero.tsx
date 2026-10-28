import React, { useState, useRef } from 'react';
import { ArrowDown, ArrowUpRight, Play, Pause } from 'lucide-react';
import { GNS_CONFIG } from '../data/gnsData';

export const Hero: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasVideoError, setHasVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          // In case browser policy interrupts playback
          setIsPlaying(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full h-[88svh] min-h-[580px] max-h-[960px] flex items-end overflow-hidden bg-[#0A1622]"
      aria-label="Welcome to GNS Real Estate Dubai"
    >
      {/* Background Layer: Full-Width MP4 Video with Authentic Supplied GNS Poster & Fallback */}
      {GNS_CONFIG.heroVideoUrl && !hasVideoError ? (
        <video
          ref={videoRef}
          src={GNS_CONFIG.heroVideoUrl}
          poster={GNS_CONFIG.heroPosterImage}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setHasVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      ) : (
        <img
          src={GNS_CONFIG.heroPosterImage}
          alt="Dubai luxury architectural development"
          className="absolute inset-0 w-full h-full object-cover scale-102 transition-transform duration-1000 ease-out"
          loading="eager"
        />
      )}

      {/* Layered Architectural Gradient Overlay for Strong Text Legibility & Depth */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-[#0A1622]/95 via-[#0A1622]/55 to-[#0A1622]/25" 
        aria-hidden="true" 
      />
      
      {/* Top subtle vignette */}
      <div 
        className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#0A1622]/60 to-transparent pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-6 md:px-12 pb-14 md:pb-20">
        <div className="max-w-3xl">
          {/* Subtle architectural eyebrow */}
          <div className="inline-flex items-center gap-2 mb-4 text-[#D8C492] text-xs font-medium tracking-[0.2em] uppercase">
            <span>Dubai Real Estate</span>
            <span aria-hidden="true">·</span>
            <span>Advisory & Portfolio Guidance</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-white leading-[1.08] tracking-[-0.01em] font-editorial mb-6 text-balance">
            Find your place in Dubai.
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg md:text-xl text-white/80 font-normal leading-relaxed max-w-2xl mb-8 md:mb-10 text-balance">
            Discover homes, investment properties, and off-plan opportunities with GNS Real Estate. Thoughtful advisory rooted in market integrity.
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#properties"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-xs font-semibold tracking-wider uppercase text-[#0E2338] bg-[#F7F5EE] hover:bg-white rounded-sm shadow-md transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span>Explore Properties</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#BFA054]" />
            </a>

            <a
              href="#team"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-medium tracking-wider uppercase text-white/90 hover:text-white bg-white/10 hover:bg-white/15 border border-white/25 rounded-sm backdrop-blur-xs transition-all duration-200"
            >
              <span>Speak to Our Team</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#D8C492]" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Controls Strip: Discreet Play/Pause & Scroll Prompt */}
      <div className="absolute right-6 md:right-12 bottom-6 z-20 flex items-center gap-4 text-white/60 text-xs">
        {GNS_CONFIG.heroVideoUrl && !hasVideoError && (
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xs bg-[#0E2338]/80 hover:bg-[#0E2338] border border-white/20 text-white/85 hover:text-white transition-colors cursor-pointer backdrop-blur-xs shadow-xs"
            aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-[#D8C492]" />
            ) : (
              <Play className="w-3.5 h-3.5 text-[#D8C492]" />
            )}
            <span className="text-[11px] font-medium tracking-wider uppercase">
              {isPlaying ? 'Pause' : 'Play'}
            </span>
          </button>
        )}

        <a
          href="#intro"
          className="hidden md:flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors py-1 group"
          aria-label="Scroll to introduction"
        >
          <span className="text-[11px] uppercase tracking-widest">Scroll</span>
          <ArrowDown className="w-3 h-3 text-[#BFA054] animate-bounce" />
        </a>
      </div>
    </section>
  );
};
