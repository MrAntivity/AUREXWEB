import { NextResponse } from "next/server";

// Auth is handled client-side via localStorage — this route is unused.
export async function POST() {
  return NextResponse.json({ message: "Use client-side auth via lib/mock-auth.ts" }, { status: 410 });
}
