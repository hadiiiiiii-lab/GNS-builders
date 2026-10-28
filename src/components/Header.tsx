import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Phone, MessageSquare, ShieldCheck } from 'lucide-react';
import { GNS_CONFIG } from '../data/gnsData';

interface HeaderProps {
  onOpenAssistant: () => void;
  onOpenVerificationNotes: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAssistant, onOpenVerificationNotes }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { label: 'Home', href: '#hero' },
    { label: 'Properties', href: '#properties' },
    { label: 'About', href: '#about' },
    { label: 'Our Team', href: '#team' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Top Advisory Strip - Subtle and informational */}
      <div className="bg-[#0E2338] text-white/80 text-xs py-2 px-4 md:px-8 border-b border-white/10 transition-colors">
        <div className="max-w-[1320px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white/60 tracking-wider uppercase text-[11px] font-medium">Dubai, UAE</span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="hidden sm:inline text-white/70">Prime Residential & Off-Plan Advisory</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a 
              href={GNS_CONFIG.officeTelUrl} 
              className="hidden md:flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#BFA054]" />
              <span>{GNS_CONFIG.officePhone}</span>
            </a>
            <button
              onClick={onOpenVerificationNotes}
              className="flex items-center gap-1.5 text-[#BFA054] hover:text-[#D4B66E] transition-colors cursor-pointer"
              title="View verification sources and notes"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="underline underline-offset-2">Preview Verification Notes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF9F5]/95 backdrop-blur-md shadow-xs border-b border-[#E6E4DF] py-3.5'
            : 'bg-[#FAF9F5] md:bg-transparent md:backdrop-blur-none border-b border-[#E6E4DF]/60 py-4.5'
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 flex items-center justify-between gap-8">
          {/* Brand Logo Zone - Clean backing for contrast */}
          <a
            href="#hero"
            className="flex items-center gap-3 group shrink-0 focus-visible:outline-2 focus-visible:outline-[#BFA054] rounded-sm"
            aria-label="GNS Real Estate LLC Home"
          >
            <div className="bg-[#0E2338] px-3 py-1.5 rounded-sm flex items-center shadow-xs border border-[#0E2338]/20 transition-transform group-hover:scale-[1.02]">
              <img
                src={GNS_CONFIG.logo}
                alt="GNS Real Estate LLC Logo"
                className="h-7 md:h-8 w-auto object-contain"
                loading="eager"
              />
            </div>
          </a>

          {/* Nav Links Zone (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium tracking-wide text-[#232220]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative py-1 text-[#2B2A28] hover:text-[#0E2338] transition-colors whitespace-nowrap after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#BFA054] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Zone (Right) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAssistant}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#0E2338] bg-[#F0EEE9] hover:bg-[#E7E4DC] border border-[#DCD9D3] rounded-sm transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#BFA054]" />
              <span>Ask GNS</span>
            </button>

            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-medium tracking-wider uppercase text-white bg-[#0E2338] hover:bg-[#153452] rounded-sm shadow-xs transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2338]"
            >
              <span>Enquire</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#BFA054]" />
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#232220] hover:text-[#0E2338] rounded-sm focus-visible:outline-2 focus-visible:outline-[#0E2338]"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer / Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0E2338]/60 backdrop-blur-xs md:hidden transition-opacity"
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
                <div className="bg-[#0E2338] px-3 py-1.5 rounded-sm">
                  <img
                    src={GNS_CONFIG.logo}
                    alt="GNS Real Estate LLC"
                    className="h-6 w-auto object-contain"
                  />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#232220] hover:text-[#0E2338] rounded-sm focus-visible:outline-2"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="flex flex-col gap-1 py-6">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-3 text-base font-medium text-[#232220] hover:text-[#0E2338] hover:bg-[#F2EFE9] rounded-sm transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="pt-2 border-t border-[#E6E4DF]">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAssistant();
                  }}
                  className="w-full flex items-center justify-between px-3 py-3 text-sm font-medium text-[#0E2338] bg-[#F0EEE9] rounded-sm"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#BFA054]" />
                    <span>Launch Enquiry Assistant</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#6B6864]" />
                </button>
              </div>
            </div>

            {/* Bottom contact info inside mobile drawer */}
            <div className="pt-6 border-t border-[#E6E4DF] space-y-3">
              <a
                href={GNS_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-white bg-[#0E2338] hover:bg-[#153452] rounded-sm"
              >
                <span>WhatsApp Advisor</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#BFA054]" />
              </a>

              <div className="text-[12px] text-[#6B6864] space-y-1">
                <div>Office: {GNS_CONFIG.officePhone}</div>
                <div>Email: {GNS_CONFIG.generalEmail}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
