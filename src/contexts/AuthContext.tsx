
import React, { createContext, useState, useContext, useEffect } from 'react';

type UserRole = 'visitor' | 'volunteer' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isApproved: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('idea_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error('Failed to parse stored user', e);
        localStorage.removeItem('idea_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function - in a real app this would call an API
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic
      if (email === 'admin@idea.org' && password === 'admin') {
        const adminUser: User = {
          id: '1',
          name: 'Admin User',
          email: 'admin@idea.org',
          role: 'admin',
          isApproved: true,
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
        };
        setUser(adminUser);
        localStorage.setItem('idea_user', JSON.stringify(adminUser));
      } else if (email === 'volunteer@idea.org' && password === 'volunteer') {
        const volunteerUser: User = {
          id: '2',
          name: 'Volunteer User',
          email: 'volunteer@idea.org',
          role: 'volunteer',
          isApproved: true,
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=volunteer'
        };
        setUser(volunteerUser);
        localStorage.setItem('idea_user', JSON.stringify(volunteerUser));
      } else if (email === 'visitor@idea.org' && password === 'visitor') {
        const visitorUser: User = {
          id: '3',
          name: 'Visitor User',
          email: 'visitor@idea.org',
          role: 'visitor',
          isApproved: true,
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=visitor'
        };
        setUser(visitorUser);
        localStorage.setItem('idea_user', JSON.stringify(visitorUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 11),
        name,
        email,
        role,
        isApproved: role === 'visitor' ? true : false, // Visitors are auto-approved
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };
      
      if (role === 'visitor') {
        // Automatically approve visitors
        setUser(newUser);
        localStorage.setItem('idea_user', JSON.stringify(newUser));
      } else {
        // For volunteers, show pending status
        setUser({ ...newUser, isApproved: false });
        alert('Your volunteer registration is pending approval by an administrator.');
        
        // In a real app, this would send an email notification to admin
        console.log('Admin notification would be sent to: carolinasisnando1@gmail.com');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('idea_user');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
