import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const features = [
  {
    index: "01",
    title: "Role-Based Approvals",
    description:
      "Multi-level approval workflows tailored to your institution's hierarchy — from requesters to department heads to super admins.",
  },
  {
    index: "02",
    title: "Budget Controls",
    description:
      "Set department-level budgets, get real-time spend visibility, and prevent overspending before it happens.",
  },
  {
    index: "03",
    title: "Faster Procurement",
    description:
      "Replace email chains and manual purchase orders with digital workflows, automated approvals, and one-click reorders.",
  },
  {
    index: "04",
    title: "Our Own Catalog",
    description:
      "Products sourced directly from manufacturers and verified distributors — vetted for quality and compliance before they reach you.",
  },
  {
    index: "05",
    title: "Multi-Department Support",
    description:
      "Manage Biology, Chemistry, Physics, and more under one institution account with isolated budget pools.",
  },
  {
    index: "06",
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
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section
        className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-end overflow-hidden px-8 pb-16 pt-32 sm:px-12 lg:px-16"
        style={{ backgroundColor: "var(--mkt-bg)" }}
      >
        {/* Precision grid — fades toward bottom-right */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, oklch(96% 0.007 55) 0px, oklch(96% 0.007 55) 1px, transparent 1px, transparent 72px), repeating-linear-gradient(90deg, oklch(96% 0.007 55) 0px, oklch(96% 0.007 55) 1px, transparent 1px, transparent 72px)",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 20% 30%, white 20%, transparent 80%)",
          }}
        />

        <div className="relative animate-fade-up">
          <p
            className="mb-6 text-[10px] font-medium uppercase tracking-[0.55em]"
            style={{ color: "var(--mkt-text-muted)" }}
          >
            Est. 2026 · Lab Supply Procurement
          </p>

          <h1
            className="font-display font-black uppercase leading-[0.82] tracking-[-0.01em]"
            style={{
              color: "var(--mkt-text)",
              fontSize: "clamp(5.5rem, 16vw, 16rem)",
            }}
          >
            Aurex
            <br />
            <span style={{ color: "var(--mkt-accent)" }}>Medical</span>
          </h1>

          <div
            className="my-8 h-px"
            style={{ backgroundColor: "var(--mkt-border)" }}
          />

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p
              className="max-w-[42ch] text-base leading-relaxed animate-fade-up animation-delay-100"
              style={{ color: "var(--mkt-text-secondary)" }}
            >
              Lab supplies and procurement software for research institutions.
              Built for how science actually operates.
            </p>
            <div className="flex shrink-0 gap-3 animate-fade-up animation-delay-200">
              <Link href="/quote" className="btn-primary">
                Request a Demo <ArrowRight size={15} />
              </Link>
              <Link href="/products" className="btn-secondary">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── What we are ──────────────────────────────────────────────── */}
      <section
        id="discover"
        className="py-24 sm:py-32"
        style={{
          backgroundColor: "var(--mkt-bg-elevated)",
          borderTop: "1px solid var(--mkt-border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-8 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
            <div className="pt-1">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.5em]"
                style={{ color: "var(--mkt-accent)" }}
              >
                01 / What we are
              </p>
            </div>

            <div>
              <p
                className="text-2xl font-light leading-relaxed sm:text-3xl"
                style={{ color: "var(--mkt-text)" }}
              >
                Aurex Medical sells lab supplies directly to research
                institutions — our own products alongside offerings from
                verified distributors and manufacturer partners. Everything
                available through a single institutional portal, with
                procurement controls built in from the start.
              </p>

              <div
                className="mt-12 divide-y"
                style={{ borderColor: "var(--mkt-border)" }}
              >
                {[
                  {
                    n: "01",
                    heading: "Direct sourcing",
                    body: "We work with manufacturers directly to cut out the middleman and control quality from the source.",
                  },
                  {
                    n: "02",
                    heading: "Verified vendors",
                    body: "Every distributor and supplier on our platform is vetted and approved before any product reaches an institution.",
                  },
                  {
                    n: "03",
                    heading: "Built for institutions",
                    body: "Budget controls, approval workflows, and per-department purchasing — designed for how research labs actually operate.",
                  },
                ].map((item) => (
                  <div
                    key={item.heading}
                    className="flex gap-8 py-6"
                    style={{ borderColor: "var(--mkt-border)" }}
                  >
                    <span
                      className="shrink-0 pt-0.5 text-[10px] font-semibold tracking-[0.4em]"
                      style={{ color: "var(--mkt-text-muted)" }}
                    >
                      {item.n}
                    </span>
                    <div>
                      <h3
                        className="text-sm font-semibold"
                        style={{ color: "var(--mkt-text)" }}
                      >
                        {item.heading}
                      </h3>
                      <p
                        className="mt-1.5 max-w-[55ch] text-sm leading-relaxed"
                        style={{ color: "var(--mkt-text-secondary)" }}
                      >
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Platform Features ────────────────────────────────────────── */}
      <section
        className="py-24 sm:py-32"
        style={{
          backgroundColor: "var(--mkt-bg)",
          borderTop: "1px solid var(--mkt-border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-8 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.5em]"
                style={{ color: "var(--mkt-accent)" }}
              >
                02 / Platform
              </p>
              <h2
                className="mt-4 font-display text-5xl font-black uppercase leading-tight"
                style={{ color: "var(--mkt-text)" }}
              >
                Everything
                <br />
                your institution
                <br />
                needs
              </h2>
              <p
                className="mt-4 max-w-[30ch] text-sm leading-relaxed"
                style={{ color: "var(--mkt-text-secondary)" }}
              >
                Built from the ground up for schools and research labs — not
                adapted from enterprise software that wasn&apos;t designed for
                science.
              </p>
            </div>

            <div
              className="divide-y"
              style={{ borderColor: "var(--mkt-border)" }}
            >
              {features.map((f) => (
                <div
                  key={f.title}
                  className="grid grid-cols-[3rem_1fr] gap-6 py-6"
                  style={{ borderColor: "var(--mkt-border)" }}
                >
                  <span
                    className="pt-0.5 text-[10px] font-semibold tracking-[0.4em]"
                    style={{ color: "var(--mkt-text-muted)" }}
                  >
                    {f.index}
                  </span>
                  <div>
                    <h3
                      className="font-display text-xl font-bold uppercase tracking-wide"
                      style={{ color: "var(--mkt-text)" }}
                    >
                      {f.title}
                    </h3>
                    <p
                      className="mt-2 max-w-[60ch] text-sm leading-relaxed"
                      style={{ color: "var(--mkt-text-secondary)" }}
                    >
                      {f.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Comparison ───────────────────────────────────────────────── */}
      <section
        className="py-24 sm:py-32"
        style={{
          backgroundColor: "var(--mkt-bg-elevated)",
          borderTop: "1px solid var(--mkt-border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-8 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.5em]"
                style={{ color: "var(--mkt-accent)" }}
              >
                03 / Why Aurex?
              </p>
              <h2
                className="mt-4 font-display text-5xl font-black uppercase leading-tight"
                style={{ color: "var(--mkt-text)" }}
              >
                Built for
                <br />
                institutions.
                <br />
                Not adapted.
              </h2>
              <p
                className="mt-4 max-w-[28ch] text-sm leading-relaxed"
                style={{ color: "var(--mkt-text-secondary)" }}
              >
                Legacy suppliers weren&apos;t designed for institutional
                procurement. Aurex was.
              </p>
            </div>

            <div>
              <table className="w-full border-collapse">
                <thead>
                  <tr
                    style={{ borderBottom: "1px solid var(--mkt-border)" }}
                  >
                    <th
                      className="pb-4 text-left text-[10px] font-semibold uppercase tracking-[0.4em]"
                      style={{ color: "var(--mkt-text-muted)" }}
                    >
                      Feature
                    </th>
                    <th
                      className="w-32 pb-4 text-center text-xs font-bold uppercase tracking-[0.15em]"
                      style={{ color: "var(--mkt-accent)" }}
                    >
                      Aurex Medical
                    </th>
                    <th
                      className="w-32 pb-4 text-center text-xs font-semibold uppercase tracking-[0.15em]"
                      style={{ color: "var(--mkt-text-muted)" }}
                    >
                      Thermo Fisher
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row) => (
                    <tr
                      key={row.feature}
                      style={{ borderBottom: "1px solid var(--mkt-border-subtle)" }}
                    >
                      <td
                        className="py-4 text-sm"
                        style={{ color: "var(--mkt-text-secondary)" }}
                      >
                        {row.feature}
                      </td>
                      <td className="py-4 text-center">
                        {row.aurex ? (
                          <span
                            className="inline-flex h-5 w-5 items-center justify-center rounded-full text-white"
                            style={{ backgroundColor: "var(--mkt-accent)" }}
                          >
                            <Check size={11} strokeWidth={3} />
                          </span>
                        ) : (
                          <span
                            className="inline-block h-px w-4"
                            style={{ backgroundColor: "var(--mkt-text-muted)" }}
                          />
                        )}
                      </td>
                      <td className="py-4 text-center">
                        {row.thermo ? (
                          <span
                            className="inline-flex h-5 w-5 items-center justify-center rounded-full"
                            style={{
                              backgroundColor: "var(--mkt-bg-surface)",
                              color: "var(--mkt-text-secondary)",
                            }}
                          >
                            <Check size={11} strokeWidth={3} />
                          </span>
                        ) : (
                          <span
                            className="inline-block h-px w-4"
                            style={{ backgroundColor: "var(--mkt-border)" }}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section
        className="py-24 sm:py-32"
        style={{
          backgroundColor: "var(--mkt-bg)",
          borderTop: "1px solid var(--mkt-border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-8 sm:px-12 lg:px-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.5em]"
                style={{ color: "var(--mkt-accent)" }}
              >
                04 / Get started
              </p>
              <h2
                className="mt-4 font-display font-black uppercase leading-[0.88]"
                style={{
                  color: "var(--mkt-text)",
                  fontSize: "clamp(3rem, 8vw, 7rem)",
                }}
              >
                Ready to
                <br />
                get started?
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <p
                className="max-w-[42ch] text-sm leading-relaxed"
                style={{ color: "var(--mkt-text-secondary)" }}
              >
                Custom pricing for schools and research institutions. Reach out
                and we&apos;ll put together a catalog and quote tailored to
                your lab.
              </p>
              <div className="flex gap-3">
                <Link href="/quote" className="btn-primary px-8 py-4 text-base">
                  Request a Demo <ArrowRight size={16} />
                </Link>
                <Link href="/products" className="btn-secondary px-8 py-4 text-base">
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
