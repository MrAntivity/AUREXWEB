"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  ArrowLeft,
  Globe,
  Calendar,
  ShieldCheck,
  UserCheck,
  User,
  Eye,
  Users,
  Power,
  PowerOff,
  Trash2,
  AlertTriangle,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  getInstitutionById,
  setInstitutionStatus,
  deleteInstitution,
} from "@/lib/institutions";
import type { Institution } from "@/lib/institutions";
import {
  getUsersByInstitution,
  setUserStatus,
  deleteUser,
  ROLE_LABELS,
} from "@/lib/mock-auth";
import type { MockRole, MockUser } from "@/lib/mock-auth";

// ─── Role helpers ─────────────────────────────────────────────────────────────

const roleIcon: Record<MockRole, React.ElementType> = {
  super_admin: ShieldCheck,
  department_admin: UserCheck,
  requester: User,
  finance_viewer: Eye,
};

const roleBadge: Record<MockRole, string> = {
  super_admin: "bg-purple-500/10 text-purple-400 ring-purple-500/20",
  department_admin: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  requester: "bg-green-500/10 text-green-400 ring-green-500/20",
  finance_viewer: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
};

// ─── Confirmation Modal ───────────────────────────────────────────────────────

type ConfirmAction =
  | { kind: "deactivate-institution"; inst: Institution }
  | { kind: "reactivate-institution"; inst: Institution }
  | { kind: "delete-institution"; inst: Institution }
  | { kind: "deactivate-user"; user: MockUser }
  | { kind: "reactivate-user"; user: MockUser }
  | { kind: "delete-user"; user: MockUser };

