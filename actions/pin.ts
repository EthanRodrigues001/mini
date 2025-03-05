"use server";

import { db } from "@/db/drizzle";
import { moderators } from "@/db/schema";
import { eq } from "drizzle-orm";
import { decrypt, encrypt } from "./encryption";

const ADMIN_PIN = process.env.ADMIN_PIN || "1234";

export async function validatePin(pin: string) {
  try {
    if (pin === ADMIN_PIN) {
      const encryptedPin = await encrypt(
        JSON.stringify({ pin, type: "admin" })
      );
      return { success: true, type: "admin", encryptedPin };
    }

    const moderator = await db
      .select()
      .from(moderators)
      .where(eq(moderators.pin, pin))
      .limit(1);

    if (moderator.length > 0) {
      const encryptedPin = await encrypt(
        JSON.stringify({ pin, type: "moderator", id: moderator[0].id })
      );
      return { success: true, type: "moderator", encryptedPin };
    }

    return { success: false, error: "Invalid PIN" };
  } catch (error) {
    console.error("PIN validation error:", error);
    return { success: false, error: "An error occurred during validation" };
  }
}

export async function decryptPin(encryptedPin: string) {
  try {
    const decrypted = await decrypt(encryptedPin);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("PIN decryption error:", error);
    throw new Error("Invalid PIN data");
  }
}
