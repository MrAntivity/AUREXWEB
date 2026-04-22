import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Clock,
  Users,
  Package,
  CheckCircle2,
  Star,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Role-Based Approvals",
    description:
      "Multi-level approval workflows tailored to your institution's hierarchy — from requesters to department heads to super admins.",
  },
  {
    icon: BarChart3,
    title: "Budget Controls",
    description:
      "Set department-level budgets, get real-time spend visibility, and prevent overspending before it happens.",
  },
  {
    icon: Clock,
    title: "Faster Procurement",
    description:
      "Cut procurement cycle time by 70%. Digital purchase orders, automated approvals, and one-click reorders.",
  },
  {
    icon: Package,
    title: "Verified Catalog",
    description:
      "Access thousands of lab-grade supplies — from pipettes to PPE — sourced from verified, compliant manufacturers.",
  },
  {
    icon: Users,
    title: "Multi-Department Support",
    description:
      "Manage Biology, Chemistry, Physics, and more under one institution account with isolated budget pools.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Built-In",
    description:
      "FERPA-aware, audit-ready transaction logs, and export-ready reports for grant accounting and audits.",
  },
];

const comparisons = [
  { feature: "Institutional pricing", aurex: true, thermo: false },
  { feature: "Role-based approval workflows", aurex: true, thermo: false },
  { feature: "Per-department budget controls", aurex: true, thermo: false },
  { feature: "Real-time spend dashboard", aurex: true, thermo: false },
  { feature: "Automated PO generation", aurex: true, thermo: false },
  { feature: "Dedicated school account manager", aurex: true, thermo: false },
  { feature: "Net-30 invoicing", aurex: true, thermo: true },
  { feature: "Product variety", aurex: true, thermo: true },
];

const testimonials = [
  {
    quote:
      "We cut our procurement cycle from 3 weeks to 4 days. The approval workflow alone saved our department admin hours every month.",
    name: "Dr. Sarah Chen",
    role: "Lab Director, Stanford Biology Dept.",
    stars: 5,
  },
  {
    quote:
      "Finally a platform that understands how schools actually operate. Budget controls by department changed everything for us.",
    name: "Marcus Webb",
    role: "Procurement Officer, MIT",
    stars: 5,
  },
  {
    quote:
      "The reporting tools make grant reconciliation so much easier. Our finance team loves it.",
    name: "Dr. Priya Nair",
    role: "Research Coordinator, UC Berkeley",
    stars: 5,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-pattern">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="relative mx-auto max-w-7xl px-6 py-28 sm:py-36 lg:py-44">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-aurex-teal animate-pulse" />
              Now serving 200+ research institutions
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Lab Supply Procurement,{" "}
              <span className="text-aurex-teal">Built for Science</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-300 sm:text-xl">
              Aurex Medical replaces slow, manual procurement with a modern platform your
              entire institution can use — with budget controls, role-based approvals, and
              transparent pricing.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/quote" className="btn-primary px-8 py-3.5 text-base">
                Request a Quote <ArrowRight size={16} />
              </Link>
              <Link href="/portal" className="btn-ghost px-8 py-3.5 text-base">
                Access Portal
              </Link>
            </div>
            <p className="mt-5 text-sm text-gray-400">
              No credit card required · Custom pricing for institutions
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 px-6 py-8 sm:grid-cols-4">
            {[
              { value: "200+", label: "Institutions" },
              { value: "$50M+", label: "Processed annually" },
              { value: "70%", label: "Faster procurement" },
              { value: "99.9%", label: "Uptime SLA" },
            ].map((stat) => (
              <div key={stat.label} className="px-6 text-center first:pl-0 last:pr-0">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="section-label">Platform Features</p>
            <h2 className="section-title mt-2">
              Everything your institution needs, nothing it doesn't
            </h2>
            <p className="section-subtitle mx-auto max-w-2xl">
              Built from the ground up for schools and research labs — not adapted from
              enterprise software that wasn't designed for science.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="card hover:shadow-md transition-shadow">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50">
                  <f.icon className="text-aurex-blue" size={22} />
                </div>
                <h3 className="text-base font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <p className="section-label">Why Aurex?</p>
            <h2 className="section-title mt-2">
              A better alternative to legacy distributors
            </h2>
            <p className="section-subtitle mx-auto max-w-xl">
              Legacy suppliers weren't built for institutional procurement. Aurex was.
            </p>
          </div>
          <div className="mt-12 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="grid grid-cols-3 border-b border-gray-100 bg-gray-50 px-6 py-4">
              <span className="text-sm font-semibold text-gray-500">Feature</span>
              <span className="text-center text-sm font-bold text-aurex-blue">Aurex Medical</span>
              <span className="text-center text-sm font-semibold text-gray-400">Thermo Fisher</span>
            </div>
            {comparisons.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 items-center px-6 py-4 ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                <span className="text-sm text-gray-700">{row.feature}</span>
                <span className="flex justify-center">
                  {row.aurex ? (
                    <CheckCircle2 className="text-aurex-teal" size={20} />
                  ) : (
                    <span className="h-5 w-5 rounded-full border-2 border-gray-200" />
                  )}
                </span>
                <span className="flex justify-center">
                  {row.thermo ? (
                    <CheckCircle2 className="text-gray-400" size={20} />
                  ) : (
                    <span className="h-5 w-5 rounded-full border-2 border-gray-200" />
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="section-label">Testimonials</p>
            <h2 className="section-title mt-2">Trusted by leading institutions</h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card flex flex-col">
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 border-t border-gray-100 pt-4">
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-hero-pattern py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to modernize your lab procurement?
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Join 200+ institutions that have moved beyond spreadsheets and email chains.
            Custom pricing available for schools and research labs.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/quote" className="btn-primary px-8 py-3.5 text-base">
              Request a Quote <ArrowRight size={16} />
            </Link>
            <Link href="/partnerships" className="btn-ghost px-8 py-3.5 text-base">
              Become a Partner
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
