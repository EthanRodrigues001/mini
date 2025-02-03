"use server";

import { events } from "@/db/schema";

import { eventCategoryEnum, eventModeEnum } from "@/db/schema";
import { getLoggedInUser } from "@/actions/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";

const eventSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(eventCategoryEnum.enumValues),
  mode: z.enum(eventModeEnum.enumValues),
  participantRegistration: z.boolean(),
  isPaid: z.boolean(),
  price: z.string().optional(),
  website: z.string().url().optional(),
  dateOfEvent: z.string(),
  logo: z.string().optional(),
  bannerImage: z.string().optional(),
});

export async function createEvent(formData: FormData) {
  try {
    const user = await getLoggedInUser();
    if (!user || user.role !== "organizer") {
      throw new Error("Unauthorized: Only organizers can create events");
    }

    const validatedFields = eventSchema.parse({
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category"),
      mode: formData.get("mode"),
      participantRegistration:
        formData.get("participantRegistration") === "true",
      isPaid: formData.get("isPaid") === "true",
      price: formData.get("price"),
      website: formData.get("website"),
      dateOfEvent: formData.get("dateOfEvent"),
      logo: formData.get("logo"),
      bannerImage: formData.get("bannerImage"),
    });

    // TODO: Handle file uploads for logo and bannerImage
    // For now, we'll just store the file names

    const newEvent = await db
      .insert(events)
      .values({
        ...validatedFields,
        organizerId: user.id,
        status: "pending",
        price: validatedFields.isPaid
          ? Number.parseFloat(validatedFields.price || "0").toString
          : 0,
      })
      .returning();

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Event created successfully",
      event: newEvent[0],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation error",
        errors: error.errors,
      };
    }
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An unexpected error occurred" };
  }
}

export async function getEvents() {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("Unauthorized: User not logged in");
    }

    const userEvents = await db
      .select()
      .from(events)
      .where(eq(events.organizerId, user.id));
    return { success: true, events: userEvents };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An unexpected error occurred" };
  }
}

export async function updateEvent(eventId: string, formData: FormData) {
  try {
    const user = await getLoggedInUser();
    if (!user || user.role !== "organizer") {
      throw new Error("Unauthorized: Only organizers can update events");
    }

    const validatedFields = eventSchema.parse({
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category"),
      mode: formData.get("mode"),
      participantRegistration:
        formData.get("participantRegistration") === "true",
      isPaid: formData.get("isPaid") === "true",
      price: formData.get("price"),
      website: formData.get("website"),
      dateOfEvent: formData.get("dateOfEvent"),
      logo: formData.get("logo"),
      bannerImage: formData.get("bannerImage"),
    });

    // TODO: Handle file uploads for logo and bannerImage
    // For now, we'll just store the file names

    const updatedEvent = await db
      .update(events)
      .set({
        ...validatedFields,
        price: validatedFields.isPaid
          ? Number.parseFloat(validatedFields.price || "0").toString()
          : "0",
      })
      .where(eq(events.id, eventId))
      .returning();

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Event updated successfully",
      event: updatedEvent[0],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation error",
        errors: error.errors,
      };
    }
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An unexpected error occurred" };
  }
}
