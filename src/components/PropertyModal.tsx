import React, { useEffect } from 'react';
import { X, MapPin, Building2, Layers, MessageCircle, Phone, ArrowUpRight, Check, ExternalLink } from 'lucide-react';
import { PropertyItem, GNS_CONFIG } from '../data/gnsData';

interface PropertyModalProps {
  property: PropertyItem | null;
  onClose: () => void;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({ property, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (property) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [property, onClose]);

  if (!property) return null;

  const encodedWhatsAppUrl = `https://wa.me/971507350414?text=${encodeURIComponent(
    `Hello GNS Real Estate, I am interested in ${property.title} in ${property.location}. Please provide availability and pricing details.`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#0E2338]/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="property-modal-title"
    >
      <div
        className="relative w-full max-w-3xl bg-[#FAF9F5] rounded-xs shadow-2xl border border-[#E6E4DF] overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors cursor-pointer"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Body */}
        <div className="overflow-y-auto">
          {/* Main Visual Frame */}
          <div className="relative aspect-[16/9] w-full bg-[#E5E2DC]">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4">
              <span className="px-3 py-1 bg-[#0E2338]/90 text-white text-xs uppercase tracking-wider rounded-xs backdrop-blur-xs">
                {property.category}
              </span>
            </div>
          </div>

          {/* Details Content */}
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#967C3B] font-medium tracking-wider uppercase mb-2">
                <span>{property.developer}</span>
                <span aria-hidden="true">·</span>
                <span>Verified GNS Listing</span>
              </div>
              <h3 id="property-modal-title" className="text-2xl md:text-3xl font-editorial text-[#1A1918] mb-2 text-balance">
                {property.title}
              </h3>
              <div className="flex items-center gap-1.5 text-sm text-[#524F4B]">
                <MapPin className="w-4 h-4 text-[#BFA054] shrink-0" />
                <span>{property.location}</span>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-[#F2EFE9] rounded-xs border border-[#E2DFD8] text-xs">
              <div>
                <span className="block text-[#7A7771] mb-1">Developer</span>
                <span className="font-semibold text-[#1A1918] flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#BFA054]" />
                  {property.developer}
                </span>
              </div>
              <div>
                <span className="block text-[#7A7771] mb-1">Property Type</span>
                <span className="font-semibold text-[#1A1918] flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#BFA054]" />
                  {property.type}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-[#7A7771] mb-1">Availability</span>
                <span className="font-semibold text-[#0E2338]">Confirmed on Request</span>
              </div>
            </div>

            {/* Editorial Description */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-[#7A7771] font-semibold">Project Overview</h4>
              <p className="text-sm md:text-base text-[#474440] leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Secondary Image if Available */}
            {property.secondaryImage && (
              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#7A7771] font-semibold mb-2">Development Imagery</h4>
                <div className="aspect-[16/9] w-full rounded-xs overflow-hidden border border-[#E2DFD8]">
                  <img
                    src={property.secondaryImage}
                    alt={`${property.title} perspective`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            {/* Pricing & Transparency Notice */}
            <div className="p-4 bg-[#FAF9F5] border-l-2 border-[#BFA054] text-xs text-[#524F4B] space-y-1">
              <p className="font-semibold text-[#1A1918]">{property.priceNote}</p>
              <p className="text-[#6E6B66]">
                In accordance with GNS transparency guidelines, pricing and specific unit inventory are subject to developer release tiers and availability at the time of inquiry.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={encodedWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#0E2338] hover:bg-[#153452] rounded-xs shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#D8C492]" />
                <span>Enquire via WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href={GNS_CONFIG.officeTelUrl}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#0E2338] bg-[#F0EEE9] hover:bg-[#E4E1D8] border border-[#DCD9D3] rounded-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#BFA054]" />
                <span>Call GNS Office</span>
              </a>

              {property.sourceUrl && (
                <a
                  href={property.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center p-3.5 text-[#7A7771] hover:text-[#0E2338] border border-[#DCD9D3] rounded-xs transition-colors"
                  title="View original listing on gnsre.com"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
