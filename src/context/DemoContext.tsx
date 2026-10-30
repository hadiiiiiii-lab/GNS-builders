import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PROPERTIES, PropertyItem, VERIFIED_TEAM, TeamMember } from '../data/gnsData';
import {
  Enquiry,
  ViewingRequest,
  ConversationLog,
  PropertyDraft,
  EnquiryStatus,
  ViewingStatus,
} from '../types/demo';
import {
  INITIAL_ENQUIRIES,
  INITIAL_VIEWINGS,
  INITIAL_CONVERSATIONS,
  INITIAL_DRAFTS,
} from '../data/demoInitialData';

interface DemoContextType {
  properties: PropertyItem[];
  enquiries: Enquiry[];
  viewings: ViewingRequest[];
  conversations: ConversationLog[];
  propertyDrafts: PropertyDraft[];
  team: TeamMember[];

  // Viewing Modal Trigger
  isViewingModalOpen: boolean;
  viewingModalProperty: { id: string; title: string; location: string } | null;
  openViewingModal: (property?: { id: string; title: string; location: string } | null) => void;
  closeViewingModal: () => void;

  // Actions
  addEnquiry: (enquiry: Omit<Enquiry, 'id' | 'createdAt'>) => Enquiry;
  updateEnquiryStatus: (id: string, status: EnquiryStatus) => void;
  assignAdvisorToEnquiry: (id: string, advisorId: string) => void;
  addEnquiryNote: (id: string, note: string) => void;

  addViewingRequest: (viewing: Omit<ViewingRequest, 'id' | 'createdAt' | 'status'>) => ViewingRequest;
  updateViewingStatus: (id: string, status: ViewingStatus) => void;
  assignAdvisorToViewing: (id: string, advisorId: string) => void;

  logConversation: (conv: Omit<ConversationLog, 'id' | 'timestamp'>) => void;

  createPropertyDraft: (draft: Omit<PropertyDraft, 'id' | 'updatedAt' | 'status'>) => void;
  approvePropertyDraft: (draftId: string) => void;
  rejectPropertyDraft: (draftId: string) => void;
  revertPropertyUpdate: (propertyId: string) => void;

  loadSampleData: () => void;
  resetDemoData: () => void;
  exportEnquiriesCSV: () => void;
}

