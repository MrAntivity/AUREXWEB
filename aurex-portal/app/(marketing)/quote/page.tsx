"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Clock, Shield, Users } from "lucide-react";

const institutionTypes = [
  "K-12 School / School District",
  "Community College",
  "University / Research University",
  "Medical School",
  "Independent Research Lab",
  "Government Research Agency",
  "Other",
];

const supplyCats = [
  "Pipettes & Tips",
  "PPE & Safety",
  "Syringes & Needles",
  "Reagents & Chemicals",
  "Glassware",
  "Lab Instruments",
  "Tubes & Containers",
  "Filtration",
  "Other",
];

const perks = [
  { icon: Clock, text: "Response within 1 business day" },
  { icon: Shield, text: "Custom institutional pricing" },
  { icon: Users, text: "Dedicated account manager" },
];

export default function QuotePage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    institution: "",
    institutionType: "",
    departments: "",
    users: "",
    annualBudget: "",
    categories: [] as string[],
    currentProcess: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function toggleCategory(cat: string) {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to /api/quote or Resend
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 py-24 px-6">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-aurex-teal/10">
            <CheckCircle2 className="text-aurex-teal" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Quote Request Received!</h1>
          <p className="mt-3 text-gray-500">
            Thanks for reaching out. Our team will review your information and follow up
            with a custom proposal within 1 business day.
          </p>
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              What happens next
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {[
                "Our team reviews your institution type and needs",
                "We prepare a custom pricing proposal",
                "30-min intro call to walk through the platform",
                "Pilot access within 5 business days",
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-aurex-blue text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-hero-pattern py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="section-label text-aurex-teal">Pricing</p>
          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
            Get Custom Institutional Pricing
          </h1>
          <p className="mt-5 text-lg text-gray-300 max-w-xl mx-auto">
            No generic list prices. Tell us about your institution and we&apos;ll build
            a custom proposal with volume discounts.
          </p>
          <div className="mt-8 flex items-center justify-center gap-8">
            {perks.map((p) => (
              <div key={p.text} className="flex items-center gap-2 text-sm text-gray-300">
                <p.icon className="text-aurex-teal" size={15} />
                {p.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact */}
            <div className="card">
              <h2 className="mb-6 text-base font-semibold text-gray-900">
                Your Contact Information
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="label">First Name</label>
                  <input
                    className="input"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input
                    className="input"
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    placeholder="Smith"
                  />
                </div>
                <div>
                  <label className="label">Work Email</label>
                  <input
                    className="input"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@university.edu"
                  />
                </div>
                <div>
                  <label className="label">Phone (optional)</label>
                  <input
                    className="input"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Institution */}
            <div className="card">
              <h2 className="mb-6 text-base font-semibold text-gray-900">
                About Your Institution
              </h2>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="label">Institution Name</label>
                  <input
                    className="input"
                    required
                    value={form.institution}
                    onChange={(e) => setForm({ ...form, institution: e.target.value })}
                    placeholder="Stanford University"
                  />
                </div>
                <div>
                  <label className="label">Institution Type</label>
                  <select
                    className="input"
                    required
                    value={form.institutionType}
                    onChange={(e) => setForm({ ...form, institutionType: e.target.value })}
                  >
                    <option value="">Select type...</option>
                    {institutionTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label">Number of Departments</label>
                    <input
                      className="input"
                      type="number"
                      min="1"
                      value={form.departments}
                      onChange={(e) => setForm({ ...form, departments: e.target.value })}
                      placeholder="e.g. 5"
                    />
                  </div>
                  <div>
                    <label className="label">Expected Portal Users</label>
                    <select
                      className="input"
                      value={form.users}
                      onChange={(e) => setForm({ ...form, users: e.target.value })}
                    >
                      <option value="">Select range...</option>
                      <option>1–10</option>
                      <option>11–50</option>
                      <option>51–200</option>
                      <option>200+</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Estimated Annual Supply Budget</label>
                  <select
                    className="input"
                    value={form.annualBudget}
                    onChange={(e) => setForm({ ...form, annualBudget: e.target.value })}
                  >
                    <option value="">Select range...</option>
                    <option>Under $25,000</option>
                    <option>$25,000 – $100,000</option>
                    <option>$100,000 – $500,000</option>
                    <option>$500,000 – $2M</option>
                    <option>$2M+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Supply needs */}
            <div className="card">
              <h2 className="mb-2 text-base font-semibold text-gray-900">
                Supply Categories Needed
              </h2>
              <p className="mb-5 text-sm text-gray-500">Select all that apply.</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {supplyCats.map((cat) => {
                  const selected = form.categories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                        selected
                          ? "border-aurex-blue bg-navy-50 font-medium text-aurex-blue"
                          : "border-gray-200 text-gray-600 hover:border-aurex-blue/40"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current process + notes */}
            <div className="card">
              <h2 className="mb-6 text-base font-semibold text-gray-900">
                Additional Details
              </h2>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="label">Current procurement process</label>
                  <select
                    className="input"
                    value={form.currentProcess}
                    onChange={(e) => setForm({ ...form, currentProcess: e.target.value })}
                  >
                    <option value="">Select...</option>
                    <option>Spreadsheets + email</option>
                    <option>Paper PO forms</option>
                    <option>Another software (e.g. SAP, Coupa)</option>
                    <option>Direct supplier ordering (no system)</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Anything else we should know?</label>
                  <textarea
                    className="input min-h-[100px] resize-y"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Special requirements, timeline, grant constraints..."
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-4 text-base">
              Submit Quote Request <ArrowRight size={16} />
            </button>
            <p className="text-center text-xs text-gray-400">
              By submitting, you agree to our Privacy Policy. We&apos;ll never share your
              information with third parties.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
