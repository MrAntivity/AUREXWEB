import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingCart,
  MapPin,
  BarChart3,
  ShieldCheck,
  FileText,
  RefreshCw,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Solutions — Aurex Medical",
  description:
    "See how Aurex Medical transforms lab procurement — from ordering to approvals, spend tracking, and reporting, all in one platform.",
};

const pillars = [
  {
    icon: ShoppingCart,
    title: "Order anything, instantly",
    description:
      "Browse your institution's full catalog and place orders in seconds. No calls, no emails, no paper forms. Reorder past items with one click.",
  },
  {
    icon: MapPin,
    title: "Track every order, end to end",
    description:
      "From the moment an order is submitted to the day it hits your lab bench — know exactly where it is and who touched it.",
  },
  {
    icon: BarChart3,
    title: "See where every dollar goes",
    description:
      "Real-time spend dashboards by department, by category, by user. No more waiting until month-end to find out you're over budget.",
  },
];

const features = [
  {
    icon: ShieldCheck,
    label: "Approval Workflows",
    title: "Built around your institution's chain of command",
    body: "Orders route automatically through the right people — PI to department head to procurement officer — based on order size, category, or department rules you define. No one gets bypassed. Nothing falls through the cracks.",
  },
  {
    icon: BarChart3,
    label: "Budget Controls",
    title: "Set budgets. Get alerts. Never overspend.",
    body: "Assign budgets at the department, grant, or project level. Aurex tracks spend in real time and flags orders that would push you over. Researchers see their remaining budget before they even submit — so surprises don't happen.",
  },
  {
    icon: MapPin,
    label: "Order Tracking",
    title: "Full visibility from submission to delivery",
    body: "Every order has a full audit trail: who requested it, who approved it, when it shipped, when it arrived. Your team always knows the status — and so do you. No more chasing vendors for updates.",
  },
  {
    icon: RefreshCw,
    label: "Reorders",
    title: "Reorder in one click, every time",
    body: "Your catalog remembers everything your lab has ever ordered. Restocking routine supplies takes seconds, not a full purchase order process. Reorder history is tied to your department so the right budget gets charged automatically.",
  },
  {
    icon: FileText,
    label: "Reporting",
    title: "Audit-ready reports, always",
    body: "Export spend summaries, order histories, and budget utilization reports with one click. Formatted for grant reconciliation, finance audits, and department reviews. No spreadsheet wrangling required.",
  },
];

export default function SolutionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-dark-bg px-6 pt-28 pb-20 sm:pt-36 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-label">The Platform</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your entire lab procurement,<br />
            <span className="text-aurex-blue">under one roof</span>
          </h1>
          <p className="mt-6 text-lg text-gray-500">
            Ordering, approvals, spend tracking, and reporting — all in a single portal
            built specifically for research institutions.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/quote" className="btn-primary px-8 py-4 text-base">
              Request a Demo <ArrowRight size={16} />
            </Link>
            <Link href="/products" className="btn-secondary px-8 py-4 text-base">
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      {/* Three pillars */}
      <section className="bg-dark-elevated py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.title} className="card-dark">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-aurex-blue/10">
                  <p.icon className="text-aurex-blue" size={20} />
                </div>
                <h3 className="text-base font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature deep-dives */}
      <section className="bg-dark-bg py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <p className="section-label">How it works</p>
            <h2 className="section-title-dark mt-2">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="section-subtitle-dark mx-auto max-w-xl">
              Aurex is designed to match how research institutions actually operate —
              not force them to adapt to software built for someone else.
            </p>
          </div>

          <div className="mt-20 flex flex-col gap-16">
            {features.map((f, i) => (
              <div
                key={f.label}
                className={`flex flex-col gap-8 md:flex-row md:items-center ${
                  i % 2 !== 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1">
                  <p className="section-label">{f.label}</p>
                  <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                    {f.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-gray-400">{f.body}</p>
                </div>
                <div className="flex h-48 w-full flex-1 items-center justify-center rounded-2xl border border-white/10 bg-dark-card md:h-56">
                  <f.icon className="text-aurex-blue/30" size={64} strokeWidth={1} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-elevated py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            See it for yourself
          </h2>
          <p className="mt-4 text-gray-500">
            We&apos;ll walk you through the platform and show you exactly how it fits
            your institution&apos;s workflow. No commitment required.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/quote" className="btn-primary px-8 py-4 text-base">
              Request a Demo <ArrowRight size={16} />
            </Link>
            <Link href="/partnerships" className="btn-secondary px-8 py-4 text-base">
              Partner with Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
