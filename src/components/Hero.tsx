
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LeafPattern, WavyBorder } from './DecorativeElements';
import AuthModal from './AuthModal';
import { useAuth } from '@/contexts/AuthContext';

const Hero = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center pt-16 pb-24 overflow-hidden bg-gradient-to-b from-forest-50 to-white">
      {/* Decorative elements */}
      <LeafPattern 
        size="lg" 
        className="absolute -top-10 -right-20 text-forest-100 opacity-30" 
        rotation={45}
      />
      <LeafPattern 
        size="md" 
        className="absolute bottom-10 -left-10 text-forest-100 opacity-20" 
        rotation={-15}
      />
      <LeafPattern 
        size="sm" 
        className="absolute top-1/3 left-1/4 text-forest-100 opacity-15" 
        rotation={20}
      />
      <WavyBorder 
        position="bottom" 
        className="hidden md:block" 
        color="text-white"
      />

      <div className="container relative z-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 md:space-y-8 animate-fade-in [animation-delay:200ms]">
            <div>
              <span className="inline-block py-1 px-3 bg-forest-100 text-forest-700 rounded-full text-sm font-medium mb-4">
                Protecting Our Future
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-forest-900 title-accent">
                Instituto de Desenvolvimento da Amazônia
              </h1>
            </div>
            <p className="text-lg md:text-xl text-forest-700 leading-relaxed max-w-lg">
              Promoting sustainable development and environmental conservation in the Amazon rainforest through research, education, and community engagement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <>
                  <Button className="btn-eco" asChild>
                    <Link to="/forum">Join Discussions</Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-forest-300 hover:bg-forest-50 text-forest-700"
                    asChild
                  >
                    <Link to="/articles">Read Articles</Link>
                  </Button>
                </>
              ) : (
                <>
                  <AuthModal 
                    trigger={<Button className="btn-eco">Join Our Mission</Button>}
                    defaultTab="register"
                  />
                  <Button 
                    variant="outline" 
                    className="border-forest-300 hover:bg-forest-50 text-forest-700"
                    asChild
                  >
                    <Link to="/about">Learn More</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="relative md:h-[500px] flex items-center justify-center animate-fade-in [animation-delay:500ms]">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-white relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80" 
                alt="Amazon Rainforest River" 
                className="w-full h-[350px] md:h-[400px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-forest-100 rounded-full -z-0"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-earth-100 rounded-full -z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
