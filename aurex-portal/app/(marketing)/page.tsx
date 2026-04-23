import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Clock,
  Users,
  Package,
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
      "Replace email chains and manual purchase orders with digital workflows, automated approvals, and one-click reorders.",
  },
  {
    icon: Package,
    title: "Our Own Catalog",
    description:
      "Products sourced directly from manufacturers and verified distributors — vetted for quality and compliance before they reach you.",
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
      "Audit-ready transaction logs and export-ready reports for grant accounting and institutional audits.",
  },
];

const comparisons = [
  { feature: "Institutional pricing", aurex: true, thermo: false },
  { feature: "Role-based approval workflows", aurex: true, thermo: false },
  { feature: "Per-department budget controls", aurex: true, thermo: false },
  { feature: "Real-time spend dashboard", aurex: true, thermo: false },
  { feature: "Automated PO generation", aurex: true, thermo: false },
  { feature: "Dedicated account manager", aurex: true, thermo: false },
  { feature: "Net-30 invoicing", aurex: true, thermo: true },
  { feature: "Product variety", aurex: true, thermo: true },
];

export default function HomePage() {
  return (
    <>
      {/* Hero — full viewport, minimal */}
      <section className="relative flex min-h-screen flex-col items-center justify-center bg-dark-bg px-6">
        <div className="text-center">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-gray-600">
            Est. 2024 · Lab Supply Procurement
          </p>
          <h1 className="text-7xl font-extrabold leading-none tracking-tighter text-white sm:text-8xl lg:text-9xl">
            AUREX
            <br />
            <span className="text-aurex-blue">MEDICAL</span>
          </h1>
          <p className="mt-8 text-base text-gray-500 sm:text-lg">
            Lab supplies and procurement software for research institutions.
          </p>
        </div>
        <a
          href="#discover"
          className="absolute bottom-12 flex flex-col items-center gap-2 text-xs font-medium tracking-widest text-gray-600 uppercase transition hover:text-gray-400"
        >
          Discover what we do
          <ArrowDown size={14} className="animate-bounce" />
        </a>
      </section>

      {/* What we are */}
      <section id="discover" className="bg-dark-elevated py-28 sm:py-36">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="section-label">What we are</p>
          <p className="mt-6 text-2xl font-light leading-relaxed text-gray-300 sm:text-3xl">
            Aurex Medical sells lab supplies directly to research institutions — our
            own products alongside offerings from verified distributors and manufacturer
            partners. Everything is available through a single institutional portal,
            with procurement controls built in from the start.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-6 border-t border-white/8 pt-12 sm:grid-cols-3">
            {[
              { heading: "Direct sourcing", body: "We work with manufacturers directly to cut out the middleman and control quality from the source." },
              { heading: "Verified vendors", body: "Every distributor and supplier on our platform is vetted and approved before any product reaches an institution." },
              { heading: "Built for institutions", body: "Budget controls, approval workflows, and per-department purchasing — designed for how research labs actually operate." },
            ].map((item) => (
              <div key={item.heading} className="text-left">
                <h3 className="text-sm font-semibold text-white">{item.heading}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="bg-dark-bg py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="section-label">Platform</p>
            <h2 className="section-title-dark mt-2">
              Everything your institution needs
            </h2>
            <p className="section-subtitle-dark mx-auto max-w-2xl">
              Built from the ground up for schools and research labs — not adapted from
              enterprise software that wasn&apos;t designed for science.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="card-dark group">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-aurex-blue/10 group-hover:bg-aurex-blue/20 transition-colors">
                  <f.icon className="text-aurex-blue" size={20} />
                </div>
                <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-dark-elevated py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <p className="section-label">Why Aurex?</p>
            <h2 className="section-title-dark mt-2">
              Built for institutions, not adapted for them
            </h2>
            <p className="section-subtitle-dark mx-auto max-w-xl">
              Legacy suppliers weren&apos;t designed for institutional procurement. Aurex was.
            </p>
          </div>
          <div className="mt-12 overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-3 border-b border-white/10 bg-white/5 px-6 py-4">
              <span className="text-sm font-semibold text-gray-500">Feature</span>
              <span className="text-center text-sm font-bold text-aurex-blue">Aurex Medical</span>
              <span className="text-center text-sm font-semibold text-gray-600">Thermo Fisher</span>
            </div>
            {comparisons.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 items-center px-6 py-4 ${
                  i % 2 === 0 ? "bg-dark-card" : "bg-dark-elevated"
                }`}
              >
                <span className="text-sm text-gray-400">{row.feature}</span>
                <span className="flex justify-center">
                  {row.aurex ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-aurex-blue/20">
                      <span className="h-2 w-2 rounded-full bg-aurex-blue" />
                    </span>
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-white/20" />
                  )}
                </span>
                <span className="flex justify-center">
                  {row.thermo ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                      <span className="h-2 w-2 rounded-full bg-gray-500" />
                    </span>
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-white/10" />
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-bg py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-gray-500">
            Custom pricing for schools and research institutions. Reach out and we&apos;ll
            put together a catalog and quote tailored to your lab.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/quote" className="btn-primary px-8 py-4 text-base">
              Request a Quote <ArrowRight size={16} />
            </Link>
            <Link href="/products" className="btn-secondary px-8 py-4 text-base">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
