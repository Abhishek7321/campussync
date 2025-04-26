
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { FeedProvider } from "@/contexts/FeedContext";
import { useEffect, useState } from "react";
// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Announcements from "./pages/Announcements";
import Events from "./pages/Events";
import StudyGroups from "./pages/StudyGroups";
import Assignments from "./pages/Assignments";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import FeedPage from "./pages/FeedPage";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <FeedProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/announcements" element={<Announcements />} />
                <Route path="/events" element={<Events />} />
                <Route path="/study-groups" element={<StudyGroups />} />
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/messages" element={<Messages />} /> 
                <Route path="/FeedPage" element={<FeedPage />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* Index route */}
                <Route path="/index" element={<Index />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </FeedProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
