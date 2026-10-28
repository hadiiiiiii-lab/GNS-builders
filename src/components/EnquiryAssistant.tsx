import React, { useState, useEffect } from 'react';
import { MessageSquare, X, ArrowRight, ArrowLeft, Check, Copy, RefreshCw } from 'lucide-react';

interface EnquiryAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const EnquiryAssistant: React.FC<EnquiryAssistantProps> = ({ isOpen, onToggle, onClose }) => {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);

  // Requirement State
  const [objective, setObjective] = useState<'Buy' | 'Rent' | 'Invest' | ''>('');
  const [area, setArea] = useState('');
  const [budget, setBudget] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [timeline, setTimeline] = useState('');
  const [contactMethod, setContactMethod] = useState('');

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const resetFlow = () => {
    setStep(1);
    setObjective('');
    setArea('');
    setBudget('');
    setBedrooms('');
    setTimeline('');
    setContactMethod('');
  };

  // Generate review summary
  const summaryText = `*GNS Real Estate Enquiry*
• Type: ${objective || 'General'}
• Area: ${area || 'Flexible'}
• Budget: ${budget || 'To discuss'}
• Layout: ${bedrooms || 'Flexible'}
• Timeline: ${timeline || 'Flexible'}
• Contact Preference: ${contactMethod || 'WhatsApp'}`;

  const handleOpenWhatsApp = () => {
    const url = `https://wa.me/971507350414?text=${encodeURIComponent(summaryText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Launcher Button - Bottom Right */}
      <div className="fixed bottom-6 right-6 md:right-10 z-40">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#162E52] text-white rounded-full shadow-lg hover:bg-[#22417C] border border-white/20 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#22417C]"
          aria-label={isOpen ? 'Close enquiry assistant' : 'Open GNS enquiry assistant'}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <>
              <X className="w-4 h-4 text-[#DEBF84]" />
              <span className="text-xs font-medium">Close</span>
            </>
          ) : (
            <>
              <MessageSquare className="w-4 h-4 text-[#DEBF84]" />
              <span className="text-xs font-medium">Ask GNS</span>
              <span className="text-[10px] text-white/50 border-l border-white/20 pl-1.5">Demo</span>
            </>
          )}
        </button>
      </div>

      {/* Assistant Modal / Box */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-4 sm:right-6 md:right-10 z-40 w-[92vw] sm:w-[370px] bg-[#FAF9F5] border border-[#DCD9D3] rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[78vh] transition-all"
          role="dialog"
          aria-modal="true"
          aria-label="GNS Enquiry Assistant Demo"
        >
          {/* Header */}
          <div className="p-4 bg-[#162E52] text-white flex items-center justify-between border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider uppercase text-[#DEBF84]">Ask GNS</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded-xs font-mono text-white/70">Demo</span>
              </div>
              <p className="text-[11px] text-white/70 mt-0.5">Prepare your enquiry before speaking with an advisor</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-white/70 hover:text-white rounded-xs cursor-pointer"
              aria-label="Close assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Step indicator */}
          <div className="bg-[#F0EEE9] px-4 py-2 border-b border-[#E6E4DF] text-[11px] text-[#63605B] flex items-center justify-between">
            <span>Step {step} of 7</span>
            <button onClick={resetFlow} className="text-[#22417C] hover:underline flex items-center gap-1 cursor-pointer">
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Interactive Steps Body */}
          <div className="p-5 overflow-y-auto space-y-4 flex-1">
            {/* Step 1: Objective */}
            {step === 1 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#1A1918]">
                  What are you looking to do?
                </h4>
                <div className="grid grid-cols-1 gap-2 pt-1">
                  {[
                    { label: 'Buy a Home', desc: 'Primary residence or family home', val: 'Buy' as const },
                    { label: 'Explore Investment / Off-Plan', desc: 'Developer projects & capital growth', val: 'Invest' as const },
                    { label: 'Rent a Property', desc: 'Annual residential tenancy', val: 'Rent' as const },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => {
                        setObjective(item.val);
                        setStep(2);
                      }}
                      className={`p-3 text-left border rounded-xs transition-colors cursor-pointer ${
                        objective === item.val
                          ? 'bg-[#162E52] text-white border-[#162E52]'
                          : 'bg-white hover:bg-[#F2EFE9] border-[#DCD9D3] text-[#2A2928]'
                      }`}
                    >
                      <div className="font-semibold text-xs">{item.label}</div>
                      <div className={`text-[11px] ${objective === item.val ? 'text-white/70' : 'text-[#7A7771]'}`}>
                        {item.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Preferred Area */}
            {step === 2 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#1A1918]">
                  Which area do you prefer?
                </h4>
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  {[
                    'Dubai Hills Estate',
                    'Downtown Dubai',
                    'Dubai Creek Harbour',
                    'Madinat Jumeirah Living',
                    'Dubai Islands',
                    'Business Bay',
                    'Palm Jumeirah',
                    'Town Square',
                  ].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setArea(loc);
                        setStep(3);
                      }}
                      className={`p-2.5 text-left border rounded-xs transition-colors cursor-pointer ${
                        area === loc
                          ? 'bg-[#162E52] text-white border-[#162E52]'
                          : 'bg-white hover:bg-[#F2EFE9] border-[#DCD9D3] text-[#2A2928]'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
                <div className="pt-2">
                  <input
                    type="text"
                    placeholder="Or enter another location..."
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full p-2 text-xs bg-white border border-[#DCD9D3] rounded-xs focus:outline-2 focus:outline-[#162E52]"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Budget */}
            {step === 3 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#1A1918]">
                  What is your target budget?
                </h4>
                <div className="grid grid-cols-1 gap-2 pt-1 text-xs">
                  {objective === 'Rent'
                    ? [
                        'Under AED 100,000 / year',
                        'AED 100,000 – 150,000 / year',
                        'AED 150,000 – 250,000 / year',
                        'AED 250,000+ / year',
                      ].map((b) => (
                        <button
                          key={b}
                          onClick={() => {
                            setBudget(b);
                            setStep(4);
                          }}
                          className={`p-2.5 text-left border rounded-xs transition-colors cursor-pointer ${
                            budget === b
                              ? 'bg-[#162E52] text-white border-[#162E52]'
                              : 'bg-white hover:bg-[#F2EFE9] border-[#DCD9D3] text-[#2A2928]'
                          }`}
                        >
                          {b}
                        </button>
                      ))
                    : [
                        'Under AED 1.5 Million',
                        'AED 1.5M – 2.5 Million',
                        'AED 2.5M – 5 Million',
                        'AED 5M – 10 Million',
                        'Above AED 10 Million',
                      ].map((b) => (
                        <button
                          key={b}
                          onClick={() => {
                            setBudget(b);
                            setStep(4);
                          }}
                          className={`p-2.5 text-left border rounded-xs transition-colors cursor-pointer ${
                            budget === b
                              ? 'bg-[#162E52] text-white border-[#162E52]'
                              : 'bg-white hover:bg-[#F2EFE9] border-[#DCD9D3] text-[#2A2928]'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                </div>
              </div>
            )}

            {/* Step 4: Bedrooms */}
            {step === 4 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#1A1918]">
                  Property type or bedroom count?
                </h4>
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  {['Studio', '1 Bedroom', '2 Bedrooms', '3 Bedrooms', '4+ Bedrooms', 'Townhouse / Villa'].map(
                    (bed) => (
                      <button
                        key={bed}
                        onClick={() => {
                          setBedrooms(bed);
                          setStep(5);
                        }}
                        className={`p-2.5 text-left border rounded-xs transition-colors cursor-pointer ${
                          bedrooms === bed
                            ? 'bg-[#162E52] text-white border-[#162E52]'
                            : 'bg-white hover:bg-[#F2EFE9] border-[#DCD9D3] text-[#2A2928]'
                        }`}
                      >
                        {bed}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Timeline */}
            {step === 5 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#1A1918]">
                  When are you looking to move or purchase?
                </h4>
                <div className="grid grid-cols-1 gap-2 pt-1 text-xs">
                  {[
                    'Immediately / Ready property',
                    'Within the next 3 months',
                    '3 to 6 months',
                    'Exploring off-plan options',
                  ].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTimeline(t);
                        setStep(6);
                      }}
                      className={`p-2.5 text-left border rounded-xs transition-colors cursor-pointer ${
                        timeline === t
                          ? 'bg-[#162E52] text-white border-[#162E52]'
                          : 'bg-white hover:bg-[#F2EFE9] border-[#DCD9D3] text-[#2A2928]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Contact Preference */}
            {step === 6 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#1A1918]">
                  Preferred contact method?
                </h4>
                <div className="grid grid-cols-1 gap-2 pt-1 text-xs">
                  {[
                    'WhatsApp',
                    'Phone Call',
                    'Email',
                  ].map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setContactMethod(m);
                        setStep(7);
                      }}
                      className={`p-2.5 text-left border rounded-xs transition-colors cursor-pointer ${
                        contactMethod === m
                          ? 'bg-[#162E52] text-white border-[#162E52]'
                          : 'bg-white hover:bg-[#F2EFE9] border-[#DCD9D3] text-[#2A2928]'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 7: Summary & Continue on WhatsApp */}
            {step === 7 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#1A1918]">
                  Review Your Requirements
                </h4>

                <div className="p-3 bg-white border border-[#E6E4DF] rounded-xs text-xs space-y-1.5 font-mono text-[#2A2928] leading-relaxed">
                  <div><strong>Intent:</strong> {objective || 'General'}</div>
                  <div><strong>Area:</strong> {area || 'Flexible'}</div>
                  <div><strong>Budget:</strong> {budget || 'To discuss'}</div>
                  <div><strong>Layout:</strong> {bedrooms || 'Any'}</div>
                  <div><strong>Timeline:</strong> {timeline || 'Flexible'}</div>
                  <div><strong>Preference:</strong> {contactMethod || 'WhatsApp'}</div>
                </div>

                <p className="text-[11px] text-[#6E6B66]">
                  Click below to open WhatsApp with your criteria. An advisor will confirm current availability and pricing.
                </p>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleOpenWhatsApp}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#162E52] hover:bg-[#22417C] rounded-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Continue on WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#DEBF84]" />
                  </button>

                  <button
                    onClick={handleCopySummary}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-[#524F4B] hover:text-[#162E52] bg-white border border-[#DCD9D3] rounded-xs transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Summary'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Back/Skip Controls */}
          {step > 1 && step < 7 && (
            <div className="p-3 bg-[#FAF9F5] border-t border-[#E6E4DF] flex items-center justify-between text-xs">
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 text-[#63605B] hover:text-[#162E52] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1 text-[#162E52] font-semibold cursor-pointer"
              >
                <span>Skip</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
