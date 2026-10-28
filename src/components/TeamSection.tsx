import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { VERIFIED_TEAM, TeamMember, GNS_CONFIG } from '../data/gnsData';

export const TeamSection: React.FC = () => {
  const [showAllTeam, setShowAllTeam] = useState(false);

  // Show 4 initially, 8 when expanded
  const displayedMembers = showAllTeam ? VERIFIED_TEAM : VERIFIED_TEAM.slice(0, 4);

  return (
    <section id="team" className="py-20 md:py-28 bg-[#FAF9F5] border-b border-[#E6E4DF]">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#E6E4DF]">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#967C3B] block mb-2">
              Our Advisory Team
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1918] font-editorial tracking-[-0.01em]">
              Meet the GNS Advisors
            </h2>
            <p className="text-sm md:text-base text-[#6E6B66] mt-2 max-w-xl">
              Dedicated property consultants and client advisors verified through official GNS Real Estate agent profiles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAllTeam(!showAllTeam)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0E2338] bg-[#F0EEE9] hover:bg-[#E4E1D8] border border-[#DCD9D3] rounded-xs transition-colors cursor-pointer"
            >
              <span>{showAllTeam ? 'Show Featured 4' : `View Full Team (${VERIFIED_TEAM.length})`}</span>
              {showAllTeam ? <ChevronUp className="w-4 h-4 text-[#BFA054]" /> : <ChevronDown className="w-4 h-4 text-[#BFA054]" />}
            </button>
          </div>
        </div>

        {/* Team Grid: 4 columns desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 pt-12">
          {displayedMembers.map((member) => (
            <article
              key={member.id}
              className="flex flex-col bg-[#F7F5EE] border border-[#E6E4DF] rounded-xs overflow-hidden group hover:border-[#BFA054]/50 transition-colors"
            >
              {/* Photo Frame (Consistent 3:4 portrait aspect ratio, zero facial alteration) */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE8DF]">
                <img
                  src={member.photo}
                  alt={`Portrait of ${member.name}, ${member.title}`}
                  className="w-full h-full object-cover object-top filter grayscale-[12%] group-hover:grayscale-0 transition-all duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <a
                    href={member.sourcePage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-xs inline-flex items-center gap-1 hover:text-[#D8C492] transition-colors"
                  >
                    <span>View gnsre.com profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Information Block */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-xl font-editorial font-normal text-[#1A1918] text-balance">
                    {member.name}
                  </h3>
                  <p className="text-xs font-medium text-[#967C3B] uppercase tracking-wider mt-0.5">
                    {member.title}
                  </p>
                  <p className="text-xs text-[#524F4B] leading-relaxed mt-2.5">
                    {member.bio}
                  </p>
                </div>

                {member.note && (
                  <div className="pt-2 border-t border-[#EAE8E2] text-[11px] text-[#7A7771] flex items-start gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#BFA054] shrink-0 mt-0.5" />
                    <span>{member.note}</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Advisory Team Disclaimer Notice */}
        <div className="mt-12 p-4 bg-[#F2EFE9] border border-[#E6E4DF] rounded-xs text-xs text-[#6E6B66] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p>
            <strong className="text-[#1A1918]">Roster Disclaimer:</strong> Profiles displayed reflect genuine public records currently verified on gnsre.com and may not represent the complete current employee roster. Vijay Kumar is titled as Chief Executive Officer in accordance with official verification.
          </p>
          <a
            href={GNS_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#0E2338] font-semibold hover:text-[#BFA054] whitespace-nowrap"
          >
            <span>Direct WhatsApp Handoff</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
