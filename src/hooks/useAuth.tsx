
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

interface AuthErrorLike {
  message?: string;
  code?: string;
  status?: number;
}

/** Turn a Supabase auth failure into a message an admin can act on. */
const describeLoginError = (error: unknown): string => {
  const { message = "", code = "", status } = (error ?? {}) as AuthErrorLike;

  if (
    code === "invalid_credentials" ||
    /invalid login credentials/i.test(message)
  ) {
    return "Incorrect email or password. Please check and try again.";
  }
  if (code === "email_not_confirmed" || /email not confirmed/i.test(message)) {
    return "This email has not been confirmed yet. Open the confirmation link we emailed you, then try again.";
  }
  if (
    code === "over_email_send_rate_limit" ||
    code === "over_request_rate_limit" ||
    status === 429
  ) {
    return "Too many attempts. Please wait a minute and try again.";
  }
  if (status === 0 || /failed to fetch|network|load failed/i.test(message)) {
    return "We could not reach the server. Check your internet connection and try again.";
  }

  return message ? `Sign-in failed: ${message}` : "Sign-in failed. Please try again.";
};

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
          .select('id')
          .ilike('email', session.user!.email ?? '')
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
        if (import.meta.env.DEV) {
          console.debug('Auth state changed:', event);
        }
        checkAdmin(session);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAdmin(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const normalisedEmail = email.trim().toLowerCase();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalisedEmail,
        password,
      });

      if (error) {
        console.error("Login error:", error.status, error.code, error.message);
        return { error: describeLoginError(error) };
      }

      // Always match the admin row against the email the session actually has:
      // Supabase Auth lower-cases addresses, so comparing with the raw input
      // used to reject valid logins (and lock out anyone who typed a capital).
      const sessionEmail = data.user?.email?.toLowerCase() ?? normalisedEmail;

      const { data: adminUser, error: adminError } = await supabase
        .from("admin_users")
        .select("id, email")
        .ilike("email", sessionEmail)
        .maybeSingle();

      if (adminError) {
        console.error("Admin lookup failed:", adminError.code, adminError.message);
        await supabase.auth.signOut();
        return {
          error:
            "We could not verify your admin access. Please try again, and contact the site owner if it keeps failing.",
        };
      }

      if (!adminUser) {
        await supabase.auth.signOut();
        return {
          error: `${sessionEmail} is not an admin account. Ask the site owner to add it to the admin list.`,
        };
      }

      // Update last login (best effort: a failure here must not block login).
      const { error: lastLoginError } = await supabase
        .from("admin_users")
        .update({ last_login: new Date().toISOString() })
        .eq("email", adminUser.email);

      if (lastLoginError) {
        console.warn("Could not stamp last_login:", lastLoginError.message);
      }

      return { error: null };
    } catch (error) {
      console.error("Login error:", error);
      return { error: describeLoginError(error) };
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
