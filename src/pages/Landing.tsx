
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MessageSquare, User, FileCheck, BellRing } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">
              <span className="campus-gradient-text">Campus</span>
              <span>Sync</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Log in
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-primary hover:opacity-90">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Connect Your <span className="campus-gradient-text">Campus Life</span> in One Place
              </h1>
              <p className="text-xl text-gray-600">
                The all-in-one platform for students and teachers to manage courses, events, study groups, and campus communication.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-primary hover:opacity-90 w-full sm:w-auto"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Log in to Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1470&auto=format&fit=crop"
                alt="Campus students"
                className="rounded-lg shadow-lg w-full"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/30 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need for Campus Success</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              CampusSync brings all aspects of campus life together in one intuitive platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary text-white flex items-center justify-center mb-4">
                <BellRing className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Campus Announcements
              </h3>
              <p className="text-gray-600">
                Stay informed with the latest updates, news, and important notifications from your campus administration.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary text-white flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Event Management</h3>
              <p className="text-gray-600">
                Discover, create, and RSVP to campus events. Never miss out on important academic and social activities.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary text-white flex items-center justify-center mb-4">
                <User className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Study Groups</h3>
              <p className="text-gray-600">
                Form and join study groups for collaborative learning. Schedule meetings and share resources with classmates.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary text-white flex items-center justify-center mb-4">
                <FileCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Assignments & Notes
              </h3>
              <p className="text-gray-600">
                Teachers can upload assignments and materials, while students can access and submit them easily.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary text-white flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Chat Messaging</h3>
              <p className="text-gray-600">
                Communicate directly with professors and classmates through individual and group chats.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary text-white flex items-center justify-center mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="8" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Suggestions</h3>
              <p className="text-gray-600">
                Get smart recommendations for events, study groups, and resources based on your interests and courses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-based section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Designed for Everyone on Campus
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're a student or teacher, CampusSync adapts to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl border">
              <h3 className="text-2xl font-semibold mb-4">For Students</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">✓</div>
                  <p>Track all your course assignments in one place</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">✓</div>
                  <p>Find and join study groups for your courses</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">✓</div>
                  <p>Receive notifications about important deadlines</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">✓</div>
                  <p>Easily communicate with professors and classmates</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">✓</div>
                  <p>Discover campus events and extracurricular activities</p>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl border">
              <h3 className="text-2xl font-semibold mb-4">For Teachers</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">✓</div>
                  <p>Create and distribute assignments efficiently</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">✓</div>
                  <p>Share course materials and resources</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">✓</div>
                  <p>Make important announcements to your classes</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">✓</div>
                  <p>Communicate directly with individual students</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">✓</div>
                  <p>Track assignment submissions and progress</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 px-4 bg-gradient-primary text-white">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Campus Experience?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of students and teachers already using CampusSync
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/20"
              >
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold">
                <span className="campus-gradient-text">Campus</span>
                <span>Sync</span>
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                © 2025 CampusSync. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
