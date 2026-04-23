import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Factory, ShieldCheck, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Products — Aurex Medical",
  description:
    "Browse Aurex Medical's full catalog — lab supplies, PPE, reagents, instruments, glassware, and more sourced directly from manufacturers and verified vendors.",
};

const categories = [
  {
    name: "Pipettes & Tips",
    icon: "🧪",
    description:
      "Single and multichannel pipettes, filter tips, wide-bore tips, and pipette controllers sourced from leading manufacturers.",
    products: ["Eppendorf Research Plus", "Gilson PIPETMAN", "Filter Tips 200μL", "Multichannel 8-Channel"],
    badge: "In stock",
  },
  {
    name: "PPE & Safety",
    icon: "🥼",
    description:
      "Lab coats, nitrile gloves, safety glasses, face shields, and chemical-resistant aprons for safe lab environments.",
    products: ["Nitrile Gloves (Box 100)", "Chemical Splash Goggles", "Disposable Lab Coats", "Face Shields"],
    badge: null,
  },
  {
    name: "Syringes & Needles",
    icon: "💉",
    description:
      "Sterile and non-sterile syringes, luer-lock tips, and dispensing needles for lab and clinical training use.",
    products: ["1mL Luer Slip Syringe", "5mL Luer Lock", "Dispensing Needles 18G", "Insulin Syringes"],
    badge: null,
  },
  {
    name: "Reagents & Chemicals",
    icon: "⚗️",
    description:
      "ACS-grade solvents, buffer solutions, staining kits, and biological reagents with full SDS documentation.",
    products: ["PBS Buffer 1X", "DMSO ACS Grade", "Trypan Blue Solution", "Ethanol 200 Proof"],
    badge: null,
  },
  {
    name: "Glassware",
    icon: "🔬",
    description:
      "Borosilicate beakers, Erlenmeyer flasks, graduated cylinders, volumetric flasks, and culture dishes.",
    products: ["Beaker 250mL", "Erlenmeyer Flask 500mL", "Grad. Cylinder 100mL", "Petri Dishes (10-pack)"],
    badge: null,
  },
  {
    name: "Lab Instruments",
    icon: "🧫",
    description:
      "Centrifuges, vortex mixers, magnetic stirrers, hot plates, balances, and water baths for every workflow.",
    products: ["Mini Centrifuge 6000 RPM", "Vortex Mixer", "Digital Hot Plate Stirrer", "Analytical Balance"],
    badge: null,
  },
  {
    name: "Tubes & Containers",
    icon: "🧴",
    description:
      "Microcentrifuge tubes, conical tubes, cryovials, sample cups, and specimen containers in bulk quantities.",
    products: ["1.5mL Microtubes (500pk)", "50mL Conical Tubes", "Cryovials 2mL", "Sample Cups"],
    badge: null,
  },
  {
    name: "Filtration",
    icon: "🌡️",
    description:
      "Syringe filters, membrane filters, filter paper, vacuum filtration systems, and sterile filter units.",
    products: ["0.22μM Syringe Filter", "0.45μM Membrane Filter", "Whatman Filter Paper", "Vacuum Filtration Kit"],
    badge: null,
  },
];

const highlights = [
  {
    icon: Factory,
    title: "Direct from Manufacturers",
    description: "We work directly with manufacturers to source products, cut out middlemen, and maintain control over quality from the source.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Vendors Only",
    description: "Every supplier and distributor on our platform is vetted and approved before any product reaches an institution.",
  },
  {
    icon: Award,
    title: "Quality Documentation",
    description: "Every product ships with full compliance documentation, certifications, and SDS sheets where applicable.",
  },
];

export default function ProductsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-dark-bg py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="section-label">Product Catalog</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Everything Your Lab Needs
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
            Our own products alongside offerings from verified distributors and manufacturer
            partners — all available through your institution&apos;s Aurex portal.
          </p>
          <Link href="/quote" className="btn-primary mt-8 inline-flex px-8 py-4 text-base">
            Request a Quote <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* How we source */}
      <section className="border-b border-white/8 bg-dark-elevated py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {highlights.map((h) => (
              <div key={h.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-aurex-blue/10">
                  <h.icon className="text-aurex-blue" size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{h.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">{h.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-dark-bg py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="section-label">Browse</p>
            <h2 className="section-title-dark mt-2">Product Lines</h2>
            <p className="section-subtitle-dark mx-auto max-w-xl">
              Available through your institution&apos;s Aurex portal with
              approval-based purchasing and department-level controls.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="card-dark group relative flex flex-col hover:-translate-y-0.5 transition-transform"
              >
                {cat.badge && (
                  <span className="absolute -top-2.5 right-4 rounded-full bg-aurex-blue px-3 py-0.5 text-xs font-semibold text-white">
                    {cat.badge}
                  </span>
                )}
                <div className="mb-3 text-3xl">{cat.icon}</div>
                <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 flex-1">{cat.description}</p>
                <ul className="mt-4 flex flex-col gap-1.5 border-t border-white/8 pt-4">
                  {cat.products.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="h-1 w-1 rounded-full bg-aurex-blue/60" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-elevated py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="section-title-dark">Need something specific?</h2>
          <p className="section-subtitle-dark mx-auto max-w-xl">
            We can source custom items and add them to your institution&apos;s private catalog.
            Reach out about bulk orders and specialized reagents.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/quote" className="btn-primary px-8 py-3.5">
              Request Custom Quote <ArrowRight size={16} />
            </Link>
            <Link href="/team" className="btn-secondary px-8 py-3.5">
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
