
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MissionSection from '@/components/MissionSection';
import FeaturedSection from '@/components/FeaturedSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header transparent />
      <main className="flex-grow">
        <Hero />
        <MissionSection />
        <FeaturedSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
