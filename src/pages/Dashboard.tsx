import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  announcements,
  events,
  assignments,
  studyGroups,
  messages,
} from "@/lib/constants";
import {
  BookOpen,
  Calendar,
  MessageSquare,
  User as UserIcon,
  BellRing,
  Users,
} from "lucide-react";
import { formatDate, truncateText } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button"; // Import Button component

export default function Dashboard() {
  const { currentUser } = useAuth();
  const isTeacher = currentUser?.role === "teacher";

  const recentAnnouncements = announcements.slice(0, 3);
  const upcomingEvents = events.slice(0, 2);
  const upcomingAssignments = assignments.slice(0, 3);
  const myStudyGroups = studyGroups.slice(0, 2);
  const unreadMessages = messages.filter((m) => !m.isRead).length;

  const handleOpenGroup = (groupId: string) => {
    // Logic for opening the group, for now just a toast or log
    console.log(`Opening group with ID: ${groupId}`);
  };

  return (
    <Layout>
      <div className="relative animate-fade-in px-6 py-6 bg-gradient-to-b from-white to-gray-50 min-h-screen flex flex-col">

        {/* Top Right Icons - Aligned */}
        <div className="absolute top-6 right-6 flex space-x-6">

          {/* Messages Icon with View All Link */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="rounded-full p-2 bg-white shadow-lg hover:shadow-2xl transition-all">
                <MessageSquare className="h-8 w-8 text-primary" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 p-4 shadow-xl border-primary border-2">
              <div className="text-center">
                {unreadMessages > 0 ? (
                  <div>
                    <Badge className="mb-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                      {unreadMessages} New
                    </Badge>
                    <p className="text-sm font-medium text-gray-700">
                      You have {unreadMessages} unread messages
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No new messages
                  </p>
                )}
                <Link to="/messages" className="text-sm text-primary hover:underline mt-4 block">
                  View All Chats
                </Link>
              </div>
            </PopoverContent>
          </Popover>

          {/* Group Study Icon */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="rounded-full p-2 bg-white shadow-lg hover:shadow-2xl transition-all">
                <Users className="h-8 w-8 text-primary" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 p-4 shadow-xl border-green-400 border-2">
              <div className="space-y-4">
                {myStudyGroups.map((group) => (
                  <div key={group.id} className="border-b pb-4 last:border-0">
                    <h4 className="font-semibold">{group.name}</h4>
                    <p className="text-xs text-gray-600">{group.course}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">{group.members} members</span>
                      {group.meetingTime && (
                        <Badge variant="outline" className="text-xs">{group.meetingTime}</Badge>
                      )}
                    </div>

                    {/* Open Group Button */}
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleOpenGroup(group.id)}
                      >
                        Open Group
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Profile Icon - Updated */}
          <Link to="/profile">
            <button className="rounded-full p-2 bg-white shadow-lg hover:shadow-2xl transition-all">
              <UserIcon className="h-8 w-8 text-primary" />
            </button>
          </Link>

        </div>

        {/* Welcome Section */}
        <section className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              Welcome back, {currentUser?.name || "Guest"}!
            </h2>
            <p className="text-gray-600 text-lg">
              Here's what's happening on campus today.
            </p>
          </div>
        </section>

        {/* Main Grid */}
        <div className="flex flex-col gap-8 mb-8">
          {/* Announcements */}
          <Card className="p-4 hover:shadow-xl transition-all">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <BellRing className="h-5 w-5" />
                  Recent Announcements
                </CardTitle>
                <Link to="/announcements" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{announcement.title}</h4>
                    <Badge variant="outline" className="text-xs">{announcement.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{truncateText(announcement.content, 100)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={announcement.authorAvatar} alt={announcement.author} />
                        <AvatarFallback>{announcement.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-500">{announcement.author}</span>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(announcement.date)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Events & Upcoming Assignments in Same Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Upcoming Events */}
            <Card className="p-4 hover:shadow-xl transition-all">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Calendar className="h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                  <Link to="/events" className="text-sm text-primary hover:underline">
                    View all
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex gap-4 border-b pb-4 last:border-0">
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-primary/10 rounded-lg">
                      <span className="text-primary text-sm font-medium">
                        {new Date(event.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-primary text-lg font-bold">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-xs text-gray-600">{event.time} • {event.location}</p>
                      <Badge variant="outline" className="text-xs mt-1">{event.category}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Assignments */}
            <Card className="p-4 hover:shadow-xl transition-all">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <BookOpen className="h-5 w-5" />
                    {isTeacher ? "Assigned Coursework" : "Upcoming Assignments"}
                  </CardTitle>
                  <Link to="/assignments" className="text-sm text-primary hover:underline">
                    View all
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAssignments.map((assignment) => (
                  <div key={assignment.id} className="border-b pb-4 last:border-0">
                    <h4 className="font-semibold">{assignment.title}</h4>
                    <p className="text-xs text-gray-600">{assignment.course}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-xs">
                        Due: {formatDate(assignment.dueDate)}
                      </Badge>
                      {isTeacher && (
                        <span className="text-xs text-primary cursor-pointer hover:underline">Edit</span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}