import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useDemoContext } from '../context/DemoContext';
import { ViewingType } from '../types/demo';

const TIME_SLOTS = [
  '10:00 AM (GST)',
  '11:30 AM (GST)',
  '02:00 PM (GST)',
  '03:30 PM (GST)',
  '05:00 PM (GST)',
  '06:30 PM (GST)',
];

export const ViewingRequestModal: React.FC = () => {
  const {
    properties,
    isViewingModalOpen,
    viewingModalProperty,
    closeViewingModal,
    addViewingRequest,
    addEnquiry,
  } = useDemoContext();

  const [selectedPropId, setSelectedPropId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>(TIME_SLOTS[1]);
  const [viewingType, setViewingType] = useState<ViewingType>('In-person');
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [contactMethod, setContactMethod] = useState<'WhatsApp' | 'Phone' | 'Email'>('WhatsApp');
  const [notes, setNotes] = useState<string>('');
  const [consentGiven, setConsentGiven] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedBookingId, setSubmittedBookingId] = useState<string>('');

  // Default to tomorrow's date
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  // Update selected property when modal is opened
  useEffect(() => {
    if (viewingModalProperty) {
      setSelectedPropId(viewingModalProperty.id);
    } else if (properties.length > 0 && !selectedPropId) {
      setSelectedPropId(properties[0].id);
    }
  }, [viewingModalProperty, properties]);

  if (!isViewingModalOpen) return null;

  const currentProp = properties.find((p) => p.id === selectedPropId) || properties[0];
  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) return;

    const newViewing = addViewingRequest({
      propertyId: currentProp.id,
      propertyTitle: currentProp.title,
      propertyLocation: currentProp.location,
      date,
      timeSlot,
      viewingType,
      visitorName: name,
      visitorContact: contact,
      visitorContactMethod: contactMethod,
      notes,
    });

    // Also register an enquiry in the CRM demo
    addEnquiry({
      name,
      contact,
      contactMethod: contactMethod === 'Phone' ? 'Phone Call' : contactMethod,
      objective: currentProp.category === 'Off-plan' ? 'Off-plan' : 'Buy',
      location: currentProp.location,
      budget: 'To discuss during viewing',
      bedrooms: currentProp.type,
      timeline: 'Viewing scheduled',
      propertyInterest: currentProp.title,
      notes: `Viewing requested for ${date} at ${timeSlot} (${viewingType}). ${notes ? `Notes: ${notes}` : ''}`,
      status: 'Viewing requested',
      consentGiven: true,
      source: 'Website Assistant',
    });

    setSubmittedBookingId(newViewing.id);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setNotes('');
    closeViewingModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#162E52]/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-label="Request a Property Viewing"
    >
      <div className="relative w-full max-w-lg bg-[#FAF9F5] border border-[#DCD9D3] rounded-xs shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-[#162E52] text-white flex items-center justify-between border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#DEBF84]">
                Schedule a Viewing
              </span>
              <span className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded-xs font-mono text-white/70">
                Demo
              </span>
            </div>
            <p className="text-xs text-white/75 mt-0.5">
              Private site visits and virtual consultations in Dubai (GST)
            </p>
          </div>
          <button
            onClick={closeViewingModal}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xs cursor-pointer transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-[#1A1918]">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-medium font-heading text-[#1A1918]">
                  Viewing Request Saved
                </h3>
                <p className="text-xs text-[#736F68] max-w-sm mx-auto">
                  Ref: <span className="font-mono font-medium">{submittedBookingId}</span> · Asia/Dubai Timezone
                </p>
              </div>

              <div className="p-4 bg-white border border-[#E6E4DF] rounded-xs text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-[#F0EEE9] pb-1.5">
                  <span className="text-[#736F68]">Property:</span>
                  <span className="font-medium text-[#1A1918]">{currentProp.title}</span>
                </div>
                <div className="flex justify-between border-b border-[#F0EEE9] pb-1.5">
                  <span className="text-[#736F68]">Date & Time:</span>
                  <span className="font-medium text-[#1A1918]">{date} · {timeSlot}</span>
                </div>
                <div className="flex justify-between border-b border-[#F0EEE9] pb-1.5">
                  <span className="text-[#736F68]">Format:</span>
                  <span className="font-medium text-[#1A1918]">{viewingType} Consultation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#736F68]">Visitor:</span>
                  <span className="font-medium text-[#1A1918]">{name} ({contact})</span>
                </div>
              </div>

              <div className="p-3 bg-[#F0EEE9] border border-[#E6E4DF] rounded-xs text-[11px] text-[#63605B] text-left flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#162E52] shrink-0 mt-0.5" />
                <span>
                  <strong>Demo State Recorded:</strong> Viewing request saved in this demo — agent confirmation required. You can inspect and manage this request in the <strong>Demo Workspace</strong>.
                </span>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-[#162E52] text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#22417C] transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Property Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                  Selected Property
                </label>
                <select
                  value={selectedPropId}
                  onChange={(e) => setSelectedPropId(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-[#DCD9D3] rounded-xs text-[#1A1918] focus:outline-2 focus:outline-[#162E52]"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.location})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#736F68] mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#162E52]" />
                  <span>{currentProp.location} · {currentProp.type}</span>
                </p>
              </div>

              {/* Viewing Type Toggle */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                  Viewing Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setViewingType('In-person')}
                    className={`py-2 px-3 text-xs border rounded-xs text-center transition-colors cursor-pointer ${
                      viewingType === 'In-person'
                        ? 'bg-[#162E52] text-white border-[#162E52] font-medium'
                        : 'bg-white text-[#4A4844] border-[#DCD9D3] hover:bg-[#F2EFE9]'
                    }`}
                  >
                    In-Person Site Visit
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewingType('Virtual')}
                    className={`py-2 px-3 text-xs border rounded-xs text-center transition-colors cursor-pointer ${
                      viewingType === 'Virtual'
                        ? 'bg-[#162E52] text-white border-[#162E52] font-medium'
                        : 'bg-white text-[#4A4844] border-[#DCD9D3] hover:bg-[#F2EFE9]'
                    }`}
                  >
                    Virtual Video Tour
                  </button>
                </div>
              </div>

              {/* Date & Time Slot Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={todayStr}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full p-2 text-xs bg-white border border-[#DCD9D3] rounded-xs focus:outline-2 focus:outline-[#162E52]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                    Time Slot (Dubai GST)
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full p-2 text-xs bg-white border border-[#DCD9D3] rounded-xs focus:outline-2 focus:outline-[#162E52]"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Visitor Details */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mansoor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 text-xs bg-white border border-[#DCD9D3] rounded-xs focus:outline-2 focus:outline-[#162E52]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                      Phone Number or WhatsApp <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+971 50 123 4567"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full p-2 text-xs bg-white border border-[#DCD9D3] rounded-xs focus:outline-2 focus:outline-[#162E52]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                      Contact Via
                    </label>
                    <select
                      value={contactMethod}
                      onChange={(e) => setContactMethod(e.target.value as any)}
                      className="w-full p-2 text-xs bg-white border border-[#DCD9D3] rounded-xs focus:outline-2 focus:outline-[#162E52]"
                    >
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Phone">Phone</option>
                      <option value="Email">Email</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                    Specific Requests / Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Preferred layouts, specific view requirements, or parking needs..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2 text-xs bg-white border border-[#DCD9D3] rounded-xs focus:outline-2 focus:outline-[#162E52]"
                  />
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    required
                    className="mt-0.5 rounded-xs text-[#162E52] focus:ring-[#162E52]"
                  />
                  <span className="text-[11px] text-[#63605B] leading-tight">
                    I consent to having GNS Real Estate record this viewing enquiry in the demonstration workspace for follow-up by an advisor.
                  </span>
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#E6E4DF]">
                <button
                  type="button"
                  onClick={closeViewingModal}
                  className="px-4 py-2 text-xs font-medium text-[#63605B] hover:text-[#1A1918] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!consentGiven || !name || !contact}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#162E52] hover:bg-[#22417C] disabled:opacity-50 disabled:cursor-not-allowed rounded-xs transition-colors cursor-pointer"
                >
                  <span>Request Viewing</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#DEBF84]" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
