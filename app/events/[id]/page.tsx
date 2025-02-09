"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Globe, Heart, MapPin, Share2 } from "lucide-react";
import { useApprovedEvents } from "@/contexts/ApprovedEventsContext";

type EventType = {
  id: string;
  name: string;
  description: string | null;
  status: "pending" | "cancelled" | "approved";
  logo: string | null;
  bannerImage: string | null;
  organizerId: string;
  participantRegistration: boolean;
  category: "technical" | "cultural" | "sports" | "workshop" | "seminar";
  featured: boolean;
  mode: "offline" | "online" | null;
  website: string | null;
  isPaid: boolean | null;
  price: string | null;
  dateOfEvent: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export default function EventPage() {
  const params = useParams();
  const { approvedEvents } = useApprovedEvents();
  const [event, setEvent] = useState<EventType | null>(null);

  useEffect(() => {
    const currentEvent = approvedEvents.find((e) => e.id === params.id);
    if (currentEvent) {
      setEvent(currentEvent);
    }
  }, [approvedEvents, params.id]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="relative h-[400px] bg-gradient-to-b from-primary/5 to-primary/20">
        <img
          src={
            // event.bannerImage ||
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
          }
          alt={`${event.name} cover`}
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto px-6 -mt-32 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6">
              <div className="flex gap-4">
                <img
                  src={event.logo || "/placeholder.svg"}
                  alt={`${event.name} logo`}
                  className="w-24 h-24 rounded-lg border"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold">{event.name}</h1>
                      <p className="text-muted-foreground">
                        {event.organizerId}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost">
                        <Heart className="h-5 w-5" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="secondary">{event.category}</Badge>
                    <Badge variant="secondary">{event.mode}</Badge>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.mode === "online" ? "Online" : "On Campus"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {event.dateOfEvent}
                    </div>
                    {event.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <a
                          href={event.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Visit website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="prizes">Prizes</TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
              </TabsList>
              <div className="mt-6">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    About the Event
                  </h2>
                  <p className="text-muted-foreground">{event.description}</p>
                </Card>
              </div>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="text-2xl font-bold">
                  {event.isPaid ? `₹ ${event.price}` : "Free"}
                </div>
                <Badge variant="default" className="uppercase">
                  Registration{" "}
                  {event.participantRegistration ? "Open" : "Closed"}
                </Badge>
              </div>

              <Button
                className="w-full mb-4"
                size="lg"
                disabled={!event.participantRegistration}
              >
                Register Now
              </Button>

              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Event Type</span>
                  <span className="font-medium">{event.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Mode</span>
                  <span className="font-medium">{event.mode}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{event.dateOfEvent}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
