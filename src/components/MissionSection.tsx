
import React from 'react';
import { Card } from '@/components/ui/card';
import { LeafPattern } from './DecorativeElements';
import { TreeDeciduous, Globe, Users } from 'lucide-react';

const MissionSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-forest-800 mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-forest-600">
            IDEA is dedicated to fostering sustainable development solutions that 
            protect the Amazon rainforest while supporting local communities.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {missionCards.map((card, index) => (
            <Card 
              key={card.title} 
              className="eco-card p-6 animate-slide-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="h-12 w-12 rounded-lg bg-forest-100 text-forest-600 flex items-center justify-center mb-4">
                <card.icon size={24} />
              </div>
              <h3 className="text-xl font-semibold text-forest-800 mb-3">
                {card.title}
              </h3>
              <p className="text-forest-600">
                {card.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <LeafPattern 
        size="lg" 
        className="absolute top-0 right-0 text-forest-100 opacity-20" 
        rotation={120}
      />
      <LeafPattern 
        size="md" 
        className="absolute bottom-10 left-10 text-forest-100 opacity-15" 
        rotation={-45}
      />
    </section>
  );
};

const missionCards = [
  {
    icon: TreeDeciduous,
    title: "Environmental Conservation",
    description: "Protecting the Amazon rainforest through research, monitoring, and conservation initiatives that preserve biodiversity and ecosystem services."
  },
  {
    icon: Users,
    title: "Community Empowerment",
    description: "Working with indigenous and local communities to develop sustainable livelihoods that respect traditional knowledge and cultural heritage."
  },
  {
    icon: Globe,
    title: "Policy Advocacy",
    description: "Advocating for policies that promote sustainable development, responsible resource management, and climate change mitigation in the Amazon region."
  }
];

export default MissionSection;
