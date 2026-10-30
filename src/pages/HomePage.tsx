import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { Hero } from '../components/Hero';
import { VERIFIED_TEAM } from '../data/gnsData';
import { useDemoContext } from '../context/DemoContext';

export const HomePage: React.FC = () => {
  const { properties } = useDemoContext();
  // Exactly 3 curated featured properties
  const featuredProperties = properties.slice(0, 3);

  // Key advisors for concise team introduction
  const featuredAdvisors = VERIFIED_TEAM.slice(0, 2);

  return (
    <div className="flex flex-col bg-[#FAF9F5] text-[#1A1918] overflow-hidden">
      {/* 1. Balanced Desktop Hero: Left copy & CTA, Right 3D Architectural Scale Model */}
      <Hero />

      {/* 2. Short Editorial Introduction */}
      <section className="py-24 md:py-32 bg-[#FAF9F5] border-b border-[#E6E4DF]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left 40%: Section label, strong heading, ~45 words body copy */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#736F68] block">
                GNS Real Estate · Dubai
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-[44px] font-medium text-[#1A1918] font-heading leading-[1.15] text-balance">
                Property decisions, thoughtfully guided.
              </h2>

              <p className="text-base sm:text-[17px] text-[#4A4844] leading-relaxed">
                Find a home or explore your next investment in Dubai. Our team helps you compare properties, understand your options and take the next step. From waterfront apartments to master-planned family villas, we provide direct, thoughtful guidance tailored to your requirements.
              </p>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#162E52] hover:text-[#22417C] transition-colors group"
                >
                  <span>About GNS</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right 60%: Large, sharp architectural image frame */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#EAE7DE]">
                <img
                  src="/gns/assets/Silva-Dubai-Creek-Emaar-2-592x444.webp"
                  alt="Dubai Creek architectural residence"
                  className="w-full h-full object-cover img-editorial"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Property Collections: Two Visually Distinct, Image-Led Compositions */}
      <section className="py-24 md:py-36 bg-[#F5F2EB] border-b border-[#E6E4DF]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24 space-y-28 md:space-y-36">
          {/* Collection 1: "Spaces to call home." */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Image (Left - 7 cols) */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#E5E2D9]">
                <img
                  src="/gns/assets/Nourelle-at-MJL-Meraas-13-592x444.webp"
                  alt="Contemporary residential home in Dubai"
                  className="w-full h-full object-cover img-editorial"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Content (Right - 5 cols) */}
            <div className="lg:col-span-5 space-y-5 lg:pl-4">
              <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#736F68] block">
                Residential
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-[42px] font-medium text-[#1A1918] font-heading leading-[1.15] text-balance">
                Spaces to call home.
              </h2>

              <p className="text-base text-[#4A4844] leading-relaxed">
                From coastal apartments to private family villas, discover established Dubai communities designed for everyday comfort and lasting peace of mind.
              </p>

              <div className="pt-2">
                <Link
                  to="/properties?category=Apartments"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold tracking-wider uppercase text-white bg-[#162E52] hover:bg-[#22417C] rounded-xs shadow-xs transition-colors"
                >
                  <span>Explore Residential</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Collection 2: "Explore what’s next." (Asymmetric, distinct layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Content (Left - 5 cols) */}
            <div className="lg:col-span-5 space-y-5 lg:pr-4">
              <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#736F68] block">
                Off-Plan & Growth
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-[42px] font-medium text-[#1A1918] font-heading leading-[1.15] text-balance">
                Explore what’s next.
              </h2>

              <p className="text-base text-[#4A4844] leading-relaxed">
                Dubai continues to introduce landmark master communities. We help you review emerging locations, developer payment schedules and project timelines.
              </p>

              <div className="pt-2">
                <Link
                  to="/properties?category=Off-plan"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold tracking-wider uppercase text-white bg-[#162E52] hover:bg-[#22417C] rounded-xs shadow-xs transition-colors"
                >
                  <span>Explore Off-Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Image (Right - 7 cols) */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#E5E2D9]">
                <img
                  src="/gns/assets/Palace-Residence-at-Hill-Estate-Emaar-1-592x444.webp"
                  alt="Off-plan master community development"
                  className="w-full h-full object-cover img-editorial"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Properties: Exactly Three Cards, Open & Uncluttered */}
      <section className="py-24 md:py-32 bg-[#FAF9F5] border-b border-[#E6E4DF]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-12 border-b border-[#E6E4DF]">
            <div>
              <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#736F68] block mb-2">
                Selected Work
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-[42px] font-medium text-[#1A1918] font-heading">
                Featured Properties
              </h2>
            </div>
            <Link
              to="/properties"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#162E52] hover:text-[#22417C] transition-colors"
            >
              <span>View All Properties ({properties.length})</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3 Visually Open Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 pt-12">
            {featuredProperties.map((property) => (
              <article key={property.id} className="group flex flex-col space-y-4">
                {/* Visual Image Frame */}
                <Link
                  to={`/properties/${property.slug}`}
                  className="block relative aspect-[4/3] w-full overflow-hidden rounded-xs bg-[#ECEAE4]"
                >
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover img-editorial"
                    loading="lazy"
                  />
                </Link>

                {/* Minimalist Meta: No heavy borders, no repetitive icons */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-xs text-[#7A7771]">
                    {property.location}
                  </p>

                  <h3 className="text-lg sm:text-xl font-heading font-medium text-[#1A1918] group-hover:text-[#162E52] transition-colors">
                    <Link to={`/properties/${property.slug}`}>
                      {property.title}
                    </Link>
                  </h3>

                  <div className="pt-2">
                    <Link
                      to={`/properties/${property.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#162E52] hover:text-[#22417C] transition-colors"
                    >
                      <span>View property</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Meet GNS: Concise Company & Team Intro Using Supplied Photography */}
      <section className="py-24 md:py-32 bg-[#F5F2EB] border-b border-[#E6E4DF]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left 45%: Short paragraph and link */}
            <div className="lg:col-span-5 space-y-5">
              <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#736F68] block">
                The Company
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-[42px] font-medium text-[#1A1918] font-heading leading-[1.15]">
                Meet GNS Real Estate
              </h2>

              <p className="text-base text-[#4A4844] leading-relaxed">
                Our advisors live and work in Dubai, offering grounded insight into neighborhoods, developer track records and transaction procedures. We work alongside you at every step of your property journey.
              </p>

              <div className="pt-2">
                <Link
                  to="/team"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#162E52] hover:text-[#22417C] transition-colors group"
                >
                  <span>Meet our team</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right 55%: High-resolution authentic team portraits */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 gap-6 sm:gap-8 max-w-lg mx-auto lg:ml-auto">
                {featuredAdvisors.map((member) => (
                  <div key={member.id} className="space-y-2.5">
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xs bg-[#ECE8DF] shadow-2xs">
                      <img
                        src={member.photo}
                        alt={`${member.name}, ${member.role}`}
                        className="w-full h-full object-cover object-top filter grayscale-[6%] transition-all duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-heading font-medium text-[#1A1918]">
                        {member.name}
                      </h3>
                      <p className="text-[11px] text-[#7A7771] uppercase tracking-wider">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Final Contact Invitation: Confident, Simple Closing Section */}
      <section className="py-24 md:py-32 bg-[#162E52] text-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-24">
          <div className="max-w-2xl space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-medium text-white leading-[1.12] text-balance">
              Your next move starts with a conversation.
            </h2>

            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-xl">
              Whether you are ready to view a property or exploring options for the year ahead, our advisors are here to help.
            </p>

            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-wider text-[#162E52] bg-[#FAF9F5] hover:bg-white rounded-xs shadow-md transition-colors"
              >
                <span>Get in touch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
