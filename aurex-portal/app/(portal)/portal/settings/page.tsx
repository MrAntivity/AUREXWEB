"use client";

import { useState } from "react";
import { CheckCircle2, Moon, Sun } from "lucide-react";
import { getStoredUser } from "@/lib/mock-auth";
import { useDarkMode } from "@/components/portal/DarkModeProvider";

export default function SettingsPage() {
  const user = getStoredUser();
  const { dark, toggle } = useDarkMode();
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your portal preferences and institution configuration.
        </p>
      </div>

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
        <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
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
            {saved && (
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
