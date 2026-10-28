import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const Introduction: React.FC = () => {
  return (
    <section id="intro" className="py-20 md:py-28 bg-[#FAF9F5] border-b border-[#E6E4DF]">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        {/* Subtle top indicator */}
        <div className="flex items-center gap-3 mb-10 md:mb-14">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#967C3B]">
            GNS REAL ESTATE · DUBAI
          </span>
          <div className="h-[1px] flex-1 bg-[#E6E4DF] max-w-[120px]" />
        </div>

        {/* Two-Column Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Expressive Heading & Clear Narrative */}
          <div className="lg:col-span-6 space-y-6 md:space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-normal text-[#1A1918] font-editorial leading-[1.14] tracking-[-0.01em] text-balance">
              Property decisions, thoughtfully guided.
            </h2>

            <p className="text-base md:text-lg text-[#524F4B] leading-relaxed">
              At GNS Real Estate, we assist private clients, homeowners, and international investors in navigating Dubai’s dynamic property landscape. From finding an enduring family residence to securing early allocations in landmark off-plan projects, our team provides transparent, grounded advice.
            </p>

            <p className="text-sm md:text-base text-[#6E6B66] leading-relaxed">
              We represent acquisitions, sales, leasing, and portfolio consultations across Dubai’s most sought-after waterfronts, golf estates, and central financial districts—partnering directly with the emirate’s premier developers.
            </p>

            <div className="pt-2 flex items-center gap-6 text-xs text-[#202020] font-medium">
              <a
                href="#properties"
                className="inline-flex items-center gap-1.5 text-[#0E2338] hover:text-[#BFA054] transition-colors border-b border-[#0E2338] pb-1"
              >
                <span>View curated properties</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <span className="text-[#C8C5BD]">/</span>
              <a
                href="#about"
                className="inline-flex items-center gap-1.5 text-[#5A5752] hover:text-[#0E2338] transition-colors pb-1"
              >
                <span>Our advisory approach</span>
              </a>
            </div>
          </div>

          {/* Right Column: Large Architectural Frame */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xs border border-[#E6E4DF] bg-[#ECEAE4] shadow-xs group">
              <img
                src="/gns/assets/Silva-Dubai-Creek-Emaar-2-592x444.webp"
                alt="Dubai Creek architectural residence preview"
                className="w-full h-full object-cover img-editorial"
                loading="lazy"
              />
              {/* Discreet Architectural Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 md:p-6 text-white flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#E3D1A5] font-medium">Dubai Creek Harbour</p>
                  <p className="text-sm font-editorial text-white/90">Curated residential developments</p>
                </div>
                <span className="text-[11px] font-mono text-white/60">GNS Advisory</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
