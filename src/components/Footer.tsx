
import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowRight } from 'lucide-react';

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // In a real app, this would call an API to subscribe the user
    toast({
      title: "Newsletter subscription successful",
      description: "Thank you for subscribing to our newsletter!",
    });
    
    setEmail('');
  };
  
  return (
    <footer className="bg-forest-900 text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative h-8 w-8 rounded-full bg-white flex items-center justify-center">
                <span className="text-forest-700 font-bold text-sm">ID</span>
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-earth-400 rounded-full" />
              </div>
              <span className="font-bold text-xl">IDEA</span>
            </div>
            <p className="text-forest-100 text-sm">
              Instituto de Desenvolvimento da Amazônia works to promote sustainable development in the Amazon region through research, education, and community engagement.
            </p>
            <div className="flex space-x-2">
              <a href="https://facebook.com" className="p-2 rounded-full bg-forest-800 hover:bg-forest-700 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" className="p-2 rounded-full bg-forest-800 hover:bg-forest-700 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" className="p-2 rounded-full bg-forest-800 hover:bg-forest-700 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://youtube.com" className="p-2 rounded-full bg-forest-800 hover:bg-forest-700 transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-forest-100 hover:text-white transition-colors text-sm">About Us</Link>
              </li>
              <li>
                <Link to="/forum" className="text-forest-100 hover:text-white transition-colors text-sm">Discussion Forum</Link>
              </li>
              <li>
                <Link to="/courses" className="text-forest-100 hover:text-white transition-colors text-sm">Educational Courses</Link>
              </li>
              <li>
                <Link to="/articles" className="text-forest-100 hover:text-white transition-colors text-sm">Research Articles</Link>
              </li>
              <li>
                <Link to="/volunteer" className="text-forest-100 hover:text-white transition-colors text-sm">Volunteer Opportunities</Link>
              </li>
              <li>
                <Link to="/download" className="text-forest-100 hover:text-white transition-colors text-sm">Download App</Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 text-forest-300 shrink-0 mt-0.5" />
                <span className="text-forest-100">
                  123 Conservation Avenue<br />
                  Manaus, AM 69000-000<br />
                  Brazil
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="h-5 w-5 text-forest-300" />
                <span className="text-forest-100">+55 (92) 1234-5678</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="h-5 w-5 text-forest-300" />
                <a href="mailto:contact@idea.org" className="text-forest-100 hover:text-white transition-colors">
                  contact@idea.org
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-forest-100 text-sm mb-4">
              Subscribe to our newsletter for updates on our projects, events, and research.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-forest-800 border-forest-700 text-white placeholder:text-forest-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="bg-forest-600 hover:bg-forest-500 px-3">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
        
        <Separator className="bg-forest-700 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-forest-300">
          <p>© {new Date().getFullYear()} IDEA. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
