import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageSquare } from 'lucide-react';
import { GNS_CONFIG } from '../data/gnsData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#121820] text-white/80 border-t border-white/10 pt-16 pb-12">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-5">
            {/* Logo: displayed on a clean light ivory panel so its natural navy, gold and burgundy stay crisp */}
            <Link to="/" className="inline-block bg-[#FAF9F5] px-4 py-2 rounded-xs shadow-xs">
              <img
                src={GNS_CONFIG.logo}
                alt="GNS Real Estate LLC"
                className="h-9 w-auto object-contain"
                loading="lazy"
              />
            </Link>

            <p className="text-sm text-white/70 max-w-sm leading-relaxed">
              GNS Real Estate LLC is an established property brokerage in Dubai, assisting clients with residential homes, off-plan projects, and investment options.
            </p>

            <div className="flex items-center gap-4 text-xs text-white/60 pt-1">
              <a
                href={GNS_CONFIG.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Instagram
              </a>
              <span className="text-white/20">·</span>
              <a
                href={GNS_CONFIG.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Facebook
              </a>
              <span className="text-white/20">·</span>
              <a
                href={GNS_CONFIG.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Quick Nav Col */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/90">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-white transition-colors">Properties</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About GNS</Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-white transition-colors">Our Team</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Business Contacts Col */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/90">
              Contact
            </h4>
            <ul className="space-y-3 text-xs text-white/70">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white/40 text-[10px] uppercase">Office</span>
                  <a href={GNS_CONFIG.officeTelUrl} className="hover:text-white transition-colors">
                    {GNS_CONFIG.officePhone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white/40 text-[10px] uppercase">WhatsApp</span>
                  <a href={GNS_CONFIG.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    {GNS_CONFIG.whatsappPhone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white/40 text-[10px] uppercase">Email</span>
                  <a href={GNS_CONFIG.mailtoUrl} className="hover:text-white transition-colors">
                    {GNS_CONFIG.generalEmail}
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} GNS Real Estate LLC. Dubai, United Arab Emirates.</p>
          <p>Licensed Real Estate Brokerage in Dubai</p>
        </div>
      </div>
    </footer>
  );
};
