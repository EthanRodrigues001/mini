"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { db } from "@/db/drizzle";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";

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

type ApprovedEventsContextType = {
  approvedEvents: EventType[];
  loading: boolean;
  error: string | null;
  refreshEvents: () => Promise<void>;
};

const ApprovedEventsContext = createContext<
  ApprovedEventsContextType | undefined
>(undefined);

export function ApprovedEventsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [approvedEvents, setApprovedEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApprovedEvents = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedEvents = await db
        .select()
        .from(events)
        .where(eq(events.status, "approved"))
        .then((events) =>
          events.map((event) => ({
            ...event,
            status: event.status || "pending",
            organizerId: event.organizerId || "",
            participantRegistration: event.participantRegistration ?? true,
            featured: event.featured ?? false,
          }))
        );
      setApprovedEvents(fetchedEvents);
      setError(null);
    } catch (err) {
      setError("Failed to fetch approved events");
      console.error("Error fetching approved events:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovedEvents();
  }, [fetchApprovedEvents]);

  const refreshEvents = useCallback(async () => {
    await fetchApprovedEvents();
  }, [fetchApprovedEvents]);

  return (
    <ApprovedEventsContext.Provider
      value={{ approvedEvents, loading, error, refreshEvents }}
    >
      {children}
    </ApprovedEventsContext.Provider>
  );
}

export function useApprovedEvents() {
  const context = useContext(ApprovedEventsContext);
  if (!context) {
    throw new Error(
      "useApprovedEvents must be used within an ApprovedEventsProvider"
    );
  }
  return context;
}
