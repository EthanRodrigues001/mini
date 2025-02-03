import { getAllUsers } from "@/actions/users";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await getAllUsers();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
