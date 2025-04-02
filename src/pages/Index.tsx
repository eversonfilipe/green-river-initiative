
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MissionSection from '@/components/MissionSection';
import FeaturedSection from '@/components/FeaturedSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header transparent />
        <main className="flex-grow">
          <Hero />
          <MissionSection />
          <FeaturedSection />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default Index;
