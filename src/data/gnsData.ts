/**
 * GNS Real Estate LLC - Central Data Configuration
 * Grounded in verified asset sources, TEAM_SOURCES.json, and business_profile.json
 */

export interface PropertyItem {
  id: string;
  title: string;
  developer: string;
  location: string;
  type: string;
  category: 'Apartments' | 'Villas & Townhouses' | 'Off-plan';
  image: string;
  secondaryImage?: string;
  priceNote: string;
  description: string;
  sourceUrl: string;
  whatsappMessage: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  photo: string;
  bio: string;
  sourcePage: string;
  note?: string;
}

export interface DeveloperPartner {
  name: string;
  logo: string;
}

export const GNS_CONFIG = {
  companyName: "GNS Real Estate LLC",
  tagline: "Property decisions, thoughtfully guided.",
  location: "Dubai, United Arab Emirates",
  logo: "/gns/verified_team/GNS_Official_Logo.png",
  favicon: "/gns/assets/GNS-Favicon_1.png",
  generalEmail: "info@gnsre.com",
  officePhone: "+971 4 399 3918",
  whatsappPhone: "+971 50 735 0414",
  mailtoUrl: "mailto:info@gnsre.com",
  officeTelUrl: "tel:+97143993918",
  whatsappUrl: "https://wa.me/971507350414",
  ceoContactName: "Vijay Sakhija (Vijay Kumar)",
  
  // Video configuration: Currently referenced by GNS's existing website (sourced from Pixabay)
  // Displayed full-width with object-fit: cover, muted autoplay, loop, playsInline, with authentic GNS poster fallback.
  heroVideoUrl: "https://cdn.pixabay.com/video/2022/03/18/111204-689949818_large.mp4" as string | null,
  heroPosterImage: "/gns/assets/The-Serene-Sobha-1-592x444.webp",

  socialLinks: {
    instagram: "https://www.instagram.com/gns.realestate/",
    facebook: "https://www.facebook.com/gnsrealestateuae/",
    linkedin: "https://www.linkedin.com/company/gns-realestate-llc/",
  },

  // Facts requiring client confirmation before public distribution
  pendingClientConfirmations: [
    {
      item: "Office Street Address",
      currentData: "Reported on LinkedIn as: Office 108, NBQ Building, Al Hamriyah St, Burjuman, Dubai, UAE",
      status: "Omitted from public street footer until formally verified by client",
    },
    {
      item: "Vijay Kumar Title",
      currentData: "Verified as CEO on official gnsre.com profile",
      status: "Retained strictly as CEO (founder title withheld without explicit confirmation)",
    },
    {
      item: "Sharjeel Profile URL",
      currentData: "Displays as 'Sharjeel' on page while URL path is /agent/sagar-kumar/",
      status: "Displayed as 'Sharjeel' with technical alias noted",
    },
    {
      item: "Live Unit Pricing",
      currentData: "Prices fluctuate per developer releases and availability",
      status: "Strictly using 'Contact for current availability and pricing'",
    },
    {
      item: "Hero Background Video",
      currentData: "Referenced by GNS's existing website (sourced from Pixabay)",
      status: "Configured with authentic GNS property poster fallback; not represented as original GNS footage",
    },
  ]
};

