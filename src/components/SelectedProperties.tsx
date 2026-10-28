import React, { useState } from 'react';
import { ArrowUpRight, MapPin, Building2, Layers } from 'lucide-react';
import { SELECTED_PROPERTIES, PropertyItem } from '../data/gnsData';
import { PropertyModal } from './PropertyModal';

interface SelectedPropertiesProps {
  initialFilter?: 'All' | 'Apartments' | 'Villas & Townhouses' | 'Off-plan';
}

export const SelectedProperties: React.FC<SelectedPropertiesProps> = ({ initialFilter = 'All' }) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Apartments' | 'Villas & Townhouses' | 'Off-plan'>(initialFilter);
  const [activeProperty, setActiveProperty] = useState<PropertyItem | null>(null);

  const filters: Array<'All' | 'Apartments' | 'Villas & Townhouses' | 'Off-plan'> = [
    'All',
    'Apartments',
    'Villas & Townhouses',
    'Off-plan',
  ];

  const filteredProperties = selectedFilter === 'All'
    ? SELECTED_PROPERTIES
    : SELECTED_PROPERTIES.filter((p) => p.category === selectedFilter);

  return (
    <section id="properties" className="py-20 md:py-28 bg-[#FAF9F5] border-b border-[#E6E4DF]">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        {/* Section Header with Functional Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#E6E4DF]">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#967C3B] block mb-2">
              Curated Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1918] font-editorial tracking-[-0.01em]">
              Selected Properties
            </h2>
            <p className="text-sm md:text-base text-[#6E6B66] mt-2 max-w-xl">
              Verified opportunities across Dubai’s most distinguished master communities, represented directly by GNS Real Estate advisors.
            </p>
          </div>

          {/* Simple, Functional Filters */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F0EEE9] rounded-xs border border-[#E0DDC6]/80 overflow-x-auto self-start md:self-auto">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-xs whitespace-nowrap transition-colors cursor-pointer ${
                  selectedFilter === filter
                    ? 'bg-[#0E2338] text-white shadow-xs'
                    : 'text-[#524F4B] hover:text-[#0E2338] hover:bg-white/60'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Property Grid: 3 columns maximum on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 pt-12">
          {filteredProperties.map((property) => (
            <article
              key={property.id}
              className="group flex flex-col bg-[#F7F5EE] border border-[#E6E4DF] rounded-xs overflow-hidden transition-all duration-300 hover:border-[#BFA054]/60 hover:shadow-sm"
            >
              {/* Image Frame with Aspect Ratio */}
              <div 
                className="relative aspect-[4/3] w-full overflow-hidden bg-[#E2DFD8] cursor-pointer"
                onClick={() => setActiveProperty(property)}
              >
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover img-editorial"
                  loading="lazy"
                />
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-2.5 py-1 bg-[#0E2338]/85 text-white text-[11px] font-medium tracking-wide rounded-xs backdrop-blur-xs">
                    {property.developer}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 bg-white/95 text-[#0E2338] text-xs font-medium uppercase tracking-wider rounded-xs shadow-md">
                    View Details
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#7A7771]">
                    <MapPin className="w-3.5 h-3.5 text-[#BFA054] shrink-0" />
                    <span className="truncate">{property.location}</span>
                  </div>

                  <h3 
                    onClick={() => setActiveProperty(property)}
                    className="text-xl font-editorial font-normal text-[#1A1918] group-hover:text-[#0E2338] cursor-pointer line-clamp-1 text-balance"
                  >
                    {property.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-[#524F4B]">
                    <Layers className="w-3.5 h-3.5 text-[#967C3B] shrink-0" />
                    <span>{property.type}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAE8E2] space-y-3">
                  <div className="text-[11px] text-[#6E6B66] italic">
                    {property.priceNote}
                  </div>

                  <button
                    onClick={() => setActiveProperty(property)}
                    className="w-full inline-flex items-center justify-between px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0E2338] bg-white hover:bg-[#0E2338] hover:text-white border border-[#DCD9D3] rounded-xs transition-colors cursor-pointer group/btn"
                  >
                    <span>Enquire about this property</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#BFA054] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Transparency note beneath the grid */}
        <div className="mt-12 p-4 bg-[#F2EFE9] border border-[#E6E4DF] rounded-xs text-xs text-[#6E6B66] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span>
            All property information and developer renderings are sourced from public developer allocations. Availability and unit pricing are confirmed at the time of private enquiry.
          </span>
          <a
            href="#contact"
            className="text-[#0E2338] font-semibold hover:text-[#BFA054] whitespace-nowrap underline underline-offset-2"
          >
            Custom Search Mandate →
          </a>
        </div>
      </div>

      {/* Property Modal */}
      <PropertyModal
        property={activeProperty}
        onClose={() => setActiveProperty(null)}
      />
    </section>
  );
};
