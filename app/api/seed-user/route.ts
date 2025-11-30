import { NextResponse } from "next/server";
import { supabaseServerClient } from "../../../lib/supabase-server";

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const email = process.env.GF_TEST_EMAIL;
    const password = process.env.GF_TEST_PASSWORD;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Test user credentials not configured" },
        { status: 500 }
      );
    }

    // Try to sign up the test user
    const { data, error } = await supabaseServerClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm for test user
    });

    if (error) {
      // If user already exists, that's fine
      if (error.message.includes("already registered")) {
        return NextResponse.json({ message: "Test user already exists" });
      }
      throw error;
    }

    return NextResponse.json({ message: "Test user created", user: data.user });
  } catch (error) {
    console.error("Error seeding test user:", error);
    return NextResponse.json(
      { error: "Failed to seed test user" },
      { status: 500 }
    );
  }
}