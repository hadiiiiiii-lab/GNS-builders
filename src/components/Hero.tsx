import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Play, Pause } from 'lucide-react';
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
        videoRef.current.play().catch(() => setIsPlaying(false));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full h-[88svh] min-h-[580px] max-h-[960px] flex items-end overflow-hidden bg-[#0A1622]"
      aria-label="GNS Real Estate Dubai Overview"
    >
      {/* Background Video Layer with Authentic Fallback */}
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
          alt="Dubai architectural skyline"
          className="absolute inset-0 w-full h-full object-cover scale-102 transition-transform duration-1000 ease-out"
          loading="eager"
        />
      )}

      {/* Lightened, targeted lower gradient overlay - keeps architecture visible while ensuring text clarity */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-[#0A1622]/85 via-[#0A1622]/25 to-transparent pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Main Content: Left-aligned 72-96px at 1440px */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 pb-16 md:pb-22">
        <div className="max-w-xl">
          {/* Main Short Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-normal text-white leading-[1.05] tracking-[-0.015em] font-editorial mb-6 text-balance">
            Find your place in Dubai.
          </h1>

          {/* One Primary Action Button */}
          <div>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold tracking-wider uppercase text-[#162E52] bg-[#FAF9F5] hover:bg-white rounded-xs shadow-md transition-colors focus-visible:outline-2 focus-visible:outline-white"
            >
              <span>Explore Properties</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#162E52]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Video Control: Positioned at Bottom-Left */}
      {GNS_CONFIG.heroVideoUrl && !hasVideoError && (
        <div className="absolute left-6 sm:left-12 lg:left-24 bottom-6 z-20">
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xs bg-[#0A1622]/70 hover:bg-[#0A1622] border border-white/20 text-white/80 hover:text-white transition-colors cursor-pointer backdrop-blur-xs text-xs"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-[#DEBF84]" />
            ) : (
              <Play className="w-3.5 h-3.5 text-[#DEBF84]" />
            )}
            <span className="text-[11px] font-mono tracking-wider uppercase">
              {isPlaying ? 'Pause' : 'Play'}
            </span>
          </button>
        </div>
      )}
    </section>
  );
};
