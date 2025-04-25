
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
import { CalendarDays, Download } from "lucide-react";
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
  const { toast } = useToast();

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
                    {assignment.fileUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
                        {isTeacher ? "Files" : "Download"}
                      </Button>
                    )}
                    {!isTeacher && (
                      <Button
                        size="sm"
                        className="bg-gradient-primary hover:opacity-90"
                      >
                        Submit
                      </Button>
                    )}
                  </div>
                </div>
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
    </Layout>
  );
}
