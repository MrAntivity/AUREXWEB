"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Plus,
  X,
  Loader2,
  Eye,
  EyeOff,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Globe,
} from "lucide-react";
import {
  getInstitutions,
  createInstitution,
} from "@/lib/institutions";
import type { Institution } from "@/lib/institutions";
import { createUser, getUsersByInstitution } from "@/lib/mock-auth";

// ─── Add Institution Modal ────────────────────────────────────────────────────

function AddInstitutionModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (adminPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);

    const instResult = createInstitution({
      name,
      domain: domain.toLowerCase().replace(/^@/, ""),
      superAdminEmail: adminEmail,
    });

    if (!instResult.ok) {
      setError(instResult.error);
      setLoading(false);
      return;
    }

    const userResult = createUser({
      email: adminEmail,
      password: adminPassword,
      name: adminName,
      role: "super_admin",
      department: "Administration",
      institutionId: instResult.id,
    });

    if (!userResult.ok) {
      setError(`Institution created but admin user failed: ${userResult.error}`);
      setLoading(false);
      return;
    }

    setLoading(false);
    onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0c0c13] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-aurex-blue/15">
              <Building2 size={15} className="text-aurex-blue" />
            </div>
            <h2 className="text-sm font-semibold text-white">Add New Institution</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 hover:bg-white/5 hover:text-gray-300"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <p className="mb-4 text-xs text-gray-500">
              Creating an institution will also provision a Super Admin account for that institution.
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-400">
              Institution Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Boston University"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-aurex-blue/50 focus:outline-none focus:ring-1 focus:ring-aurex-blue/30"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-400">
              Email Domain <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
              placeholder="bu.edu"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-aurex-blue/50 focus:outline-none focus:ring-1 focus:ring-aurex-blue/30"
            />
            <p className="text-xs text-gray-600">Users with this domain will belong to this institution.</p>
          </div>

          <div className="border-t border-white/8 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Super Admin Account</p>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-400">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  required
                  placeholder="Jane Smith"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-aurex-blue/50 focus:outline-none focus:ring-1 focus:ring-aurex-blue/30"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-400">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  placeholder="admin@bu.edu"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-aurex-blue/50 focus:outline-none focus:ring-1 focus:ring-aurex-blue/30"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-400">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    placeholder="Min. 6 characters"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 pr-9 text-sm text-white placeholder-gray-600 focus:border-aurex-blue/50 focus:outline-none focus:ring-1 focus:ring-aurex-blue/30"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    tabIndex={-1}
                  >
                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-xs text-gray-600">The super admin will be prompted to set a new password on first login.</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
              <AlertCircle size={13} className="mt-0.5 shrink-0 text-red-400" />
              <p className="text-xs font-medium text-red-400">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-400 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-aurex-blue px-5 py-2 text-sm font-semibold text-white hover:bg-aurex-blue-light disabled:opacity-60"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Create Institution
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Institution Card ─────────────────────────────────────────────────────────

function InstitutionCard({ inst }: { inst: Institution }) {
  const router = useRouter();
  const users = getUsersByInstitution(inst.id).filter((u) => u.status !== "deleted");
  const activeCount = users.filter((u) => u.status !== "inactive").length;

  return (
    <button
      onClick={() => router.push(`/staff/institutions/${inst.id}`)}
      className="group w-full rounded-xl border border-white/8 bg-white/3 p-5 text-left transition-all hover:border-aurex-blue/30 hover:bg-white/5"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-aurex-blue/15">
            <Building2 size={16} className="text-aurex-blue" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{inst.name}</p>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
              <Globe size={11} />
              {inst.domain}
            </div>
          </div>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
            inst.status === "active"
              ? "bg-green-500/10 text-green-400 ring-green-500/20"
              : "bg-red-500/10 text-red-400 ring-red-500/20"
          }`}
        >
          {inst.status === "active" ? (
            <CheckCircle2 size={10} />
          ) : (
            <AlertCircle size={10} />
          )}
          {inst.status === "active" ? "Active" : "Suspended"}
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-white/8 pt-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Users size={12} />
          {activeCount} active user{activeCount !== 1 ? "s" : ""}
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-aurex-blue opacity-0 transition-opacity group-hover:opacity-100">
          View details <ArrowRight size={11} />
        </div>
      </div>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const load = useCallback(() => {
    setInstitutions(getInstitutions());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const activeCount = institutions.filter((i) => i.status === "active").length;
  const inactiveCount = institutions.filter((i) => i.status === "inactive").length;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Institutions</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {activeCount} active · {inactiveCount} suspended
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-aurex-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-aurex-blue-light"
          >
            <Plus size={15} />
            Add Institution
          </button>
        </div>

        {institutions.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-xl border border-white/8 bg-white/3 text-center">
            <Building2 size={32} className="text-gray-700" />
            <p className="text-sm text-gray-500">No institutions yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {institutions.map((inst) => (
              <InstitutionCard key={inst.id} inst={inst} />
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddInstitutionModal
          onClose={() => setShowAddModal(false)}
          onCreated={load}
        />
      )}
    </>
  );
}
