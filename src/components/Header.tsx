
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, LogOut, User, Settings } from 'lucide-react';
import AuthModal from './AuthModal';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Forum', path: '/forum' },
  { name: 'Courses', path: '/courses' },
  { name: 'Articles', path: '/articles' },
  { name: 'Volunteer', path: '/volunteer' },
  { name: 'Download', path: '/download' },
];

interface HeaderProps {
  transparent?: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ transparent = false, className }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const avatarFallback = user?.name
    ? user.name.split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ID';

  return (
    <header 
      className={cn(
        'fixed w-full z-50 transition-all duration-300 py-3',
        transparent && !isScrolled 
          ? 'bg-transparent' 
          : 'bg-white/95 backdrop-blur-sm shadow-sm',
        className
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10 rounded-full bg-forest-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">ID</span>
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-earth-400 rounded-full" />
          </div>
          <span className="font-bold text-xl text-forest-700">IDEA</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map(item => (
            <Link
              key={item.name}
              to={item.path}
              className="text-forest-700 hover:text-forest-500 font-medium transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        {/* Authentication */}
        <div className="hidden lg:flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-forest-200 hover:border-forest-300 transition-colors">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                    <AvatarFallback className="bg-forest-100 text-forest-700">
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <div 
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full w-fit uppercase",
                        user?.role === 'admin' 
                          ? "bg-forest-100 text-forest-700" 
                          : user?.role === 'volunteer' 
                            ? "bg-earth-100 text-earth-700"
                            : "bg-water-100 text-water-700"
                      )}
                    >
                      {user?.role}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                {user?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer flex items-center text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthModal />
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center lg:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {isMenuOpen ? <X /> : <Menu />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col h-full">
                <div className="flex-1 py-4">
                  <nav className="flex flex-col gap-2">
                    {navItems.map(item => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="py-2 px-4 rounded-md hover:bg-forest-50 text-forest-700 hover:text-forest-500 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
                
                <div className="py-4 border-t border-forest-100">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 px-4">
                        <Avatar className="h-10 w-10 border-2 border-forest-200">
                          <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                          <AvatarFallback className="bg-forest-100 text-forest-700">
                            {avatarFallback}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user?.name}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                      </div>
                      <div className="px-4 flex flex-col gap-2">
                        <Link 
                          to="/profile" 
                          className="py-2 px-3 rounded-md hover:bg-forest-50 text-forest-700 text-sm flex items-center"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="mr-2 h-4 w-4" />
                          <span>My Profile</span>
                        </Link>
                        {user?.role === 'admin' && (
                          <Link 
                            to="/admin" 
                            className="py-2 px-3 rounded-md hover:bg-forest-50 text-forest-700 text-sm flex items-center"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                        <Button 
                          variant="ghost" 
                          className="justify-start px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4">
                      <AuthModal 
                        trigger={<Button className="w-full btn-eco">Sign In</Button>}
                      />
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
