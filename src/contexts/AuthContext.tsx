
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, dummyUsers } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: "student" | "teacher") => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isAuthenticated = !!currentUser;

  // Check for saved user in local storage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("campusSyncUser");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("campusSyncUser");
      }
    }

    // Set up Supabase auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Convert Supabase user to app user format
          const user: User = {
            id: session.user.id,
            name: session.user.user_metadata.name || 'User',
            email: session.user.email || '',
            avatar: `https://randomuser.me/api/portraits/${session.user.user_metadata.role === "student" ? "men" : "women"}/${Math.floor(Math.random() * 70)}.jpg`,
            role: session.user.user_metadata.role || 'student',
            major: session.user.user_metadata.role === 'student' ? session.user.user_metadata.major || 'Undeclared' : undefined,
            department: session.user.user_metadata.role === 'teacher' ? session.user.user_metadata.department || 'General' : undefined,
          };
          
          setCurrentUser(user);
          localStorage.setItem("campusSyncUser", JSON.stringify(user));
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          localStorage.removeItem("campusSyncUser");
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Convert Supabase user to app user format
        const user: User = {
          id: session.user.id,
          name: session.user.user_metadata.name || 'User',
          email: session.user.email || '',
          avatar: `https://randomuser.me/api/portraits/${session.user.user_metadata.role === "student" ? "men" : "women"}/${Math.floor(Math.random() * 70)}.jpg`,
          role: session.user.user_metadata.role || 'student',
          major: session.user.user_metadata.role === 'student' ? session.user.user_metadata.major || 'Undeclared' : undefined,
          department: session.user.user_metadata.role === 'teacher' ? session.user.user_metadata.department || 'General' : undefined,
        };
        
        setCurrentUser(user);
        localStorage.setItem("campusSyncUser", JSON.stringify(user));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      // The session will be handled by the onAuthStateChange listener
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Invalid email or password");
    }
  };

  const signup = async (name: string, email: string, password: string, role: "student" | "teacher") => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            major: role === 'student' ? 'Undeclared' : undefined,
            department: role === 'teacher' ? 'General' : undefined,
          },
        }
      });
      
      if (error) {
        throw error;
      }
      
      // The session will be handled by the onAuthStateChange listener
    } catch (error) {
      console.error("Signup error:", error);
      throw new Error("Could not create account");
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      localStorage.removeItem("campusSyncUser");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
