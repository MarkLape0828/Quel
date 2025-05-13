
"use client";

import React, { useState } from 'react';
import HeroSection from './components/hero-section';
import ScheduleTourModal from './components/schedule-tour-modal';

export default function LandingPage() {
  const [isScheduleTourModalOpen, setIsScheduleTourModalOpen] = useState(false);

  const openScheduleTourModal = () => setIsScheduleTourModalOpen(true);
  const closeScheduleTourModal = () => setIsScheduleTourModalOpen(false);

  return (
    <>
      <HeroSection 
        onScheduleTourClick={openScheduleTourModal}
      />
      <ScheduleTourModal isOpen={isScheduleTourModalOpen} onClose={closeScheduleTourModal} /> 
    </>
  );
}
