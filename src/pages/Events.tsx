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
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);
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

  const toggleDetails = (eventId: number) => {
    setExpandedEventId((prevId) => (prevId === eventId ? null : eventId));
  };

  return (
    <Layout showFAB onFABClick={() => setDialogOpen(true)}>
      <div className="animate-fade-in">
        {/* Category Badges */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.events.map((category) => (
            <Badge
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`cursor-pointer px-4 py-2 rounded-full text-sm ${
                selectedCategory === category
                  ? "bg-gradient-primary hover:opacity-90 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-2xl"
            >
              <CardContent className="p-0 flex flex-col">
                {/* Event Image */}
                <div
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${event.image})` }}
                ></div>
                
                {/* Event Content */}
                <div className="p-6 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl">{event.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {event.category}
                    </Badge>
                  </div>

                  {/* Expand/Collapse Event Details */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      expandedEventId === event.id
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-gray-600 mb-4">{event.description}</p>
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
                  </div>

                  {/* Buttons */}
                  <div className="mt-6 flex justify-between">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleDetails(event.id)}
                      className="rounded-full px-6"
                    >
                      {expandedEventId === event.id
                        ? "Hide Details"
                        : "Show Details"}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-primary hover:opacity-90 rounded-full px-6"
                    >
                      RSVP
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* No Events Found */}
          {filteredEvents.length === 0 && (
            <div className="text-center p-10 col-span-full">
              <p className="text-gray-500">No events found for this category.</p>
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
              <Select onValueChange={setEventCategory} value={eventCategory}>
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
