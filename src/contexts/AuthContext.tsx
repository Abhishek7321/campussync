
import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, dummyUsers } from "@/lib/constants";

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

  const login = async (email: string, password: string) => {
    // Mock login function
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const user = dummyUsers.find((user) => user.email === email);
        
        if (user && password === "password") {
          setCurrentUser(user);
          resolve();
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 1000);
    });
  };

  const signup = async (name: string, email: string, password: string, role: "student" | "teacher") => {
    // Mock signup function
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const existingUser = dummyUsers.find((user) => user.email === email);
        
        if (existingUser) {
          reject(new Error("Email already in use"));
        } else {
          const newUser: User = {
            id: `u${dummyUsers.length + 1}`,
            name,
            email,
            avatar: `https://randomuser.me/api/portraits/${role === "student" ? "men" : "women"}/${Math.floor(Math.random() * 70)}.jpg`,
            role,
            major: role === "student" ? "Undeclared" : undefined,
            department: role === "teacher" ? "General" : undefined,
          };
          
          // In a real app, we would persist this user to a database
          setCurrentUser(newUser);
          resolve();
        }
      }, 1000);
    });
  };

  const logout = () => {
    setCurrentUser(null);
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
