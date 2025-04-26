import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from "chart.js";
import { Mail, Home, BookOpen, CreditCard } from "lucide-react";

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

interface SemesterResult {
  semester: string;
  gpa: number;
  subjects: { name: string; grade: string; credits: number }[];
}

interface Assignment {
  id: number;
  title: string;
  subject: string;
  status: "completed" | "pending" | "overdue";
  dueDate: string;
  grade?: string;
}

interface SubjectAttendance {
  subject: string;
  present: number;
  total: number;
  percentage: number;
}

const defaultSemesterResults: SemesterResult[] = [
  { semester: "1st Sem", gpa: 8.5, subjects: [] },
  { semester: "2nd Sem", gpa: 8.8, subjects: [] },
  { semester: "3rd Sem", gpa: 9.0, subjects: [] },
];

const defaultAssignments: Assignment[] = [
  { id: 1, title: "Project Report", subject: "Software Engineering", status: "completed", dueDate: "2023-04-15" },
  { id: 2, title: "Database Assignment", subject: "Database Systems", status: "pending", dueDate: "2023-05-10" },
];

const defaultAttendanceBySubject: SubjectAttendance[] = [
  { subject: "Database Systems", present: 18, total: 20, percentage: 90 },
  { subject: "Computer Networks", present: 16, total: 20, percentage: 80 },
];

const Profile: React.FC = () => {
  const [semesterResults, setSemesterResults] = useState<SemesterResult[]>(defaultSemesterResults);
  const [assignments, setAssignments] = useState<Assignment[]>(defaultAssignments);
  const [attendanceBySubject, setAttendanceBySubject] = useState<SubjectAttendance[]>(defaultAttendanceBySubject);

  const studentDetails = {
    fullName: "John Doe",
    email: "john.doe@university.edu",
    address: "123 Campus Street, University City",
    course: "B.Tech Computer Science",
    feesSubmitted: "80,000 INR",
  };

  const totalCGPA = semesterResults.reduce((sum, res) => sum + res.gpa, 0) / semesterResults.length;
  const overallAttendance = Math.round(
    attendanceBySubject.reduce((sum, subj) => sum + subj.percentage, 0) / attendanceBySubject.length
  );

  const performanceTrendData = {
    labels: semesterResults.map((res) => res.semester),
    datasets: [
      {
        label: "GPA",
        data: semesterResults.map((res) => res.gpa),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const attendanceData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [overallAttendance, 100 - overallAttendance],
        backgroundColor: ["#4CAF50", "#F44336"],
        borderWidth: 1,
      },
    ],
  };

  const subjectAttendanceData = {
    labels: attendanceBySubject.map((s) => s.subject),
    datasets: [
      {
        label: "Attendance %",
        data: attendanceBySubject.map((s) => s.percentage),
        backgroundColor: attendanceBySubject.map((s) =>
          s.percentage >= 90 ? "#4CAF50" : s.percentage >= 75 ? "#FFC107" : "#F44336"
        ),
      },
    ],
  };

  return (
    <Layout>
      <div className="p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6 gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="academics">Academics</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="student">Student Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>CGPA</CardTitle>
                </CardHeader>
                <CardContent>
                  <h2 className="text-3xl font-bold text-primary">{totalCGPA.toFixed(2)}</h2>
                  <Line data={performanceTrendData} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <h2 className="text-3xl font-bold text-primary">{overallAttendance}%</h2>
                  <Doughnut data={attendanceData} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <h2 className="text-3xl font-bold text-primary">
                    {assignments.filter((a) => a.status === "pending").length}
                  </h2>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academics">
            <h3 className="text-xl font-bold mb-4">Semester Results</h3>
            {semesterResults.map((sem) => (
              <Card key={sem.semester} className="mb-4">
                <CardHeader>
                  <CardTitle>{sem.semester}</CardTitle>
                </CardHeader>
                <CardContent>
                  GPA: {sem.gpa}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="attendance">
            <h3 className="text-xl font-bold mb-4">Subject Attendance</h3>
            <Bar data={subjectAttendanceData} />
          </TabsContent>

          <TabsContent value="student">
            <h3 className="text-xl font-bold mb-4">Student Details</h3>
            <Card className="mb-4">
              <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Mail className="text-primary" />
                  <div>
                    <div className="font-bold">Full Name</div>
                    <div>{studentDetails.fullName}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="text-primary" />
                  <div>
                    <div className="font-bold">College Email</div>
                    <div>{studentDetails.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Home className="text-primary" />
                  <div>
                    <div className="font-bold">Address</div>
                    <div>{studentDetails.address}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <BookOpen className="text-primary" />
                  <div>
                    <div className="font-bold">Course</div>
                    <div>{studentDetails.course}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard className="text-primary" />
                  <div>
                    <div className="font-bold">Fees Submitted</div>
                    <div>{studentDetails.feesSubmitted}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
