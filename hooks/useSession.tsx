import React, { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  loginAsDemo: () => void;
  isDemo: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  loginAsDemo: () => {},
  isDemo: false,
});

// Mock objects for Demo Mode
const DEMO_USER: User = {
  id: 'demo-user-123',
  app_metadata: { provider: 'email' },
  user_metadata: { 
    full_name: 'Juan Pérez García',
    document_id: 'X123456Z', // Example NIE for PIN generation
    address: 'C/ Mayor 123',
    city: 'Madrid',
    zip_code: '28001',
    province: 'Madrid',
    country: 'España'
  },
  aud: 'authenticated',
  created_at: '2023-01-15T10:00:00Z',
  email: 'demo@trasteros.com',
  phone: '600123456',
  role: 'authenticated',
  updated_at: new Date().toISOString(),
};

const DEMO_SESSION: Session = {
  access_token: 'mock-token',
  refresh_token: 'mock-refresh',
  expires_in: 3600,
  token_type: 'bearer',
  user: DEMO_USER,
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    // Check for Demo Mode flag in localStorage on mount
    const demoFlag = localStorage.getItem('demo_mode');
    if (demoFlag === 'true') {
      setSession(DEMO_SESSION);
      setIsDemo(true);
      setLoading(false);
      return;
    }

    // Check active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginAsDemo = () => {
    localStorage.setItem('demo_mode', 'true');
    setSession(DEMO_SESSION);
    setIsDemo(true);
    // Loading is already false if we are on login page, or we set it false
    setLoading(false); 
  };

  const signOut = async () => {
    if (isDemo) {
      localStorage.removeItem('demo_mode');
      setSession(null);
      setIsDemo(false);
      // No reload needed, React state update will trigger router redirect to login
      return;
    }
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signOut, loginAsDemo, isDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSession = () => {
  return useContext(AuthContext);
};