"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
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
    <div className="flex min-h-screen bg-dark-bg">
      {/* Left panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-dark-elevated p-12 lg:flex border-r border-white/8">
        <div className="flex items-center gap-2.5">
          <FlaskConical size={20} className="text-aurex-blue" />
          <span className="text-sm font-bold tracking-tight text-white">Aurex Medical</span>
        </div>
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-aurex-blue/20 bg-aurex-blue/10 px-3 py-1.5">
            <ShieldCheck size={13} className="text-aurex-blue" />
            <span className="text-xs font-semibold text-aurex-blue">Staff Access Only</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-aurex-blue">
            Internal Portal
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white">
            Manage products,<br />fulfill orders.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-gray-500">
            The Aurex staff portal gives your team full control over the product
            catalog, inventory, order fulfillment, and audit history.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { label: "Product Management", desc: "Add, edit, and manage stock levels" },
              { label: "Order Visibility", desc: "See all orders from user portals" },
              { label: "Audit Log", desc: "Complete history of every change" },
              { label: "Team Access", desc: "Role-based access for your staff" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/8 bg-white/3 p-3">
                <p className="text-xs font-semibold text-white">{item.label}</p>
                <p className="mt-0.5 text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-700">
          © {new Date().getFullYear()} Aurex Medical, Inc. — Internal use only.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-2 flex items-center justify-center gap-2.5 lg:hidden">
            <FlaskConical size={20} className="text-aurex-blue" />
            <span className="text-sm font-bold text-white">Aurex Medical</span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-white">Staff sign in</h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Use your <span className="text-aurex-blue">@aurexmed.com</span> credentials.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
              className="btn-primary w-full justify-center py-3"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Sign In <ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-700">
            This portal is restricted to authorised Aurex Medical staff.<br />
            Contact <a href="mailto:hello@aurexmedical.com" className="text-gray-500 hover:text-gray-300 transition">hello@aurexmedical.com</a> for access.
          </p>
        </div>
      </div>
    </div>
  );
}
