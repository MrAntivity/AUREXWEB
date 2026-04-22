"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Handshake,
  TrendingUp,
  Users,
  Globe,
  CheckCircle2,
} from "lucide-react";

const partnerTypes = [
  {
    icon: Globe,
    title: "Distributor Partners",
    description:
      "Regional distributors who want to offer Aurex's digital procurement layer on top of existing supply relationships.",
    perks: ["Co-branded portal access", "Revenue sharing on platform fees", "Joint sales support", "Priority fulfillment"],
  },
  {
    icon: Users,
    title: "Institutional Partners",
    description:
      "University systems, school districts, and research consortia who want white-labeled procurement for their member organizations.",
    perks: ["White-label option", "Consolidated billing", "Dedicated CSM", "Custom approval workflows"],
  },
  {
    icon: TrendingUp,
    title: "Technology Partners",
    description:
      "ERP, LIMS, or inventory system providers who want to integrate with Aurex's procurement API.",
    perks: ["REST API access", "Webhook integrations", "Co-marketing opportunities", "Partner portal listing"],
  },
];

const currentPartners = [
  { name: "Fisher Scientific", type: "Distributor", since: "2023" },
  { name: "VWR International", type: "Distributor", since: "2023" },
  { name: "California State University System", type: "Institution", since: "2024" },
  { name: "EduLab Network", type: "Institution", since: "2024" },
  { name: "LabWare LIMS", type: "Technology", since: "2024" },
  { name: "Quartzy", type: "Technology", since: "2024" },
];

export default function PartnershipsPage() {
  const [form, setForm] = useState({
    name: "", email: "", organization: "", type: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to /api/partnerships or Resend
    setSubmitted(true);
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-hero-pattern py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="section-label text-aurex-teal">Partnerships</p>
          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
            Grow Together with Aurex
          </h1>
          <p className="mt-5 text-lg text-gray-300 max-w-2xl mx-auto">
            We&apos;re building the infrastructure for institutional science procurement.
            Join us as a distributor, institutional partner, or technology integrator.
          </p>
        </div>
      </section>

      {/* Partner Types */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="section-label">Partnership Programs</p>
            <h2 className="section-title mt-2">Three ways to partner</h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {partnerTypes.map((pt) => (
              <div key={pt.title} className="card flex flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50">
                  <pt.icon className="text-aurex-blue" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{pt.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 flex-1">
                  {pt.description}
                </p>
                <ul className="mt-6 flex flex-col gap-2 border-t border-gray-100 pt-5">
                  {pt.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="shrink-0 text-aurex-teal" size={15} />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="section-label">Our Partners</p>
            <h2 className="section-title mt-2">Who we work with</h2>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {currentPartners.map((p) => (
              <div
                key={p.name}
                className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-50">
                  <Handshake className="text-aurex-blue" size={20} />
                </div>
                <p className="mt-3 text-xs font-semibold text-gray-900">{p.name}</p>
                <span className="mt-1 rounded-full bg-aurex-teal/10 px-2 py-0.5 text-xs text-aurex-teal">
                  {p.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="bg-white py-24 sm:py-32" id="inquiry">
        <div className="mx-auto max-w-2xl px-6">
          <div className="text-center">
            <p className="section-label">Get Started</p>
            <h2 className="section-title mt-2">Partnership Inquiry</h2>
            <p className="section-subtitle">
              Tell us about your organization and we&apos;ll reach out within 2 business days.
            </p>
          </div>

          {submitted ? (
            <div className="mt-12 rounded-2xl border border-aurex-teal/30 bg-aurex-teal/5 p-10 text-center">
              <CheckCircle2 className="mx-auto text-aurex-teal" size={40} />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Inquiry Received!</h3>
              <p className="mt-2 text-gray-500">
                Our partnerships team will be in touch within 2 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    className="input"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Dr. Jane Smith"
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
              </div>
              <div>
                <label className="label">Organization</label>
                <input
                  className="input"
                  required
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  placeholder="Your institution or company name"
                />
              </div>
              <div>
                <label className="label">Partnership Type</label>
                <select
                  className="input"
                  required
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="">Select a type...</option>
                  <option value="distributor">Distributor Partner</option>
                  <option value="institutional">Institutional Partner</option>
                  <option value="technology">Technology Partner</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="label">Message</label>
                <textarea
                  className="input min-h-[120px] resize-y"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your organization and what you're looking for..."
                />
              </div>
              <button type="submit" className="btn-primary justify-center py-3.5">
                Submit Inquiry <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
