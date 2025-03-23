import { db } from "@/db/drizzle";
import {
  events,
  eventApprovals,
  moderators,
  eventLikes,
  eventRegistrations,
} from "@/db/schema";
import { Event } from "@/types/index";
import { eq, and, desc, sql } from "drizzle-orm";

// Get all approved events
export async function getApprovedEvents() {
  try {
    const approvedEvents = await db
      .select()
      .from(events)
      .where(eq(events.status, "approved"))
      .orderBy(desc(events.createdAt));

    return { success: true, events: approvedEvents };
  } catch (error) {
    console.error("Error fetching approved events:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch events",
    };
  }
}
export async function createEvent(eventData: Event) {
  const newEvent = await db
    .insert(events)
    .values({
      ...eventData,
      status: "pending",
    })
    .returning();

  return newEvent[0];
}

export async function getEvents() {
  return db.select().from(events);
}

export async function approveEvent(eventId: string, moderatorId: string) {
  await db.insert(eventApprovals).values({
    eventId,
    moderatorId,
    isApproved: true,
  });

  const approvals = await db
    .select()
    .from(eventApprovals)
    .where(eq(eventApprovals.eventId, eventId));

  // Check if all moderators have approved
  const allModerators = await db.select().from(moderators);
  if (approvals.length === allModerators.length) {
    await db
      .update(events)
      .set({ status: "approved" })
      .where(eq(events.id, eventId));
  }

  return { success: true };
}

// Get event by ID
export async function getEventById(eventId: string) {
  try {
    const event = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (event.length === 0) {
      return { success: false, error: "Event not found" };
    }

    return { success: true, event: event[0] };
  } catch (error) {
    console.error("Error fetching event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch event",
    };
  }
}

// Like or unlike an event
export async function toggleEventLike(eventId: string, userId: string) {
  try {
    // Check if user already liked the event
    const existingLike = await db
      .select()
      .from(eventLikes)
      .where(
        and(eq(eventLikes.eventId, eventId), eq(eventLikes.userId, userId))
      )
      .limit(1);

    if (existingLike.length > 0) {
      // Unlike the event
      await db.delete(eventLikes).where(eq(eventLikes.id, existingLike[0].id));

      return { success: true, liked: false };
    } else {
      // Like the event
      await db.insert(eventLikes).values({
        eventId,
        userId,
      });

      return { success: true, liked: true };
    }
  } catch (error) {
    console.error("Error toggling event like:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update like status",
    };
  }
}
// Check if user has liked an event
export async function checkEventLike(eventId: string, userId: string) {
  try {
    const like = await db
      .select()
      .from(eventLikes)
      .where(
        and(eq(eventLikes.eventId, eventId), eq(eventLikes.userId, userId))
      )
      .limit(1);

    return { success: true, liked: like.length > 0 };
  } catch (error) {
    console.error("Error checking event like:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to check like status",
    };
  }
}

// Get event like count
export async function getEventLikeCount(eventId: string) {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(eventLikes)
      .where(eq(eventLikes.eventId, eventId));

    return { success: true, count: result[0].count };
  } catch (error) {
    console.error("Error getting event like count:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get like count",
    };
  }
}
export async function registerForEvent(eventId: string, userId: string) {
  try {
    // Check if user is already registered
    const existingRegistration = await db
      .select()
      .from(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventId, eventId),
          eq(eventRegistrations.userId, userId)
        )
      )
      .limit(1);

    if (existingRegistration.length > 0) {
      return {
        success: false,
        error: "You are already registered for this event",
      };
    }

    // Get event details to check if it's paid
    const eventResult = await getEventById(eventId);
    if (!eventResult.success) {
      return eventResult;
    }

    const event = eventResult.event;

    // Create registration
    const registration = await db
      .insert(eventRegistrations)
      .values({
        eventId,
        userId,
        paymentStatus: event && event.isPaid ? false : true, // If paid event, payment status is false initially
      })
      .returning();

    // If it's a paid event, redirect to payment page
    if (event && event.isPaid) {
      return {
        success: true,
        registration: registration[0],
        requiresPayment: true,
      };
    }

    return {
      success: true,
      registration: registration[0],
      requiresPayment: false,
    };
  } catch (error) {
    console.error("Error registering for event:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to register for event",
    };
  }
}

// Process payment for an event
export async function processEventPayment(
  registrationId: string,
  txnId: string
) {
  try {
    const updatedRegistration = await db
      .update(eventRegistrations)
      .set({
        paymentStatus: true,
        txnId,
      })
      .where(eq(eventRegistrations.id, registrationId))
      .returning();

    if (updatedRegistration.length === 0) {
      return { success: false, error: "Registration not found" };
    }
    return { success: true, registration: updatedRegistration[0] };
  } catch (error) {
    console.error("Error processing payment:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to process payment",
    };
  }
}

// Get user registrations with event details
export async function getUserRegistrations(userId: string) {
  try {
    const registrations = await db
      .select({
        id: eventRegistrations.id,
        eventId: eventRegistrations.eventId,
        userId: eventRegistrations.userId,
        registeredAt: eventRegistrations.registeredAt,
        paymentStatus: eventRegistrations.paymentStatus,
        txnId: eventRegistrations.txnId,
        event: events,
      })
      .from(eventRegistrations)
      .leftJoin(events, eq(eventRegistrations.eventId, events.id))
      .where(eq(eventRegistrations.userId, userId))
      .orderBy(desc(eventRegistrations.registeredAt));

    return { success: true, registrations };
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch registrations",
    };
  }
}
