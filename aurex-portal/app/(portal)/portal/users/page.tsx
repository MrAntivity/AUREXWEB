"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getStoredUser,
  getUsersFromStore,
  createUser,
  setUserStatus,
  deleteUser,
  dismissDeactivationRequest,
  ROLE_LABELS,
} from "@/lib/mock-auth";
import type { MockRole, MockUser } from "@/lib/mock-auth";
import {
  ShieldCheck,
  UserCheck,
  User,
  Eye,
  EyeOff,
  X,
  UserPlus,
  Loader2,
  Trash2,
  PowerOff,
  Power,
  AlertTriangle,
  Bell,
} from "lucide-react";

const roleIcon: Record<MockRole, React.ElementType> = {
  super_admin: ShieldCheck,
  department_admin: UserCheck,
  requester: User,
  finance_viewer: Eye,
};

const roleBadge: Record<MockRole, string> = {
  super_admin:
    "bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:ring-purple-500/20",
  department_admin:
    "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/20",
  requester:
    "bg-green-50 text-green-700 ring-green-200 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-500/20",
  finance_viewer:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20",
};

const ALL_ROLES: MockRole[] = ["requester", "department_admin", "finance_viewer", "super_admin"];

// ─── Add User Modal ─────────────────────────────────────────────────────────