function ConfirmModal({
  action,
  onClose,
  onConfirm,
}: {
  action: ConfirmAction;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const isDestructive =
    action.kind === "delete-institution" ||
    action.kind === "deactivate-institution" ||
    action.kind === "delete-user" ||
    action.kind === "deactivate-user";

  const requiresTypedConfirm =
    action.kind === "delete-institution" || action.kind === "delete-user";

  const confirmValue =
    action.kind === "delete-institution"
      ? action.inst.name
      : action.kind === "delete-user"
      ? action.user.email
      : "";

  let title = "";
  let description = "";
  let buttonLabel = "";

  switch (action.kind) {
    case "deactivate-institution":
      title = "Suspend Institution";
      description = `Suspending "${action.inst.name}" will immediately block all users from signing in. Their data is preserved.`;
      buttonLabel = "Suspend Institution";
      break;
    case "reactivate-institution":
      title = "Reactivate Institution";
      description = `This will restore portal access for all active users at "${action.inst.name}".`;
      buttonLabel = "Reactivate Institution";
      break;
    case "delete-institution":
      title = "Delete Institution";
      description = `This will permanently delete "${action.inst.name}" and all associated data. This cannot be undone.`;
      buttonLabel = "Delete Institution";
      break;
    case "deactivate-user":
      title = "Deactivate User";
      description = `Deactivating ${action.user.name} will prevent them from signing in. Their history is preserved.`;
      buttonLabel = "Deactivate User";
      break;
    case "reactivate-user":
      title = "Reactivate User";
      description = `This will restore portal access for ${action.user.name}.`;
      buttonLabel = "Reactivate User";
      break;
    case "delete-user":
      title = "Delete User";
      description = `This will permanently remove ${action.user.name}'s account. This cannot be undone.`;
      buttonLabel = "Delete User";
      break;
  }

  function handleConfirm() {
    setError("");
    if (requiresTypedConfirm && input.trim() !== confirmValue) {
      setError(`Please type "${confirmValue}" exactly to confirm.`);
      return;
    }
    onConfirm();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c0c13] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isDestructive ? "bg-red-500/15" : "bg-green-500/15"}`}>
              <AlertTriangle size={15} className={isDestructive ? "text-red-400" : "text-green-400"} />
            </div>
            <h2 className="text-sm font-semibold text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 hover:bg-white/5 hover:text-gray-300"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className={`rounded-lg border p-4 ${isDestructive ? "border-red-500/20 bg-red-500/10" : "border-green-500/20 bg-green-500/10"}`}>
            <p className={`text-sm ${isDestructive ? "text-red-300" : "text-green-300"}`}>{description}</p>
          </div>

          {requiresTypedConfirm && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-400">
                Type <span className="font-mono font-bold text-red-400">{confirmValue}</span> to confirm
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={confirmValue}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-red-500/40 focus:outline-none focus:ring-1 focus:ring-red-500/20"
                autoComplete="off"
              />
            </div>
          )}

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              onClick={onClose}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-400 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white ${
                isDestructive ? "bg-red-600 hover:bg-red-700" : "bg-green-700 hover:bg-green-600"
              }`}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InstitutionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [institution, setInstitution] = useState<Institution | null>(null);
  const [users, setUsers] = useState<MockUser[]>([]);
  const [pendingAction, setPendingAction] = useState<ConfirmAction | null>(null);

  const reload = useCallback(() => {
    const inst = getInstitutionById(id);
    setInstitution(inst);
    if (inst) {
      const raw = getUsersByInstitution(id);
      const visible = raw
        .filter((u) => u.status !== "deleted")
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ password: _pw, ...u }) => u);
      setUsers(visible);
    }
  }, [id]);

  useEffect(() => {
    reload();
  }, [reload]);

  if (!institution) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-gray-500">
        Institution not found.
      </div>
    );
  }

  function executeAction(action: ConfirmAction) {
    switch (action.kind) {
      case "deactivate-institution":
        setInstitutionStatus(action.inst.id, "inactive");
        break;
      case "reactivate-institution":
        setInstitutionStatus(action.inst.id, "active");
        break;
      case "delete-institution":
        deleteInstitution(action.inst.id);
        router.replace("/staff/institutions");
        return;
      case "deactivate-user":
        setUserStatus(action.user.email, "inactive");
        break;
      case "reactivate-user":
        setUserStatus(action.user.email, "active");
        break;
      case "delete-user":
        deleteUser(action.user.email);
        break;
    }
    reload();
  }

  const activeUsers = users.filter((u) => u.status !== "inactive").length;
  const isAurex = id === "aurex";

  return (
    <>
      <div className="space-y-6">
        {/* Back */}
        <button
          onClick={() => router.push("/staff/institutions")}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeft size={15} /> Back to Institutions
        </button>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-aurex-blue/15">
              <Building2 size={22} className="text-aurex-blue" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{institution.name}</h1>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                    institution.status === "active"
                      ? "bg-green-500/10 text-green-600 ring-green-500/20"
                      : "bg-red-500/10 text-red-500 ring-red-500/20"
                  }`}
                >
                  {institution.status === "active" ? (
                    <CheckCircle2 size={10} />
                  ) : (
                    <AlertCircle size={10} />
                  )}
                  {institution.status === "active" ? "Active" : "Suspended"}
                </span>
              </div>
            </div>
          </div>

          {/* Institution actions */}
          {!isAurex && (
            <div className="flex shrink-0 items-center gap-2">
              {institution.status === "active" ? (
                <button
                  onClick={() => setPendingAction({ kind: "deactivate-institution", inst: institution })}
                  className="flex items-center gap-1.5 rounded-lg border border-amber-200 px-3 py-2 text-xs font-medium text-amber-600 hover:bg-amber-50"
                >
                  <PowerOff size={13} /> Suspend
                </button>
              ) : (
                <button
                  onClick={() => setPendingAction({ kind: "reactivate-institution", inst: institution })}
                  className="flex items-center gap-1.5 rounded-lg border border-green-200 px-3 py-2 text-xs font-medium text-green-600 hover:bg-green-50"
                >
                  <Power size={13} /> Reactivate
                </button>
              )}
              <button
                onClick={() => setPendingAction({ kind: "delete-institution", inst: institution })}
                className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Info card */}
        <div className="card grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-gray-400">Domain</p>
            <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white">
              <Globe size={13} className="text-gray-400" />
              {institution.domain}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400">Super Admin</p>
            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{institution.superAdminEmail}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400">Enlisted</p>
            <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white">
              <Calendar size={13} className="text-gray-400" />
              {new Date(institution.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Users section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <Users size={15} className="text-gray-400" />
              Users
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-white/10 dark:text-gray-400">
                {activeUsers} active
              </span>
            </h2>
          </div>

          {users.length === 0 ? (
            <div className="card flex h-32 items-center justify-center text-sm text-gray-400">
              No users in this institution.
            </div>
          ) : (
            <div className="card divide-y divide-gray-50 dark:divide-white/5">
              {users.map((u) => {
                const Icon = roleIcon[u.role];
                const isInactive = u.status === "inactive";

                return (
                  <div
                    key={u.email}
                    className={`flex items-center gap-4 py-4 ${isInactive ? "opacity-60" : ""}`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-aurex-blue text-xs font-bold text-white">
                      {u.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{u.name}</p>
                        {isInactive && (
                          <span className="rounded-full border border-gray-300 bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:border-white/10 dark:bg-white/8 dark:text-gray-400">
                            inactive
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                    <div className="shrink-0 text-xs text-gray-500 dark:text-gray-400">{u.department}</div>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${roleBadge[u.role]}`}
                    >
                      <Icon size={11} />
                      {ROLE_LABELS[u.role]}
                    </span>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={() =>
                          setPendingAction(
                            isInactive
                              ? { kind: "reactivate-user", user: u }
                              : { kind: "deactivate-user", user: u }
                          )
                        }
                        title={isInactive ? "Reactivate user" : "Deactivate user"}
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
                        onClick={() => setPendingAction({ kind: "delete-user", user: u })}
                        title="Delete user"
                        className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-white/10 dark:text-gray-500 dark:hover:border-red-500/20 dark:hover:bg-red-900/10 dark:hover:text-red-400"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {pendingAction && (
        <ConfirmModal
          action={pendingAction}
          onClose={() => setPendingAction(null)}
          onConfirm={() => executeAction(pendingAction)}
        />
      )}
    </>
  );
}
