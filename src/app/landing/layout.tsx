
"use client";

import React, { useState } from 'react';
import LandingHeader from './components/landing-header';
import LandingFooter from './components/landing-footer';
import SignInModal from './components/sign-in-modal';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const openSignInModal = () => setIsSignInModalOpen(true);
  const closeSignInModal = () => setIsSignInModalOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-background w-full">
      <LandingHeader onSignInClick={openSignInModal} />
      <main className="flex-grow w-full">
        {children}
      </main>
      <LandingFooter />
      <SignInModal isOpen={isSignInModalOpen} onClose={closeSignInModal} />
    </div>
  );
}
