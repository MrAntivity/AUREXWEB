"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PhoneCall, Mail, LogOut, Building2 } from "lucide-react";
import { clearStoredUser } from "@/lib/mock-auth";
import { Suspense } from "react";

function InactiveContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSuspended = searchParams.get("reason") === "suspended";

  function handleLogout() {
    clearStoredUser();
    router.replace("/portal/sign-in");
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
      <div className={`flex h-16 w-16 items-center justify-center rounded-full ${isSuspended ? "bg-red-50 dark:bg-red-900/20" : "bg-amber-50 dark:bg-amber-900/20"}`}>
        {isSuspended ? (
          <Building2 size={28} className="text-red-500" />
        ) : (
          <PhoneCall size={28} className="text-amber-500" />
        )}
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isSuspended ? "Institution Suspended" : "Account Inactive"}
        </h1>
        <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
          {isSuspended
            ? "Your institution's portal access has been suspended. Please contact Aurex Medical to restore access."
            : "Your account has been deactivated. You cannot place orders or access portal features until your account is reactivated by an administrator."}
        </p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm ${isSuspended ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-900/20 dark:text-red-400" : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-900/20 dark:text-amber-400"}`}>
          <Mail size={14} />
          <span>{isSuspended ? "Contact Aurex Medical to restore access" : "Contact your admin to restore access"}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </div>
  );
}

export default function InactivePage() {
  return (
    <Suspense fallback={null}>
      <InactiveContent />
    </Suspense>
  );
}
