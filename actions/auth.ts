"use server";

import { ID, OAuthProvider } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/server/appwrite";
import { cookies, headers } from "next/headers";
import { db } from "@/db/drizzle";
import { users,moderators } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs"

export const getUserDetails = async (userId: string) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, userId));
    return user[0] || null;
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (email: string) => {
  try {
    const user = await db.select().from(users).where(eq(users.email, email));
    return {
      id: user[0].id,
      email: user[0].email,
      name: user[0].name,
      role: user[0].role,
      rollNo: user[0].rollNo ?? undefined,
      department: user[0].department ?? undefined,
      semester: user[0].semester ?? undefined,
      phoneNo: user[0].phoneNo ?? undefined,
      collegeEmail: user[0].collegeEmail ?? undefined,
      club: user[0].club ?? undefined,
    };
  } catch (error) {
    console.log(error);
  }
};

export async function signUp(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!password || password.length < 8 || password.length > 265) {
    return { error: "Password must be between 8 and 265 characters long." };
  }

  try {
    const { account } = await createAdminClient();

    // Check if the email already exists in the database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (await account.getSession(email)) {
      return { error: "An account with this email already exists." };
    }

    if (existingUser.length > 0) {
      return { error: "An account with this email already exists." };
    }

    await account.create(ID.unique(), email, password, username);

    const newUser = await db
      .insert(users)
      .values({
        email: email,
        name: username,
        password: password,
        role: "student",
      })
      .returning();

    if (!newUser) throw new Error("Failed to create user document");

    const session = await account.createEmailPasswordSession(email, password);
    (await cookies()).set("auth-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return {
      success: true,
      user: newUser,
      redirect: "/getting-started",
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "An error occurred during sign up.",
    };
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

  try {
    const { account } = await createAdminClient();

    // Check if the user exists in the database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length === 0) {
      return { error: "No account found with this email address." };
    }

    const session = await account.createEmailPasswordSession(email, password);
    (await cookies()).set("auth-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return { success: true, userId: existingUser[0].id };
  } catch (error) {
    console.error("Signin error:", error);
    return {
      error: "Invalid email or password.",
    };
  }
}

export async function signOut(): Promise<void> {
  const sessionClient = await createSessionClient();
  if (!sessionClient) redirect("/sign-in");
  const { account } = sessionClient;

  // Delete the session cookie
  (await cookies()).delete("auth-session");

  // Delete the current session in Appwrite
  await account.deleteSession("current");

  // Redirect to the sign-in page
  redirect("/sign-in");
}

export async function signIn_google() {
  const { account } = await createAdminClient();

  const origin = (await headers()).get("origin") || "http://localhost:3000";

  try {
    const redirectUrl = await account.createOAuth2Token(
      OAuthProvider.Google,
      `${origin}/api/oauth`, // Callback URL
      `${origin}/sign-in` // Redirect URL after OAuth
    );

    return redirectUrl;
  } catch (error) {
    console.error("Google OAuth error:", error);
    throw error;
  }
}

export async function getLoggedInUser() {
  const sessionClient = await createSessionClient();
  // console.log("Session client:", sessionClient);
  if (!sessionClient) {
    // console.error("No session client found. User is not logged in.");
    return null;
  }
  const { account } = sessionClient;

  try {
    const result = await account.get();
    let user = await getUser(result.email);
    if (!user) {
      const newUser = await db
        .insert(users)
        .values({
          email: result.email,
          name: result.name,
          role: "student",
          password: "", // Add a default or hashed password value
        })
        .returning();

      if (!newUser[0]) throw new Error("Failed to create user document");
      user = {
        ...newUser[0],
        rollNo: newUser[0].rollNo ?? undefined,
        department: newUser[0].department ?? undefined,
        semester: newUser[0].semester ?? undefined,
        phoneNo: newUser[0].phoneNo ?? undefined,
        collegeEmail: newUser[0].collegeEmail ?? undefined,
        club: newUser[0].club ?? undefined,
      };
    }
    return user;
  } catch (error) {
    console.error("Get logged in user error:", error);
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  userData: {
    role: "student" | "organizer";
    rollNo?: string;
    department?:
      | "computer"
      | "extc"
      | "it"
      | "mechanical"
      | "civil"
      | "electronics";
    semester?: number;
    phoneNo?: string;
    collegeEmail?: string;
    club?:
      | "NSS"
      | "GDSC"
      | "Algozenith"
      | "AI/DL"
      | "CSI-COMP"
      | "CSI-IT"
      | "IEEE"
      | "FCRIT Council"
      | "ECELL"
      | "Manthan"
      | "AGNEL CYBER CELL"
      | "ECO CLUB"
      | "DEBATE CLUB"
      | "RHYTHM Club"
      | "Agnel Robotics Club"
      | "The drama house fcrit"
      | "Nritya Nation";
  }
) {
  try {
    // Ensure that the role is correctly set
    if (userData.role === "organizer" && !userData.club) {
      throw new Error("Club is required for organizers.");
    }

    if (userData.role === "student" && !userData.rollNo) {
      throw new Error("Roll number is required for students.");
    }

    // Update the user profile
    const updatedUser = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(), // Ensure the updatedAt field is updated
      })
      .where(eq(users.id, userId))
      .returning();

    if (updatedUser.length === 0) {
      throw new Error("User not found.");
    }

    return { success: true, user: updatedUser[0] };
  } catch (error) {
    console.error("Update user profile error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while updating the profile.",
    };
  }
}

export async function adminLogin(pin: string) {
  // In a real-world scenario, you'd want to store this securely, not hardcode it
  const ADMIN_PIN = "1234"

  if (pin === ADMIN_PIN) {
    // Here you'd typically create a session or JWT for the admin
    return { success: true }
  } else {
    return { success: false, error: "Invalid admin PIN" }
  }
}

export async function moderatorLogin(pin: string) {
  const moderator = await db
    .select()
    .from(moderators)
    .where(eq(moderators.pin, await hash(pin, 10)))

  if (moderator) {
    // Here you'd typically create a session or JWT for the moderator
    return { success: true, moderator }
  } else {
    return { success: false, error: "Invalid moderator PIN" }
  }
}

export async function createModerator(name: string, email: string, pin: string) {
  const hashedPin = await hash(pin, 10)

  const newModerator = await db
    .insert(moderators)
    .values({
      name,
      email,
      pin: hashedPin,
    })
    .returning()

  return newModerator[0]
}


