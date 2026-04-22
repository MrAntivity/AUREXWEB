"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, Loader2 } from "lucide-react";
import { authenticate, setStoredUser } from "@/lib/mock-auth";

const QUICK_LOGINS = [
  {
    label: "Super Admin",
    email: "admin@aurex.dev",
    description: "Full access — budgets, users, approvals",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
  },
  {
    label: "Dept Admin",
    email: "dept@aurex.dev",
    description: "Manage Chemistry dept orders & approvals",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  {
    label: "Requester",
    email: "req@aurex.dev",
    description: "Submit purchase requests for Biology",
    badge: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  {
    label: "Finance Viewer",
    email: "finance@aurex.dev",
    description: "Read-only access to reports & budgets",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
];

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function login(e: string, p: string) {
    setLoading(true);
    setError("");
    const user = authenticate(e, p);
    if (user) {
      setStoredUser(user);
      router.push("/portal/dashboard");
    } else {
      setError("Invalid email or password.");
      setLoading(false);
    }
  }

  function handleQuickLogin(quickEmail: string) {
    login(quickEmail, "password");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login(email, password);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-aurex-blue">
            <FlaskConical size={24} className="text-aurex-teal" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Aurex Medical Portal</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your institution account</p>
        </div>

        {/* Dev mode quick-login */}
        <div className="mb-6 rounded-2xl border border-dashed border-gray-300 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              Dev Mode
            </span>
            <span className="text-xs text-gray-400">Click a role to instantly sign in</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_LOGINS.map((q) => (
              <button
                key={q.email}
                onClick={() => handleQuickLogin(q.email)}
                disabled={loading}
                className={`flex flex-col items-start rounded-xl border p-3 text-left transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 ${q.badge}`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${q.dot}`} />
                  <span className="text-xs font-semibold">{q.label}</span>
                </div>
                <p className="mt-1 text-xs opacity-70">{q.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Manual form */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Or sign in manually
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institution.edu"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Sign In"}
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-gray-400">
            All demo accounts use password:{" "}
            <code className="rounded bg-gray-100 px-1 font-mono">password</code>
          </p>
        </div>
      </div>
    </div>
  );
}
