"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getStoredUser, clearStoredUser } from "@/lib/mock-auth";
import type { MockUser } from "@/lib/mock-auth";
import PortalSidebar from "@/components/portal/Sidebar";
import PortalHeader from "@/components/portal/Header";
import { StoreProvider } from "@/components/portal/StoreProvider";
import CartDrawer from "@/components/portal/CartDrawer";

const AUTH_ROUTES = ["/portal/sign-in", "/portal/sign-up"];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<MockUser | null>(null);
  const [ready, setReady] = useState(false);

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    setReady(true);

    if (!stored && !isAuthRoute) {
      router.replace("/portal/sign-in");
    }
    if (stored && isAuthRoute) {
      router.replace("/portal/dashboard");
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isAuthRoute) {
    return <>{children}</>;
  }

  if (!ready || !user) {
    return null;
  }

  function handleLogout() {
    clearStoredUser();
    setUser(null);
    router.replace("/portal/sign-in");
  }

  return (
    <StoreProvider>
      <div className="flex h-screen bg-gray-50">
        <PortalSidebar user={user} onLogout={handleLogout} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <PortalHeader user={user} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
        <CartDrawer />
      </div>
    </StoreProvider>
  );
}
