import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Globe, Heart, MapPin, Share2 } from "lucide-react";

export default function EventPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative h-[400px] bg-gradient-to-b from-primary/5 to-primary/20">
        <img
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
          alt="Event cover"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 -mt-32 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6">
              <div className="flex gap-4">
                <img
                  src="/placeholder.svg?height=100&width=100"
                  alt="Event logo"
                  className="w-24 h-24 rounded-lg border"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold">
                        Tech Hackathon 2024
                      </h1>
                      <p className="text-muted-foreground">
                        Organized by IEEE Student Branch
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
                    <Badge variant="secondary">Hackathon</Badge>
                    <Badge variant="secondary">Coding Challenge</Badge>
                    <Badge variant="secondary">Workshop</Badge>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Main Campus Auditorium
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Feb 15-16, 2024
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <a href="#" className="hover:underline">
                        Visit website
                      </a>
                    </div>
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
                  <p className="text-muted-foreground">
                    Join us for an exciting 24-hour hackathon where you&apos;ll
                    work on innovative solutions to real-world problems. This
                    event brings together creative minds, technical expertise,
                    and entrepreneurial spirit.
                  </p>

                  <h3 className="text-lg font-semibold mt-6 mb-3">
                    What to expect
                  </h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>24 hours of intensive coding and problem-solving</li>
                    <li>Mentorship from industry experts</li>
                    <li>Workshops on cutting-edge technologies</li>
                    <li>Networking opportunities</li>
                    <li>Amazing prizes worth ₹1,50,000</li>
                  </ul>
                </Card>
              </div>
            </Tabs>
          </div>

          {/* Right Column - Registration Card */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="text-2xl font-bold">₹ 400</div>
                <Badge variant="default" className="uppercase">
                  Registration Open
                </Badge>
              </div>

              <Button className="w-full mb-4" size="lg">
                Register Now
              </Button>

              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Registered</span>
                  <span className="font-medium">1,378</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Team Size</span>
                  <span className="font-medium">3 - 4 Members</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Impressions</span>
                  <span className="font-medium">44,804</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">
                    Registration Deadline
                  </span>
                  <span className="font-medium">Jan 20, 2024</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Organizer</h3>
              <div className="flex items-center gap-3">
                <img
                  src="/placeholder.svg?height=40&width=40"
                  alt="Organizer logo"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium">IEEE Student Branch</p>
                  <p className="text-sm text-muted-foreground">
                    Technical Club
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
