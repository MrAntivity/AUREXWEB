"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getStoredStaffUser, clearStoredStaffUser } from "@/lib/staff-auth";
import { runSeedIfNeeded } from "@/lib/data-seed";
import type { StaffUser } from "@/lib/staff-auth";
import StaffSidebar from "@/components/staff/Sidebar";
import StaffHeader from "@/components/staff/Header";
import { addAuditEntry } from "@/lib/audit-log";
import { StaffDarkModeProvider } from "@/components/staff/StaffDarkModeProvider";

const AUTH_ROUTES = ["/staff/sign-in"];

function StaffShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<StaffUser | null>(null);
  const [ready, setReady] = useState(false);

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  useEffect(() => {
    runSeedIfNeeded();
    const stored = getStoredStaffUser();
    setUser(stored);
    setReady(true);

    if (!stored && !isAuthRoute) {
      router.replace("/staff/sign-in");
    }
    if (stored && isAuthRoute) {
      router.replace("/staff/dashboard");
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isAuthRoute) return <>{children}</>;
  if (!ready || !user) return null;

  function handleLogout() {
    if (user) {
      addAuditEntry({
        userName: user.name,
        userEmail: user.email,
        action: "staff_logout",
        target: "session",
        details: `${user.name} signed out`,
      });
    }
    clearStoredStaffUser();
    setUser(null);
    router.replace("/staff/sign-in");
  }

  return (
    <div className="flex h-screen bg-[#f3f4f6] dark:bg-[#0c0c13]">
      <StaffSidebar user={user} onLogout={handleLogout} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <StaffHeader user={user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <StaffDarkModeProvider>
      <StaffShell>{children}</StaffShell>
    </StaffDarkModeProvider>
  );
}
