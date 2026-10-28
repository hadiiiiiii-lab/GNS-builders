/**
 * GNS Real Estate LLC - Clean Data Configuration
 * Strictly based on verified website sources and published roles.
 */

export interface PropertyItem {
  id: string;
  slug: string;
  title: string;
  developer: string;
  location: string;
  type: string;
  category: 'Apartments' | 'Villas & Townhouses' | 'Off-plan';
  image: string;
  gallery?: string[];
  priceNote: string;
  description: string;
  keyFeatures?: string[];
  sourceUrl: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  sourcePage: string;
}

export interface DeveloperPartner {
  name: string;
  logo: string;
}

export const GNS_CONFIG = {
  companyName: "GNS Real Estate LLC",
  city: "Dubai, UAE",
  logo: "/gns/verified_team/GNS_Official_Logo.png",
  favicon: "/gns/assets/GNS-Favicon_1.png",
  generalEmail: "info@gnsre.com",
  officePhone: "+971 4 399 3918",
  whatsappPhone: "+971 50 735 0414",
  mailtoUrl: "mailto:info@gnsre.com",
  officeTelUrl: "tel:+97143993918",
  whatsappUrl: "https://wa.me/971507350414",

  // Background hero video currently referenced on GNS live website
  heroVideoUrl: "https://cdn.pixabay.com/video/2022/03/18/111204-689949818_large.mp4",
  // Authentic high-resolution fallback image
  heroPosterImage: "/gns/assets/Oria-by-Emaar-6.webp",

  socialLinks: {
    instagram: "https://www.instagram.com/gns.realestate/",
    facebook: "https://www.facebook.com/gnsrealestateuae/",
    linkedin: "https://www.linkedin.com/company/gns-realestate-llc/",
  },
};

export const VERIFIED_TEAM: TeamMember[] = [
  {
    id: "vijay-kumar",
    name: "Vijay Kumar",
    role: "CEO",
    photo: "/gns/verified_team/Vijay_Kumar.jpg",
    sourcePage: "https://gnsre.com/agent/vijay-kumar/",
  },
  {
    id: "heena-shaikh",
    name: "Heena Shaikh",
    role: "Administrative",
    photo: "/gns/verified_team/Heena_Shaikh.jpg",
    sourcePage: "https://gnsre.com/agent/heena-sheikh/",
  },
  {
    id: "prince-manooj",
    name: "Prince Manooj",
    role: "Sales Executive",
    photo: "/gns/verified_team/Prince_Manooj.jpg",
    sourcePage: "https://gnsre.com/agent/prince-manooj/",
  },
  {
    id: "nisar-ahmed",
    name: "Nisar Ahmed",
    role: "Sales Executive",
    photo: "/gns/verified_team/Nisar_Ahmed.jpg",
    sourcePage: "https://gnsre.com/agent/nisar-ahamed/",
  },
  {
    id: "vanesh-kumar",
    name: "Vanesh Kumar",
    role: "Sales Executive",
    photo: "/gns/verified_team/Vanesh_Kumar.jpg",
    sourcePage: "https://gnsre.com/agent/vanesh-kumar/",
  },
  {
    id: "sharjeel",
    name: "Sharjeel",
    role: "Sales Executive",
    photo: "/gns/verified_team/Sharjeel.jpg",
    sourcePage: "https://gnsre.com/agent/sagar-kumar/",
  },
  {
    id: "shafiq-ur-rehman",
    name: "Shafiq ur Rehman",
    role: "Sales Executive",
    photo: "/gns/verified_team/Shafiq_ur_Rehman.jpg",
    sourcePage: "https://gnsre.com/agent/shafiq-ur-rehman/",
  },
  {
    id: "krystelle-detic",
    name: "Krystelle Detic",
    role: "Administrative",
    photo: "/gns/verified_team/Krystelle_Detic.jpg",
    sourcePage: "https://gnsre.com/agent/krystelle-detic/",
  },
];

