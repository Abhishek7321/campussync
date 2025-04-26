
import { Calendar, Home, MessageSquare, UserPlus,Plus, BookOpen, BellRing } from "lucide-react";

export type UserRole = "student" | "teacher";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  major?: string;
  department?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  author: string;
  authorRole: UserRole;
  authorAvatar: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  organizer: string;
  category: string;
  attendees: number;
  image?: string;
}

export interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  description: string;
  teacherName: string;
  fileUrl?: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  course: string;
  members: number;
  description: string;
  creator: string;
  meetingTime?: string;
  meetingLocation?: string;
}

export interface Message {
  id: string;
  sender: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Chat {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
  }[];
  lastMessage: {
    content: string;
    timestamp: string;
    senderId: string;
  };
  unread: number;
}

// Navigation items
export const sidebarItems = [
  {
    name: "Dashboard",
    icon: Home,
    path: "/dashboard",
  },
  {
    name: "Announcements",
    icon: BellRing,
    path: "/announcements",
  },
  {
    name: "Events",
    icon: Calendar,
    path: "/events",
  },
  {
    name: "Study Groups",
    icon: UserPlus,
    path: "/study-groups",
  },
  {
    name: "Assignments",
    icon: BookOpen,
    path: "/assignments",
  },
  {
    name: "Messages",
    icon: MessageSquare,
    path: "/messages",
  },

  {
    name: "Feeds",
    icon: Plus,
    path: "/Feedpage",
  },
];

// Dummy Users
export const dummyUsers: User[] = [
  {
    id: "u1",
    name: "Alex Johnson",
    email: "alex.johnson@campus.edu",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "student",
    major: "Computer Science",
  },
  {
    id: "u2",
    name: "Sarah Williams",
    email: "sarah.williams@campus.edu",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    role: "student",
    major: "Business Administration",
  },
  {
    id: "u3",
    name: "Dr. Michael Chen",
    email: "m.chen@campus.edu",
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    role: "teacher",
    department: "Computer Science",
  },
  {
    id: "u4",
    name: "Prof. Emma Davis",
    email: "e.davis@campus.edu",
    avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    role: "teacher",
    department: "Business School",
  },
];

// Dummy announcements
export const announcements: Announcement[] = [
  {
    id: "a1",
    title: "Campus Library Extended Hours",
    content: "The main campus library will be open 24/7 during finals week to accommodate study needs.",
    category: "Academic",
    date: "2025-04-20",
    author: "Dr. Michael Chen",
    authorRole: "teacher",
    authorAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
  },
  {
    id: "a2",
    title: "Career Fair Next Week",
    content: "Don't miss the annual career fair with over 50 companies looking to hire graduates and interns.",
    category: "Career",
    date: "2025-04-18",
    author: "Prof. Emma Davis",
    authorRole: "teacher",
    authorAvatar: "https://randomuser.me/api/portraits/women/17.jpg",
  },
  {
    id: "a3",
    title: "New Student Recreation Center Opening",
    content: "The new fitness center will open next Monday with free classes for the first week.",
    category: "Campus Life",
    date: "2025-04-15",
    author: "Student Affairs",
    authorRole: "teacher",
    authorAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: "a4",
    title: "Scholarship Applications Open",
    content: "Merit and need-based scholarship applications for the next academic year are now open.",
    category: "Financial",
    date: "2025-04-10",
    author: "Financial Aid Office",
    authorRole: "teacher",
    authorAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
  },
];

// Dummy events
export const events: Event[] = [
  {
    id: "e1",
    title: "Tech Startup Workshop",
    description: "Learn how to launch your own tech startup from industry experts",
    location: "Business Building, Room 305",
    date: "2025-05-05",
    time: "14:00 - 16:00",
    organizer: "Entrepreneurship Club",
    category: "Career",
    attendees: 45,
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1470&auto=format&fit=crop",
  },
  {
    id: "e2",
    title: "Spring Concert",
    description: "Annual spring concert featuring student bands and a special guest performer",
    location: "Campus Amphitheater",
    date: "2025-05-10",
    time: "18:00 - 21:00",
    organizer: "Student Activities Board",
    category: "Entertainment",
    attendees: 230,
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1470&auto=format&fit=crop",
  },
  {
    id: "e3",
    title: "AI Research Symposium",
    description: "Presentations of cutting-edge AI research by faculty and graduate students",
    location: "Science Center Auditorium",
    date: "2025-05-15",
    time: "10:00 - 16:00",
    organizer: "Computer Science Department",
    category: "Academic",
    attendees: 120,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1374&auto=format&fit=crop",
  },
  {
    id: "e4",
    title: "Volunteer Day",
    description: "Join fellow students in community service projects around the city",
    location: "Student Union (Meet Up Point)",
    date: "2025-05-20",
    time: "09:00 - 15:00",
    organizer: "Community Outreach Organization",
    category: "Service",
    attendees: 75,
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1528&auto=format&fit=crop",
  },
];

