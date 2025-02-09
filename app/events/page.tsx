"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Filter, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useApprovedEvents } from "@/contexts/ApprovedEventsContext";

const categories = [
  "All",
  "Technical",
  "Cultural",
  "Sports",
  "Workshop",
  "Seminar",
];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { approvedEvents, loading } = useApprovedEvents();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = approvedEvents
    .filter(
      (event) =>
        selectedCategory === "All" ||
        event.category.toLowerCase() === selectedCategory.toLowerCase()
    )
    .filter((event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Upcoming Events
            </h1>
            <p className="text-muted-foreground">
              Discover what&apos;s happening on campus
            </p>
          </div>

          <div className="flex w-full md:w-auto gap-4">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="shrink-0">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <Tabs defaultValue="All" className="mb-12">
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {loading ? (
          <div>Loading events...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="group hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {event.category}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {event.name}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">
                      {event.mode === "online" ? "Online" : "On Campus"}
                    </span>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t">
                    <div className="text-sm text-muted-foreground">
                      {event.dateOfEvent}
                    </div>
                    <Link href={`/events/${event.id}`}>
                      <Button>Register</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
