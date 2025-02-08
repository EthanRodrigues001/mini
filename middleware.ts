import { NextRequest, NextResponse } from "next/server";
import { getLoggedInUser } from "./actions/auth";

const protectedRoutes = ["/dashboard"];

export default async function middleware(request: NextRequest) {
  const user = await getLoggedInUser();
  // console.log("User in middleware:", user);
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Define conditions for an incomplete profile
  const isProfileIncomplete =
    !user?.rollNo || !user?.phoneNo || !user?.collegeEmail;

  // 1️⃣ Prevent Not Logged-in Users from accessing `/getting-started`
  if (!user && pathname.startsWith("/getting-started")) {
    console.log("Redirecting to sign-in because user is not logged in");
    return NextResponse.redirect(new URL("/sign-in", request.nextUrl.origin));
  }

  // 2️⃣ Redirect users with an incomplete profile away from protected routes (e.g., `/dashboard`)
  if (user && isProfileIncomplete && isProtected) {
    console.log("Redirecting to getting-started due to incomplete profile");
    return NextResponse.redirect(
      new URL("/getting-started", request.nextUrl.origin)
    );
  }

  // // 3️⃣ Ensure users with an incomplete profile are redirected to `/getting-started`
  // if (user && isProfileIncomplete && pathname !== "/getting-started") {
  //   console.log("Redirecting to getting-started due to incomplete profile");
  //   return NextResponse.redirect(
  //     new URL("/getting-started", request.nextUrl.origin)
  //   );
  // }

  // 4️⃣ Prevent users with a complete profile from accessing `/getting-started`
  if (user && !isProfileIncomplete && pathname.startsWith("/getting-started")) {
    console.log("Redirecting to home because profile is complete");
    return NextResponse.redirect(new URL("/", request.nextUrl.origin));
  }

  return NextResponse.next();
}

// User State                      | Visiting `/`            | Visiting `/dashboard`     | Visiting `/getting-started`
// ---------------------------------------------------------------------------------------------------------------
// Not logged in                   | ✅ Allowed              | 🔄 Redirects to `/sign-in` | 🔄 Redirects to `/sign-in`
// Logged in, profile complete     | ✅ Allowed              | ✅ Allowed                | 🔄 Redirects to `/`
// Logged in, profile incomplete   | 🔄 Redirects to `/getting-started` | 🔄 Redirects to `/getting-started` | ✅ Allowed (so they can complete their profile)
