"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Filter, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Upcoming Events
            </h1>
            <p className="text-muted-foreground">
              Discover what&apos;s happening on campus
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex w-full md:w-auto gap-4">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search events..." className="pl-10" />
            </div>
            <Button variant="outline" className="shrink-0">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
        {/* Categories */}
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
        {/* Events Grid */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 })
            .filter(
              (_, i) =>
                selectedCategory === "All" ||
                categories[1 + (i % (categories.length - 1))] ===
                  selectedCategory
            )
            .map((_, i) => (
              <Card
                key={i}
                className="group hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {categories[1 + (i % (categories.length - 1))]}
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
                      {
                        [
                          "Tech Workshop",
                          "Cultural Night",
                          "Sports Tournament",
                          "AI Seminar",
                          "Coding Contest",
                          "Music Festival",
                        ][i]
                      }
                    </h3>
                    <p className="text-muted-foreground line-clamp-2">
                      Join us for an exciting event filled with learning, fun,
                      and networking opportunities.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Main Auditorium</span>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t">
                    <div className="flex -space-x-2">
                      {Array.from({ length: 3 }).map((_, j) => (
                        <div
                          key={j}
                          className="h-8 w-8 rounded-full border-2 border-background bg-muted"
                        />
                      ))}
                    </div>
                    <Link href={"/events/test"}>
                      <Button>Register</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </main>
  );
}
