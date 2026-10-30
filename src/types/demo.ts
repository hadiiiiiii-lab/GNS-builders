import { PropertyItem, TeamMember } from '../data/gnsData';

export type EnquiryStatus = 'New' | 'Contacted' | 'Viewing requested' | 'Closed';

export type ViewingStatus = 'Pending Confirmation' | 'Confirmed' | 'Completed' | 'Cancelled';

export type ViewingType = 'In-person' | 'Virtual';

export interface Enquiry {
  id: string;
  createdAt: string;
  name: string;
  contact: string;
  contactMethod: 'WhatsApp' | 'Phone Call' | 'Email';
  objective: 'Buy' | 'Rent' | 'Off-plan' | 'General';
  location: string;
  budget: string;
  bedrooms: string;
  timeline: string;
  propertyInterest?: string;
  notes?: string;
  status: EnquiryStatus;
  assignedAdvisorId?: string;
  consentGiven: boolean;
  source: 'Website Assistant' | 'Voice Receptionist' | 'Property Page' | 'Sample Data';
}

export interface ViewingRequest {
  id: string;
  createdAt: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "11:00 AM (GST)"
  viewingType: ViewingType;
  visitorName: string;
  visitorContact: string;
  visitorContactMethod: 'WhatsApp' | 'Phone' | 'Email';
  notes?: string;
  status: ViewingStatus;
  assignedAdvisorId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user' | 'system';
  text: string;
  time: string;
  quickChoices?: string[];
  shortlist?: PropertyItem[];
  showViewingTrigger?: {
    propertyId: string;
    propertyTitle: string;
  };
}

export interface ConversationLog {
  id: string;
  channel: 'Chat Receptionist' | 'Voice Call Simulation' | 'Voice Mic Live';
  timestamp: string;
  visitorName?: string;
  visitorContact?: string;
  summary: string;
  transcript: Array<{ role: 'user' | 'assistant' | 'system'; text: string; time: string }>;
  extractedCriteria?: {
    objective?: string;
    location?: string;
    budget?: string;
    bedrooms?: string;
    timeline?: string;
  };
}

export interface PropertyDraft {
  id: string;
  propertyId: string;
  propertyTitle: string;
  updatedAt: string;
  updatedBy: string;
  status: 'Draft' | 'Approved' | 'Rejected';
  changeSummary: string;
  original: {
    priceNote: string;
    description: string;
    image: string;
    availability?: string;
  };
  proposed: {
    priceNote: string;
    description: string;
    image: string;
    availability?: string;
  };
}
