
"use client";

import React, { useState } from 'react';
import LandingHeader from './components/landing-header';
import HeroSection from './components/hero-section';
import SignInModal from './components/sign-in-modal';
import ScheduleTourModal from './components/schedule-tour-modal'; // New modal

export default function LandingPage() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isScheduleTourModalOpen, setIsScheduleTourModalOpen] = useState(false); // New state

  const openSignInModal = () => setIsSignInModalOpen(true);
  const closeSignInModal = () => setIsSignInModalOpen(false);

  const openScheduleTourModal = () => setIsScheduleTourModalOpen(true); // New handler
  const closeScheduleTourModal = () => setIsScheduleTourModalOpen(false); // New handler

  return (
    <div className="min-h-screen flex flex-col bg-background w-full">
      <LandingHeader onSignInClick={openSignInModal} />
      <main className="flex-grow w-full">
        <HeroSection 
          onSignInClick={openSignInModal} 
          onScheduleTourClick={openScheduleTourModal} // Pass new handler
        />
      </main>
      <SignInModal isOpen={isSignInModalOpen} onClose={closeSignInModal} />
      <ScheduleTourModal isOpen={isScheduleTourModalOpen} onClose={closeScheduleTourModal} /> 
    </div>
  );
}
