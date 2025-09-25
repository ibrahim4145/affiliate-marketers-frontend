"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('affiliate-marketers-user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch {
        // Clear corrupted data
        localStorage.removeItem('affiliate-marketers-user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      setIsLoading(false);
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call with reduced timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userData: User = {
        id: '1',
        name: email.split('@')[0],
        email: email
      };
      
      setUser(userData);
      localStorage.setItem('affiliate-marketers-user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('affiliate-marketers-user');
    router.push('/login');
  }, [router]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  }), [user, isLoading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