export const VERIFIED_TEAM: TeamMember[] = [
  {
    id: "vijay-kumar",
    name: "Vijay Kumar",
    title: "Chief Executive Officer (CEO)",
    photo: "/gns/verified_team/Vijay_Kumar.jpg",
    bio: "Guiding GNS Real Estate's advisory practice with an unwavering commitment to transparent client counsel across Dubai's premier residential communities and landmark developments.",
    sourcePage: "https://gnsre.com/agent/vijay-kumar/",
  },
  {
    id: "heena-shaikh",
    name: "Heena Shaikh",
    title: "Senior Property Advisor",
    photo: "/gns/verified_team/Heena_Shaikh.jpg",
    bio: "Specializing in prime residential waterfront acquisitions, luxury apartments, and private client portfolio growth across Madinat Jumeirah, Downtown, and Creek Harbour.",
    sourcePage: "https://gnsre.com/agent/heena-sheikh/",
  },
  {
    id: "prince-manooj",
    name: "Prince Manooj",
    title: "Property Consultant",
    photo: "/gns/verified_team/Prince_Manooj.jpg",
    bio: "Advising end-users and investors on emerging island developments, off-plan structures, and optimal handover timelines across Dubai's top master plans.",
    sourcePage: "https://gnsre.com/agent/prince-manooj/",
  },
  {
    id: "nisar-ahmed",
    name: "Nisar Ahmed",
    title: "Property Consultant",
    photo: "/gns/verified_team/Nisar_Ahmed.jpg",
    bio: "Connecting international and regional buyers with reputable developer partnerships, flexible payment schedules, and verified ready residential holdings.",
    sourcePage: "https://gnsre.com/agent/nisar-ahamed/",
  },
  {
    id: "vanesh-kumar",
    name: "Vanesh Kumar",
    title: "Property Advisor",
    photo: "/gns/verified_team/Vanesh_Kumar.jpg",
    bio: "Focusing on family villa communities, prime off-plan allocations, and comprehensive investor onboarding across high-demand Dubai corridors.",
    sourcePage: "https://gnsre.com/agent/vanesh-kumar/",
  },
  {
    id: "sharjeel",
    name: "Sharjeel",
    title: "Property Consultant",
    photo: "/gns/verified_team/Sharjeel.jpg",
    bio: "Assisting clients with tailored search mandates, market comparisons, and handover preparations across established residential districts.",
    sourcePage: "https://gnsre.com/agent/sagar-kumar/",
    note: "Official page displays name Sharjeel; URL alias sagar-kumar flagged for confirmation.",
  },
  {
    id: "krystelle-detic",
    name: "Krystelle Detic",
    title: "Client Relations & Operations",
    photo: "/gns/verified_team/Krystelle_Detic.jpg",
    bio: "Directing client care, inquiry coordination, and administrative precision to ensure seamless transactions from initial inquiry to final key handover.",
    sourcePage: "https://gnsre.com/agent/krystelle-detic/",
  },
  {
    id: "shafiq-ur-rehman",
    name: "Shafiq ur Rehman",
    title: "Property Advisor",
    photo: "/gns/verified_team/Shafiq_ur_Rehman.jpg",
    bio: "Providing granular community insights, rental yield assessments, and personalized viewings for ready townhouses and apartments in Dubai.",
    sourcePage: "https://gnsre.com/agent/shafiq-ur-rehman/",
  },
];

