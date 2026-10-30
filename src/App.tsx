import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { DemoProvider } from './context/DemoContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { EnquiryAssistant } from './components/EnquiryAssistant';
import { ViewingRequestModal } from './components/ViewingRequestModal';
import { PageTransitionOverlay } from './components/PageTransitionOverlay';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { AboutPage } from './pages/AboutPage';
import { TeamPage } from './pages/TeamPage';
import { ContactPage } from './pages/ContactPage';
import { DemoWorkspacePage } from './pages/DemoWorkspacePage';

// Route metadata & title updater
function RouteTitleManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === '/') {
      document.title = 'GNS Real Estate LLC | Dubai Property Preview';
    } else if (pathname === '/properties') {
      document.title = 'Properties in Dubai | GNS Real Estate';
    } else if (pathname === '/about') {
      document.title = 'About GNS Real Estate | Dubai Property Advisory';
    } else if (pathname === '/team') {
      document.title = 'Our Team | GNS Real Estate Advisors';
    } else if (pathname === '/contact') {
      document.title = 'Contact GNS Real Estate | Dubai Office';
    } else if (pathname === '/demo-workspace') {
      document.title = 'Demo Workspace | GNS Operations';
    }
  }, [pathname]);

  return null;
}

function MainLayout() {
  const [assistantOpen, setAssistantOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1A1918] font-sans antialiased selection:bg-[#BFA054]/20 selection:text-[#162E52]">
      <RouteTitleManager />

      {/* Lightweight Architectural Sketch Route Transition Overlay */}
      <PageTransitionOverlay />

      {/* Global Clean 88px Header */}
      <Header />

      {/* Routed Main Views */}
      <main className="flex-1 focus:outline-none">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:slug" element={<PropertyDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/demo-workspace" element={<DemoWorkspacePage />} />
          {/* Fallback to Home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Global Clean Footer */}
      <Footer />

      {/* Discreet Enquiry Assistant ("Ask GNS") at bottom-right */}
      <EnquiryAssistant
        isOpen={assistantOpen}
        onToggle={() => setAssistantOpen(!assistantOpen)}
        onClose={() => setAssistantOpen(false)}
      />

      {/* Global Viewing Request Modal */}
      <ViewingRequestModal />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DemoProvider>
        <MainLayout />
      </DemoProvider>
    </BrowserRouter>
  );
}
