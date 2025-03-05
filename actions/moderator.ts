"use server";

import { db } from "@/db/drizzle";
import { events, eventApprovals, moderators } from "@/db/schema";
import { eq, and, count, sql } from "drizzle-orm";
import type { EventWithApprovals } from "@/types";
import { revalidatePath } from "next/cache";

// Get all pending events for moderator approval
export async function getPendingEvents(moderatorId: string) {
  try {
    // Get total number of moderators
    const moderatorCount = await db.select({ count: count() }).from(moderators);

    const totalModerators = moderatorCount[0].count;

    // Get all pending events
    const pendingEvents = await db
      .select({
        event: events,
        approvalCount: count(eventApprovals.id).as("approvalCount"),
        isApprovedByCurrentModerator: sql<boolean>`
          EXISTS (
            SELECT 1 FROM ${eventApprovals}
            WHERE ${eventApprovals.eventId} = ${events.id}
            AND ${eventApprovals.moderatorId} = ${moderatorId}
            AND ${eventApprovals.isApproved} = true
          )
        `.as("isApprovedByCurrentModerator"),
      })
      .from(events)
      .leftJoin(
        eventApprovals,
        and(
          eq(events.id, eventApprovals.eventId),
          eq(eventApprovals.isApproved, true)
        )
      )
      .where(eq(events.status, "pending"))
      .groupBy(events.id);

    // Transform the result to include approval information
    const eventsWithApprovals: EventWithApprovals[] = pendingEvents.map(
      (item) => ({
        ...item.event,
        approvals: Number(item.approvalCount),
        totalModerators,
        isApprovedByCurrentModerator: item.isApprovedByCurrentModerator,
      })
    );

    return { success: true, events: eventsWithApprovals };
  } catch (error) {
    console.error("Error fetching pending events:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch pending events",
    };
  }
}

// Approve an event
export async function approveEvent(eventId: string, moderatorId: string) {
  try {
    // Check if the moderator has already approved this event
    const existingApproval = await db
      .select()
      .from(eventApprovals)
      .where(
        and(
          eq(eventApprovals.eventId, eventId),
          eq(eventApprovals.moderatorId, moderatorId)
        )
      )
      .limit(1);

    if (existingApproval.length > 0) {
      // Update existing approval
      await db
        .update(eventApprovals)
        .set({
          isApproved: true,
          approvedAt: new Date(),
        })
        .where(eq(eventApprovals.id, existingApproval[0].id));
    } else {
      // Create new approval
      await db.insert(eventApprovals).values({
        eventId,
        moderatorId,
        isApproved: true,
      });
    }

    // Check if all moderators have approved
    const moderatorCount = await db.select({ count: count() }).from(moderators);

    const totalModerators = moderatorCount[0].count;

    const approvalCount = await db
      .select({ count: count() })
      .from(eventApprovals)
      .where(
        and(
          eq(eventApprovals.eventId, eventId),
          eq(eventApprovals.isApproved, true)
        )
      );

    const totalApprovals = approvalCount[0].count;

    // If all moderators have approved, update event status
    if (totalApprovals >= totalModerators) {
      await db
        .update(events)
        .set({
          status: "approved",
          updatedAt: new Date(),
        })
        .where(eq(events.id, eventId));
    }

    revalidatePath("/pin/moderator");
    return { success: true };
  } catch (error) {
    console.error("Error approving event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to approve event",
    };
  }
}

// Reject an event
export async function rejectEvent(eventId: string, moderatorId: string) {
  try {
    // Check if the moderator has already reviewed this event
    const existingApproval = await db
      .select()
      .from(eventApprovals)
      .where(
        and(
          eq(eventApprovals.eventId, eventId),
          eq(eventApprovals.moderatorId, moderatorId)
        )
      )
      .limit(1);

    if (existingApproval.length > 0) {
      // Update existing approval to rejected
      await db
        .update(eventApprovals)
        .set({
          isApproved: false,
          approvedAt: new Date(),
        })
        .where(eq(eventApprovals.id, existingApproval[0].id));
    } else {
      // Create new rejection
      await db.insert(eventApprovals).values({
        eventId,
        moderatorId,
        isApproved: false,
      });
    }

    // Update event status to cancelled
    await db
      .update(events)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(events.id, eventId));

    revalidatePath("/pin/moderator");
    return { success: true };
  } catch (error) {
    console.error("Error rejecting event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reject event",
    };
  }
}

// Get moderator's approval history
export async function getModeratorApprovalHistory(moderatorId: string) {
  try {
    const approvalHistory = await db
      .select({
        approval: eventApprovals,
        event: events,
      })
      .from(eventApprovals)
      .leftJoin(events, eq(eventApprovals.eventId, events.id))
      .where(eq(eventApprovals.moderatorId, moderatorId))
      .orderBy(sql`${eventApprovals.approvedAt} DESC`);

    return {
      success: true,
      history: approvalHistory.map((item) => ({
        ...item.approval,
        event: item.event,
      })),
    };
  } catch (error) {
    console.error("Error fetching approval history:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch approval history",
    };
  }
}

// Get event approval status
export async function getEventApprovalStatus(eventId: string) {
  try {
    // Get total number of moderators
    const moderatorCount = await db.select({ count: count() }).from(moderators);

    const totalModerators = moderatorCount[0].count;

    // Get approvals for this event
    const approvals = await db
      .select({
        moderator: moderators,
        approval: eventApprovals,
      })
      .from(eventApprovals)
      .leftJoin(moderators, eq(eventApprovals.moderatorId, moderators.id))
      .where(eq(eventApprovals.eventId, eventId));

    // Get event details
    const eventDetails = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (eventDetails.length === 0) {
      return { success: false, error: "Event not found" };
    }

    return {
      success: true,
      event: eventDetails[0],
      approvals: approvals.map((item) => ({
        moderator: item.moderator,
        isApproved: item.approval.isApproved,
        approvedAt: item.approval.approvedAt,
      })),
      totalModerators,
      pendingApprovals: totalModerators - approvals.length,
    };
  } catch (error) {
    console.error("Error fetching event approval status:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch event approval status",
    };
  }
}
