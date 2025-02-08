import { getLoggedInUser } from "@/actions/auth";
import { createAdminClient } from "@/lib/server/appwrite";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");
  const user = await getLoggedInUser();

  if (!userId || !secret) {
    return NextResponse.redirect(`${request.nextUrl.origin}/sign-in`);
  }

  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(userId, secret);

    (await cookies()).set("auth-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    const isProfileIncomplete =
      !user?.rollNo || !user?.phoneNo || !user?.collegeEmail;
    if (isProfileIncomplete) {
      return NextResponse.redirect(`${request.nextUrl.origin}/getting-started`);
    }

    return NextResponse.redirect(`${request.nextUrl.origin}/`);
  } catch (error) {
    console.error("Failed to create session:", error);
    return NextResponse.redirect(`${request.nextUrl.origin}/sign-in`);
  }
}
