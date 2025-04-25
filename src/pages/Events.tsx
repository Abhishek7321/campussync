
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { events, categories } from "@/lib/constants";
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
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const { toast } = useToast();

  const filteredEvents = events.filter((event) => {
    if (selectedCategory === "All") return true;
    return event.category === selectedCategory;
  });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCreateEvent = () => {
    if (
      eventTitle &&
      eventDescription &&
      eventCategory &&
      eventDate &&
      eventTime &&
      eventLocation
    ) {
      toast({
        title: "Event created!",
        description: "Your event has been published.",
      });
      setDialogOpen(false);
      setEventTitle("");
      setEventDescription("");
      setEventCategory("");
      setEventDate("");
      setEventTime("");
      setEventLocation("");
    }
  };

  return (
    <Layout showFAB onFABClick={() => setDialogOpen(true)}>
      <div className="animate-fade-in">
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.events.map((category) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden card-hover">
              <CardContent className="p-0">
                <div
                  className="h-40 bg-cover bg-center"
                  style={{ backgroundImage: `url(${event.image})` }}
                ></div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-lg">{event.title}</h3>
                    <Badge variant="outline">{event.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {event.description}
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      RSVP
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredEvents.length === 0 && (
            <div className="text-center p-10 col-span-full">
              <p className="text-gray-500">
                No events found for this category.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Event Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
            <DialogDescription>
              Create a new event for the campus community.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                placeholder="Event title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={setEventCategory}
                value={eventCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.events
                    .filter((cat) => cat !== "All")
                    .map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Event location"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Event description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-primary hover:opacity-90"
              onClick={handleCreateEvent}
            >
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
