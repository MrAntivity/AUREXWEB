"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, Loader2, ArrowRight } from "lucide-react";
import { authenticate, setStoredUser } from "@/lib/mock-auth";

const QUICK_LOGINS = [
  {
    label: "Super Admin",
    email: "admin@aurex.dev",
    description: "Full access — budgets, users, approvals",
    color: "border-purple-500/30 hover:border-purple-500/60",
    dot: "bg-purple-400",
    textColor: "text-purple-400",
  },
  {
    label: "Dept Admin",
    email: "dept@aurex.dev",
    description: "Manage Chemistry dept orders & approvals",
    color: "border-aurex-blue/30 hover:border-aurex-blue/60",
    dot: "bg-aurex-blue",
    textColor: "text-aurex-blue",
  },
  {
    label: "Requester",
    email: "req@aurex.dev",
    description: "Submit purchase requests for Biology",
    color: "border-green-500/30 hover:border-green-500/60",
    dot: "bg-green-400",
    textColor: "text-green-400",
  },
  {
    label: "Finance Viewer",
    email: "finance@aurex.dev",
    description: "Read-only access to reports & budgets",
    color: "border-amber-500/30 hover:border-amber-500/60",
    dot: "bg-amber-400",
    textColor: "text-amber-400",
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
    <div className="flex min-h-screen bg-dark-bg">
      {/* Left panel — branding */}
      <div className="hidden w-1/2 flex-col justify-between bg-dark-elevated p-12 lg:flex border-r border-white/8">
        <div className="flex items-center gap-2.5">
          <FlaskConical size={20} className="text-aurex-blue" />
          <span className="text-sm font-bold tracking-tight text-white">Aurex Medical</span>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-aurex-blue">
            Institutional Portal
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white">
            Procurement,<br />under control.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-gray-500">
            Manage orders, approvals, budgets, and reporting — all in one place,
            built for how research institutions actually operate.
          </p>
        </div>
        <p className="text-xs text-gray-700">
          © {new Date().getFullYear()} Aurex Medical, Inc.
        </p>
      </div>

      {/* Right panel — sign in */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-10 flex items-center justify-center gap-2.5 lg:hidden">
            <FlaskConical size={20} className="text-aurex-blue" />
            <span className="text-sm font-bold text-white">Aurex Medical</span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-white">Sign in to your portal</h1>
          <p className="mt-2 text-sm text-gray-500">
            Accounts are provisioned by your institution&apos;s admin.
          </p>

          {/* Manual form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="label-dark">Email</label>
              <input
                className="input-dark"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institution.edu"
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
              className="btn-primary w-full justify-center py-3"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Sign In <ArrowRight size={15} /></>}
            </button>
          </form>

          {/* Dev mode */}
          <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-white/3 p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                Dev Mode
              </span>
              <span className="text-xs text-gray-600">Click a role to instantly sign in</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {QUICK_LOGINS.map((q) => (
                <button
                  key={q.email}
                  onClick={() => handleQuickLogin(q.email)}
                  disabled={loading}
                  className={`flex flex-col items-start rounded-xl border bg-white/3 p-3 text-left transition hover:bg-white/6 disabled:cursor-not-allowed disabled:opacity-50 ${q.color}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${q.dot}`} />
                    <span className={`text-xs font-semibold ${q.textColor}`}>{q.label}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">{q.description}</p>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-700 text-center">
              All demo accounts use password:{" "}
              <code className="rounded bg-white/5 px-1 font-mono text-gray-500">password</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
