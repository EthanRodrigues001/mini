import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  MapPin,
  Search,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/5 to-primary/20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        <div className="relative z-10 text-center space-y-6 p-6 max-w-4xl mt-24 mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold">
            Discover Amazing College Events
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Join workshops, seminars, and exciting events happening at your
            campus
          </p>
          <div className="max-w-md mx-auto w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>
          <Button size="lg" className="mt-4">
            Explore All Events
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              "Technical",
              "Cultural",
              "Sports",
              "Workshop",
              "Seminar",
              "Hackathon",
            ].map((category) => (
              <Card
                key={category}
                className="p-6 text-center hover:border-primary transition-colors cursor-pointer group"
              >
                <h3 className="font-medium group-hover:text-primary transition-colors">
                  {category}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">12 Events</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Events</h2>
              <p className="text-muted-foreground">
                Don&apos;t miss out on these highlights
              </p>
            </div>
            <Button variant="outline">View All</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, i) => (
              <Card key={i} className="group overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={`https://source.unsplash.com/random/800x600?tech,event&${i}`}
                    alt="Event cover"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <Badge className="absolute top-4 right-4">Featured</Badge>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Tech Summit {2024 + i}
                      </h3>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>Mar {15 + i}, 2024</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Join us for an exciting day of innovation, learning, and
                    networking.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>Main Auditorium</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Users className="h-4 w-4" />
                      <span>120 Registered</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Timeline */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12">Upcoming Events</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <Card key={i} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="shrink-0 text-center md:text-left">
                    <div className="text-2xl font-bold">MAR</div>
                    <div className="text-3xl font-bold text-primary">
                      {15 + i}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">
                          Annual Tech Fest
                        </h3>
                        <p className="text-muted-foreground">
                          Department of Computer Engineering
                        </p>
                      </div>
                      <Button>Register Now</Button>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Main Auditorium
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        250 Seats
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        9:00 AM - 5:00 PM
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/events">
              <Button variant="outline" size="lg">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Event Suggestions */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              What events would you like to see?
            </h2>
            <p className="text-muted-foreground mb-8">
              Help us organize events that interest you by sharing your
              preferences
            </p>
            <div className="flex gap-4 justify-center">
              <Input placeholder="Share your ideas..." className="max-w-md" />
              <Button>Submit</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated with Latest Events
            </h2>
            <p className="mb-8">
              Subscribe to our newsletter and never miss an exciting event on
              campus!
            </p>
            <div className="flex gap-4 justify-center">
              <Input
                placeholder="Enter your email"
                className="max-w-md bg-primary-foreground text-primary"
              />
              <Button variant="secondary">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