export const SELECTED_PROPERTIES: PropertyItem[] = [
  {
    id: "nourelle-madinat-jumeirah",
    title: "Nourelle at Madinat Jumeirah Living",
    developer: "Meraas",
    location: "Madinat Jumeirah Living, Umm Suqeim",
    type: "1–4 Bedroom Residences & Penthouses",
    category: "Apartments",
    image: "/gns/assets/Nourelle-at-MJL-Meraas-13-592x444.webp",
    secondaryImage: "/gns/assets/original-3-592x444.webp",
    priceNote: "Contact for current availability and pricing",
    description: "An exclusive pedestrian-first enclave situated moments from Burj Al Arab. Classic Arabesque wind-tower styling meets expansive contemporary interiors and lush garden pathways.",
    sourceUrl: "https://gnsre.com/property/nourelle-at-madinat-jumeirah/",
    whatsappMessage: "Hello GNS Real Estate, I am enquiring about Nourelle at Madinat Jumeirah Living.",
  },
  {
    id: "the-serene-sobha-central",
    title: "The Serene at Sobha Central",
    developer: "Sobha Realty",
    location: "Sobha Central, Dubai",
    type: "Luxury Waterfront Apartments",
    category: "Apartments",
    image: "/gns/assets/The-Serene-Sobha-1-592x444.webp",
    secondaryImage: "/gns/assets/The-Serene-Sobha-6-592x444.webp",
    priceNote: "Contact for current availability and pricing",
    description: "Architectural residences built to Sobha's renowned backward-integrated precision standards, framing sweeping views of serene waterways and manicured parklands.",
    sourceUrl: "https://gnsre.com/property/the-serene-at-sobha-central/",
    whatsappMessage: "Hello GNS Real Estate, I am enquiring about The Serene at Sobha Central.",
  },
  {
    id: "palace-residences-hillside",
    title: "Palace Residences Hillside A",
    developer: "Emaar Properties",
    location: "Dubai Hills Estate",
    type: "Branded Parkside Apartments",
    category: "Off-plan",
    image: "/gns/assets/Palace-Residence-at-Hill-Estate-Emaar-1-592x444.webp",
    secondaryImage: "/gns/assets/Silva-Dubai-Creek-Emaar-2-592x444.webp",
    priceNote: "Contact for current availability and pricing",
    description: "Hospitality-branded urban homes managed with the distinguished five-star service standards of Palace Hotels & Resorts, directly bordering Dubai Hills Central Park.",
    sourceUrl: "https://gnsre.com/property/palace-residences-hillside-a-at-dubai-hills-estate/",
    whatsappMessage: "Hello GNS Real Estate, I am enquiring about Palace Residences Hillside A at Dubai Hills Estate.",
  },
  {
    id: "samana-ocean-crest",
    title: "Samana Ocean Crest",
    developer: "Samana Developers",
    location: "Dubai Islands, Deira Coastal Basin",
    type: "Resort-Style Island Residences",
    category: "Off-plan",
    image: "/gns/assets/Samana-Ocean-Crest-6-592x444.webp",
    secondaryImage: "/gns/assets/Bay-Grove-Deira-Dubai-Island-Phase-1-4-592x444.webp",
    priceNote: "Contact for current availability and pricing",
    description: "Elevated coastal living on Dubai Islands featuring private balcony pools, sun terraces, and direct water-facing promenades within minutes of heritage Deira.",
    sourceUrl: "https://gnsre.com/property/samana-ocean-crest-at-dubai-islands/",
    whatsappMessage: "Hello GNS Real Estate, I am enquiring about Samana Ocean Crest at Dubai Islands.",
  },
  {
    id: "bayz-102-business-bay",
    title: "Bayz 102 by Danube",
    developer: "Danube Properties",
    location: "Business Bay, Dubai Canal",
    type: "Contemporary High-Rise Apartments",
    category: "Apartments",
    image: "/gns/assets/Bayz-102-Danube-Properties-1-592x444.webp",
    secondaryImage: "/gns/assets/Breez-by-Danube-8-592x444.webp",
    priceNote: "Contact for current availability and pricing",
    description: "High-floor urban residences positioned near the Dubai Canal, delivering quick connectivity to Downtown Dubai, Burj Khalifa, and the financial center.",
    sourceUrl: "https://gnsre.com/property/bayz-102/",
    whatsappMessage: "Hello GNS Real Estate, I am enquiring about Bayz 102 in Business Bay.",
  },
  {
    id: "shams-townhouses",
    title: "Shams Townhouses",
    developer: "Town Square Dubai",
    location: "Town Square, Al Qudra Road",
    type: "3 & 4 Bedroom Family Townhouses",
    category: "Villas & Townhouses",
    image: "/gns/assets/Shams-townhouses-5-592x444.webp",
    secondaryImage: "/gns/assets/Farm-Garden-Phase-2-Emaar-4-592x444.webp",
    priceNote: "Contact for current availability and pricing",
    description: "Spacious ready-to-move-in homes with private outdoor gardens, modern architectural elevations, and immediate access to community parks, trails, and retail.",
    sourceUrl: "https://gnsre.com/property/shams-townhouses-ready-to-move-in/",
    whatsappMessage: "Hello GNS Real Estate, I am enquiring about Shams Townhouses in Town Square.",
  },
];

export const DEVELOPER_PARTNERS: DeveloperPartner[] = [
  { name: "Emaar Properties", logo: "/gns/assets/Dubai-Developers-Logo-2.jpg" },
  { name: "Sobha Realty", logo: "/gns/assets/Dubai-Developers-Logo-7.jpg" },
  { name: "Danube Properties", logo: "/gns/assets/Dubai-Developers-Logo-10.jpg" },
  { name: "Azizi Developments", logo: "/gns/assets/azizi-logo.png" },
  { name: "Binghatti", logo: "/gns/assets/Binghatti-Logo.png" },
  { name: "Meraas", logo: "/gns/assets/Dubai-Developers-Logo-13.jpg" },
];

export const THREE_STEP_JOURNEY = [
  {
    step: "01",
    title: "Share your requirements",
    description: "Whether seeking a primary residence, a seasonal home, or an investment asset, brief us on your desired community, layout, budget, and timing.",
  },
  {
    step: "02",
    title: "Explore suitable options",
    description: "Receive a curated selection of genuine, verified developer allocations and ready properties matching your criteria, without clutter or inflated expectations.",
  },
  {
    step: "03",
    title: "Speak with an advisor",
    description: "Connect directly with a dedicated GNS advisor who coordinates on-site viewings, developer contract reviews, and transaction procedures from start to finish.",
  },
];
