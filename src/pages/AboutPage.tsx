import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ShieldCheck, Users } from 'lucide-react';
import { DEVELOPER_PARTNERS, GNS_CONFIG } from '../data/gnsData';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-16 md:py-24 bg-[#FAF9F5]">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 space-y-20 md:space-y-28">
        {/* Page Hero / Narrative */}
        <div className="max-w-3xl space-y-6">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#162E52] block">
            About GNS Real Estate
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-editorial font-normal text-[#1A1918] leading-[1.12] text-balance">
            Personal guidance across Dubai's property market.
          </h1>
          <p className="text-base sm:text-lg text-[#4A4844] leading-relaxed">
            GNS Real Estate LLC is an established property brokerage based in Dubai. We assist homeowners, tenants and investors with clear, dependable guidance across residential and off-plan properties.
          </p>
        </div>

        {/* 40/60 Split Architectural Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-editorial font-normal text-[#1A1918]">
              A practical, transparent advisory approach.
            </h2>
            <p className="text-base text-[#524F4B] leading-relaxed">
              Navigating property choices in Dubai requires accurate local context. We help clients compare communities, assess true handover timelines, understand developer track records, and review contract terms thoroughly before making a commitment.
            </p>
            <p className="text-base text-[#524F4B] leading-relaxed">
              Our team operates with a commitment to straightforward communication: providing balanced assessments of location benefits, infrastructure access, and real market conditions.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs border border-[#E6E4DF] bg-[#ECEAE4]">
              <img
                src="/gns/assets/Bentley-homes-by-Mira-development-5.webp"
                alt="Dubai luxury architecture"
                className="w-full h-full object-cover img-editorial"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* The 3-Step Client Journey */}
        <div className="pt-8 border-t border-[#E6E4DF] space-y-12">
          <div className="max-w-xl">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#162E52] block mb-2">
              Our Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial font-normal text-[#1A1918]">
              How we work with you
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#F4F1EA] border border-[#E6E4DF] rounded-xs space-y-3">
              <span className="text-3xl font-editorial text-[#BFA054] block">01</span>
              <h3 className="text-lg font-semibold text-[#1A1918]">Share your requirements</h3>
              <p className="text-sm text-[#524F4B] leading-relaxed">
                Tell us about your preferred community, bedroom requirements, budget range and timeline.
              </p>
            </div>

            <div className="p-8 bg-[#F4F1EA] border border-[#E6E4DF] rounded-xs space-y-3">
              <span className="text-3xl font-editorial text-[#BFA054] block">02</span>
              <h3 className="text-lg font-semibold text-[#1A1918]">Explore suitable options</h3>
              <p className="text-sm text-[#524F4B] leading-relaxed">
                Receive a shortlist of verified developer allocations and ready properties matching your criteria.
              </p>
            </div>

            <div className="p-8 bg-[#F4F1EA] border border-[#E6E4DF] rounded-xs space-y-3">
              <span className="text-3xl font-editorial text-[#BFA054] block">03</span>
              <h3 className="text-lg font-semibold text-[#1A1918]">Speak with an advisor</h3>
              <p className="text-sm text-[#524F4B] leading-relaxed">
                Connect directly with a GNS advisor who coordinates property viewings, payment plan details and next steps.
              </p>
            </div>
          </div>
        </div>

        {/* Clean Developer Logos Row (without individual bordered white boxes) */}
        <div className="pt-8 border-t border-[#E6E4DF] space-y-8">
          <div className="text-center">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#7A7771]">
              Leading Dubai Developer Projects
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14 opacity-80">
            {DEVELOPER_PARTNERS.map((partner) => (
              <img
                key={partner.name}
                src={partner.logo}
                alt={partner.name}
                className="h-9 md:h-11 w-auto max-w-[130px] object-contain grayscale hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            ))}
          </div>
        </div>

        {/* Contact Invitation */}
        <div className="pt-8 border-t border-[#E6E4DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-editorial font-normal text-[#1A1918]">Have questions or ready to view properties?</h3>
            <p className="text-sm text-[#6E6B66] mt-1">Our advisory team is available to assist you.</p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#162E52] hover:bg-[#22417C] rounded-xs shadow-xs transition-colors"
          >
            <span>Contact GNS</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#DEBF84]" />
          </Link>
        </div>
      </div>
    </div>
  );
};
