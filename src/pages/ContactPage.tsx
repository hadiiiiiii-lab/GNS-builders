import React, { useState, useEffect } from 'react';
import { Phone, Mail, MessageCircle, ArrowUpRight, Copy, Check } from 'lucide-react';
import { GNS_CONFIG } from '../data/gnsData';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    purpose: 'Buy' as 'Buy' | 'Rent' | 'Off-plan',
    preferredArea: '',
    budget: '',
    message: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [reviewSummary, setReviewSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name';
    if (!formData.contactInfo.trim()) errs.contactInfo = 'Please provide a phone number or email';
    if (!formData.preferredArea.trim()) errs.preferredArea = 'Please state your preferred location or community';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePrepareEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const summary = `*GNS Real Estate Enquiry*
• Name: ${formData.name.trim()}
• Contact: ${formData.contactInfo.trim()}
• Purpose: ${formData.purpose}
• Preferred Area: ${formData.preferredArea.trim()}
• Budget: ${formData.budget.trim() || 'To discuss'}
${formData.message.trim() ? `• Notes: ${formData.message.trim()}` : ''}`;

    setReviewSummary(summary);
  };

  const handleOpenWhatsApp = () => {
    if (!reviewSummary) return;
    const url = `https://wa.me/971507350414?text=${encodeURIComponent(reviewSummary)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopySummary = () => {
    if (!reviewSummary) return;
    navigator.clipboard.writeText(reviewSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-16 md:py-24 bg-[#FAF9F5]">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-2xl pb-12 border-b border-[#E6E4DF] space-y-4">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#162E52] block">
            Direct Office & Advisory
          </span>
          <h1 className="text-4xl sm:text-5xl font-editorial font-normal text-[#1A1918]">
            Contact GNS Real Estate
          </h1>
          <p className="text-base text-[#524F4B] leading-relaxed">
            Reach our Dubai advisory team directly by telephone, WhatsApp, or through the enquiry form below.
          </p>
        </div>

        {/* Balanced Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-12 items-start">
          {/* Left Column: Plain Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-editorial font-normal text-[#1A1918]">Direct Channels</h2>
              <p className="text-sm text-[#6E6B66] leading-relaxed">
                Connect with our team for consultations, developer brochures, and viewing arrangements.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href={GNS_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 bg-white border border-[#E6E4DF] hover:border-[#162E52] rounded-xs flex items-center justify-between transition-colors shadow-xs group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-[#F4F1EA] text-[#162E52] rounded-xs">
                    <MessageCircle className="w-5 h-5 text-[#22417C]" />
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-[#7A7771]">WhatsApp / Call</span>
                    <span className="font-semibold text-sm text-[#1A1918]">{GNS_CONFIG.whatsappPhone}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#7A7771] group-hover:text-[#162E52] transition-colors" />
              </a>

              <a
                href={GNS_CONFIG.officeTelUrl}
                className="p-5 bg-white border border-[#E6E4DF] hover:border-[#162E52] rounded-xs flex items-center justify-between transition-colors shadow-xs group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-[#F4F1EA] text-[#162E52] rounded-xs">
                    <Phone className="w-5 h-5 text-[#22417C]" />
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-[#7A7771]">Office Landline</span>
                    <span className="font-semibold text-sm text-[#1A1918]">{GNS_CONFIG.officePhone}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#7A7771] group-hover:text-[#162E52] transition-colors" />
              </a>

              <a
                href={GNS_CONFIG.mailtoUrl}
                className="p-5 bg-white border border-[#E6E4DF] hover:border-[#162E52] rounded-xs flex items-center justify-between transition-colors shadow-xs group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-[#F4F1EA] text-[#162E52] rounded-xs">
                    <Mail className="w-5 h-5 text-[#22417C]" />
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-[#7A7771]">Email Enquiries</span>
                    <span className="font-semibold text-sm text-[#1A1918]">{GNS_CONFIG.generalEmail}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#7A7771] group-hover:text-[#162E52] transition-colors" />
              </a>
            </div>

            <div className="pt-2 text-xs text-[#7A7771] space-y-1">
              <p><strong>Office Hours:</strong> Monday – Saturday, 9:00 AM – 6:00 PM GST</p>
              <p>WhatsApp advisory response typically within 15–30 minutes during business hours.</p>
            </div>
          </div>

          {/* Right Column: Simple Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 md:p-10 bg-white border border-[#E6E4DF] rounded-xs shadow-xs">
              <div className="mb-6">
                <h2 className="text-2xl font-editorial font-normal text-[#1A1918]">Enquiry Form</h2>
                <p className="text-xs text-[#6E6B66] mt-1">
                  Enter your details to generate an enquiry for our Dubai office.
                </p>
              </div>

              <form onSubmit={handlePrepareEnquiry} className="space-y-5">
                {/* Purpose */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#524F4B] mb-2">
                    I am looking to
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Buy', 'Rent', 'Off-plan'] as const).map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setFormData({ ...formData, purpose: opt })}
                        className={`py-2 px-3 text-xs font-medium rounded-xs border transition-colors cursor-pointer text-center ${
                          formData.purpose === opt
                            ? 'bg-[#162E52] text-white border-[#162E52]'
                            : 'bg-[#FAF9F5] text-[#524F4B] border-[#DCD9D3] hover:border-[#162E52]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-[#524F4B] mb-1">
                    Your Name <span className="text-[#967C3B]">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. David Miller"
                    className={`w-full px-3.5 py-2.5 text-sm bg-[#FAF9F5] border rounded-xs focus:bg-white focus:outline-2 focus:outline-[#162E52] transition-colors ${
                      errors.name ? 'border-red-400' : 'border-[#DCD9D3]'
                    }`}
                  />
                  {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Phone or Email */}
                <div>
                  <label htmlFor="contactInfo" className="block text-xs font-semibold uppercase tracking-wider text-[#524F4B] mb-1">
                    Phone Number or Email <span className="text-[#967C3B]">*</span>
                  </label>
                  <input
                    id="contactInfo"
                    type="text"
                    value={formData.contactInfo}
                    onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                    placeholder="+971 50 ... or name@example.com"
                    className={`w-full px-3.5 py-2.5 text-sm bg-[#FAF9F5] border rounded-xs focus:bg-white focus:outline-2 focus:outline-[#162E52] transition-colors ${
                      errors.contactInfo ? 'border-red-400' : 'border-[#DCD9D3]'
                    }`}
                  />
                  {errors.contactInfo && <p className="text-red-600 text-xs mt-1">{errors.contactInfo}</p>}
                </div>

                {/* Preferred Area & Budget in a row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="preferredArea" className="block text-xs font-semibold uppercase tracking-wider text-[#524F4B] mb-1">
                      Preferred Community <span className="text-[#967C3B]">*</span>
                    </label>
                    <input
                      id="preferredArea"
                      type="text"
                      value={formData.preferredArea}
                      onChange={(e) => setFormData({ ...formData, preferredArea: e.target.value })}
                      placeholder="e.g. Dubai Hills, Downtown, Marina"
                      className={`w-full px-3.5 py-2.5 text-sm bg-[#FAF9F5] border rounded-xs focus:bg-white focus:outline-2 focus:outline-[#162E52] transition-colors ${
                        errors.preferredArea ? 'border-red-400' : 'border-[#DCD9D3]'
                      }`}
                    />
                    {errors.preferredArea && <p className="text-red-600 text-xs mt-1">{errors.preferredArea}</p>}
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-xs font-semibold uppercase tracking-wider text-[#524F4B] mb-1">
                      Budget (AED)
                    </label>
                    <input
                      id="budget"
                      type="text"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="e.g. AED 2.5M – 4M"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F5] border border-[#DCD9D3] rounded-xs focus:bg-white focus:outline-2 focus:outline-[#162E52] transition-colors"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-[#524F4B] mb-1">
                    Specific Requirements or Questions (Optional)
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="e.g. High floor preferred, payment plan details, viewing availability..."
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F5] border border-[#DCD9D3] rounded-xs focus:bg-white focus:outline-2 focus:outline-[#162E52] transition-colors resize-none"
                  />
                </div>

                {/* Submit Action */}
                <div>
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#162E52] hover:bg-[#22417C] rounded-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Continue on WhatsApp</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#DEBF84]" />
                  </button>
                </div>
              </form>

              {/* Reviewable Summary Block (Opened only on explicit user click) */}
              {reviewSummary && (
                <div className="mt-6 p-4 bg-[#F7F5EE] border border-[#BFA054]/40 rounded-xs space-y-3">
                  <div className="text-xs font-semibold text-[#162E52]">
                    Reviewable Enquiry Summary
                  </div>

                  <pre className="p-3 bg-white border border-[#E6E4DF] rounded-xs text-xs text-[#2A2928] font-mono whitespace-pre-wrap leading-relaxed">
                    {reviewSummary}
                  </pre>

                  <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                    <button
                      onClick={handleOpenWhatsApp}
                      className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#162E52] hover:bg-[#22417C] rounded-xs transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#DEBF84]" />
                      <span>Open WhatsApp</span>
                    </button>

                    <button
                      onClick={handleCopySummary}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-[#524F4B] hover:text-[#162E52] bg-white border border-[#DCD9D3] rounded-xs transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
