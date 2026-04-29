"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Users,
  TrendingUp,
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
      "University systems, school districts, and research consortia who want modern procurement for their member organizations.",
    perks: ["White-label option", "Consolidated billing", "Dedicated account manager", "Custom approval workflows"],
  },
  {
    icon: TrendingUp,
    title: "Technology Partners",
    description:
      "ERP, LIMS, or inventory system providers who want to integrate with Aurex's procurement API.",
    perks: ["REST API access", "Webhook integrations", "Co-marketing opportunities", "Partner portal listing"],
  },
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
      <section className="bg-dark-bg px-6 pt-28 pb-20 sm:pt-36 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-label">Partnerships</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Build something better, together
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
            We&apos;re building infrastructure for institutional science procurement.
            Join us as a distributor, institutional partner, or technology integrator.
          </p>
        </div>
      </section>

      {/* Who we work with */}
      <section className="bg-dark-elevated py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="section-label">Who we work with</p>
          <h2 className="section-title-dark mt-2">Universities and higher education institutions</h2>
          <p className="section-subtitle-dark mx-auto max-w-2xl">
            Aurex is built for academic and research environments — universities, colleges,
            and research institutions that need modern procurement infrastructure with the
            controls and accountability that institutional purchasing requires.
          </p>

          {/* Scrolling school names */}
          <p className="mt-12 text-xs font-semibold uppercase tracking-[0.3em] text-gray-600">
            Used in labs at
          </p>
          <div className="mt-8 overflow-hidden">
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .marquee-track {
                display: flex;
                width: max-content;
                animation: marquee 18s linear infinite;
              }
            `}</style>
            <div className="marquee-track">
              {[
                "Boston University",
                "Northeastern University",
                "New York University",
                "Boston University",
                "Northeastern University",
                "New York University",
              ].map((name, i) => (
                <span
                  key={i}
                  className="mx-10 text-3xl sm:text-4xl font-extrabold tracking-tight text-white/20 whitespace-nowrap select-none"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-10 text-sm text-gray-600">
            If you represent a university, research lab, or higher education institution,
            we&apos;d love to talk.
          </p>
          <a href="#inquiry" className="btn-primary mt-6 inline-flex px-6 py-3">
            Get in touch <ArrowRight size={15} />
          </a>
        </div>
      </section>

      {/* Partner Types */}
      <section className="bg-dark-bg py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="section-label">Partnership Programs</p>
            <h2 className="section-title-dark mt-2">Three ways to partner</h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {partnerTypes.map((pt) => (
              <div key={pt.title} className="card-dark flex flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-aurex-blue/10">
                  <pt.icon className="text-aurex-blue" size={22} />
                </div>
                <h3 className="text-base font-semibold text-white">{pt.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 flex-1">
                  {pt.description}
                </p>
                <ul className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-5">
                  {pt.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle2 className="shrink-0 text-aurex-blue/60" size={14} />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="bg-dark-elevated py-24 sm:py-32" id="inquiry">
        <div className="mx-auto max-w-2xl px-6">
          <div className="text-center">
            <p className="section-label">Get Started</p>
            <h2 className="section-title-dark mt-2">Partnership Inquiry</h2>
            <p className="section-subtitle-dark">
              Tell us about your organization and we&apos;ll reach out within 2 business days.
            </p>
          </div>

          {submitted ? (
            <div className="mt-12 rounded-2xl border border-aurex-blue/20 bg-aurex-blue/5 p-10 text-center">
              <CheckCircle2 className="mx-auto text-aurex-blue" size={40} />
              <h3 className="mt-4 text-xl font-semibold text-white">Inquiry Received</h3>
              <p className="mt-2 text-gray-500">
                Our partnerships team will be in touch within 2 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="label-dark">Full Name</label>
                  <input
                    className="input-dark"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Dr. Jane Smith"
                  />
                </div>
                <div>
                  <label className="label-dark">Work Email</label>
                  <input
                    className="input-dark"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@university.edu"
                  />
                </div>
              </div>
              <div>
                <label className="label-dark">Organization</label>
                <input
                  className="input-dark"
                  required
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  placeholder="Your institution or company name"
                />
              </div>
              <div>
                <label className="label-dark">Partnership Type</label>
                <select
                  className="input-dark"
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
                <label className="label-dark">Message</label>
                <textarea
                  className="input-dark min-h-[120px] resize-y"
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
