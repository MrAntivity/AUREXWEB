"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getAllStaffUsers,
  createStaffUser,
  getStoredStaffUser,
} from "@/lib/staff-auth";
import type { StaffUser } from "@/lib/staff-auth";
import { addAuditEntry } from "@/lib/audit-log";
import { UserPlus, X, Eye, EyeOff, Loader2, Users } from "lucide-react";

// ─── Add Staff Modal ──────────────────────────────────────────────────────────

function AddStaffModal({
  onClose,
  onCreated,
  currentUser,
}: {
  onClose: () => void;
  onCreated: () => void;
  currentUser: StaffUser | null;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const result = createStaffUser({ email, name, role, password });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (currentUser) {
      addAuditEntry({
        userName: currentUser.name,
        userEmail: currentUser.email,
        action: "staff_user_created",
        target: email,
        details: `${currentUser.name} created staff account for ${name} (${email})`,
      });
    }
    onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1a2a]">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-white/8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-aurex-blue/10">
              <UserPlus size={15} className="text-aurex-blue" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Add Staff Member</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/8 dark:hover:text-gray-300"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full Name" required>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Jane Smith"
                className="form-input-portal"
              />
            </Field>
            <Field label="Email Address" required>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="jane@aurexmed.com"
                className="form-input-portal"
                autoComplete="off"
              />
            </Field>
          </div>

          <Field label="Job Title / Role" required>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              placeholder="e.g. Director, East Coast Ops"
              className="form-input-portal"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Password" required>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min. 6 characters"
                  className="form-input-portal pr-9"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </Field>
            <Field label="Confirm Password" required>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Repeat password"
                  className="form-input-portal pr-9"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </Field>
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-aurex-blue px-5 py-2 text-sm font-semibold text-white hover:bg-aurex-blue-light disabled:opacity-60"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
              Add Staff Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-400">
        {label}
        {required && <span className="ml-0.5 text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StaffUsersPage() {
  const currentUser = getStoredStaffUser();
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadUsers = useCallback(() => {
    setStaffUsers(getAllStaffUsers());
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Staff Users</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {staffUsers.length} staff {staffUsers.length === 1 ? "member" : "members"}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-aurex-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-aurex-blue-light"
          >
            <UserPlus size={15} />
            Add Staff
          </button>
        </div>

        {staffUsers.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-16 text-center shadow-sm dark:border-white/10 dark:bg-[#1a1a2a]">
            <Users size={32} className="mx-auto mb-3 text-gray-200 dark:text-gray-700" />
            <p className="text-sm text-gray-400">No staff users found.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#1a1a2a]">
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {staffUsers.map((u) => {
                const isSelf = u.email === currentUser?.email;
                return (
                  <div
                    key={u.email}
                    className="flex items-center gap-4 px-6 py-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-aurex-blue/30 bg-aurex-blue/10 text-xs font-bold text-aurex-blue">
                      {u.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{u.name}</p>
                        {isSelf && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-white/10 dark:text-gray-400">
                            you
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
                      {u.role}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddStaffModal
          onClose={() => setShowAddModal(false)}
          onCreated={loadUsers}
          currentUser={currentUser}
        />
      )}
    </>
  );
}
