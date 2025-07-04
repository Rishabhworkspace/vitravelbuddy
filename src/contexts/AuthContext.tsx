
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event === 'SIGNED_IN') {
          // Create user profile if doesn't exist
          setTimeout(async () => {
            const { error } = await supabase
              .from('users')
              .upsert({
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata?.name || session.user.email!.split('@')[0]
              }, { onConflict: 'id' });
            
            if (error) {
              console.error('Error creating user profile:', error);
            }
          }, 0);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: name
        }
      }
    });
    
    if (error) {
      console.error('Sign up error:', error);
      toast.error(error.message);
    } else {
      toast.success('Welcome to the Dark Side! Check your email to confirm.');
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Sign in error:', error);
      toast.error(error.message);
    } else {
      toast.success('The Force is strong with you!');
    }
    
    return { error };
  };

  const signOut = async () => {
    try {
      // Clear local state immediately to prevent UI confusion
      setSession(null);
      setUser(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // Check if it's a session not found error (which is expected after logout)
        if (error.message?.includes('session_not_found') || error.message?.includes('Session not found')) {
          // This is expected - session was already cleared
          toast.success('May the Force be with you... always.');
        } else {
          console.error('Sign out error:', error);
          toast.error('Logout failed. Please try again.');
        }
      } else {
        toast.success('May the Force be with you... always.');
      }
    } catch (error) {
      console.error('Unexpected logout error:', error);
      // Still clear local state even if logout fails
      setSession(null);
      setUser(null);
      toast.success('Logged out successfully.');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};
