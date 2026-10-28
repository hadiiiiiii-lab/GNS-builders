import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { GNS_CONFIG } from '../data/gnsData';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Properties', to: '/properties' },
    { label: 'About', to: '/about' },
    { label: 'Our Team', to: '/team' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 h-[88px] w-full bg-[#FAF9F5] border-b border-[#E6E4DF] transition-colors">
      <div className="max-w-[1320px] h-full mx-auto px-6 md:px-12 flex items-center justify-between gap-8">
        {/* Brand Zone - Original GNS logo in true natural colors without dark artificial box */}
        <Link
          to="/"
          className="flex items-center shrink-0 focus-visible:outline-2 focus-visible:outline-[#22417C] rounded-sm transition-opacity hover:opacity-90"
          aria-label="GNS Real Estate LLC Home"
        >
          <img
            src={GNS_CONFIG.logo}
            alt="GNS Real Estate LLC"
            className="h-10 md:h-12 w-auto object-contain"
            loading="eager"
          />
        </Link>

        {/* Navigation Zone (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium tracking-wide text-[#232220]">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `relative py-1 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-[#22417C] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#22417C]'
                    : 'text-[#4A4844] hover:text-[#1A1918]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Action Zone (Right) */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold tracking-wider uppercase text-white bg-[#162E52] hover:bg-[#22417C] rounded-sm shadow-xs transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#162E52]"
          >
            <span>Enquire</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#DEBF84]" />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#232220] hover:text-[#162E52] rounded-sm focus-visible:outline-2 focus-visible:outline-[#162E52]"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0E1B28]/50 backdrop-blur-xs md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed top-0 right-0 w-[85%] max-w-[340px] h-full bg-[#FAF9F5] shadow-2xl p-6 flex flex-col justify-between border-l border-[#E6E4DF]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-6 border-b border-[#E6E4DF]">
                <img
                  src={GNS_CONFIG.logo}
                  alt="GNS Real Estate LLC"
                  className="h-9 w-auto object-contain"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#232220] hover:text-[#162E52] rounded-sm"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="flex flex-col gap-1 py-6">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.label}
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `px-3.5 py-3 text-base font-medium rounded-sm transition-colors ${
                        isActive
                          ? 'bg-[#EAE7DF] text-[#162E52] font-semibold'
                          : 'text-[#232220] hover:bg-[#F2EFE9] hover:text-[#162E52]'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Bottom action inside mobile drawer */}
            <div className="pt-6 border-t border-[#E6E4DF] space-y-3">
              <Link
                to="/contact"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#162E52] hover:bg-[#22417C] rounded-sm"
              >
                <span>Enquire With Our Team</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#DEBF84]" />
              </Link>
              <div className="text-[12px] text-[#6E6B66] text-center pt-1">
                Office: {GNS_CONFIG.officePhone}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
