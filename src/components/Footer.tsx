import React from 'react';
import { ArrowUpRight, ShieldCheck, Mail, Phone, MessageSquare } from 'lucide-react';
import { GNS_CONFIG } from '../data/gnsData';

interface FooterProps {
  onOpenVerificationNotes: () => void;
  onOpenAssistant: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenVerificationNotes, onOpenAssistant }) => {
  return (
    <footer className="bg-[#0A1622] text-white/80 border-t border-white/10 pt-16 pb-12">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-block bg-[#0E2338] px-3.5 py-2 rounded-xs border border-white/15">
              <img
                src={GNS_CONFIG.logo}
                alt="GNS Real Estate LLC"
                className="h-8 w-auto object-contain"
                loading="lazy"
              />
            </div>

            <p className="text-sm text-white/70 max-w-sm leading-relaxed">
              GNS Real Estate LLC is an established property brokerage based in Dubai, United Arab Emirates, assisting clients with residential homes, off-plan developer projects, and prudent investment opportunities.
            </p>

            <div className="flex items-center gap-4 pt-1">
              <a
                href={GNS_CONFIG.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/70 hover:text-[#D8C492] transition-colors"
              >
                Instagram ↗
              </a>
              <span className="text-white/20">·</span>
              <a
                href={GNS_CONFIG.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/70 hover:text-[#D8C492] transition-colors"
              >
                Facebook ↗
              </a>
              <span className="text-white/20">·</span>
              <a
                href={GNS_CONFIG.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/70 hover:text-[#D8C492] transition-colors"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>

          {/* Quick Nav Col */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#D8C492]">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#properties" className="hover:text-white transition-colors">Curated Properties</a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">About GNS</a>
              </li>
              <li>
                <a href="#team" className="hover:text-white transition-colors">Our Advisory Team</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Contact Office</a>
              </li>
              <li>
                <button
                  onClick={onOpenAssistant}
                  className="hover:text-[#D8C492] transition-colors cursor-pointer text-left"
                >
                  Discreet Enquiry Assistant
                </button>
              </li>
            </ul>
          </div>

          {/* Business Contacts Col */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#D8C492]">
              Verified Contacts
            </h4>
            <ul className="space-y-3 text-xs text-white/70">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#BFA054] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white/40 text-[10px] uppercase">Landline</span>
                  <a href={GNS_CONFIG.officeTelUrl} className="hover:text-white transition-colors">
                    {GNS_CONFIG.officePhone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-[#BFA054] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white/40 text-[10px] uppercase">WhatsApp / Mobile</span>
                  <a href={GNS_CONFIG.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    {GNS_CONFIG.whatsappPhone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#BFA054] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white/40 text-[10px] uppercase">Email</span>
                  <a href={GNS_CONFIG.mailtoUrl} className="hover:text-white transition-colors">
                    {GNS_CONFIG.generalEmail}
                  </a>
                </div>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onOpenVerificationNotes}
                className="inline-flex items-center gap-1.5 text-xs text-[#D8C492] hover:text-white transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="underline underline-offset-4">Preview Sources & Verification Notes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Verification Strip */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} GNS Real Estate LLC, Dubai. All rights reserved.</p>
          <p className="text-center md:text-right">
            Preview demonstration prepared for client review · Genuine brand assets & verified listings
          </p>
        </div>
      </div>
    </footer>
  );
};
