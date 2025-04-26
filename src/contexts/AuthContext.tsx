import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User as AppUser } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

type AuthContextType = {
  currentUser: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: "student" | "teacher") => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<AppUser>) => Promise<AppUser | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to convert Supabase user to app user
const supabaseUserToAppUser = async (supabaseUser: SupabaseUser): Promise<AppUser | null> => {
  try {
    // Try to get the user profile from Supabase
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();
    
    if (error) throw error;
    
    if (profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar || `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 70)}.jpg`,
        role: profile.role as "student" | "teacher",
        major: profile.role === "student" ? profile.major || undefined : undefined,
        department: profile.role === "teacher" ? profile.department || undefined : undefined,
      };
    }
    
    // If no profile exists yet, create a basic one from the user metadata
    const userData = supabaseUser.user_metadata;
    const role = userData?.role || "student";
    
    return {
      id: supabaseUser.id,
      name: userData?.name || supabaseUser.email?.split('@')[0] || "User",
      email: supabaseUser.email || "",
      avatar: userData?.avatar || `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 70)}.jpg`,
      role: role,
      major: role === "student" ? userData?.major || "Undeclared" : undefined,
      department: role === "teacher" ? userData?.department || "General" : undefined,
    };
  } catch (error) {
    console.error("Error converting Supabase user to app user:", error);
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!currentUser;

  // Check for existing session on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session?.user) {
          const appUser = await supabaseUserToAppUser(session.user);
          if (appUser) {
            setCurrentUser(appUser);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === "SIGNED_IN" && session?.user) {
          const appUser = await supabaseUserToAppUser(session.user);
          if (appUser) {
            setCurrentUser(appUser);
          }
        } else if (event === "SIGNED_OUT") {
          setCurrentUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Support for the demo account
      if (email === "Abhi" && password === "Abhi@12") {
        // Create a mock user profile
        const userId = "abhi-123";
        
        // Check if we already have a profile for this user
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        let profile = existingProfile;
        
        // If not, create one
        if (!profile) {
          const { data: newProfile, error } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              name: "Abhika",
              email: "abhi@campus.edu",
              avatar: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 70)}.jpg`,
              role: "student",
              major: "Computer Science",
              department: null,
              bio: "Campus Sync Developer",
              join_date: new Date().toISOString(),
            })
            .select()
            .single();
          
          if (error) throw error;
          profile = newProfile;
        }
        
        if (!profile) {
          throw new Error("Failed to create user profile");
        }
        
        // Convert to User type and update state
        const user: AppUser = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar,
          role: profile.role as "student" | "teacher",
          major: profile.major || undefined,
          department: profile.department || undefined,
        };
        
        setCurrentUser(user);
        window.location.href = '/dashboard';
        return;
      }
      
      // For real users, use Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data.user) {
        throw new Error("Login failed: No user data received");
      }
      
      const appUser = await supabaseUserToAppUser(data.user);
      if (appUser) {
        setCurrentUser(appUser);
        window.location.href = '/dashboard';
      } else {
        throw new Error("Failed to get user profile");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Invalid email or password");
    }
  };

  const signup = async (name: string, email: string, password: string, role: "student" | "teacher") => {
    try {
      // Create user with Supabase auth
      const userData = {
        name,
        role,
        major: role === "student" ? "Undeclared" : null,
        department: role === "teacher" ? "General" : null,
      };
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data.user) {
        throw new Error("Signup failed: No user data received");
      }
      
      // Generate avatar URL
      const avatarUrl = `https://randomuser.me/api/portraits/${role === "student" ? "men" : "women"}/${Math.floor(Math.random() * 70)}.jpg`;
      
      // Create a profile in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          name,
          email,
          avatar: avatarUrl,
          role,
          major: role === "student" ? "Undeclared" : null,
          department: role === "teacher" ? "General" : null,
          bio: null,
          join_date: new Date().toISOString(),
        });
      
      if (profileError) {
        throw new Error("Failed to create user profile");
      }
      
      // Create app user
      const appUser: AppUser = {
        id: data.user.id,
        name,
        email,
        avatar: avatarUrl,
        role,
        major: role === "student" ? "Undeclared" : undefined,
        department: role === "teacher" ? "General" : undefined,
      };
      
      setCurrentUser(appUser);
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error("Signup error:", error);
      throw new Error(error.message || "Could not create account");
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUserProfile = async (updates: Partial<AppUser>): Promise<AppUser | null> => {
    if (!currentUser) {
      throw new Error("No user is logged in");
    }
    
    try {
      // Update user metadata in Supabase auth
      await supabase.auth.updateUser({
        data: {
          name: updates.name,
          avatar: updates.avatar,
          major: updates.major,
          department: updates.department,
        }
      });
      
      // Update the profile in the profiles table
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .upsert({
          id: currentUser.id,
          name: updates.name,
          avatar: updates.avatar,
          major: updates.major || null,
          department: updates.department || null,
          bio: null, // We could add this to the updates parameter if needed
        })
        .select()
        .single();
      
      if (error) throw error;
      if (!updatedProfile) {
        throw new Error("Failed to update profile");
      }
      
      // Update local state
      const updatedUser: AppUser = {
        ...currentUser,
        ...updates,
      };
      
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating profile:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        updateUserProfile,
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
