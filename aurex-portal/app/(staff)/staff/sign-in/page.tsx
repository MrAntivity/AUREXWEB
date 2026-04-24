"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FlaskConical, Loader2, ArrowRight, Shield } from "lucide-react";
import { staffAuthenticate, setStoredStaffUser } from "@/lib/staff-auth";
import { addAuditEntry } from "@/lib/audit-log";

export default function StaffSignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const user = staffAuthenticate(email, password);
    if (user) {
      setStoredStaffUser(user);
      addAuditEntry({
        userName: user.name,
        userEmail: user.email,
        action: "staff_login",
        target: "session",
        details: `${user.name} signed in`,
      });
      router.push("/staff/dashboard");
    } else {
      setError("Invalid email or password.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-bg px-4 py-12">
      {/* Top-left home link */}
      <Link
        href="/"
        className="absolute left-8 top-8 flex items-center gap-2 text-gray-600 hover:text-gray-400 transition-colors"
      >
        <FlaskConical size={16} className="text-aurex-blue" />
        <span className="text-xs font-semibold text-gray-500">Aurex Medical</span>
      </Link>

      {/* Center content */}
      <div className="w-full max-w-[380px]">
        {/* Logo + badge */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-dark-elevated shadow-lg">
            <FlaskConical size={26} className="text-aurex-blue" />
          </div>
          <div>
            <p className="text-base font-bold text-white">Aurex Medical</p>
            <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-aurex-blue/20 bg-aurex-blue/8 px-2.5 py-1">
              <Shield size={11} className="text-aurex-blue" />
              <span className="text-xs font-semibold text-aurex-blue">Staff Portal</span>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-white/8 bg-dark-elevated px-8 py-8 shadow-2xl">
          <h1 className="text-xl font-bold tracking-tight text-white">Sign in</h1>
          <p className="mt-1 text-sm text-gray-500">
            Use your <span className="text-aurex-blue">@aurexmed.com</span> credentials
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label-dark">Email</label>
              <input
                className="input-dark"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@aurexmed.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label-dark">Password</label>
              <input
                className="input-dark"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
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
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-700">
          This portal is restricted to authorised Aurex Medical staff.{" "}
          <br className="hidden sm:block" />
          Contact{" "}
          <a
            href="mailto:hello@aurexmedical.com"
            className="text-gray-500 transition hover:text-gray-400"
          >
            hello@aurexmedical.com
          </a>{" "}
          for access.
        </p>
      </div>
    </div>
  );
}
