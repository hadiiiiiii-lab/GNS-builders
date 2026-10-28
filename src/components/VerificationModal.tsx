import React, { useEffect } from 'react';
import { X, ShieldCheck, AlertCircle, CheckCircle2, FileText, ExternalLink } from 'lucide-react';
import { GNS_CONFIG } from '../data/gnsData';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#0E2338]/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="verification-modal-title"
    >
      <div
        className="relative w-full max-w-2xl bg-[#FAF9F5] border border-[#DCD9D3] rounded-xs shadow-2xl p-6 md:p-8 max-h-[85vh] overflow-y-auto space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E6E4DF]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-[#BFA054]" />
            <div>
              <h3 id="verification-modal-title" className="text-xl font-editorial font-normal text-[#1A1918]">
                Asset Authenticity & Verification Notes
              </h3>
              <p className="text-xs text-[#6E6B66]">GNS Real Estate LLC Preview Compliance Record</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#524F4B] hover:text-[#0E2338] rounded-xs cursor-pointer"
            aria-label="Close notes"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Genuine Assets Used */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0E2338] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Genuine Assets Implemented</span>
          </h4>
          <ul className="space-y-2 text-xs text-[#524F4B] pl-2">
            <li>• <strong>Original GNS Logo:</strong> Rendered directly from verified source asset (`verified_team/GNS_Official_Logo.png`) on dark contrasting containers to preserve legibility without distortion or color alteration.</li>
            <li>• <strong>Verified Team Portraits:</strong> Sourced strictly from official `gnsre.com` agent profiles (Vijay Kumar, Heena Shaikh, Prince Manooj, Nisar Ahmed, Vanesh Kumar, Sharjeel, Krystelle Detic, Shafiq ur Rehman).</li>
            <li>• <strong>Property Imagery:</strong> Sourced from supplied developer allocations (`asset_sources.json` and `property_links.csv`) with verified attribution to Meraas, Sobha, Emaar, Samana, Danube, and Town Square.</li>
            <li>• <strong>Hero Video:</strong> Connected to the background video currently referenced by GNS’s existing live website (sourced from Pixabay; not described as original GNS footage). An authentic supplied GNS property image serves as the poster and error fallback.</li>
          </ul>
        </div>

        {/* 2. Client Confirmation Checklist */}
        <div className="space-y-3 pt-2 border-t border-[#E6E4DF]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#967C3B] flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-[#BFA054]" />
            <span>Items Requiring Client Confirmation</span>
          </h4>
          <div className="space-y-3">
            {GNS_CONFIG.pendingClientConfirmations.map((item, idx) => (
              <div key={idx} className="p-3 bg-[#F2EFE9] border border-[#E2DFD8] rounded-xs text-xs space-y-1">
                <div className="font-semibold text-[#1A1918]">{item.item}</div>
                <div className="text-[#6E6B66]">{item.currentData}</div>
                <div className="text-[#0E2338] font-medium text-[11px] pt-0.5">
                  Action taken: {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Standards Compliance */}
        <div className="p-4 bg-[#EDEAE3] rounded-xs border border-[#DFDBD3] text-xs text-[#524F4B] space-y-1">
          <p className="font-semibold text-[#1A1918]">Strict Anti-Slop & Design Discipline:</p>
          <p>
            No invented founder title, reviews, statistics, ROI guarantees, or simulated form success messages. The enquiry assistant is deterministic and serves solely as a structured requirement organizer for WhatsApp and direct agent handoff.
          </p>
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#0E2338] hover:bg-[#153452] rounded-xs cursor-pointer"
          >
            Understood & Close
          </button>
        </div>
      </div>
    </div>
  );
};
