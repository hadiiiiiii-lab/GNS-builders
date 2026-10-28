import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { VERIFIED_TEAM, GNS_CONFIG } from '../data/gnsData';

export const TeamPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-16 md:py-24 bg-[#FAF9F5]">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 space-y-16">
        {/* Header */}
        <div className="max-w-2xl space-y-4">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#162E52] block">
            Advisory Team
          </span>
          <h1 className="text-4xl sm:text-5xl font-editorial font-normal text-[#1A1918]">
            Our Team
          </h1>
          <p className="text-base text-[#524F4B] leading-relaxed">
            Meet the property advisors and executives at GNS Real Estate LLC, serving buyers, sellers and tenants across Dubai.
          </p>
        </div>

        {/* 8-Member Portrait Grid: 4 columns desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {VERIFIED_TEAM.map((member) => (
            <article
              key={member.id}
              className="group flex flex-col bg-white border border-[#E6E4DF] rounded-xs overflow-hidden transition-all duration-300 hover:border-[#162E52]/40"
            >
              {/* High-Resolution Portrait with consistent 3:4 crop */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE8DF]">
                <img
                  src={member.photo}
                  alt={`${member.name}, ${member.role}`}
                  className="w-full h-full object-cover object-top filter grayscale-[8%] group-hover:grayscale-0 transition-all duration-500"
                  loading="lazy"
                />
              </div>

              {/* Information: Clean Name & Published Role only. Zero fabricated biographies. */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-xl font-editorial font-normal text-[#1A1918]">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#7A7771] mt-0.5">
                    {member.role}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F0EEE9] flex items-center justify-between text-xs">
                  <a
                    href={GNS_CONFIG.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#162E52] hover:text-[#22417C] font-semibold transition-colors"
                  >
                    Enquire via WhatsApp →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Footer Contact CTA */}
        <div className="pt-10 border-t border-[#E6E4DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-editorial font-normal text-[#1A1918]">Speak directly with a GNS advisor</h3>
            <p className="text-sm text-[#6E6B66] mt-1">Available via WhatsApp, phone, or scheduled in-person consultation.</p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#162E52] hover:bg-[#22417C] rounded-xs shadow-xs transition-colors"
          >
            <span>Contact Our Team</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#DEBF84]" />
          </Link>
        </div>
      </div>
    </div>
  );
};
