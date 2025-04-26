
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "@/lib/constants";
import { profileService } from "@/services/databaseService";

type AuthContextType = {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: "student" | "teacher") => Promise<void>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => Promise<User | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to generate a mock user ID
const generateUserId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Mock user database for authentication
const mockUsers: Record<string, { email: string; password: string; userId: string }> = {};

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
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Check for hardcoded user
      if (email === "Abhi" && password === "Abhi@12") {
        // Create a mock user profile
        const userId = "abhi-123";
        
        // Check if we already have a profile for this user
        let profile = await profileService.getProfileById(userId);
        
        // If not, create one
        if (!profile) {
          profile = await profileService.createProfile({
            id: userId,
            name: "Abhika",
            email: "abhi@campus.edu",
            avatar: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 70)}.jpg`,
            role: "student",
            major: "Computer Science",
            department: null,
            bio: "Campus Sync Developer",
            join_date: new Date().toISOString(),
          });
        }
        
        if (!profile) {
          throw new Error("Failed to create user profile");
        }
        
        // Convert to User type and update state
        const user = profileService.profileToUser(profile);
        setCurrentUser(user);
        localStorage.setItem("campusSyncUser", JSON.stringify(user));
        return;
      }
      
      // For other users (if we add more later)
      const userEntry = Object.values(mockUsers).find(user => user.email === email);
      
      if (!userEntry || userEntry.password !== password) {
        throw new Error("Invalid email or password");
      }
      
      // Get user profile
      const profile = await profileService.getProfileById(userEntry.userId);
      
      if (!profile) {
        throw new Error("User profile not found");
      }
      
      // Convert to User type and update state
      const user = profileService.profileToUser(profile);
      setCurrentUser(user);
      localStorage.setItem("campusSyncUser", JSON.stringify(user));
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Invalid email or password");
    }
  };

  const signup = async (name: string, email: string, password: string, role: "student" | "teacher") => {
    try {
      // Check if email already exists
      if (Object.values(mockUsers).some(user => user.email === email)) {
        throw new Error("Email already in use");
      }
      
      // Generate a new user ID
      const userId = generateUserId();
      
      // Store user credentials
      mockUsers[email] = {
        email,
        password,
        userId
      };
      
      // Create a profile
      const avatarUrl = `https://randomuser.me/api/portraits/${role === "student" ? "men" : "women"}/${Math.floor(Math.random() * 70)}.jpg`;
      
      const profile = await profileService.createProfile({
        id: userId,
        name,
        email,
        avatar: avatarUrl,
        role,
        major: role === 'student' ? 'Undeclared' : null,
        department: role === 'teacher' ? 'General' : null,
        bio: null,
        join_date: new Date().toISOString(),
      });
      
      if (!profile) {
        throw new Error("Failed to create profile");
      }
      
      // Convert to User type and update state
      const user = profileService.profileToUser(profile);
      setCurrentUser(user);
      localStorage.setItem("campusSyncUser", JSON.stringify(user));
    } catch (error) {
      console.error("Signup error:", error);
      throw new Error("Could not create account");
    }
  };

  const logout = async () => {
    try {
      setCurrentUser(null);
      localStorage.removeItem("campusSyncUser");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<User | null> => {
    if (!currentUser) {
      throw new Error("No user is logged in");
    }
    
    try {
      // Update the profile in the database
      const updatedProfile = await profileService.updateProfile(currentUser.id, {
        name: updates.name,
        avatar: updates.avatar,
        major: updates.major || null,
        department: updates.department || null,
        bio: updates.bio || null,
      });
      
      if (!updatedProfile) {
        throw new Error("Failed to update profile");
      }
      
      // Convert to User type
      const updatedUser = profileService.profileToUser(updatedProfile);
      
      // Update local state and storage
      setCurrentUser(updatedUser);
      localStorage.setItem("campusSyncUser", JSON.stringify(updatedUser));
      
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
