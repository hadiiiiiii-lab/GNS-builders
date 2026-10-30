import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Building2, Layers, MessageCircle, Phone, ArrowLeft, ArrowUpRight, CheckCircle2, Calendar } from 'lucide-react';
import { GNS_CONFIG } from '../data/gnsData';
import { useDemoContext } from '../context/DemoContext';

export const PropertyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { properties, openViewingModal } = useDemoContext();

  const property = properties.find((p) => p.slug === slug);

  // Scroll to top and set document title on load
  useEffect(() => {
    window.scrollTo(0, 0);
    if (property) {
      document.title = `${property.title} | GNS Real Estate`;
    }
  }, [slug, property]);

  if (!property) {
    return (
      <div className="py-24 max-w-[1320px] mx-auto px-6 text-center space-y-4">
        <h2 className="text-3xl font-editorial text-[#1A1918]">Property Not Found</h2>
        <p className="text-sm text-[#6E6B66]">The property you are looking for is not listed or has been moved.</p>
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#162E52] rounded-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Properties</span>
        </Link>
      </div>
    );
  }

  const encodedWhatsAppUrl = `https://wa.me/971507350414?text=${encodeURIComponent(
    `Hello GNS Real Estate, I am enquiring about ${property.title} in ${property.location}. Please provide availability and pricing details.`
  )}`;

  return (
    <div className="py-12 md:py-20 bg-[#FAF9F5]">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 space-y-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#7A7771]">
          <Link to="/" className="hover:text-[#162E52] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/properties" className="hover:text-[#162E52] transition-colors">Properties</Link>
          <span>/</span>
          <span className="text-[#1A1918] font-medium truncate max-w-[200px] sm:max-w-none">{property.title}</span>
        </nav>

        {/* Top Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E6E4DF]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#162E52] mb-2">
              <span>{property.developer}</span>
              <span aria-hidden="true">·</span>
              <span>{property.category}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-normal text-[#1A1918] text-balance">
              {property.title}
            </h1>
            <div className="flex items-center gap-1.5 text-sm text-[#524F4B] mt-2">
              <MapPin className="w-4 h-4 text-[#BFA054] shrink-0" />
              <span>{property.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={encodedWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#162E52] hover:bg-[#22417C] rounded-xs shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#DEBF84]" />
              <span>Continue on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Visual Frame */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xs border border-[#E6E4DF] bg-[#E8E6DF] shadow-xs">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Overview & Quick Facts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
          {/* Left Details (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-editorial font-normal text-[#1A1918]">Project Overview</h2>
              <p className="text-base text-[#4A4844] leading-relaxed">
                {property.description}
              </p>
            </div>

            {property.keyFeatures && property.keyFeatures.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-[#E6E4DF]">
                <h3 className="text-lg font-editorial font-normal text-[#1A1918]">Key Highlights</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#524F4B]">
                  {property.keyFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#BFA054] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Gallery Frames if present */}
            {property.gallery && property.gallery.length > 1 && (
              <div className="space-y-4 pt-4 border-t border-[#E6E4DF]">
                <h3 className="text-lg font-editorial font-normal text-[#1A1918]">Additional Perspective</h3>
                <div className="aspect-[16/10] rounded-xs overflow-hidden border border-[#E6E4DF] bg-[#ECEAE4]">
                  <img
                    src={property.gallery[1]}
                    alt={`${property.title} view`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-white border border-[#E6E4DF] rounded-xs space-y-5 shadow-xs">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#162E52]">
                Property Details
              </h3>

              <div className="space-y-3.5 text-xs text-[#524F4B]">
                <div className="flex justify-between py-2 border-b border-[#F0EEE9]">
                  <span className="text-[#7A7771]">Developer</span>
                  <span className="font-semibold text-[#1A1918]">{property.developer}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#F0EEE9]">
                  <span className="text-[#7A7771]">Location</span>
                  <span className="font-semibold text-[#1A1918] text-right truncate max-w-[180px]">{property.location}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#F0EEE9]">
                  <span className="text-[#7A7771]">Type</span>
                  <span className="font-semibold text-[#1A1918] text-right">{property.type}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#F0EEE9]">
                  <span className="text-[#7A7771]">Pricing</span>
                  <span className="font-semibold text-[#162E52]">{property.priceNote}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={() =>
                    openViewingModal({
                      id: property.id,
                      title: property.title,
                      location: property.location,
                    })
                  }
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#162E52] hover:bg-[#22417C] rounded-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#DEBF84]" />
                  <span>Schedule a Viewing</span>
                </button>

                <a
                  href={encodedWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#162E52] bg-white hover:bg-[#F2EFE9] border border-[#DCD9D3] rounded-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Enquire on WhatsApp</span>
                </a>

                <a
                  href={GNS_CONFIG.officeTelUrl}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#736F68] hover:text-[#162E52] rounded-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#BFA054]" />
                  <span>Call {GNS_CONFIG.officePhone}</span>
                </a>
              </div>
            </div>

            <div className="p-4 bg-[#F2EFE9] border border-[#E6E4DF] rounded-xs text-xs text-[#6E6B66]">
              Units and payment plans vary by developer release phase. An advisor will provide current floor plans and availability.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
