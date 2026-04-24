"use client";

import { useState, useEffect } from "react";
import {
  User, Palette, Lock, Briefcase, Moon, Sun,
  CheckCircle2, Eye, EyeOff, Clock, Shield,
} from "lucide-react";
import {
  getStoredStaffUser,
  updateStaffProfile,
  changeStaffPassword,
} from "@/lib/staff-auth";
import type { StaffUser } from "@/lib/staff-auth";
import { useStaffDarkMode } from "@/components/staff/StaffDarkModeProvider";

type Tab = "account" | "appearance" | "twofa" | "role";

const TABS: { id: Tab; label: string; icon: React.ElementType; soon?: boolean }[] = [
  { id: "account",    label: "Account & Security", icon: User },
  { id: "appearance", label: "Appearance",          icon: Palette },
  { id: "twofa",      label: "Two-Factor Auth",     icon: Lock,     soon: true },
  { id: "role",       label: "Role in Company",     icon: Briefcase },
];

export default function StaffSettingsPage() {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [tab, setTab] = useState<Tab>("account");
  const { dark, toggle } = useStaffDarkMode();

  // Account fields
  const [displayName, setDisplayName] = useState("");
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    const stored = getStoredStaffUser();
    setUser(stored);
    if (stored) setDisplayName(stored.name);
  }, []);

  function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setProfileError("");

    const nameChanged = displayName.trim() && displayName.trim() !== user.name;
    const changingPwd = currentPwd || newPwd || confirmPwd;

    if (changingPwd) {
      if (!currentPwd) { setProfileError("Enter your current password."); return; }
      if (newPwd.length < 6) { setProfileError("New password must be at least 6 characters."); return; }
      if (newPwd !== confirmPwd) { setProfileError("New passwords do not match."); return; }
      const result = changeStaffPassword(user.email, currentPwd, newPwd);
      if (!result.ok) { setProfileError(result.error); return; }
    }

    if (nameChanged) updateStaffProfile(user.email, { name: displayName.trim() });

    const updated = getStoredStaffUser();
    setUser(updated);
    if (updated) setDisplayName(updated.name);
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your staff account and preferences.
        </p>
      </div>

      <div className="flex gap-8">
        {/* Left nav */}
        <aside className="w-52 shrink-0">
          <nav className="space-y-0.5">
            {TABS.map(({ id, label, icon: Icon, soon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  tab === id
                    ? "bg-aurex-blue/10 text-aurex-blue"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
                }`}
              >
                <Icon
                  size={15}
                  className={tab === id ? "text-aurex-blue" : "text-gray-400 dark:text-gray-600"}
                />
                <span className="flex-1">{label}</span>
                {soon && (
                  <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 dark:bg-white/5 dark:text-gray-600">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Right content */}
        <div className="min-w-0 flex-1">

          {/* Account & Security */}
          {tab === "account" && (
            <form onSubmit={handleProfileSave} className="space-y-5 max-w-2xl">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#1a1a2a]">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Account & Security</h2>
                <p className="mt-0.5 text-xs text-gray-400">Update your display name or change your password.</p>

                <div className="mt-5">
                  <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-400">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-aurex-blue focus:outline-none focus:ring-1 focus:ring-aurex-blue dark:border-white/10 dark:bg-[#131320] dark:text-white"
                  />
                </div>

                <div className="mt-5 border-t border-gray-100 pt-4 dark:border-white/8">
                  <p className="mb-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                    Change Password{" "}
                    <span className="font-normal text-gray-400 dark:text-gray-600">(leave blank to keep current)</span>
                  </p>
                  <div className="space-y-3">
                    <PwdField label="Current password" value={currentPwd} onChange={setCurrentPwd} show={showCurrent} onToggle={() => setShowCurrent((v) => !v)} placeholder="Your current password" auto="current-password" />
                    <PwdField label="New password" value={newPwd} onChange={setNewPwd} show={showNew} onToggle={() => setShowNew((v) => !v)} placeholder="Min. 6 characters" auto="new-password" />
                    <PwdField label="Confirm new password" value={confirmPwd} onChange={setConfirmPwd} show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} placeholder="Repeat new password" auto="new-password" />
                  </div>
                </div>

                {profileError && (
                  <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                    {profileError}
                  </p>
                )}

                <div className="mt-5 flex items-center gap-3">
                  <button
                    type="submit"
                    className="rounded-lg bg-aurex-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-aurex-blue-light"
                  >
                    Save Changes
                  </button>
                  {profileSaved && (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                      <CheckCircle2 size={15} /> Saved
                    </span>
                  )}
                </div>
              </div>
            </form>
          )}

          {/* Appearance */}
          {tab === "appearance" && (
            <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#1a1a2a]">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Appearance</h2>
              <p className="mt-0.5 text-xs text-gray-400">Customize the look of the staff portal.</p>

              <div className="mt-5 flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3.5 dark:border-white/8 dark:bg-white/3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-[#1a1a2a]">
                    {dark
                      ? <Moon size={16} className="text-aurex-blue" />
                      : <Sun size={16} className="text-amber-500" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p>
                    <p className="text-xs text-gray-400">Switch the staff portal to a dark theme</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-aurex-blue focus:ring-offset-2 dark:focus:ring-offset-[#1a1a2a] ${
                    dark ? "bg-aurex-blue" : "bg-gray-200"
                  }`}
                  role="switch"
                  aria-checked={dark}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                      dark ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => !dark || toggle()}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-all ${
                    !dark
                      ? "border-aurex-blue bg-aurex-blue/5 ring-1 ring-aurex-blue"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-white/10 dark:bg-white/3 dark:hover:border-white/20"
                  }`}
                >
                  <div className="flex h-12 w-full items-center justify-center rounded-md bg-white border border-gray-200 shadow-sm">
                    <div className="flex gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-200" />
                      <div className="h-2 w-8 rounded bg-gray-100" />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => dark || toggle()}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-all ${
                    dark
                      ? "border-aurex-blue bg-aurex-blue/5 ring-1 ring-aurex-blue dark:bg-aurex-blue/10"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-white/10 dark:bg-white/3 dark:hover:border-white/20"
                  }`}
                >
                  <div className="flex h-12 w-full items-center justify-center rounded-md bg-[#0c0c13] border border-white/10">
                    <div className="flex gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-white/20" />
                      <div className="h-2 w-8 rounded bg-white/10" />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Dark</span>
                </button>
              </div>
            </div>
          )}

          {/* Two-Factor Auth */}
          {tab === "twofa" && (
            <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#1a1a2a]">
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5">
                  <Shield size={24} className="text-gray-300 dark:text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</p>
                  <p className="mt-2 max-w-xs text-sm text-gray-400">
                    Add an extra layer of security to your account with an authenticator app or hardware key.
                  </p>
                  <span className="mt-4 inline-block rounded-full bg-aurex-blue/10 px-3 py-1 text-xs font-semibold text-aurex-blue">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Role in Company */}
          {tab === "role" && (
            <div className="max-w-2xl space-y-4">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#1a1a2a]">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Role in Company</h2>
                <p className="mt-0.5 text-xs text-gray-400">Your Aurex Medical staff role and access level.</p>

                <div className="mt-5 space-y-0 divide-y divide-gray-100 dark:divide-white/8">
                  <RoleRow label="Full Name" value={user?.name ?? "—"} />
                  <RoleRow label="Email" value={user?.email ?? "—"} />
                  <RoleRow label="Job Title" value={user?.role ?? "—"} />
                  <RoleRow label="Access Level" value="Full Staff Access" />
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-white/8 dark:bg-white/3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Role assignments are managed by Aurex system administrators. Contact{" "}
                  <a href="mailto:hello@aurexmedical.com" className="text-aurex-blue hover:underline">
                    hello@aurexmedical.com
                  </a>{" "}
                  to request a role change.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PwdField({
  label, value, onChange, show, onToggle, placeholder, auto,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder?: string;
  auto?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-400">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={auto}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-9 text-sm text-gray-900 focus:border-aurex-blue focus:outline-none focus:ring-1 focus:ring-aurex-blue dark:border-white/10 dark:bg-[#131320] dark:text-white dark:placeholder-gray-600"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          tabIndex={-1}
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

function RoleRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}
