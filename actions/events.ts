
import { db } from "@/db/drizzle"
import { events, eventApprovals, moderators } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function createEvent(eventData: any) {
  const newEvent = await db
    .insert(events)
    .values({
      ...eventData,
      status: "pending",
    })
    .returning()

  return newEvent[0]
}

export async function getEvents() {
  return db.select().from(events)
}

export async function approveEvent(eventId: string, moderatorId: string) {
  await db.insert(eventApprovals).values({
    eventId,
    moderatorId,
    isApproved: true,
  })

  const approvals = await db.select().from(eventApprovals).where(eq(eventApprovals.eventId, eventId))

  // Check if all moderators have approved
  const allModerators = await db.select().from(moderators)
  if (approvals.length === allModerators.length) {
    await db.update(events).set({ status: "approved" }).where(eq(events.id, eventId))
  }

  return { success: true }
}

