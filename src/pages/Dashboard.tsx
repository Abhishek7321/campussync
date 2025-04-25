
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
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
  UserPlus,
  BellRing,
} from "lucide-react";
import { formatDate, truncateText } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const isTeacher = currentUser?.role === "teacher";

  // Get recent/upcoming content
  const recentAnnouncements = announcements.slice(0, 3);
  const upcomingEvents = events.slice(0, 2);
  const upcomingAssignments = assignments.slice(0, 3);
  const myStudyGroups = studyGroups.slice(0, 2);
  const unreadMessages = messages.filter((m) => !m.isRead).length;

  return (
    <Layout>
      <div className="animate-fade-in">
        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {currentUser?.name || 'Guest'}!
          </h2>
          <p className="text-gray-600">
            Here's what's happening on campus today.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BellRing className="h-5 w-5 text-primary" />
                    Recent Announcements
                  </CardTitle>
                  <Link
                    to="/announcements"
                    className="text-sm text-primary hover:underline"
                  >
                    View all
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAnnouncements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="border-b last:border-b-0 pb-3 last:pb-0"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium">{announcement.title}</h4>
                        <Badge variant="outline">{announcement.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {truncateText(announcement.content, 120)}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={announcement.authorAvatar}
                              alt={announcement.author}
                            />
                            <AvatarFallback>
                              {announcement.author.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-500">
                            {announcement.author}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(announcement.date)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Upcoming Events
                    </CardTitle>
                    <Link
                      to="/events"
                      className="text-sm text-primary hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex gap-3 border-b last:border-b-0 pb-3 last:pb-0"
                      >
                        <div className="min-w-16 h-16 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                          <span className="text-primary text-sm font-medium">
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                            })}
                          </span>
                          <span className="text-primary text-lg font-bold">
                            {new Date(event.date).getDate()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-xs text-gray-600 mb-1">
                            {event.time} • {event.location}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {event.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      {isTeacher
                        ? "Assigned Coursework"
                        : "Upcoming Assignments"}
                    </CardTitle>
                    <Link
                      to="/assignments"
                      className="text-sm text-primary hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAssignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="border-b last:border-b-0 pb-3 last:pb-0"
                      >
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-xs text-gray-600 mb-1">
                          {assignment.course}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            Due: {formatDate(assignment.dueDate)}
                          </Badge>
                          {isTeacher && (
                            <span className="text-xs text-primary">
                              Edit
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                    <AvatarFallback>{currentUser?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-medium text-lg">{currentUser?.name || 'Guest'}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {currentUser?.role || 'Visitor'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {currentUser && currentUser.role === "student"
                      ? `Major: ${currentUser.major || 'Undeclared'}`
                      : currentUser && currentUser.role === "teacher"
                      ? `Department: ${currentUser.department || 'General'}`
                      : 'Sign in to see your profile'}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Badge className="bg-gradient-primary hover:opacity-90">
                      {currentUser?.role === "student" ? "3.8 GPA" : currentUser?.role === "teacher" ? "Faculty" : "Guest"}
                    </Badge>
                    <Badge variant="outline">
                      {currentUser?.role === "student"
                        ? "Junior"
                        : currentUser?.role === "teacher"
                        ? "Associate Professor"
                        : "Visitor"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-primary" />
                    Study Groups
                  </CardTitle>
                  <Link
                    to="/study-groups"
                    className="text-sm text-primary hover:underline"
                  >
                    View all
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myStudyGroups.map((group) => (
                    <div
                      key={group.id}
                      className="border-b last:border-b-0 pb-3 last:pb-0"
                    >
                      <h4 className="font-medium">{group.name}</h4>
                      <p className="text-xs text-gray-600 mb-1">
                        {group.course}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {group.members} members
                        </span>
                        {group.meetingTime && (
                          <Badge variant="outline" className="text-xs">
                            {group.meetingTime}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Messages
                  </CardTitle>
                  <Link
                    to="/messages"
                    className="text-sm text-primary hover:underline"
                  >
                    View all
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4">
                  {unreadMessages > 0 ? (
                    <div>
                      <Badge className="mb-2 bg-gradient-primary">
                        {unreadMessages} new
                      </Badge>
                      <p className="text-sm">
                        You have {unreadMessages} unread messages
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">
                      No new messages at this time
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
