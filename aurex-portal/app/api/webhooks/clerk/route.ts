import { NextResponse } from "next/server";

// Clerk webhooks are disabled in prototype mode (no Clerk integration active)
export async function POST() {
  return NextResponse.json({ received: true });
}
