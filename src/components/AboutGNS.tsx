import React from 'react';
import { ShieldCheck, Compass, Users2, ArrowUpRight } from 'lucide-react';
import { THREE_STEP_JOURNEY, DEVELOPER_PARTNERS } from '../data/gnsData';

export const AboutGNS: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-[#FAF9F5] border-b border-[#E6E4DF]">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 space-y-20 md:space-y-24">
        {/* Split Introduction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Large Image Frame */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xs border border-[#E6E4DF] bg-[#ECEAE4] shadow-xs">
              <img
                src="/gns/assets/Bentley-homes-by-Mira-development-5.webp"
                alt="Contemporary architecture in Dubai"
                className="w-full h-full object-cover img-editorial"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#0E2338]/90 text-white p-4 rounded-xs backdrop-blur-xs">
                <p className="text-[11px] uppercase tracking-wider text-[#D8C492]">Dubai Real Estate Advisory</p>
                <p className="text-sm font-editorial text-white/95">Dedicated personal representation across prime districts</p>
              </div>
            </div>
          </div>

          {/* Right: Company Introduction */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#967C3B]">
              About GNS Real Estate
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1918] font-editorial leading-[1.15] text-balance">
              Personal assistance in a market that moves quickly.
            </h2>

            <p className="text-base text-[#524F4B] leading-relaxed">
              Based in Dubai, GNS Real Estate LLC operates with a singular mandate: to provide buyers, sellers, and tenants with measured, honest counsel. In a market frequently characterized by fast-paced sales tactics, our advisors emphasize clarity, due diligence, and verified information.
            </p>

            <p className="text-sm md:text-base text-[#6E6B66] leading-relaxed">
              Whether you are acquiring a home for family life, seeking a seasonal pied-à-terre, or diversifying capital through off-plan allocations, we guide your transaction with personalized care and direct developer accountability.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#F2EFE9] border border-[#E6E4DF] rounded-xs">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0E2338] mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#BFA054]" />
                  <span>Direct Developer Access</span>
                </div>
                <p className="text-xs text-[#6E6B66] leading-relaxed">
                  Authorized relationships with premier builders across the UAE, ensuring genuine inventory and developer terms.
                </p>
              </div>

              <div className="p-4 bg-[#F2EFE9] border border-[#E6E4DF] rounded-xs">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0E2338] mb-1">
                  <Compass className="w-4 h-4 text-[#BFA054]" />
                  <span>Factual Guidance</span>
                </div>
                <p className="text-xs text-[#6E6B66] leading-relaxed">
                  Clear-eyed market evaluations free of speculative yield exaggerations or manufactured urgency.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Three-Step Client Journey */}
        <div className="pt-10 border-t border-[#E6E4DF]">
          <div className="max-w-2xl mb-12">
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#967C3B] block mb-2">
              How We Work
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-editorial font-normal text-[#1A1918]">
              A three-step client journey.
            </h3>
            <p className="text-sm md:text-base text-[#6E6B66] mt-2">
              Simple, transparent, and structured around your timeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {THREE_STEP_JOURNEY.map((item, idx) => (
              <div
                key={item.step}
                className="relative p-8 bg-[#F7F5EE] border border-[#E6E4DF] rounded-xs flex flex-col justify-between"
              >
                <div>
                  <span className="font-editorial text-4xl text-[#BFA054] block mb-4">
                    {item.step}
                  </span>
                  <h4 className="text-lg font-semibold text-[#1A1918] mb-3">
                    {item.title}
                  </h4>
                  <p className="text-sm text-[#524F4B] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {idx < 2 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-[1px] bg-[#D4D0C6]" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Developer Partners Strip - Verified Supplied Logos */}
        <div className="pt-8 border-t border-[#E6E4DF]">
          <div className="text-center mb-8">
            <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#7A7771]">
              Trusted Developer Collaborations Across Dubai
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
            {DEVELOPER_PARTNERS.map((partner) => (
              <div
                key={partner.name}
                className="h-16 flex items-center justify-center p-3 bg-white border border-[#E6E4DF] rounded-xs grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-300"
                title={partner.name}
              >
                <img
                  src={partner.logo}
                  alt={`${partner.name} Logo`}
                  className="max-h-10 max-w-[120px] object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
