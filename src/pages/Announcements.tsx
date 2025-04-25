
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { announcements, categories } from "@/lib/constants";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export default function Announcements() {
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [announcementCategory, setAnnouncementCategory] = useState("");
  const { toast } = useToast();

  const isTeacher = currentUser?.role === "teacher";

  const filteredAnnouncements = announcements.filter((announcement) => {
    if (selectedCategory === "All") return true;
    return announcement.category === selectedCategory;
  });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCreateAnnouncement = () => {
    if (announcementTitle && announcementContent && announcementCategory) {
      toast({
        title: "Announcement created!",
        description: "Your announcement has been published.",
      });
      setDialogOpen(false);
      setAnnouncementTitle("");
      setAnnouncementContent("");
      setAnnouncementCategory("");
    }
  };

  return (
    <Layout showFAB={isTeacher} onFABClick={() => setDialogOpen(true)}>
      <div className="animate-fade-in">
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.announcements.map((category) => (
            <Badge
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`cursor-pointer ${
                selectedCategory === category
                  ? "bg-gradient-primary hover:opacity-90"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="overflow-hidden card-hover">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg mb-1">
                        {announcement.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={announcement.authorAvatar}
                            alt={announcement.author}
                          />
                          <AvatarFallback>
                            {announcement.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{announcement.author}</span>
                        <span>•</span>
                        <span>{formatDate(announcement.date)}</span>
                      </div>
                    </div>
                    <Badge variant="outline">{announcement.category}</Badge>
                  </div>
                  <p className="text-gray-600">{announcement.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredAnnouncements.length === 0 && (
            <div className="text-center p-10">
              <p className="text-gray-500">
                No announcements found for this category.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Announcement Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
            <DialogDescription>
              Post a new announcement to the campus community.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Announcement title"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={setAnnouncementCategory}
                value={announcementCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.announcements
                    .filter((cat) => cat !== "All")
                    .map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Announcement details"
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-primary hover:opacity-90"
              onClick={handleCreateAnnouncement}
            >
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