export const PROPERTIES: PropertyItem[] = [
  {
    id: "oria-dubai-creek",
    slug: "oria-dubai-creek-harbour",
    title: "Oria at Dubai Creek Harbour",
    developer: "Emaar Properties",
    location: "Dubai Creek Harbour",
    type: "1 to 3 Bedroom Waterfront Apartments",
    category: "Off-plan",
    image: "/gns/assets/Oria-by-Emaar-6.webp",
    gallery: [
      "/gns/assets/Oria-by-Emaar-6.webp",
      "/gns/assets/Silva-Dubai-Creek-Emaar-2-592x444.webp",
    ],
    priceNote: "Pricing and availability upon request",
    description: "Waterfront residences overlooking the historic creek and Downtown Dubai skyline. Designed with expansive floor-to-ceiling windows, landscaped podium amenities, and direct access to the Creek promenade.",
    keyFeatures: [
      "Prime waterfront position along Dubai Creek",
      "Panoramic views of Downtown skyline",
      "Walking access to central park and marina promenade",
      "Flexible developer payment plan options",
    ],
    sourceUrl: "https://gnsre.com/property/oria-by-emaar/",
  },
  {
    id: "nourelle-madinat-jumeirah",
    slug: "nourelle-at-madinat-jumeirah",
    title: "Nourelle at Madinat Jumeirah Living",
    developer: "Meraas",
    location: "Madinat Jumeirah Living, Umm Suqeim",
    type: "1 to 4 Bedroom Residences & Penthouses",
    category: "Apartments",
    image: "/gns/assets/Nourelle-at-MJL-Meraas-13-592x444.webp",
    gallery: [
      "/gns/assets/Nourelle-at-MJL-Meraas-13-592x444.webp",
      "/gns/assets/original-3-592x444.webp",
    ],
    priceNote: "Pricing and availability upon request",
    description: "Pedestrian-oriented community opposite Burj Al Arab. Classic Arabesque architecture paired with contemporary interior finishes and winding garden paths.",
    keyFeatures: [
      "Unobstructed views of Burj Al Arab",
      "Gated pedestrian-first neighborhood",
      "Direct bridge access to Madinat Jumeirah Resort",
      "Family swimming pools, gymnasiums and retail pavilions",
    ],
    sourceUrl: "https://gnsre.com/property/nourelle-at-madinat-jumeirah/",
  },
  {
    id: "the-serene-sobha-central",
    slug: "the-serene-at-sobha-central",
    title: "The Serene at Sobha Central",
    developer: "Sobha Realty",
    location: "Sobha Central, Dubai",
    type: "Waterfront Residences",
    category: "Apartments",
    image: "/gns/assets/The-Serene-Sobha-1-592x444.webp",
    gallery: [
      "/gns/assets/The-Serene-Sobha-1-592x444.webp",
      "/gns/assets/The-Serene-Sobha-6-592x444.webp",
    ],
    priceNote: "Pricing and availability upon request",
    description: "Crafted residences featuring Sobha's signature construction quality, tranquil water channels, and lush green open landscapes minutes from major highway connections.",
    keyFeatures: [
      "Built with Sobha's backward-integrated engineering",
      "Waterfront walkways and shaded parks",
      "Proximity to Downtown Dubai and Ras Al Khor Sanctuary",
      "Resort-style recreational facilities",
    ],
    sourceUrl: "https://gnsre.com/property/the-serene-at-sobha-central/",
  },
  {
    id: "palace-residences-hillside",
    slug: "palace-residences-dubai-hills",
    title: "Palace Residences Hillside",
    developer: "Emaar Properties",
    location: "Dubai Hills Estate",
    type: "Parkside Branded Apartments",
    category: "Off-plan",
    image: "/gns/assets/Palace-Residence-at-Hill-Estate-Emaar-1-592x444.webp",
    gallery: [
      "/gns/assets/Palace-Residence-at-Hill-Estate-Emaar-1-592x444.webp",
    ],
    priceNote: "Pricing and availability upon request",
    description: "Hospitality-managed residences in Dubai Hills Estate, directly fronting the central park. Combines urban convenience with golf course proximity and premier healthcare and education.",
    keyFeatures: [
      "Direct frontage onto Dubai Hills Central Park",
      "Hospitality services by Palace Hotels & Resorts",
      "Minutes from Dubai Hills Mall and 18-hole championship golf course",
      "Comprehensive payment plan during construction",
    ],
    sourceUrl: "https://gnsre.com/property/palace-residences-hillside-a-at-dubai-hills-estate/",
  },
  {
    id: "samana-ocean-crest",
    slug: "samana-ocean-crest-dubai-islands",
    title: "Samana Ocean Crest",
    developer: "Samana Developers",
    location: "Dubai Islands",
    type: "Resort-Style Island Living",
    category: "Off-plan",
    image: "/gns/assets/Samana-Ocean-Crest-6-592x444.webp",
    gallery: [
      "/gns/assets/Samana-Ocean-Crest-6-592x444.webp",
      "/gns/assets/Bay-Grove-Deira-Dubai-Island-Phase-1-4-592x444.webp",
    ],
    priceNote: "Pricing and availability upon request",
    description: "Island living on Dubai Islands featuring private balcony pools, sun terraces, and sea views within easy reach of the traditional city center and international airport.",
    keyFeatures: [
      "Select units with private balcony plunge pools",
      "Beachfront access on Dubai Islands master community",
      "Full leisure deck with infinity pool and spa amenities",
      "Attractive investor payment milestones",
    ],
    sourceUrl: "https://gnsre.com/property/samana-ocean-crest-at-dubai-islands/",
  },
  {
    id: "bayz-102-business-bay",
    slug: "bayz-102-business-bay",
    title: "Bayz 102",
    developer: "Danube Properties",
    location: "Business Bay",
    type: "High-Rise Residential Tower",
    category: "Apartments",
    image: "/gns/assets/Bayz-102-Danube-Properties-1-592x444.webp",
    gallery: [
      "/gns/assets/Bayz-102-Danube-Properties-1-592x444.webp",
      "/gns/assets/Breez-by-Danube-8-592x444.webp",
    ],
    priceNote: "Pricing and availability upon request",
    description: "Modern high-rise residential living in the heart of Business Bay, moments from the Dubai Canal and Downtown attractions. Designed with smart lifestyle amenities.",
    keyFeatures: [
      "Central Business Bay location near Dubai Canal",
      "Quick access to Sheikh Zayed Road and Downtown Dubai",
      "Modern furnished and semi-furnished options",
      "Danube structured monthly payment options",
    ],
    sourceUrl: "https://gnsre.com/property/bayz-102/",
  },
  {
    id: "shams-townhouses",
    slug: "shams-townhouses-town-square",
    title: "Shams Townhouses",
    developer: "Town Square Dubai",
    location: "Town Square, Al Qudra Road",
    type: "3 & 4 Bedroom Townhouses",
    category: "Villas & Townhouses",
    image: "/gns/assets/Shams-townhouses-5-592x444.webp",
    gallery: [
      "/gns/assets/Shams-townhouses-5-592x444.webp",
      "/gns/assets/Farm-Garden-Phase-2-Emaar-4-592x444.webp",
    ],
    priceNote: "Pricing and availability upon request",
    description: "Ready-to-move-in family townhouses set around private gardens, community pools, cycling tracks, and neighborhood retail in Town Square.",
    keyFeatures: [
      "Ready for immediate handover and occupancy",
      "Private gardens and covered parking",
      "Community parks, splash pads and retail plaza",
      "Established community with strong family appeal",
    ],
    sourceUrl: "https://gnsre.com/property/shams-townhouses-ready-to-move-in/",
  },
  {
    id: "breez-by-danube",
    slug: "breez-by-danube",
    title: "Breez by Danube",
    developer: "Danube Properties",
    location: "Dubai Maritime City",
    type: "Waterfront Apartments",
    category: "Off-plan",
    image: "/gns/assets/Breez-by-Danube-8-592x444.webp",
    gallery: [
      "/gns/assets/Breez-by-Danube-8-592x444.webp",
      "/gns/assets/Sparklz-by-Danube-17-592x444.webp",
    ],
    priceNote: "Pricing and availability upon request",
    description: "Seafront development in Dubai Maritime City offering maritime vistas, contemporary architecture, and accessible payment structuring.",
    keyFeatures: [
      "Frontline sea and skyline panoramas",
      "Maritime City waterfront location",
      "40+ lifestyle and fitness amenities",
      "Staged payment schedule through completion",
    ],
    sourceUrl: "https://gnsre.com/property/breez-by-danube/",
  },
];

export const DEVELOPER_PARTNERS: DeveloperPartner[] = [
  { name: "Emaar Properties", logo: "/gns/assets/Dubai-Developers-Logo-2.jpg" },
  { name: "Sobha Realty", logo: "/gns/assets/Dubai-Developers-Logo-7.jpg" },
  { name: "Danube Properties", logo: "/gns/assets/Dubai-Developers-Logo-10.jpg" },
  { name: "Meraas", logo: "/gns/assets/Dubai-Developers-Logo-13.jpg" },
  { name: "Azizi Developments", logo: "/gns/assets/azizi-logo.png" },
  { name: "Binghatti", logo: "/gns/assets/Binghatti-Logo.png" },
];
