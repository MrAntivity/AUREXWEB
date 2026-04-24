"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Moon, Sun, Eye, EyeOff } from "lucide-react";
import {
  getStoredUser,
  updateUserProfile,
  changePassword,
} from "@/lib/mock-auth";
import type { MockUser } from "@/lib/mock-auth";
import { useDarkMode } from "@/components/portal/DarkModeProvider";
import { BUDGET_WARNING_KEY } from "@/lib/store";

export default function SettingsPage() {
  const [user, setUser] = useState<MockUser | null>(null);
  const { dark, toggle } = useDarkMode();

  // Profile state
  const [displayName, setDisplayName] = useState("");
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Institution state
  const [instSaved, setInstSaved] = useState(false);
  const [budgetWarningPct, setBudgetWarningPct] = useState("80");

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    if (stored) setDisplayName(stored.name);
    try {
      const raw = localStorage.getItem(BUDGET_WARNING_KEY);
      if (raw !== null) setBudgetWarningPct(raw);
    } catch { /* ignore */ }
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
      const result = changePassword(user.email, currentPwd, newPwd);
      if (!result.ok) { setProfileError(result.error); return; }
    }

    if (nameChanged) {
      updateUserProfile(user.email, { name: displayName.trim() });
    }

    // Refresh user from session
    const updated = getStoredUser();
    setUser(updated);
    if (updated) setDisplayName(updated.name);
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  }

  function handleInstSave(e: React.FormEvent) {
    e.preventDefault();
    const val = parseFloat(budgetWarningPct);
    if (!isNaN(val) && val > 0 && val <= 100) {
      localStorage.setItem(BUDGET_WARNING_KEY, String(val));
    }
    setInstSaved(true);
    setTimeout(() => setInstSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your portal preferences and institution configuration.
        </p>
      </div>

      {/* My Profile — visible to all users */}
      <form onSubmit={handleProfileSave} className="card space-y-5 max-w-2xl">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">My Profile</h2>
          <p className="mt-0.5 text-xs text-gray-400">Update your display name or change your password.</p>
        </div>

        <div>
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

        <div className="border-t border-gray-100 pt-4 dark:border-white/8">
          <p className="mb-3 text-xs font-medium text-gray-500 dark:text-gray-400">
            Change Password <span className="font-normal text-gray-400 dark:text-gray-600">(leave blank to keep current)</span>
          </p>
          <div className="space-y-3">
            <PasswordField
              label="Current password"
              value={currentPwd}
              onChange={setCurrentPwd}
              show={showCurrentPwd}
              onToggleShow={() => setShowCurrentPwd((v) => !v)}
              placeholder="Your current password"
              autoComplete="current-password"
            />
            <PasswordField
              label="New password"
              value={newPwd}
              onChange={setNewPwd}
              show={showNewPwd}
              onToggleShow={() => setShowNewPwd((v) => !v)}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
            />
            <PasswordField
              label="Confirm new password"
              value={confirmPwd}
              onChange={setConfirmPwd}
              show={showConfirmPwd}
              onToggleShow={() => setShowConfirmPwd((v) => !v)}
              placeholder="Repeat new password"
              autoComplete="new-password"
            />
          </div>
        </div>

        {profileError && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            {profileError}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-aurex-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-aurex-blue-light"
          >
            Save Profile
          </button>
          {profileSaved && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
              <CheckCircle2 size={15} /> Saved
            </span>
          )}
        </div>
      </form>

      {/* Appearance — visible to all users */}
      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Appearance</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5">
              {dark ? <Moon size={16} className="text-aurex-blue" /> : <Sun size={16} className="text-gray-500" />}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p>
              <p className="text-xs text-gray-400">Switch the portal to a dark theme</p>
            </div>
          </div>
          <button
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
      </div>

      {/* Institution settings — super admin only */}
      {user?.role === "super_admin" ? (
        <form onSubmit={handleInstSave} className="space-y-5 max-w-2xl">
          <div className="card space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Institution</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Institution Name" defaultValue="Aurex Medical Research Institute" />
              <Field label="Institution Code" defaultValue="AMRI-001" />
              <Field label="Primary Contact Email" defaultValue="admin@aurex.dev" type="email" />
              <Field label="Billing Address" defaultValue="123 Lab Way, San Francisco CA" />
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Approval Thresholds</h2>
            <p className="text-xs text-gray-400">
              Orders above these amounts require elevated approval.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Dept Admin threshold ($)" defaultValue="500" type="number" />
              <Field label="Super Admin threshold ($)" defaultValue="2500" type="number" />
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Budget Alerts</h2>
            <p className="text-xs text-gray-400">
              Show a warning on the dashboard when a department reaches this percentage of their budget.
            </p>
            <div className="max-w-[160px]">
              <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-400">
                Warning threshold (%)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={budgetWarningPct}
                onChange={(e) => setBudgetWarningPct(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-aurex-blue focus:outline-none focus:ring-1 focus:ring-aurex-blue dark:border-white/10 dark:bg-[#1a1a2a] dark:text-white"
              />
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h2>
            {[
              { label: "Email on new order submitted", defaultChecked: true },
              { label: "Email on order approved", defaultChecked: true },
              { label: "Email on order rejected", defaultChecked: true },
              { label: "Weekly spend summary digest", defaultChecked: false },
            ].map((item) => (
              <label key={item.label} className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked={item.defaultChecked}
                  className="h-4 w-4 rounded border-gray-300 text-aurex-blue focus:ring-aurex-blue"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-lg bg-aurex-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-aurex-blue-light"
            >
              Save Changes
            </button>
            {instSaved && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                <CheckCircle2 size={15} /> Saved
              </span>
            )}
          </div>
        </form>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4 dark:border-white/8 dark:bg-white/3">
          <p className="text-sm text-gray-500">
            Institution configuration is restricted to Super Admins.
          </p>
        </div>
      )}
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggleShow,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggleShow: () => void;
  placeholder?: string;
  autoComplete?: string;
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
          autoComplete={autoComplete}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-9 text-sm text-gray-900 focus:border-aurex-blue focus:outline-none focus:ring-1 focus:ring-aurex-blue dark:border-white/10 dark:bg-[#131320] dark:text-white dark:placeholder-gray-600"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          tabIndex={-1}
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-400">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-aurex-blue focus:outline-none focus:ring-1 focus:ring-aurex-blue dark:border-white/10 dark:bg-[#1a1a2a] dark:text-white"
      />
    </div>
  );
}
