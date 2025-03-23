"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import { getUserRegistrations } from "@/actions/events";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type EventRegistration = {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: Date;
  paymentStatus: boolean | null;
  txnId: string | null;
  event: {
    id: string;
    name: string;
    description: string | null;
    status: "pending" | "approved" | "cancelled";
    category: string;
    mode: "online" | "offline" | null;
    dateOfEvent: string | null;
    isPaid: boolean | null;
    price: string | null;
  };
};

export default function MyEventsPage() {
  const { user } = useUser();
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const result = await getUserRegistrations(user.id);
        if (result.success && result.registrations) {
          setRegistrations(result.registrations);
        } else {
          toast({
            title: "Error",
            description:
              result.error || "Failed to fetch your event registrations",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching registrations:", error);
        toast({
          title: "Error",
          description:
            "An unexpected error occurred while fetching your registrations",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto py-12">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
            <p className="text-muted-foreground mb-6">
              You need to be signed in to view your events
            </p>
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role !== "student") {
    router.push("/");
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredRegistrations =
    activeTab === "all"
      ? registrations
      : activeTab === "paid"
      ? registrations.filter((reg) => reg.event.isPaid)
      : registrations.filter((reg) => !reg.event.isPaid);

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Events</h1>
        <p className="text-muted-foreground">Manage your event registrations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="paid">Paid Events</TabsTrigger>
          <TabsTrigger value="free">Free Events</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredRegistrations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-semibold mb-4">No events found</h2>
            <p className="text-muted-foreground mb-6">
              You haven&apos;t registered for any events yet
            </p>
            <Link href="/events">
              <Button>Browse Events</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegistrations.map((registration) => (
            <Card key={registration.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="secondary">
                    {registration.event.category}
                  </Badge>
                  {registration.event.isPaid && (
                    <Badge
                      variant={
                        registration.paymentStatus ? "default" : "destructive"
                      }
                    >
                      {registration.paymentStatus ? "Paid" : "Payment Pending"}
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-2">
                  {registration.event.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {registration.event.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-col space-y-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {registration.event.dateOfEvent || "Date not specified"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {registration.event.mode || "Mode not specified"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex justify-between items-center w-full">
                  <div className="text-sm text-muted-foreground">
                    Registered on{" "}
                    {new Date(registration.registeredAt).toLocaleDateString()}
                  </div>
                  <Link href={`/events/${registration.eventId}`}>
                    <Button variant="outline" size="sm">
                      View Event
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
