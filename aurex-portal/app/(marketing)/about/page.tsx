import type { Metadata } from "next";
import { Target, Lightbulb, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About — Aurex Medical",
  description:
    "Learn about Aurex Medical — our mission to modernize lab supply procurement for schools and research institutions.",
};

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description:
      "We exist to make scientific research more accessible by removing procurement friction for underfunded institutions.",
  },
  {
    icon: Lightbulb,
    title: "Built for Science",
    description:
      "Every feature we ship is validated with actual lab directors, procurement officers, and department admins.",
  },
  {
    icon: Heart,
    title: "Institutions First",
    description:
      "We charge institutions fairly. Revenue from platform access, not supply margins.",
  },
];

const team = [
  {
    name: "Aiden Yue",
    role: "CEO & Co-Founder",
    bio: "Drives company strategy and platform development — focused on building procurement infrastructure that fits how research institutions actually operate.",
    initials: "AY",
  },
  {
    name: "Kevin Liu",
    role: "CEO & Co-Founder",
    bio: "Leads product procurement, building direct relationships with manufacturers to source and vet every item on the Aurex catalog.",
    initials: "KL",
  },
  {
    name: "Michael Lang",
    role: "Head of Operations",
    bio: "Oversees the operational backbone of Aurex — ensuring orders move efficiently, processes scale cleanly, and the team delivers for institutions.",
    initials: "ML",
  },
  {
    name: "Petar Milenkov",
    role: "Director, West Coast Operations",
    bio: "Manages institutional relationships and day-to-day operations across the West Coast, working closely with universities and research labs.",
    initials: "PM",
  },
  {
    name: "Devin Swartz",
    role: "Director, West Coast Operations",
    bio: "Supports West Coast operations focused on fulfillment logistics and building strong partnerships with institutions in the region.",
    initials: "DS",
  },
  {
    name: "Drew Vo",
    role: "Director, East Coast Operations",
    bio: "Leads East Coast operations, managing institutional accounts and coordinating procurement logistics for universities and research organizations.",
    initials: "DV",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-dark-bg px-6 pt-28 pb-20 sm:pt-36 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-label">Our Story</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            We got tired of terrible procurement
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
            Aurex was built by people who saw firsthand how slow, fragmented, and
            frustrating institutional lab procurement was — and decided to fix it.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-dark-elevated py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div>
              <p className="section-label">Our Mission</p>
              <h2 className="section-title-dark mt-2">
                Science shouldn&apos;t be slowed down by bad software
              </h2>
              <p className="mt-5 text-base leading-relaxed text-gray-400">
                Every day, researchers wait weeks for supplies because their
                institution&apos;s procurement process is stuck in the past. Phone calls,
                paper POs, spreadsheet budgets, and email approval chains slow down
                the science that matters.
              </p>
              <p className="mt-4 text-base leading-relaxed text-gray-400">
                Aurex replaces all of that with a single, modern platform that
                respects institutional hierarchy while dramatically reducing cycle time.
                We believe the best scientific discoveries happen when researchers can
                focus on research, not paperwork.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              {values.map((v) => (
                <div key={v.title} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-aurex-blue/10">
                    <v.icon className="text-aurex-blue" size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{v.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-dark-bg py-24 sm:py-32" id="team">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="section-label">The Team</p>
            <h2 className="section-title-dark mt-2">People behind the platform</h2>
            <p className="section-subtitle-dark mx-auto max-w-xl">
              A small, focused team building infrastructure for how research institutions
              actually operate.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="card-dark">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-aurex-blue/30 to-aurex-blue-light/10 border border-aurex-blue/20">
                    <span className="text-sm font-bold text-aurex-blue">{member.initials}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">{member.name}</h3>
                    <p className="text-xs font-medium text-aurex-blue">{member.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-gray-500">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-elevated py-20 sm:py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Want to learn more?
          </h2>
          <p className="mt-4 text-gray-500">
            Reach out to our team or request a demo to see how Aurex fits your
            institution&apos;s workflow.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="mailto:hello@aurexmedical.com" className="btn-primary px-6 py-3">
              Get in touch
            </a>
            <a href="/quote" className="btn-secondary px-6 py-3">
              Request a Demo
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
