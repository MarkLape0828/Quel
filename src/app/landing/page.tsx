
"use client";

import React, { useState } from 'react';
import LandingHeader from './components/landing-header';
import HeroSection from './components/hero-section';
import SignInModal from './components/sign-in-modal';

export default function LandingPage() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const openSignInModal = () => setIsSignInModalOpen(true);
  const closeSignInModal = () => setIsSignInModalOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-background w-full">
      <LandingHeader onSignInClick={openSignInModal} />
      <main className="flex-grow w-full">
        <HeroSection />
      </main>
      <SignInModal isOpen={isSignInModalOpen} onClose={closeSignInModal} />
    </div>
  );
}

