import { db } from "@/db/drizzle";
import { events } from "@/db/schema";

export const createEvent = async (formData: FormData, user: { id: string }) => {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as
    | "technical"
    | "cultural"
    | "sports"
    | "workshop"
    | "seminar";
  const mode = formData.get("mode") as "offline" | "online";
  const participantRegistration =
    formData.get("participantRegistration") === "true";
  const website = formData.get("website") as string;
  const isPaid = formData.get("isPaid") === "true";
  const price = isPaid
    ? (parseFloat(formData.get("price") as string) || 0).toString()
    : "0";

  try {
    const newEvent = await db
      .insert(events)
      .values({
        name,
        description,
        category,
        mode,
        participantRegistration,
        website,
        isPaid,
        price,
        organizerId: user.id,
      })
      .returning();

    return { success: true, event: newEvent[0] };
  } catch (error) {
    console.error("Error creating event:", error);
    return { error: "Failed to create event" };
  }
};
