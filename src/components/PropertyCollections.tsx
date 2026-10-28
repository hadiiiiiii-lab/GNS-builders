import React from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface PropertyCollectionsProps {
  onSelectCategory: (category: 'Apartments' | 'Villas & Townhouses' | 'Off-plan') => void;
}

export const PropertyCollections: React.FC<PropertyCollectionsProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-20 md:py-28 bg-[#F5F3ED] border-b border-[#E6E4DF] overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 space-y-24 md:space-y-32">
        {/* Composition 1: Residential Properties (Image Left, Text Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs border border-[#E0DDC6]/80 bg-[#E8E6DF] shadow-xs group">
              <img
                src="/gns/assets/Nourelle-at-MJL-Meraas-13-592x444.webp"
                alt="Nourelle at Madinat Jumeirah living residence"
                className="w-full h-full object-cover img-editorial"
                loading="lazy"
              />
              <div className="absolute top-4 left-4 bg-[#0E2338]/90 text-white text-[11px] uppercase tracking-widest px-3 py-1 rounded-xs backdrop-blur-xs">
                Residential Living
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
            <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#967C3B]">
              Residential Guidance
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-normal text-[#1A1918] font-editorial leading-[1.18] text-balance">
              Find a home that fits your life.
            </h2>
            <p className="text-base text-[#524F4B] leading-relaxed">
              Choosing a home in Dubai is an intimate decision that touches family, commute, community amenities, and long-term peace of mind. We curate private townhouses, serene garden villas, and waterfront apartments tailored precisely to your living requirements.
            </p>
            <ul className="space-y-2.5 text-xs text-[#524F4B] pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#BFA054] shrink-0" />
                <span>Verified ready properties & verified handover schedules</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#BFA054] shrink-0" />
                <span>Prime locations: Madinat Jumeirah, Dubai Hills & Downtown</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#BFA054] shrink-0" />
                <span>End-to-end conveyance & documentation support</span>
              </li>
            </ul>
            <div className="pt-2">
              <a
                href="#properties"
                onClick={() => onSelectCategory('Apartments')}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold tracking-wider uppercase text-white bg-[#0E2338] hover:bg-[#153452] rounded-xs shadow-xs transition-colors"
              >
                <span>Explore Homes</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#D8C492]" />
              </a>
            </div>
          </div>
        </div>

        {/* Composition 2: Off-Plan & Investment (Text Left, Image Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#967C3B]">
              Off-Plan & Growth
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-normal text-[#1A1918] font-editorial leading-[1.18] text-balance">
              Explore your next investment.
            </h2>
            <p className="text-base text-[#524F4B] leading-relaxed">
              Dubai’s premier developers introduce transformative master communities with phased payment schedules and strategic regional connectivity. GNS provides objective analysis on location viability, developer track record, and real market dynamics—without speculative promises or artificial yield claims.
            </p>
            <ul className="space-y-2.5 text-xs text-[#524F4B] pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#BFA054] shrink-0" />
                <span>Direct allocations with Emaar, Sobha, Danube, Meraas & Azizi</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#BFA054] shrink-0" />
                <span>Transparent developer payment plans & construction milestones</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#BFA054] shrink-0" />
                <span>Prudent, factual portfolio diversification guidance</span>
              </li>
            </ul>
            <div className="pt-2">
              <a
                href="#properties"
                onClick={() => onSelectCategory('Off-plan')}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold tracking-wider uppercase text-white bg-[#0E2338] hover:bg-[#153452] rounded-xs shadow-xs transition-colors"
              >
                <span>Explore Opportunities</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#D8C492]" />
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs border border-[#E0DDC6]/80 bg-[#E8E6DF] shadow-xs group">
              <img
                src="/gns/assets/Palace-Residence-at-Hill-Estate-Emaar-1-592x444.webp"
                alt="Palace Residences Hillside at Dubai Hills Estate"
                className="w-full h-full object-cover img-editorial"
                loading="lazy"
              />
              <div className="absolute top-4 left-4 bg-[#0E2338]/90 text-white text-[11px] uppercase tracking-widest px-3 py-1 rounded-xs backdrop-blur-xs">
                Masterplan Opportunities
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
