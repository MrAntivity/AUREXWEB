"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  getStoredUser,
  clearStoredUser,
  forceChangePassword,
} from "@/lib/mock-auth";
import { runSeedIfNeeded } from "@/lib/data-seed";
import type { MockUser } from "@/lib/mock-auth";
import { getInstitutionById } from "@/lib/institutions";
import PortalSidebar from "@/components/portal/Sidebar";
import PortalHeader from "@/components/portal/Header";
import { StoreProvider } from "@/components/portal/StoreProvider";
import { DarkModeProvider } from "@/components/portal/DarkModeProvider";
import { FlaskConical, Eye, EyeOff, Loader2 } from "lucide-react";

const AUTH_ROUTES = ["/portal/sign-in", "/portal/sign-up"];
const INACTIVE_ROUTE = "/portal/inactive";
const SUSPENDED_ROUTE = "/portal/inactive?reason=suspended";

function ForceChangePasswordModal({
  email,
  onDone,
}: {
  email: string;
  onDone: (updatedUser: MockUser) => void;
}) {
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (newPwd.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    forceChangePassword(email, newPwd);
    const updated = getStoredUser();
    if (updated) onDone(updated);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-[#1a1a2a]">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aurex-blue/10">
            <FlaskConical size={18} className="text-aurex-blue" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-aurex-blue">
              Action Required
            </p>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Set your password</h2>
          </div>
        </div>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Your account was provisioned by an administrator. Please set a new password
          before continuing.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
              New password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                required
                placeholder="Min. 6 characters"
                className="form-input-portal pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                tabIndex={-1}
              >
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
              Confirm new password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                required
                placeholder="Repeat password"
                className="form-input-portal pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3 mt-2"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Set Password & Continue"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<MockUser | null>(null);
  const [ready, setReady] = useState(false);
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  useEffect(() => {
    runSeedIfNeeded();
    const stored = getStoredUser();
    setUser(stored);
    setReady(true);

    if (!stored && !isAuthRoute) {
      router.replace("/portal/sign-in");
      return;
    }
    if (stored && isAuthRoute) {
      router.replace("/portal/dashboard");
      return;
    }
    if (stored && stored.status === "deleted") {
      clearStoredUser();
      router.replace("/portal/sign-in");
      return;
    }
    if (
      stored &&
      stored.status === "inactive" &&
      !isAuthRoute &&
      pathname !== INACTIVE_ROUTE
    ) {
      router.replace(INACTIVE_ROUTE);
      return;
    }
    if (stored && !isAuthRoute && pathname !== INACTIVE_ROUTE) {
      const institution = getInstitutionById(stored.institutionId ?? "aurex");
      if (institution && institution.status === "inactive") {
        router.replace(SUSPENDED_ROUTE);
      }
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
    <StoreProvider userEmail={user.email} institutionId={user.institutionId ?? "aurex"}>
      <div className="flex h-screen bg-gray-50 dark:bg-[#131320]">
        <PortalSidebar user={user} onLogout={handleLogout} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <PortalHeader user={user} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
      {user.mustChangePassword && (
        <ForceChangePasswordModal
          email={user.email}
          onDone={(updated) => setUser(updated)}
        />
      )}
    </StoreProvider>
  );
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <DarkModeProvider>
      <PortalShell>{children}</PortalShell>
    </DarkModeProvider>
  );
}
