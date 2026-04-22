"use client";

import { useState } from "react";
import { getStoredUser } from "@/lib/mock-auth";
import { CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const user = getStoredUser();
  const [saved, setSaved] = useState(false);

  if (user?.role !== "super_admin") {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        Settings are restricted to Super Admins.
      </div>
    );
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Institution-level configuration for Aurex Medical portal.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
        {/* Institution */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Institution</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Institution Name" defaultValue="Aurex Medical Research Institute" />
            <Field label="Institution Code" defaultValue="AMRI-001" />
            <Field label="Primary Contact Email" defaultValue="admin@aurex.dev" type="email" />
            <Field label="Billing Address" defaultValue="123 Lab Way, San Francisco CA" />
          </div>
        </div>

        {/* Approval thresholds */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Approval Thresholds</h2>
          <p className="text-xs text-gray-400">
            Orders above these amounts require elevated approval.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Dept Admin threshold ($)" defaultValue="500" type="number" />
            <Field label="Super Admin threshold ($)" defaultValue="2500" type="number" />
          </div>
        </div>

        {/* Notifications */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Notifications</h2>
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
              <span className="text-sm text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>

        {/* Actions */}
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
      <label className="mb-1.5 block text-xs font-medium text-gray-700">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-aurex-blue focus:outline-none focus:ring-1 focus:ring-aurex-blue"
      />
    </div>
  );
}
