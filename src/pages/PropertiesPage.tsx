import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { PROPERTIES, PropertyItem } from '../data/gnsData';

export const PropertiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') as 'All' | 'Apartments' | 'Villas & Townhouses' | 'Off-plan' | null;
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Apartments' | 'Villas & Townhouses' | 'Off-plan'>(
    categoryParam || 'All'
  );

  useEffect(() => {
    if (categoryParam) {
      setSelectedFilter(categoryParam);
    }
  }, [categoryParam]);

  const filters: Array<'All' | 'Apartments' | 'Villas & Townhouses' | 'Off-plan'> = [
    'All',
    'Apartments',
    'Villas & Townhouses',
    'Off-plan',
  ];

  const handleFilterClick = (filter: 'All' | 'Apartments' | 'Villas & Townhouses' | 'Off-plan') => {
    setSelectedFilter(filter);
    if (filter === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: filter });
    }
  };

  const filtered = selectedFilter === 'All'
    ? PROPERTIES
    : PROPERTIES.filter((p) => p.category === selectedFilter);

  return (
    <div className="py-16 md:py-24 bg-[#FAF9F5]">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#E6E4DF]">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#162E52] block mb-2">
              Portfolio
            </span>
            <h1 className="text-4xl sm:text-5xl font-normal text-[#1A1918] font-editorial">
              Properties in Dubai
            </h1>
            <p className="text-sm md:text-base text-[#6E6B66] mt-2 max-w-xl">
              Explore residential apartments, townhouses, and off-plan opportunities across Dubai’s prominent master communities.
            </p>
          </div>

          {/* Clean Segmented Filter Bar */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F0EEE9] rounded-xs border border-[#E0DDC6]/80 overflow-x-auto self-start md:self-auto">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterClick(filter)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-xs whitespace-nowrap transition-colors cursor-pointer ${
                  selectedFilter === filter
                    ? 'bg-[#162E52] text-white shadow-xs font-semibold'
                    : 'text-[#524F4B] hover:text-[#162E52] hover:bg-white/60'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Property Grid: 3 columns desktop, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 pt-12">
          {filtered.map((property) => (
            <article
              key={property.id}
              className="group flex flex-col bg-white border border-[#E6E4DF] rounded-xs overflow-hidden transition-all duration-300 hover:border-[#162E52]/40 shadow-xs"
            >
              {/* Image Frame */}
              <Link to={`/properties/${property.slug}`} className="block relative aspect-[4/3] w-full overflow-hidden bg-[#ECEAE4]">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover img-editorial"
                  loading="lazy"
                />
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-2.5 py-1 bg-[#162E52]/90 text-white text-[11px] font-medium tracking-wide rounded-xs backdrop-blur-xs">
                    {property.developer}
                  </span>
                </div>
              </Link>

              {/* Compact Information */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 text-xs text-[#7A7771]">
                    <MapPin className="w-3.5 h-3.5 text-[#BFA054] shrink-0" />
                    <span className="truncate">{property.location}</span>
                  </div>

                  <h3 className="text-xl font-editorial font-normal text-[#1A1918] group-hover:text-[#162E52] transition-colors">
                    <Link to={`/properties/${property.slug}`}>
                      {property.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-[#6E6B66]">{property.type}</p>
                </div>

                <div className="pt-3 border-t border-[#F0EEE9] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#7A7771]">Pricing on request</span>
                  <Link
                    to={`/properties/${property.slug}`}
                    className="inline-flex items-center gap-1 font-semibold text-[#162E52] hover:text-[#22417C] transition-colors"
                  >
                    <span>View property</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Footer enquiry banner */}
        <div className="mt-16 p-8 bg-[#F4F1EA] border border-[#E6E4DF] rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-editorial font-normal text-[#1A1918]">Looking for a specific community or unit type?</h3>
            <p className="text-xs text-[#6E6B66] mt-1">Our advisors track current developer availability across Dubai.</p>
          </div>
          <Link
            to="/contact"
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#162E52] hover:bg-[#22417C] rounded-xs whitespace-nowrap"
          >
            Contact Advisor
          </Link>
        </div>
      </div>
    </div>
  );
};