function AddUserModal({
  onClose,
  onCreated,
  institutionId,
}: {
  onClose: () => void;
  onCreated: () => void;
  institutionId: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<MockRole>("requester");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
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
    const result = createUser({
      email,
      password,
      name,
      role,
      department,
      institutionId,
      location: location || undefined,
    });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1a2a]">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-white/8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-aurex-blue/10">
              <UserPlus size={15} className="text-aurex-blue" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Add New User</h2>
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
            <FormField label="Full Name" required>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Jane Smith"
                className="form-input-portal"
              />
            </FormField>
            <FormField label="Email Address" required>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="jane@institution.edu"
                className="form-input-portal"
                autoComplete="off"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Password" required>
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
            </FormField>
            <FormField label="Confirm Password" required>
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
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Role" required>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as MockRole)}
                className="form-input-portal"
              >
                {ALL_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Department" required>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                placeholder="e.g. Chemistry"
                className="form-input-portal"
              />
            </FormField>
          </div>

          <FormField label="Location (optional)">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Lab Building A, Room 201"
              className="form-input-portal"
            />
          </FormField>

          <p className="text-xs text-gray-400 dark:text-gray-500">
            The user will be prompted to set a new password on first login.
          </p>

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
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirmation Modal ───────────────────────────────────────────────

function DeleteUserModal({
  targetUser,
  onClose,
  onDeleted,
}: {
  targetUser: MockUser;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState("");

  function handleDelete() {
    setError("");
    if (emailInput.trim().toLowerCase() !== targetUser.email.toLowerCase()) {
      setError("Email does not match. Please type the exact email address to confirm.");
      return;
    }
    deleteUser(targetUser.email);
    onDeleted();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1a2a]">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-white/8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20">
              <AlertTriangle size={15} className="text-red-500" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Deactivate Account</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/8 dark:hover:text-gray-300"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-900/10">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              You are about to deactivate <strong>{targetUser.name}</strong>&apos;s account.
            </p>
            <p className="mt-1 text-xs text-red-600 dark:text-red-400/80">
              Their account will be disabled and they won&apos;t be able to sign in. All their order history will be preserved.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-400">
              Type <span className="font-mono font-bold text-red-600 dark:text-red-400">{targetUser.email}</span> to confirm
            </label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Paste or type their email"
              className="form-input-portal"
              autoComplete="off"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              <Trash2 size={14} /> Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FormField ───────────────────────────────────────────────────────────────

function FormField({
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

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function UsersPage() {
  const currentUser = getStoredUser();
  const [users, setUsers] = useState<MockUser[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MockUser | null>(null);

  const canManageUsers =
    currentUser?.role === "super_admin" || currentUser?.role === "department_admin";

  const loadUsers = useCallback(() => {
    const store = getUsersFromStore();
    const institutionId = currentUser?.institutionId ?? "aurex";
    const list = Object.values(store)
      .filter((u) => u.status !== "deleted" && u.institutionId === institutionId)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ password: _pw, ...u }) => u);
    setUsers(list);
  }, [currentUser?.institutionId]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  if (!canManageUsers) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        User management is restricted to admins.
      </div>
    );
  }

  function handleToggleStatus(u: MockUser) {
    const next = u.status === "inactive" ? "active" : "inactive";
    setUserStatus(u.email, next);
    loadUsers();
  }

  function handleDeactivateWithRequest(u: MockUser) {
    setUserStatus(u.email, "inactive");
    dismissDeactivationRequest(u.email);
    loadUsers();
  }

  function handleDismissDeactivation(u: MockUser) {
    dismissDeactivationRequest(u.email);
    loadUsers();
  }

  function canActOn(target: MockUser): boolean {
    if (target.email === currentUser?.email) return false;
    if (currentUser?.role !== "super_admin" && target.role === "super_admin") return false;
    return true;
  }

  const activeCount = users.filter((u) => u.status !== "inactive").length;
  const inactiveCount = users.filter((u) => u.status === "inactive").length;
  const deactivationRequestCount = users.filter((u) => u.deactivationRequested).length;

  // Sort: deactivation requests first, then active, then inactive
  const sortedUsers = [...users].sort((a, b) => {
    if (a.deactivationRequested && !b.deactivationRequested) return -1;
    if (!a.deactivationRequested && b.deactivationRequested) return 1;
    if (a.status !== "inactive" && b.status === "inactive") return -1;
    if (a.status === "inactive" && b.status !== "inactive") return 1;
    return 0;
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">User Management</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {activeCount} active · {inactiveCount} inactive
              {deactivationRequestCount > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  <Bell size={10} />
                  {deactivationRequestCount} deactivation {deactivationRequestCount === 1 ? "request" : "requests"}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-aurex-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-aurex-blue-light"
          >
            <UserPlus size={15} />
            Add User
          </button>
        </div>

        <div className="card divide-y divide-gray-50 dark:divide-white/5">
          {sortedUsers.map((u) => {
            const Icon = roleIcon[u.role];
            const isSelf = u.email === currentUser?.email;
            const isInactive = u.status === "inactive";
            const hasDeactivationRequest = !!u.deactivationRequested;
            const canAct = canActOn(u);

            return (
              <div
                key={u.email}
                className={`flex items-center gap-4 py-4 ${isInactive && !hasDeactivationRequest ? "opacity-60" : ""}`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${hasDeactivationRequest ? "bg-red-500" : "bg-aurex-blue"}`}>
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
                    {hasDeactivationRequest && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                        <Bell size={9} /> Requested Deactivation
                      </span>
                    )}
                    {isInactive && !hasDeactivationRequest && (
                      <span className="rounded-full border border-gray-300 bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:border-white/10 dark:bg-white/8 dark:text-gray-400">
                        inactive
                      </span>
                    )}
                    {u.mustChangePassword && !isInactive && (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
                        must reset password
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <div className="shrink-0 text-sm text-gray-500 dark:text-gray-400">{u.department}</div>
                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${roleBadge[u.role]}`}
                >
                  <Icon size={11} />
                  {ROLE_LABELS[u.role]}
                </span>

                {/* Actions */}
                {hasDeactivationRequest && canAct ? (
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => handleDismissDeactivation(u)}
                      className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleDeactivateWithRequest(u)}
                      className="flex items-center gap-1.5 rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                    >
                      <PowerOff size={12} /> Deactivate
                    </button>
                  </div>
                ) : canAct ? (
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => handleToggleStatus(u)}
                      title={isInactive ? "Reactivate account" : "Deactivate account"}
                      className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        isInactive
                          ? "border-green-200 text-green-600 hover:bg-green-50 dark:border-green-500/20 dark:text-green-400 dark:hover:bg-green-900/10"
                          : "border-gray-200 text-gray-500 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 dark:border-white/10 dark:text-gray-500 dark:hover:border-amber-500/20 dark:hover:bg-amber-900/10 dark:hover:text-amber-400"
                      }`}
                    >
                      {isInactive ? <Power size={12} /> : <PowerOff size={12} />}
                      {isInactive ? "Reactivate" : "Deactivate"}
                    </button>
                    <button
                      onClick={() => setDeleteTarget(u)}
                      title="Delete account"
                      className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-white/10 dark:text-gray-500 dark:hover:border-red-500/20 dark:hover:bg-red-900/10 dark:hover:text-red-400"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                ) : (
                  <div className="w-[200px] shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onCreated={loadUsers}
          institutionId={currentUser?.institutionId ?? "aurex"}
        />
      )}

      {deleteTarget && (
        <DeleteUserModal
          targetUser={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={loadUsers}
        />
      )}
    </>
  );
}
