
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { studyGroups } from "@/lib/constants";
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
import { Users, Calendar, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StudyGroups() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupCourse, setGroupCourse] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("");
  const { toast } = useToast();

  const handleCreateGroup = () => {
    if (groupName && groupCourse && groupDescription) {
      toast({
        title: "Study group created!",
        description: "Your study group has been created successfully.",
      });
      setDialogOpen(false);
      setGroupName("");
      setGroupCourse("");
      setGroupDescription("");
      setMeetingTime("");
      setMeetingLocation("");
    }
  };

  return (
    <Layout showFAB onFABClick={() => setDialogOpen(true)}>
      <div className="animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyGroups.map((group) => (
            <Card key={group.id} className="card-hover">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-lg">{group.name}</h3>
                  <Badge variant="outline" className="ml-2">
                    <Users className="h-3 w-3 mr-1" />
                    {group.members}
                  </Badge>
                </div>
                <p className="text-sm text-primary font-medium mb-3">
                  {group.course}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {group.description}
                </p>
                {group.meetingTime && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span>{group.meetingTime}</span>
                  </div>
                )}
                {group.meetingLocation && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{group.meetingLocation}</span>
                  </div>
                )}
                <div className="flex items-center justify-between mt-2">
                  <Badge>Created by {group.creator}</Badge>
                  <Button
                    size="sm"
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    Join Group
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Study Group Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Study Group</DialogTitle>
            <DialogDescription>
              Create a new study group for your course.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                placeholder="Study group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course">Course</Label>
              <Input
                id="course"
                placeholder="Course name and code"
                value={groupCourse}
                onChange={(e) => setGroupCourse(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description of your study group"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="meetingTime">Meeting Time (Optional)</Label>
                <Input
                  id="meetingTime"
                  placeholder="e.g., Tuesdays, 7:00 PM"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="meetingLocation">
                  Meeting Location (Optional)
                </Label>
                <Input
                  id="meetingLocation"
                  placeholder="e.g., Library Room 204"
                  value={meetingLocation}
                  onChange={(e) => setMeetingLocation(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-primary hover:opacity-90"
              onClick={handleCreateGroup}
            >
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
