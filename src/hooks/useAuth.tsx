
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/supabase/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Deferred admin check. Must NOT be awaited inside onAuthStateChange:
    // awaiting supabase queries within that callback deadlocks the auth
    // lock (supabase-js v2) and leaves the app stuck on the loading state.
    const checkAdmin = (session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (!session?.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // setTimeout(0) escapes the auth-lock call stack before querying
      setTimeout(() => {
        supabase
          .from('admin_users')
          .select('*')
          .eq('email', session.user!.email)
          .maybeSingle()
          .then(({ data, error }) => {
            if (!mounted) return;
            if (error) console.error('Admin check failed:', error.message);
            setIsAdmin(!error && !!data);
            setLoading(false);
          })
          .catch(() => {
            if (!mounted) return;
            setIsAdmin(false);
            setLoading(false);
          });
      }, 0);
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        checkAdmin(session);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      checkAdmin(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Consolidated: use the shared Supabase client only (demo login removed)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        console.error('Login error:', error.message);
        return { error: 'Invalid admin credentials' };
      }

      // Check if user is in admin_users table
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();

      if (adminError || !adminUser) {
        await supabase.auth.signOut();
        return { error: 'Invalid admin credentials' };
      }

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('email', email);

      return { error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'Login failed' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAdmin,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
