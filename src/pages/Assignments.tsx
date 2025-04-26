import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { assignments } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Download, Bell, Upload as UploadIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Assignments() {
  const { currentUser } = useAuth();
  const isTeacher = currentUser?.role === "teacher";
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentCourse, setAssignmentCourse] = useState("");
  const [assignmentDueDate, setAssignmentDueDate] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Function to download a text file dynamically
  const downloadTextFile = (content: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCreateAssignment = () => {
    if (
      assignmentTitle &&
      assignmentCourse &&
      assignmentDueDate &&
      assignmentDescription
    ) {
      toast({
        title: "Assignment created!",
        description: "Your assignment has been published.",
      });
      setDialogOpen(false);
      setAssignmentTitle("");
      setAssignmentCourse("");
      setAssignmentDueDate("");
      setAssignmentDescription("");
    }
  };

  const handleNotifyStudent = (assignmentId: string) => {
    if (!notificationEnabled) return;

    toast({
      title: "Notification sent!",
      description: `Student has been notified about the upcoming due date for Assignment ID: ${assignmentId}.`,
    });
    setNotificationEnabled(false);
  };

  const handleUploadFile = () => {
    if (!pdfFile) {
      toast({
        title: "No file selected!",
        description: "Please select a PDF file before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Simulate file upload logic here
    toast({
      title: "File uploaded!",
      description: "Your file has been successfully uploaded.",
    });

    setUploadDialogOpen(false);
  };

  return (
    <Layout showFAB={isTeacher} onFABClick={() => setDialogOpen(true)}>
      <div className="animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="card-hover">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-lg">{assignment.title}</h3>
                  <div className="flex items-center gap-1 text-gray-500">
                    <CalendarDays className="h-4 w-4" />
                    <span className="text-xs">
                      Due: {formatDate(assignment.dueDate)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-primary font-medium mb-3">
                  {assignment.course}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {assignment.description}
                </p>

                <div className="flex items-center justify-between">
                  <Badge variant="outline">
                    {isTeacher ? "Created by you" : assignment.teacherName}
                  </Badge>

                  <div className="flex items-center gap-2">
                    {assignment.fileUrl ? (
                      // If fileUrl exists, download directly
                      <a
                        href={assignment.fileUrl}
                        download
                        className="flex items-center gap-1"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          {isTeacher ? "Files" : "Download"}
                        </Button>
                      </a>
                    ) : (
                      // If no fileUrl, generate a text file download
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() =>
                          downloadTextFile(
                            `Assignment: ${assignment.title}\n\nCourse: ${assignment.course}\n\nDescription:\n${assignment.description}`,
                            `${assignment.title.replace(/\s+/g, "_")}.txt`
                          )
                        }
                      >
                        <Download className="h-4 w-4" />
                        {isTeacher ? "Files" : "Download"}
                      </Button>
                    )}
                    
                    {!isTeacher && !assignment.submitted && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => setUploadDialogOpen(true)}
                      >
                        <UploadIcon className="h-4 w-4" />
                        Upload
                      </Button>
                    )}
                  </div>
                </div>

                {/* Show Notify button only for students and if not submitted */}
                {!isTeacher && !assignment.submitted && (
                  <Button
                    size="sm"
                    className="mt-3"
                    onClick={() => handleNotifyStudent(assignment.id)}
                    disabled={!notificationEnabled}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notify me
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Assignment Dialog */}
      {isTeacher && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Assignment</DialogTitle>
              <DialogDescription>
                Create a new assignment for your students.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Assignment Title</Label>
                <Input
                  id="title"
                  placeholder="Assignment title"
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="course">Course</Label>
                <Input
                  id="course"
                  placeholder="Course name and code"
                  value={assignmentCourse}
                  onChange={(e) => setAssignmentCourse(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={assignmentDueDate}
                  onChange={(e) => setAssignmentDueDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Assignment description and instructions"
                  value={assignmentDescription}
                  onChange={(e) => setAssignmentDescription(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="file">Attachment (Optional)</Label>
                <Input id="file" type="file" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-gradient-primary hover:opacity-90"
                onClick={handleCreateAssignment}
              >
                Create Assignment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Upload PDF Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Upload PDF</DialogTitle>
            <DialogDescription>Select a PDF file to upload</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="upload">Upload PDF</Label>
              <Input
                id="upload"
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-primary hover:opacity-90"
              onClick={handleUploadFile}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}