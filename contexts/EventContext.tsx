"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useUser } from "./UserContext";
import { getEvents } from "@/actions/event";

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

type EventContextType = {
  events: EventType[];
  loading: boolean;
  error: string | null;
  refreshEvents: () => Promise<void>;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const fetchEvents = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const fetchedEvents = await getEvents(user.id);
      setEvents(fetchedEvents);
      setError(null);
    } catch (err) {
      setError("Failed to fetch events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const refreshEvents = useCallback(async () => {
    await fetchEvents();
  }, [fetchEvents]);

  return (
    <EventContext.Provider value={{ events, loading, error, refreshEvents }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
}
