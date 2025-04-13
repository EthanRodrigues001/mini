"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Globe, Heart, MapPin, Share2, Loader2 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

import { toast } from "sonner";
import {
  getEventById,
  checkEventLike,
  toggleEventLike,
  getEventLikeCount,
  hasRegistered,
} from "@/actions/events";
import type { Event } from "@/types/index";
import { EventRegistrationDialog } from "@/components/event-registration-dialog";

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const result = await getEventById(params.id as string);

        if (result.success && result.event) {
          setEvent(result.event);

          // Check if user has liked this event
          if (user) {
            const likeResult = await checkEventLike(result.event.id, user.id);
            if (likeResult.success) {
              setIsLiked(likeResult.liked ?? false);
            }
          }

          // Get like count
          const countResult = await getEventLikeCount(result.event.id);
          if (countResult.success) {
            setLikeCount(countResult.count ?? 0);
          }
        } else {
          toast("Error", {
            description: result.error || "Failed to load event",
          });
          router.push("/events");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        toast("Error", {
          description: "An unexpected error occurred",
        });
        router.push("/events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    // Check if user has registered for the event
    const hasRegisteredForEvent = async () => {
      try {
        const result = await hasRegistered(params.id as string, user?.id || "");

        if (result) {
          setIsRegistered(true);
        }
      } catch (error) {
        console.error("Error checking if user has registered:", error);
        toast("Error", {
          description: "An unexpected error occurred",
        });
      }
    };
    hasRegisteredForEvent();
  }, [params.id, user, router]);

  const handleLikeToggle = async () => {
    if (!user) {
      toast("Authentication required", {
        description: "Please sign in to like events",
      });
      router.push("/sign-in");
      return;
    }

    if (!event) return;

    try {
      setLikeLoading(true);
      const result = await toggleEventLike(event.id, user.id);

      if (result.success) {
        setIsLiked(result.liked ?? false);
        setLikeCount((prev) => (result.liked ? prev + 1 : prev - 1));
      } else {
        toast("Error", {
          description: result.error || "Failed to update like status",
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast("Error", {
        description: "An unexpected error occurred",
      });
    } finally {
      setLikeLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: event?.name || "Event",
          text: `Check out this event: ${event?.name}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast("Copied", {
        description: "Event link copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12">
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-4">Event not found</h1>
            <p className="text-muted-foreground mb-6">
              The event you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Button onClick={() => router.push("/events")}>
              Browse Events
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="relative h-[400px] bg-gradient-to-b from-primary/5 to-primary/20">
        <img
          src={
            event.bannerImage ||
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d" ||
            "/placeholder.svg" ||
            "/placeholder.svg"
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
                  src={event.logo || "/placeholder.svg?height=96&width=96"}
                  alt={`${event.name} logo`}
                  className="w-24 h-24 rounded-lg border"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold">{event.name}</h1>
                      <p className="text-muted-foreground">
                        Organized by {event.organizerId}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant={isLiked ? "default" : "ghost"}
                        onClick={handleLikeToggle}
                        disabled={likeLoading}
                        title={isLiked ? "Unlike" : "Like"}
                      >
                        {likeLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Heart
                            className={`h-5 w-5 ${
                              isLiked ? "fill-current" : ""
                            }`}
                          />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Share"
                        onClick={handleShare}
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline">{likeCount} likes</Badge>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="secondary">{event.category}</Badge>
                    {event.mode && (
                      <Badge variant="secondary">{event.mode}</Badge>
                    )}
                    {event.status && (
                      <Badge
                        variant={
                          event.status === "approved"
                            ? "default"
                            : event.status === "pending"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {event.status}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.mode === "online" ? "Online" : "On Campus"}
                    </div>
                    {event.dateOfEvent && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {event.dateOfEvent}
                      </div>
                    )}
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

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full justify-start">
                <TabsTrigger value="details">Details</TabsTrigger>
                {/* Only show relevant tabs */}
              </TabsList>

              <TabsContent value="details" className="mt-6">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    About the Event
                  </h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {event.description ||
                      "No description provided for this event."}
                  </p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="text-2xl font-bold">
                  {event.isPaid ? `₹ ${event.price}` : "Free"}
                </div>
                <Badge
                  variant={
                    event.participantRegistration ? "default" : "secondary"
                  }
                  className="uppercase"
                >
                  Registration{" "}
                  {event.participantRegistration ? "Open" : "Closed"}
                </Badge>
              </div>

              <Button
                className="w-full mb-4"
                size="lg"
                disabled={
                  !event.participantRegistration ||
                  !user ||
                  event.status !== "approved" ||
                  isRegistered
                }
                onClick={() => setIsRegistrationOpen(true)}
              >
                {!user
                  ? "Sign in to Register"
                  : !event.participantRegistration
                  ? "Registration Closed"
                  : event.status !== "approved"
                  ? "Event Pending Approval"
                  : !isRegistered
                  ? "Register Now"
                  : "Registered"}
              </Button>

              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Event Type</span>
                  <span className="font-medium">{event.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Mode</span>
                  <span className="font-medium">
                    {event.mode || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">
                    {event.dateOfEvent || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium capitalize">
                    {event.status || "pending"}
                  </span>
                </div>
              </div>
            </Card>

            {event.isPaid && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Payment Information
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-center">
                    {event.qrImage ? (
                      <img
                        src={event.qrImage || "/placeholder.svg"}
                        alt="Payment QR Code"
                        className="max-w-[200px] h-auto border rounded-md"
                      />
                    ) : (
                      <div className="bg-muted w-[200px] h-[200px] rounded-md flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                          QR Code not available
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    Scan the QR code to make payment of ₹{event.price}
                  </p>
                  <p className="text-xs text-center text-muted-foreground">
                    After payment, you&apos;ll need to provide the transaction
                    ID during registration
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Event Registration Dialog */}
      <EventRegistrationDialog
        eventId={event.id}
        eventName={event.name}
        isPaid={!!event.isPaid}
        price={event.price?.toString() || ""}
        qrImage={event.qrImage || ""}
        isOpen={isRegistrationOpen}
        onOpenChange={setIsRegistrationOpen}
      />
    </main>
  );
}
