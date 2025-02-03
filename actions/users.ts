import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserById(userId: string) {
  try {
    // Query the user by ID
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      return { success: false, error: "User not found." };
    }

    return { success: true, user: user[0] };
  } catch (error) {
    console.error("Get user by ID error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching the user.",
    };
  }
}

export async function getAllUsers() {
  try {
    // Query all users
    const allUsers = await db.select().from(users);

    return { success: true, users: allUsers };
  } catch (error) {
    console.error("Get all users error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching all users.",
    };
  }
}