const STORAGE_KEYS = {
  ENQUIRIES: 'gns_demo_enquiries_v1',
  VIEWINGS: 'gns_demo_viewings_v1',
  CONVERSATIONS: 'gns_demo_conversations_v1',
  DRAFTS: 'gns_demo_drafts_v1',
  OVERRIDES: 'gns_demo_property_overrides_v1',
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Overrides map: propertyId -> Partial<PropertyItem>
  const [propertyOverrides, setPropertyOverrides] = useState<Record<string, Partial<PropertyItem>>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OVERRIDES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
    } catch {
      return INITIAL_ENQUIRIES;
    }
  });

  const [viewings, setViewings] = useState<ViewingRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIEWINGS);
      return saved ? JSON.parse(saved) : INITIAL_VIEWINGS;
    } catch {
      return INITIAL_VIEWINGS;
    }
  });

  const [conversations, setConversations] = useState<ConversationLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  const [propertyDrafts, setPropertyDrafts] = useState<PropertyDraft[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DRAFTS);
      return saved ? JSON.parse(saved) : INITIAL_DRAFTS;
    } catch {
      return INITIAL_DRAFTS;
    }
  });

  // Modal State
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
  const [viewingModalProperty, setViewingModalProperty] = useState<{ id: string; title: string; location: string } | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.OVERRIDES, JSON.stringify(propertyOverrides));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [propertyOverrides]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [enquiries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VIEWINGS, JSON.stringify(viewings));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [viewings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(propertyDrafts));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [propertyDrafts]);

  // Merged properties list
  const properties = useMemo(() => {
    return PROPERTIES.map((prop) => {
      const override = propertyOverrides[prop.id];
      if (override) {
        return {
          ...prop,
          ...override,
        };
      }
      return prop;
    });
  }, [propertyOverrides]);

  const openViewingModal = (property?: { id: string; title: string; location: string } | null) => {
    setViewingModalProperty(property || null);
    setIsViewingModalOpen(true);
  };

  const closeViewingModal = () => {
    setIsViewingModalOpen(false);
    setViewingModalProperty(null);
  };

  const addEnquiry = (enquiryData: Omit<Enquiry, 'id' | 'createdAt'>): Enquiry => {
    const newEnquiry: Enquiry = {
      ...enquiryData,
      id: `enq-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };
    setEnquiries((prev) => [newEnquiry, ...prev]);
    return newEnquiry;
  };

  const updateEnquiryStatus = (id: string, status: EnquiryStatus) => {
    setEnquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const assignAdvisorToEnquiry = (id: string, advisorId: string) => {
    setEnquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, assignedAdvisorId: advisorId } : item))
    );
  };

  const addEnquiryNote = (id: string, noteText: string) => {
    setEnquiries((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const updatedNotes = item.notes
            ? `${item.notes}\n[${timestamp}] ${noteText}`
            : `[${timestamp}] ${noteText}`;
          return { ...item, notes: updatedNotes };
        }
        return item;
      })
    );
  };

  const addViewingRequest = (viewingData: Omit<ViewingRequest, 'id' | 'createdAt' | 'status'>): ViewingRequest => {
    const newViewing: ViewingRequest = {
      ...viewingData,
      id: `view-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: 'Pending Confirmation',
    };
    setViewings((prev) => [newViewing, ...prev]);
    return newViewing;
  };

  const updateViewingStatus = (id: string, status: ViewingStatus) => {
    setViewings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const assignAdvisorToViewing = (id: string, advisorId: string) => {
    setViewings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, assignedAdvisorId: advisorId } : item))
    );
  };

  const logConversation = (conv: Omit<ConversationLog, 'id' | 'timestamp'>) => {
    const newLog: ConversationLog = {
      ...conv,
      id: `conv-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
    };
    setConversations((prev) => [newLog, ...prev]);
  };

  const createPropertyDraft = (draftData: Omit<PropertyDraft, 'id' | 'updatedAt' | 'status'>) => {
    const newDraft: PropertyDraft = {
      ...draftData,
      id: `draft-${Date.now().toString().slice(-6)}`,
      updatedAt: new Date().toISOString(),
      status: 'Draft',
    };
    setPropertyDrafts((prev) => [newDraft, ...prev]);
  };

  const approvePropertyDraft = (draftId: string) => {
    const draft = propertyDrafts.find((d) => d.id === draftId);
    if (!draft) return;

    // Apply to overrides
    setPropertyOverrides((prev) => ({
      ...prev,
      [draft.propertyId]: {
        ...prev[draft.propertyId],
        priceNote: draft.proposed.priceNote,
        description: draft.proposed.description,
        image: draft.proposed.image,
      },
    }));

    // Mark draft as approved
    setPropertyDrafts((prev) =>
      prev.map((d) => (d.id === draftId ? { ...d, status: 'Approved' } : d))
    );
  };

  const rejectPropertyDraft = (draftId: string) => {
    setPropertyDrafts((prev) =>
      prev.map((d) => (d.id === draftId ? { ...d, status: 'Rejected' } : d))
    );
  };

  const revertPropertyUpdate = (propertyId: string) => {
    setPropertyOverrides((prev) => {
      const next = { ...prev };
      delete next[propertyId];
      return next;
    });
  };

  const loadSampleData = () => {
    setEnquiries(INITIAL_ENQUIRIES);
    setViewings(INITIAL_VIEWINGS);
    setConversations(INITIAL_CONVERSATIONS);
    setPropertyDrafts(INITIAL_DRAFTS);
    setPropertyOverrides({});
  };

  const resetDemoData = () => {
    setEnquiries([]);
    setViewings([]);
    setConversations([]);
    setPropertyDrafts([]);
    setPropertyOverrides({});
    try {
      localStorage.removeItem(STORAGE_KEYS.ENQUIRIES);
      localStorage.removeItem(STORAGE_KEYS.VIEWINGS);
      localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
      localStorage.removeItem(STORAGE_KEYS.DRAFTS);
      localStorage.removeItem(STORAGE_KEYS.OVERRIDES);
    } catch {
      // ignore
    }
  };

  const exportEnquiriesCSV = () => {
    if (enquiries.length === 0) {
      alert('No enquiries to export in current demo state.');
      return;
    }

    const headers = [
      'ID',
      'Created Date',
      'Visitor Name',
      'Contact',
      'Contact Method',
      'Objective',
      'Location',
      'Budget',
      'Bedrooms',
      'Timeline',
      'Property Interest',
      'Status',
      'Assigned Advisor',
      'Source',
      'Notes',
    ];

    const rows = enquiries.map((enq) => {
      const advisor = VERIFIED_TEAM.find((t) => t.id === enq.assignedAdvisorId)?.name || 'Unassigned';
      return [
        enq.id,
        new Date(enq.createdAt).toLocaleString(),
        `"${(enq.name || '').replace(/"/g, '""')}"`,
        `"${(enq.contact || '').replace(/"/g, '""')}"`,
        enq.contactMethod,
        enq.objective,
        `"${(enq.location || '').replace(/"/g, '""')}"`,
        `"${(enq.budget || '').replace(/"/g, '""')}"`,
        `"${(enq.bedrooms || '').replace(/"/g, '""')}"`,
        `"${(enq.timeline || '').replace(/"/g, '""')}"`,
        `"${(enq.propertyInterest || '').replace(/"/g, '""')}"`,
        enq.status,
        `"${advisor.replace(/"/g, '""')}"`,
        enq.source,
        `"${(enq.notes || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `GNS_Enquiries_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DemoContext.Provider
      value={{
        properties,
        enquiries,
        viewings,
        conversations,
        propertyDrafts,
        team: VERIFIED_TEAM,
        isViewingModalOpen,
        viewingModalProperty,
        openViewingModal,
        closeViewingModal,
        addEnquiry,
        updateEnquiryStatus,
        assignAdvisorToEnquiry,
        addEnquiryNote,
        addViewingRequest,
        updateViewingStatus,
        assignAdvisorToViewing,
        logConversation,
        createPropertyDraft,
        approvePropertyDraft,
        rejectPropertyDraft,
        revertPropertyUpdate,
        loadSampleData,
        resetDemoData,
        exportEnquiriesCSV,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemoContext = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoContext must be used within a DemoProvider');
  }
  return context;
};