// Dummy assignments
export const assignments: Assignment[] = [
  {
    id: "as1",
    title: "Final Project: Web Application",
    course: "CS 401: Advanced Web Development",
    dueDate: "2025-05-15",
    description: "Create a full-stack web application that demonstrates your understanding of React, Node.js, and database integration.",
    teacherName: "Dr. Michael Chen",
    fileUrl: "#",
  },
  {
    id: "as2",
    title: "Market Analysis Report",
    course: "BUS 330: Marketing Strategy",
    dueDate: "2025-05-10",
    description: "Analyze a company of your choice and provide a comprehensive market analysis with SWOT and competitor assessment.",
    teacherName: "Prof. Emma Davis",
    fileUrl: "#",
  },
  {
    id: "as3",
    title: "Literature Review",
    course: "ENG 220: Contemporary Literature",
    dueDate: "2025-05-08",
    description: "Write a 5-page literature review on a modern novel of your choice, focusing on themes and character development.",
    teacherName: "Dr. Lisa Monroe",
    fileUrl: "#",
  },
  {
    id: "as4",
    title: "Lab Report: Chemical Reactions",
    course: "CHEM 310: Organic Chemistry",
    dueDate: "2025-05-12",
    description: "Submit a comprehensive lab report based on the chemical reactions experiment conducted in class.",
    teacherName: "Prof. James Wilson",
    fileUrl: "#",
  },
];

// Dummy study groups
export const studyGroups: StudyGroup[] = [
  {
    id: "sg1",
    name: "Web Dev Wizards",
    course: "CS 401: Advanced Web Development",
    members: 8,
    description: "Group for collaborating on the final project and preparing for the exam",
    creator: "Alex Johnson",
    meetingTime: "Tuesdays, 18:00 - 20:00",
    meetingLocation: "Library Study Room 4",
  },
  {
    id: "sg2",
    name: "Marketing Strategy Team",
    course: "BUS 330: Marketing Strategy",
    members: 6,
    description: "Group for discussing case studies and working on the group project",
    creator: "Sarah Williams",
    meetingTime: "Wednesdays, 17:00 - 19:00",
    meetingLocation: "Business Building, Room 210",
  },
  {
    id: "sg3",
    name: "Literature Circle",
    course: "ENG 220: Contemporary Literature",
    members: 5,
    description: "Discussion group for analyzing themes and characters in assigned readings",
    creator: "Jordan Smith",
    meetingTime: "Fridays, 14:00 - 15:30",
    meetingLocation: "Arts Building, Room 115",
  },
  {
    id: "sg4",
    name: "Organic Chemistry Support",
    course: "CHEM 310: Organic Chemistry",
    members: 10,
    description: "Study group for reviewing lecture materials and preparing for exams",
    creator: "Taylor Rodriguez",
    meetingTime: "Mondays & Thursdays, 19:00 - 21:00",
    meetingLocation: "Science Center, Lab 3",
  },
];

// Dummy messages and chats
export const messages: Message[] = [
  {
    id: "m1",
    sender: "Sarah Williams",
    senderAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    content: "Hey, are you coming to the study group tonight?",
    timestamp: "2025-04-25T14:30:00",
    isRead: false,
  },
  {
    id: "m2",
    sender: "Dr. Michael Chen",
    senderAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
    content: "Please remember to submit your assignments by Friday.",
    timestamp: "2025-04-24T10:15:00",
    isRead: true,
  },
  {
    id: "m3",
    sender: "Jordan Smith",
    senderAvatar: "https://randomuser.me/api/portraits/men/55.jpg",
    content: "I've shared the notes from yesterday's lecture with you.",
    timestamp: "2025-04-23T18:45:00",
    isRead: true,
  },
];

export const chats: Chat[] = [
  {
    id: "c1",
    participants: [
      {
        id: "u2",
        name: "Sarah Williams",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
    ],
    lastMessage: {
      content: "Hey, are you coming to the study group tonight?",
      timestamp: "2025-04-25T14:30:00",
      senderId: "u2",
    },
    unread: 1,
  },
  {
    id: "c2",
    participants: [
      {
        id: "u3",
        name: "Dr. Michael Chen",
        avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      },
    ],
    lastMessage: {
      content: "Please remember to submit your assignments by Friday.",
      timestamp: "2025-04-24T10:15:00",
      senderId: "u3",
    },
    unread: 0,
  },
  {
    id: "c3",
    participants: [
      {
        id: "u5",
        name: "Jordan Smith",
        avatar: "https://randomuser.me/api/portraits/men/55.jpg",
      },
      {
        id: "u6",
        name: "Taylor Rodriguez",
        avatar: "https://randomuser.me/api/portraits/women/63.jpg",
      },
      {
        id: "u7",
        name: "Jamie Wilson",
        avatar: "https://randomuser.me/api/portraits/men/33.jpg",
      },
    ],
    lastMessage: {
      content: "I've shared the notes from yesterday's lecture with you all.",
      timestamp: "2025-04-23T18:45:00",
      senderId: "u5",
    },
    unread: 0,
  },
];

export const categories = {
  announcements: ["All", "Academic", "Career", "Campus Life", "Financial", "Events"],
  events: ["All", "Academic", "Career", "Entertainment", "Service", "Sports"],
};
