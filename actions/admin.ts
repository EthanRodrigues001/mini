"use server";

import { db } from "@/db/drizzle";
import {
  users,
  moderators,
  events,
  eventApprovals,
  eventRegistrations,
  eventLikes,
} from "@/db/schema";
import { eq, count } from "drizzle-orm";
import type {
  CreateUserInput,
  UpdateUserInput,
  CreateModeratorInput,
  UpdateModeratorInput,
  UpdateEventInput,
} from "@/types";
import { revalidatePath } from "next/cache";

// User Management Functions
export async function createUser(input: CreateUserInput) {
  try {
    const newUser = await db.insert(users).values(input).returning();

    revalidatePath("/pin/admin");
    return { success: true, user: newUser[0] };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create user",
    };
  }
}

export async function updateUser(userId: string, input: UpdateUserInput) {
  try {
    const updatedUser = await db
      .update(users)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    if (updatedUser.length === 0) {
      return { success: false, error: "User not found" };
    }

    revalidatePath("/pin/admin");
    return { success: true, user: updatedUser[0] };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user",
    };
  }
}

export async function deleteUser(userId: string) {
  try {
    // First, delete related records
    await db
      .delete(eventRegistrations)
      .where(eq(eventRegistrations.userId, userId));
    await db.delete(eventLikes).where(eq(eventLikes.userId, userId));

    // Then delete the user
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    if (deletedUser.length === 0) {
      return { success: false, error: "User not found" };
    }

    revalidatePath("/pin/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete user",
    };
  }
}

// Moderator Management Functions
export async function createModerator(input: CreateModeratorInput) {
  try {
    const newModerator = await db.insert(moderators).values(input).returning();

    revalidatePath("/pin/admin");
    return { success: true, moderator: newModerator[0] };
  } catch (error) {
    console.error("Error creating moderator:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create moderator",
    };
  }
}

export async function updateModerator(
  moderatorId: string,
  input: UpdateModeratorInput
) {
  try {
    const updatedModerator = await db
      .update(moderators)
      .set(input)
      .where(eq(moderators.id, moderatorId))
      .returning();

    if (updatedModerator.length === 0) {
      return { success: false, error: "Moderator not found" };
    }

    revalidatePath("/pin/admin");
    return { success: true, moderator: updatedModerator[0] };
  } catch (error) {
    console.error("Error updating moderator:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update moderator",
    };
  }
}

export async function deleteModerator(moderatorId: string) {
  try {
    // First, delete related records
    await db
      .delete(eventApprovals)
      .where(eq(eventApprovals.moderatorId, moderatorId));

    // Then delete the moderator
    const deletedModerator = await db
      .delete(moderators)
      .where(eq(moderators.id, moderatorId))
      .returning();

    if (deletedModerator.length === 0) {
      return { success: false, error: "Moderator not found" };
    }

    revalidatePath("/pin/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting moderator:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete moderator",
    };
  }
}

export async function getAllModerators() {
  try {
    const allModerators = await db.select().from(moderators);
    return { success: true, moderators: allModerators };
  } catch (error) {
    console.error("Error fetching moderators:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch moderators",
    };
  }
}

// Event Management Functions
export async function getAllEvents() {
  try {
    const allEvents = await db.select().from(events);
    return { success: true, events: allEvents };
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch events",
    };
  }
}

export async function updateEvent(eventId: string, input: UpdateEventInput) {
  try {
    const updatedEvent = await db
      .update(events)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(events.id, eventId))
      .returning();

    if (updatedEvent.length === 0) {
      return { success: false, error: "Event not found" };
    }

    revalidatePath("/pin/admin");
    return { success: true, event: updatedEvent[0] };
  } catch (error) {
    console.error("Error updating event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update event",
    };
  }
}

export async function deleteEvent(eventId: string) {
  try {
    // First, delete related records
    await db.delete(eventApprovals).where(eq(eventApprovals.eventId, eventId));
    await db
      .delete(eventRegistrations)
      .where(eq(eventRegistrations.eventId, eventId));
    await db.delete(eventLikes).where(eq(eventLikes.eventId, eventId));

    // Then delete the event
    const deletedEvent = await db
      .delete(events)
      .where(eq(events.id, eventId))
      .returning();

    if (deletedEvent.length === 0) {
      return { success: false, error: "Event not found" };
    }

    revalidatePath("/pin/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete event",
    };
  }
}

export async function toggleEventFeatured(eventId: string) {
  try {
    // First, get the current featured status
    const event = await db
      .select({ featured: events.featured })
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (event.length === 0) {
      return { success: false, error: "Event not found" };
    }

    // Toggle the featured status
    const updatedEvent = await db
      .update(events)
      .set({
        featured: !event[0].featured,
        updatedAt: new Date(),
      })
      .where(eq(events.id, eventId))
      .returning();

    revalidatePath("/pin/admin");
    return { success: true, event: updatedEvent[0] };
  } catch (error) {
    console.error("Error toggling event featured status:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update event featured status",
    };
  }
}

export async function getModeratorApprovalStats() {
  try {
    const result = await db
      .select({
        moderatorId: eventApprovals.moderatorId,
        moderatorName: moderators.name,
        moderatorEmail: moderators.email,
        approvalCount: count(eventApprovals.id),
      })
      .from(eventApprovals)
      .leftJoin(moderators, eq(eventApprovals.moderatorId, moderators.id))
      .where(eq(eventApprovals.isApproved, true))
      .groupBy(eventApprovals.moderatorId, moderators.name, moderators.email);

    return { success: true, stats: result };
  } catch (error) {
    console.error("Error fetching moderator approval stats:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch moderator approval stats",
    };
  }
}
