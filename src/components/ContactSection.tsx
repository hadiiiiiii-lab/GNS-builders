import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, ArrowUpRight, Copy, Check, Clock } from 'lucide-react';
import { GNS_CONFIG } from '../data/gnsData';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    interest: 'Buy' as 'Buy' | 'Rent' | 'Off-plan',
    preferredArea: '',
    budgetRange: '',
    message: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name';
    if (!formData.contactInfo.trim()) errs.contactInfo = 'Please provide your phone number or email';
    if (!formData.preferredArea.trim()) errs.preferredArea = 'Please specify a preferred area (e.g. Dubai Marina, Creek, Hills)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGenerateWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const summary = `*New Property Inquiry — GNS Real Estate*
• Name: ${formData.name.trim()}
• Contact: ${formData.contactInfo.trim()}
• Interested In: ${formData.interest}
• Preferred Area: ${formData.preferredArea.trim()}
• Budget: ${formData.budgetRange.trim() || 'Flexible / To Discuss'}
${formData.message.trim() ? `• Notes: ${formData.message.trim()}` : ''}`;

    setGeneratedMessage(summary);
  };

  const handleOpenWhatsApp = () => {
    if (!generatedMessage) return;
    const url = `https://wa.me/971507350414?text=${encodeURIComponent(generatedMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyMessage = () => {
    if (!generatedMessage) return;
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#F5F3ED] border-b border-[#E6E4DF]">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Context, Verified Direct Contacts */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#967C3B] block mb-2">
                Begin a Conversation
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1918] font-editorial leading-[1.14]">
                Let’s find your next property.
              </h2>
              <p className="text-base text-[#524F4B] mt-4 leading-relaxed">
                Connect directly with our Dubai advisory office. We are at your service for discreet consultations, project brochures, and accompanied viewings.
              </p>
            </div>

            {/* Verified Business Contact Methods */}
            <div className="space-y-4 pt-2">
              <a
                href={GNS_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white border border-[#E6E4DF] hover:border-[#BFA054] rounded-xs flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-[#F4F1EA] text-[#0E2338] rounded-xs">
                    <MessageCircle className="w-5 h-5 text-[#BFA054]" />
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-[#7A7771]">WhatsApp / Call</span>
                    <span className="font-semibold text-sm text-[#1A1918]">{GNS_CONFIG.whatsappPhone}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#7A7771] group-hover:text-[#0E2338] transition-colors" />
              </a>

              <a
                href={GNS_CONFIG.officeTelUrl}
                className="p-4 bg-white border border-[#E6E4DF] hover:border-[#BFA054] rounded-xs flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-[#F4F1EA] text-[#0E2338] rounded-xs">
                    <Phone className="w-5 h-5 text-[#BFA054]" />
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-[#7A7771]">Office Landline</span>
                    <span className="font-semibold text-sm text-[#1A1918]">{GNS_CONFIG.officePhone}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#7A7771] group-hover:text-[#0E2338] transition-colors" />
              </a>

              <a
                href={GNS_CONFIG.mailtoUrl}
                className="p-4 bg-white border border-[#E6E4DF] hover:border-[#BFA054] rounded-xs flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-[#F4F1EA] text-[#0E2338] rounded-xs">
                    <Mail className="w-5 h-5 text-[#BFA054]" />
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-[#7A7771]">General Inquiries</span>
                    <span className="font-semibold text-sm text-[#1A1918]">{GNS_CONFIG.generalEmail}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#7A7771] group-hover:text-[#0E2338] transition-colors" />
              </a>
            </div>

            {/* Note on Street Address */}
            <div className="p-4 bg-[#EDEAE3] rounded-xs border border-[#DFDBD3] text-xs text-[#63605B] space-y-1">
              <span className="font-semibold text-[#1A1918] block">Physical Office Verification:</span>
              <p>
                In alignment with client instructions, specific building suite address is pending final client approval prior to formal map listing. Direct office phone and WhatsApp channels remain fully operational.
              </p>
            </div>
          </div>

          {/* Right Column: Compact, Honest Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 md:p-10 bg-white border border-[#E6E4DF] rounded-xs shadow-xs">
              <div className="mb-6">
                <h3 className="text-xl font-editorial font-normal text-[#1A1918]">
                  Share Your Requirements
                </h3>
                <p className="text-xs text-[#6E6B66] mt-1">
                  Fill in your criteria below to prepare a formatted WhatsApp or email enquiry.
                </p>
              </div>

              <form onSubmit={handleGenerateWhatsApp} className="space-y-4.5">
                {/* Interest Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#524F4B] mb-1.5">
                    Interested In
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Buy', 'Rent', 'Off-plan'] as const).map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setFormData({ ...formData, interest: opt })}
                        className={`py-2 px-3 text-xs font-medium rounded-xs border transition-colors cursor-pointer text-center ${
                          formData.interest === opt
                            ? 'bg-[#0E2338] text-white border-[#0E2338]'
                            : 'bg-[#FAF9F5] text-[#524F4B] border-[#DCD9D3] hover:border-[#BFA054]'
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
                    placeholder="e.g. Alexander Wright"
                    className={`w-full px-3.5 py-2.5 text-sm bg-[#FAF9F5] border rounded-xs focus:bg-white focus:outline-2 focus:outline-[#0E2338] transition-colors ${
                      errors.name ? 'border-red-400' : 'border-[#DCD9D3]'
                    }`}
                  />
                  {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Contact: Phone or Email */}
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
                    className={`w-full px-3.5 py-2.5 text-sm bg-[#FAF9F5] border rounded-xs focus:bg-white focus:outline-2 focus:outline-[#0E2338] transition-colors ${
                      errors.contactInfo ? 'border-red-400' : 'border-[#DCD9D3]'
                    }`}
                  />
                  {errors.contactInfo && <p className="text-red-600 text-xs mt-1">{errors.contactInfo}</p>}
                </div>

                {/* Preferred Area & Budget in a 2-col row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="preferredArea" className="block text-xs font-semibold uppercase tracking-wider text-[#524F4B] mb-1">
                      Preferred Area <span className="text-[#967C3B]">*</span>
                    </label>
                    <input
                      id="preferredArea"
                      type="text"
                      value={formData.preferredArea}
                      onChange={(e) => setFormData({ ...formData, preferredArea: e.target.value })}
                      placeholder="e.g. Dubai Hills, Creek, Marina"
                      className={`w-full px-3.5 py-2.5 text-sm bg-[#FAF9F5] border rounded-xs focus:bg-white focus:outline-2 focus:outline-[#0E2338] transition-colors ${
                        errors.preferredArea ? 'border-red-400' : 'border-[#DCD9D3]'
                      }`}
                    />
                    {errors.preferredArea && <p className="text-red-600 text-xs mt-1">{errors.preferredArea}</p>}
                  </div>

                  <div>
                    <label htmlFor="budgetRange" className="block text-xs font-semibold uppercase tracking-wider text-[#524F4B] mb-1">
                      Budget Range
                    </label>
                    <input
                      id="budgetRange"
                      type="text"
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      placeholder="e.g. AED 2M – 3.5M"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F5] border border-[#DCD9D3] rounded-xs focus:bg-white focus:outline-2 focus:outline-[#0E2338] transition-colors"
                    />
                  </div>
                </div>

                {/* Optional Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-[#524F4B] mb-1">
                    Specific Requirements or Timeline (Optional)
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="e.g. Looking for high floor, sea view, ready within 6 months..."
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F5] border border-[#DCD9D3] rounded-xs focus:bg-white focus:outline-2 focus:outline-[#0E2338] transition-colors resize-none"
                  />
                </div>

                {/* Generate / Review Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#0E2338] hover:bg-[#153452] rounded-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Prepare WhatsApp Inquiry</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#D8C492]" />
                  </button>
                  <p className="text-[11px] text-[#7A7771] text-center mt-2">
                    Review and verify your inquiry summary before opening WhatsApp or dispatching.
                  </p>
                </div>
              </form>

              {/* Reviewable WhatsApp Handoff Box */}
              {generatedMessage && (
                <div className="mt-6 p-4 bg-[#F7F5EE] border border-[#BFA054]/40 rounded-xs space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#0E2338]">
                    <span>Reviewable Inquiry Summary</span>
                    <span className="text-[#967C3B] font-mono text-[11px]">Ready for dispatch</span>
                  </div>

                  <pre className="p-3 bg-white border border-[#E6E4DF] rounded-xs text-xs text-[#2A2928] font-mono whitespace-pre-wrap leading-relaxed">
                    {generatedMessage}
                  </pre>

                  <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                    <button
                      onClick={handleOpenWhatsApp}
                      className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#0E2338] hover:bg-[#153452] rounded-xs transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#D8C492]" />
                      <span>Open in WhatsApp</span>
                    </button>

                    <button
                      onClick={handleCopyMessage}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-[#524F4B] hover:text-[#0E2338] bg-white border border-[#DCD9D3] rounded-xs transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Text'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
