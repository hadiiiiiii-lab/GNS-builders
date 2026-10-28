import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Introduction } from './components/Introduction';
import { PropertyCollections } from './components/PropertyCollections';
import { SelectedProperties } from './components/SelectedProperties';
import { AboutGNS } from './components/AboutGNS';
import { TeamSection } from './components/TeamSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { EnquiryAssistant } from './components/EnquiryAssistant';
import { VerificationModal } from './components/VerificationModal';

export default function App() {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [propertyCategory, setPropertyCategory] = useState<'All' | 'Apartments' | 'Villas & Townhouses' | 'Off-plan'>('All');

  const handleSelectCollectionCategory = (cat: 'Apartments' | 'Villas & Townhouses' | 'Off-plan') => {
    setPropertyCategory(cat);
    const el = document.getElementById('properties');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#202020] font-sans antialiased selection:bg-[#BFA054]/20 selection:text-[#0E2338]">
      {/* Primary Header */}
      <Header
        onOpenAssistant={() => setAssistantOpen(true)}
        onOpenVerificationNotes={() => setVerificationModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Cinematic Hero */}
        <Hero />

        {/* 2. Editorial Introduction */}
        <Introduction />

        {/* 3. Property Collections (Residential & Investment) */}
        <PropertyCollections onSelectCategory={handleSelectCollectionCategory} />

        {/* 4. Selected Properties with Working Filters & Detail Modal */}
        <SelectedProperties initialFilter={propertyCategory} />

        {/* 5. About GNS, 3-Step Client Journey & Developer Partners */}
        <AboutGNS />

        {/* 6. Meet the Verified Team */}
        <TeamSection />

        {/* 7. Contact / Requirement Handoff Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenVerificationNotes={() => setVerificationModalOpen(true)}
        onOpenAssistant={() => setAssistantOpen(true)}
      />

      {/* Discreet Enquiry Assistant (Ask GNS) */}
      <EnquiryAssistant
        isOpen={assistantOpen}
        onToggle={() => setAssistantOpen(!assistantOpen)}
        onClose={() => setAssistantOpen(false)}
      />

      {/* Client Verification & Authenticity Checklist Modal */}
      <VerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
      />
    </div>
  );
}
