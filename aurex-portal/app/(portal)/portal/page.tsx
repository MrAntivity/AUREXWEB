"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser } from "@/lib/mock-auth";

// /portal has no content — redirect based on auth state
export default function PortalIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser();
    router.replace(user ? "/portal/dashboard" : "/portal/sign-in");
  }, [router]);

  return null;
}
