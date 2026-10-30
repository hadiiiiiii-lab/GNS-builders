import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  MessageSquare,
  Building,
  Download,
  RotateCcw,
  Check,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Filter,
  Copy,
  Mail,
  Phone,
  MessageCircle,
  Edit3,
  ArrowRight,
  ShieldAlert,
  ArrowLeft,
  X,
} from 'lucide-react';
import { useDemoContext } from '../context/DemoContext';
import { Enquiry, ViewingRequest, PropertyDraft, EnquiryStatus, ViewingStatus } from '../types/demo';
import { GNS_CONFIG } from '../data/gnsData';

export const DemoWorkspacePage: React.FC = () => {
  const {
    properties,
    enquiries,
    viewings,
    conversations,
    propertyDrafts,
    team,
    updateEnquiryStatus,
    assignAdvisorToEnquiry,
    addEnquiryNote,
    updateViewingStatus,
    assignAdvisorToViewing,
    createPropertyDraft,
    approvePropertyDraft,
    rejectPropertyDraft,
    revertPropertyUpdate,
    loadSampleData,
    resetDemoData,
    exportEnquiriesCSV,
  } = useDemoContext();

  const [activeTab, setActiveTab] = useState<'enquiries' | 'viewings' | 'conversations' | 'properties'>('enquiries');
  const [enquiryFilter, setEnquiryFilter] = useState<'All' | EnquiryStatus>('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [copiedHandoff, setCopiedHandoff] = useState(false);

  // Property Editor Form State
  const [selectedPropId, setSelectedPropId] = useState(properties[0]?.id || '');
  const [editPriceNote, setEditPriceNote] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editAvailability, setEditAvailability] = useState('Available');
  const [draftSuccessNotice, setDraftSuccessNotice] = useState<string | null>(null);

  // Confirmation modal for resetting demo data
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Selected property object
  const currentEditProp = properties.find((p) => p.id === selectedPropId) || properties[0];

  // Initialize editor fields when property selection changes
  const handleSelectPropertyToEdit = (propId: string) => {
    setSelectedPropId(propId);
    const prop = properties.find((p) => p.id === propId);
    if (prop) {
      setEditPriceNote(prop.priceNote);
      setEditDescription(prop.description);
      setEditImage(prop.image);
      setEditAvailability('Available');
    }
  };

  // Filtered enquiries
  const filteredEnquiries = enquiryFilter === 'All'
    ? enquiries
    : enquiries.filter((e) => e.status === enquiryFilter);

  // Follow-up message generator
  const generateFollowUpText = (enquiry: Enquiry) => {
    const advisor = team.find((t) => t.id === enquiry.assignedAdvisorId) || team[0];
    return `Hello ${enquiry.name},

Thank you for contacting GNS Real Estate regarding your interest in ${enquiry.location || 'Dubai properties'}.

I have noted your requirement:
• Objective: ${enquiry.objective}
• Location: ${enquiry.location}
• Budget: ${enquiry.budget}
• Layout: ${enquiry.bedrooms}
• Timeline: ${enquiry.timeline}
${enquiry.propertyInterest ? `• Property of Interest: ${enquiry.propertyInterest}` : ''}

I would be pleased to share the current floor plans, developer payment structures, and arrange an in-person or virtual viewing for you.

Kind regards,
${advisor.name}
${advisor.role} | GNS Real Estate LLC
Phone: ${GNS_CONFIG.officePhone}
WhatsApp: ${GNS_CONFIG.whatsappPhone}
Email: ${GNS_CONFIG.generalEmail}`;
  };

  const handleCopyFollowUp = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHandoff(true);
    setTimeout(() => setCopiedHandoff(false), 2000);
  };

  const handleCreateDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEditProp) return;

    createPropertyDraft({
      propertyId: currentEditProp.id,
      propertyTitle: currentEditProp.title,
      updatedBy: 'Vijay Kumar (CEO)',
      changeSummary: `Updated pricing note and descriptions for ${currentEditProp.title}`,
      original: {
        priceNote: currentEditProp.priceNote,
        description: currentEditProp.description,
        image: currentEditProp.image,
      },
      proposed: {
        priceNote: editPriceNote || currentEditProp.priceNote,
        description: editDescription || currentEditProp.description,
        image: editImage || currentEditProp.image,
        availability: editAvailability,
      },
    });

    setDraftSuccessNotice(`Draft created for ${currentEditProp.title}. Review and approve below to publish.`);
    setTimeout(() => setDraftSuccessNotice(null), 5000);
  };

  return (
    <div className="py-12 md:py-16 bg-[#FAF9F5] min-h-screen text-[#1A1918]">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12 space-y-8">
        {/* Top Breadcrumb & Disclaimer Banner */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#736F68]">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 hover:text-[#162E52] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </Link>

            <span className="font-mono text-[11px] bg-[#EFECE6] px-2.5 py-1 rounded-xs text-[#54514C]">
              Asia/Dubai (GST)
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E6E4DF] pb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-medium font-heading text-[#1A1918]">
                  Operations Demo Workspace
                </h1>
                <span className="text-[11px] px-2 py-0.5 bg-[#162E52] text-[#DEBF84] font-mono rounded-xs">
                  Internal Demo
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#736F68] mt-1 max-w-2xl">
                Demonstrates how incoming enquiries from the AI Receptionist, scheduled viewing requests, conversation transcripts, and property portfolio drafts are coordinated.
              </p>
            </div>

            {/* Global Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={loadSampleData}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#162E52] bg-white border border-[#DCD9D3] hover:bg-[#F2EFE9] rounded-xs transition-colors cursor-pointer"
                title="Load realistic sample enquiries and viewings"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Load Sample Data</span>
              </button>

              <button
                onClick={exportEnquiriesCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#162E52] bg-white border border-[#DCD9D3] hover:bg-[#F2EFE9] rounded-xs transition-colors cursor-pointer"
                title="Download enquiries as CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setShowResetConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 rounded-xs transition-colors cursor-pointer"
                title="Reset demo data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            </div>
          </div>

          {/* Honest Demo Notice */}
          <div className="p-3 bg-[#F0EEE9] border border-[#E6E4DF] rounded-xs text-xs text-[#524F4B] flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#162E52] shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong>Simulated Workspace:</strong> In this demo, changes to property price notes and descriptions take effect across this preview session. Viewing confirmations and follow-ups are modeled realistically without sending real SMS, WhatsApp, or email dispatches.
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#DCD9D3] space-x-1 sm:space-x-4 overflow-x-auto">
          {[
            { id: 'enquiries', label: `Enquiries (${enquiries.length})`, icon: Users },
            { id: 'viewings', label: `Viewing Requests (${viewings.length})`, icon: Calendar },
            { id: 'conversations', label: `Conversations (${conversations.length})`, icon: MessageSquare },
            { id: 'properties', label: `Property Updates (${propertyDrafts.length})`, icon: Building },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-[#162E52] text-[#162E52] bg-[#FAF9F5]'
                    : 'border-transparent text-[#736F68] hover:text-[#1A1918]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#162E52]' : 'text-[#736F68]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: ENQUIRIES CRM */}
        {/* ========================================================= */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            {/* Filter Pills & Counts */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {(['All', 'New', 'Contacted', 'Viewing requested', 'Closed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setEnquiryFilter(st)}
                    className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
                      enquiryFilter === st
                        ? 'bg-[#162E52] text-white font-medium'
                        : 'bg-white border border-[#DCD9D3] text-[#54514C] hover:bg-[#F2EFE9]'
                    }`}
                  >
                    {st} {st !== 'All' && `(${enquiries.filter((e) => e.status === st).length})`}
                  </button>
                ))}
              </div>

              <div className="text-xs text-[#736F68]">
                Showing {filteredEnquiries.length} of {enquiries.length} enquiries
              </div>
            </div>

            {/* Enquiries Table */}
            {filteredEnquiries.length === 0 ? (
              <div className="p-12 text-center bg-white border border-[#E6E4DF] rounded-xs space-y-3">
                <Users className="w-8 h-8 text-[#B0ABA2] mx-auto" />
                <p className="text-sm text-[#736F68]">No enquiries found under this filter.</p>
                <button
                  onClick={loadSampleData}
                  className="px-4 py-2 text-xs font-medium text-[#162E52] bg-[#F0EEE9] rounded-xs hover:bg-[#E6E4DF]"
                >
                  Load Sample Enquiries
                </button>
              </div>
            ) : (
              <div className="bg-white border border-[#DCD9D3] rounded-xs overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs text-[#2A2928] border-collapse">
                  <thead>
                    <tr className="bg-[#F0EEE9] text-[#736F68] uppercase tracking-wider text-[10px] border-b border-[#E6E4DF]">
                      <th className="p-3.5 font-medium">Visitor Name</th>
                      <th className="p-3.5 font-medium">Contact</th>
                      <th className="p-3.5 font-medium">Objective & Location</th>
                      <th className="p-3.5 font-medium">Budget</th>
                      <th className="p-3.5 font-medium">Status</th>
                      <th className="p-3.5 font-medium">Assigned Advisor</th>
                      <th className="p-3.5 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EEE9]">
                    {filteredEnquiries.map((enq) => {
                      const advisor = team.find((t) => t.id === enq.assignedAdvisorId);
                      return (
                        <tr
                          key={enq.id}
                          className="hover:bg-[#FAF9F5] transition-colors cursor-pointer"
                          onClick={() => setSelectedEnquiry(enq)}
                        >
                          <td className="p-3.5">
                            <div className="font-semibold text-[#1A1918]">{enq.name}</div>
                            <div className="text-[10px] text-[#7A7771] mt-0.5">
                              {new Date(enq.createdAt).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                              })} · {enq.source}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div>{enq.contact}</div>
                            <div className="text-[10px] text-[#7A7771]">{enq.contactMethod}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="font-medium text-[#162E52]">{enq.objective}</span>
                            <div className="text-[11px] text-[#54514C]">{enq.location}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="truncate max-w-[140px]">{enq.budget}</div>
                            <div className="text-[10px] text-[#7A7771]">{enq.bedrooms}</div>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider ${
                                enq.status === 'New'
                                  ? 'bg-blue-100 text-blue-800'
                                  : enq.status === 'Contacted'
                                  ? 'bg-amber-100 text-amber-800'
                                  : enq.status === 'Viewing requested'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {enq.status}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="text-[#1A1918]">{advisor ? advisor.name : 'Unassigned'}</div>
                            <div className="text-[10px] text-[#7A7771]">{advisor?.role || 'Pending'}</div>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEnquiry(enq);
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold text-[#162E52] bg-[#F0EEE9] hover:bg-[#E6E4DF] rounded-xs"
                            >
                              View / Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Selected Enquiry Drawer / Modal */}
        {selectedEnquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#162E52]/60 backdrop-blur-xs">
            <div className="relative w-full max-w-2xl bg-[#FAF9F5] border border-[#DCD9D3] rounded-xs shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
              {/* Header */}
              <div className="p-4 bg-[#162E52] text-white flex items-center justify-between border-b border-white/10">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Enquiry Details: {selectedEnquiry.name}
                  </h3>
                  <p className="text-xs text-white/70">
                    ID: {selectedEnquiry.id} · Logged {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="p-1 text-white/70 hover:text-white rounded-xs cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#2A2928]">
                {/* 1. Qualification Criteria */}
                <div className="p-4 bg-white border border-[#E6E4DF] rounded-xs space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#736F68]">
                    Qualification Summary
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="text-[10px] text-[#7A7771]">Objective</div>
                      <div className="font-semibold text-[#1A1918]">{selectedEnquiry.objective}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#7A7771]">Target Location</div>
                      <div className="font-semibold text-[#1A1918]">{selectedEnquiry.location}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#7A7771]">Budget</div>
                      <div className="font-semibold text-[#1A1918]">{selectedEnquiry.budget}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#7A7771]">Bedrooms</div>
                      <div className="font-semibold text-[#1A1918]">{selectedEnquiry.bedrooms}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#7A7771]">Timeline</div>
                      <div className="font-semibold text-[#1A1918]">{selectedEnquiry.timeline}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#7A7771]">Contact Preference</div>
                      <div className="font-semibold text-[#1A1918]">
                        {selectedEnquiry.contact} ({selectedEnquiry.contactMethod})
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Status & Advisor Assignment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                      Update Enquiry Status
                    </label>
                    <select
                      value={selectedEnquiry.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as EnquiryStatus;
                        updateEnquiryStatus(selectedEnquiry.id, newStatus);
                        setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
                      }}
                      className="w-full p-2 bg-white border border-[#DCD9D3] rounded-xs text-xs focus:outline-2 focus:outline-[#162E52]"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Viewing requested">Viewing requested</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                      Assign GNS Property Advisor
                    </label>
                    <select
                      value={selectedEnquiry.assignedAdvisorId || ''}
                      onChange={(e) => {
                        const advId = e.target.value;
                        assignAdvisorToEnquiry(selectedEnquiry.id, advId);
                        setSelectedEnquiry((prev) => (prev ? { ...prev, assignedAdvisorId: advId } : null));
                      }}
                      className="w-full p-2 bg-white border border-[#DCD9D3] rounded-xs text-xs focus:outline-2 focus:outline-[#162E52]"
                    >
                      <option value="">Unassigned</option>
                      {team.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Internal Notes */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#1A1918]">
                    Internal Advisor Notes
                  </label>
                  {selectedEnquiry.notes && (
                    <div className="p-3 bg-white border border-[#E6E4DF] rounded-xs whitespace-pre-line text-[11px] text-[#4A4844] max-h-28 overflow-y-auto">
                      {selectedEnquiry.notes}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an internal note..."
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      className="flex-1 p-2 bg-white border border-[#DCD9D3] rounded-xs text-xs"
                    />
                    <button
                      onClick={() => {
                        if (!noteInput.trim()) return;
                        addEnquiryNote(selectedEnquiry.id, noteInput.trim());
                        setSelectedEnquiry((prev) =>
                          prev
                            ? {
                                ...prev,
                                notes: prev.notes
                                  ? `${prev.notes}\n[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] ${noteInput.trim()}`
                                  : noteInput.trim(),
                              }
                            : null
                        );
                        setNoteInput('');
                      }}
                      className="px-3 py-1.5 bg-[#162E52] text-white rounded-xs text-xs font-medium cursor-pointer"
                    >
                      Add Note
                    </button>
                  </div>
                </div>

                {/* 4. Follow-up & Handoff Generator */}
                <div className="p-4 bg-[#F0EEE9] border border-[#E6E4DF] rounded-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1A1918]">
                      Client Follow-up Handoff
                    </span>
                    <span className="text-[10px] text-[#736F68]">
                      Explicit user actions · No auto-dispatch
                    </span>
                  </div>

                  <div className="p-3 bg-white border border-[#DCD9D3] rounded-xs font-mono text-[11px] text-[#333] whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed">
                    {generateFollowUpText(selectedEnquiry)}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => handleCopyFollowUp(generateFollowUpText(selectedEnquiry))}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#DCD9D3] hover:border-[#162E52] rounded-xs text-xs font-medium cursor-pointer"
                    >
                      {copiedHandoff ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#162E52]" />
                      )}
                      <span>{copiedHandoff ? 'Copied' : 'Copy Message'}</span>
                    </button>

                    <a
                      href={`https://wa.me/971507350414?text=${encodeURIComponent(
                        generateFollowUpText(selectedEnquiry)
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#25D366] text-white rounded-xs text-xs font-medium hover:bg-[#20ba59] cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Open WhatsApp</span>
                    </a>

                    <a
                      href={`mailto:${GNS_CONFIG.generalEmail}?subject=GNS%20Follow-up%20for%20${encodeURIComponent(
                        selectedEnquiry.name
                      )}&body=${encodeURIComponent(generateFollowUpText(selectedEnquiry))}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#DCD9D3] hover:bg-[#F2EFE9] rounded-xs text-xs font-medium cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#162E52]" />
                      <span>Prepare Email</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: VIEWING REQUESTS */}
        {/* ========================================================= */}
        {activeTab === 'viewings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#736F68]">
              <span>Scheduled viewing appointments ({viewings.length})</span>
              <span>All times Asia/Dubai (GST)</span>
            </div>

            {viewings.length === 0 ? (
              <div className="p-12 text-center bg-white border border-[#E6E4DF] rounded-xs space-y-3">
                <Calendar className="w-8 h-8 text-[#B0ABA2] mx-auto" />
                <p className="text-sm text-[#736F68]">No viewing requests recorded yet.</p>
                <button
                  onClick={loadSampleData}
                  className="px-4 py-2 text-xs font-medium text-[#162E52] bg-[#F0EEE9] rounded-xs hover:bg-[#E6E4DF]"
                >
                  Load Sample Data
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {viewings.map((view) => {
                  const advisor = team.find((t) => t.id === view.assignedAdvisorId);
                  return (
                    <div
                      key={view.id}
                      className="p-5 bg-white border border-[#DCD9D3] rounded-xs shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-[#1A1918]">
                              {view.propertyTitle}
                            </h4>
                            <span className="text-[10px] px-1.5 py-0.5 bg-[#F0EEE9] text-[#162E52] rounded-xs font-mono">
                              {view.viewingType}
                            </span>
                          </div>
                          <p className="text-xs text-[#736F68] mt-0.5">{view.propertyLocation}</p>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider ${
                            view.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : view.status === 'Pending Confirmation'
                              ? 'bg-amber-100 text-amber-800'
                              : view.status === 'Completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {view.status}
                        </span>
                      </div>

                      <div className="p-3 bg-[#FAF9F5] border border-[#E6E4DF] rounded-xs text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-[#736F68]">Requested Slot:</span>
                          <span className="font-semibold text-[#1A1918]">
                            {view.date} · {view.timeSlot}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#736F68]">Visitor:</span>
                          <span className="text-[#1A1918]">
                            {view.visitorName} ({view.visitorContact} via {view.visitorContactMethod})
                          </span>
                        </div>
                        {view.notes && (
                          <div className="pt-1 text-[11px] text-[#54514C] italic border-t border-[#F0EEE9]">
                            "{view.notes}"
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#F0EEE9] text-xs">
                        <div className="text-[11px] text-[#736F68]">
                          Advisor: <strong className="text-[#1A1918]">{advisor ? advisor.name : 'Unassigned'}</strong>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {view.status !== 'Confirmed' && (
                            <button
                              onClick={() => updateViewingStatus(view.id, 'Confirmed')}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 text-white rounded-xs hover:bg-emerald-700 cursor-pointer"
                            >
                              Confirm
                            </button>
                          )}
                          {view.status !== 'Cancelled' && (
                            <button
                              onClick={() => updateViewingStatus(view.id, 'Cancelled')}
                              className="px-2 py-1 text-[11px] text-[#736F68] hover:text-rose-600 cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CONVERSATION LOGS */}
        {/* ========================================================= */}
        {activeTab === 'conversations' && (
          <div className="space-y-4">
            <div className="text-xs text-[#736F68]">
              Recorded transcripts from Website Assistant and Voice Simulations ({conversations.length})
            </div>

            {conversations.length === 0 ? (
              <div className="p-12 text-center bg-white border border-[#E6E4DF] rounded-xs space-y-3">
                <MessageSquare className="w-8 h-8 text-[#B0ABA2] mx-auto" />
                <p className="text-sm text-[#736F68]">No recorded conversations.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="p-5 bg-white border border-[#DCD9D3] rounded-xs shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#1A1918]">
                          {conv.visitorName ? `${conv.visitorName} (${conv.visitorContact})` : 'Anonymous Visitor'}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-[#162E52] text-[#DEBF84] font-mono rounded-xs">
                          {conv.channel}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#736F68]">
                        {new Date(conv.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-[#4A4844] bg-[#FAF9F5] p-2.5 rounded-xs border border-[#E6E4DF]">
                      <strong>AI Summary:</strong> {conv.summary}
                    </p>

                    {/* Collapsible Transcript */}
                    <div className="border border-[#E6E4DF] rounded-xs overflow-hidden">
                      <div className="p-2 bg-[#F0EEE9] text-[11px] font-semibold text-[#736F68]">
                        Full Transcript ({conv.transcript.length} turns)
                      </div>
                      <div className="p-3 max-h-48 overflow-y-auto space-y-2 text-xs">
                        {conv.transcript.map((t, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-xs ${
                              t.role === 'user'
                                ? 'bg-blue-50/70 border border-blue-100 text-[#162E52]'
                                : 'bg-[#FAF9F5] border border-[#E6E4DF] text-[#2A2928]'
                            }`}
                          >
                            <div className="text-[10px] text-[#736F68] mb-0.5 font-semibold">
                              {t.role === 'user' ? 'Client' : 'GNS Assistant'} · {t.time}
                            </div>
                            <p>{t.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PROPERTY PORTFOLIO CMS & APPROVAL WORKFLOW */}
        {/* ========================================================= */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            <div className="p-4 bg-[#F0EEE9] border border-[#E6E4DF] rounded-xs text-xs text-[#524F4B] space-y-1">
              <div className="font-semibold text-[#1A1918]">Property Update Approval Workflow</div>
              <p>
                Edit pricing notes, descriptions, or availability for any GNS property. When approved, updates instantly apply across the public website pages and the AI Receptionist knowledge base.
              </p>
            </div>

            {draftSuccessNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{draftSuccessNotice}</span>
              </div>
            )}

            {/* Editor Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Editor Form */}
              <div className="lg:col-span-6 bg-white border border-[#DCD9D3] rounded-xs p-5 shadow-xs space-y-4">
                <h3 className="text-sm font-semibold text-[#1A1918] border-b border-[#E6E4DF] pb-2">
                  Edit Property Details
                </h3>

                <form onSubmit={handleCreateDraft} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#1A1918] mb-1">
                      Choose Property to Edit
                    </label>
                    <select
                      value={selectedPropId}
                      onChange={(e) => handleSelectPropertyToEdit(e.target.value)}
                      className="w-full p-2 bg-white border border-[#DCD9D3] rounded-xs text-xs focus:outline-2 focus:outline-[#162E52]"
                    >
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.location})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1A1918] mb-1">
                      Pricing Note / Tranche
                    </label>
                    <input
                      type="text"
                      value={editPriceNote}
                      onChange={(e) => setEditPriceNote(e.target.value)}
                      placeholder="e.g. Starting from AED 1.8M · 80/20 Payment Plan"
                      className="w-full p-2 bg-white border border-[#DCD9D3] rounded-xs text-xs focus:outline-2 focus:outline-[#162E52]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1A1918] mb-1">
                      Availability Status
                    </label>
                    <select
                      value={editAvailability}
                      onChange={(e) => setEditAvailability(e.target.value)}
                      className="w-full p-2 bg-white border border-[#DCD9D3] rounded-xs text-xs focus:outline-2 focus:outline-[#162E52]"
                    >
                      <option value="Available">Available</option>
                      <option value="Limited Availability">Limited Availability</option>
                      <option value="Under Offer">Under Offer</option>
                      <option value="Sold Out">Sold Out</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1A1918] mb-1">
                      Architectural Description
                    </label>
                    <textarea
                      rows={3}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full p-2 bg-white border border-[#DCD9D3] rounded-xs text-xs focus:outline-2 focus:outline-[#162E52]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => revertPropertyUpdate(currentEditProp.id)}
                      className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                    >
                      Revert this property to original
                    </button>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#162E52] text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#22417C] cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#DEBF84]" />
                      <span>Save as Draft</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Live Before & After Comparison */}
              <div className="lg:col-span-6 bg-white border border-[#DCD9D3] rounded-xs p-5 shadow-xs space-y-4">
                <h3 className="text-sm font-semibold text-[#1A1918] border-b border-[#E6E4DF] pb-2">
                  Side-by-Side Comparison: {currentEditProp.title}
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  {/* Current Live */}
                  <div className="p-3 bg-[#FAF9F5] border border-[#E6E4DF] rounded-xs space-y-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#736F68] block">
                      Current Live Version
                    </span>
                    <div className="text-[11px] text-[#736F68]">Pricing Note:</div>
                    <div className="font-medium text-[#1A1918]">{currentEditProp.priceNote}</div>
                    <div className="text-[11px] text-[#736F68] pt-1">Description:</div>
                    <p className="text-[11px] text-[#54514C] leading-snug line-clamp-4">
                      {currentEditProp.description}
                    </p>
                  </div>

                  {/* Proposed Update */}
                  <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xs space-y-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 block">
                      Proposed Update
                    </span>
                    <div className="text-[11px] text-[#736F68]">Pricing Note:</div>
                    <div className="font-semibold text-emerald-950">
                      {editPriceNote || currentEditProp.priceNote}
                    </div>
                    <div className="text-[11px] text-[#736F68] pt-1">Status:</div>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono rounded-xs">
                      {editAvailability}
                    </span>
                    <div className="text-[11px] text-[#736F68] pt-1">Description:</div>
                    <p className="text-[11px] text-emerald-950 leading-snug line-clamp-4">
                      {editDescription || currentEditProp.description}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF9F5] border border-[#E6E4DF] rounded-xs text-[11px] text-[#63605B]">
                  Live website pages (Home, Properties, Detail) and the AI receptionist read from this updated state once approved.
                </div>
              </div>
            </div>

            {/* Pending & Approved Drafts Queue */}
            <div className="bg-white border border-[#DCD9D3] rounded-xs p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-semibold text-[#1A1918] border-b border-[#E6E4DF] pb-2">
                Approval Queue & Change History
              </h3>

              {propertyDrafts.length === 0 ? (
                <p className="text-xs text-[#736F68]">No pending or historical drafts found.</p>
              ) : (
                <div className="space-y-3">
                  {propertyDrafts.map((draft) => (
                    <div
                      key={draft.id}
                      className="p-4 bg-[#FAF9F5] border border-[#E6E4DF] rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#1A1918]">{draft.propertyTitle}</span>
                          <span
                            className={`px-2 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider ${
                              draft.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : draft.status === 'Rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {draft.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#54514C]">{draft.changeSummary}</p>
                        <div className="text-[10px] text-[#7A7771]">
                          Proposed by {draft.updatedBy} · {new Date(draft.updatedAt).toLocaleString()}
                        </div>
                      </div>

                      {draft.status === 'Draft' && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => approvePropertyDraft(draft.id)}
                            className="px-3 py-1.5 bg-emerald-700 text-white font-medium rounded-xs hover:bg-emerald-800 transition-colors cursor-pointer"
                          >
                            Approve & Publish to Demo
                          </button>
                          <button
                            onClick={() => rejectPropertyDraft(draft.id)}
                            className="px-3 py-1.5 bg-white border border-[#DCD9D3] text-rose-700 rounded-xs hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {draft.status === 'Approved' && (
                        <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active on Website</span>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: Confirm Reset Demo Data */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#162E52]/60 backdrop-blur-xs">
            <div className="relative w-full max-w-md bg-[#FAF9F5] border border-[#DCD9D3] rounded-xs shadow-2xl p-6 space-y-4 text-[#1A1918]">
              <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm">
                <AlertCircle className="w-5 h-5" />
                <span>Reset Demo State?</span>
              </div>
              <p className="text-xs text-[#54514C] leading-relaxed">
                This will clear all recorded enquiries, viewing bookings, conversation logs, and custom property drafts in this browser session. You can reload sample data at any time.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 text-xs text-[#736F68] hover:text-[#1A1918] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    resetDemoData();
                    setShowResetConfirm(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xs cursor-pointer"
                >
                  Yes, Reset All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
