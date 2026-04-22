import type { Metadata } from "next";
import { Target, Lightbulb, Heart, Linkedin } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
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
      "We charge institutions fairly. No markups on supplies. Revenue from platform subscriptions, not supply margins.",
  },
];

const team = [
  {
    name: "Aiden Yue",
    role: "Co-Founder & CEO",
    bio: "Former procurement lead at Stanford's chemistry department. Built Aurex after spending 4 years navigating broken PO systems.",
    initials: "AY",
    linkedin: "#",
  },
  {
    name: "Maya Patel",
    role: "Co-Founder & CTO",
    bio: "Ex-Stripe engineer. Passionate about applying fintech infrastructure to scientific procurement workflows.",
    initials: "MP",
    linkedin: "#",
  },
  {
    name: "Dr. James Okafor",
    role: "Head of Science & Compliance",
    bio: "PhD in Biochemistry from MIT. Ensures our catalog and compliance standards meet real lab requirements.",
    initials: "JO",
    linkedin: "#",
  },
  {
    name: "Sarah Kim",
    role: "Head of Institutional Sales",
    bio: "10 years in edtech B2B sales. Brings a deep understanding of how schools make purchasing decisions.",
    initials: "SK",
    linkedin: "#",
  },
  {
    name: "Luca Romano",
    role: "Lead Product Designer",
    bio: "Designed supply chain tools at Amazon before joining Aurex to make procurement genuinely enjoyable.",
    initials: "LR",
    linkedin: "#",
  },
  {
    name: "Priya Sharma",
    role: "Finance & Operations",
    bio: "CPA and former controller at a regional school district. Deeply understands institutional finance constraints.",
    initials: "PS",
    linkedin: "#",
  },
];

const milestones = [
  { year: "2022", event: "Aurex founded after $1.2M pre-seed round" },
  { year: "2023", event: "First 10 institutional customers — all from word of mouth" },
  { year: "2023", event: "Partnership with VWR and Fisher Scientific" },
  { year: "2024", event: "Series A: $8M raised. Expanded to 200+ institutions" },
  { year: "2025", event: "Launched full portal with Stripe billing and Clerk SSO" },
  { year: "2026", event: "Expanding to Canada and UK research markets" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-hero-pattern py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="section-label text-aurex-teal">Our Story</p>
          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
            We got tired of terrible procurement
          </h1>
          <p className="mt-5 text-lg text-gray-300 max-w-2xl mx-auto">
            Aurex was born in a Stanford chemistry lab where ordering a box of pipette
            tips required a 3-week approval chain and three separate emails. We knew
            there was a better way.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div>
              <p className="section-label">Our Mission</p>
              <h2 className="section-title mt-2">
                Science shouldn&apos;t be slowed down by bad software
              </h2>
              <p className="mt-5 text-base leading-relaxed text-gray-500">
                Every day, thousands of researchers wait weeks for supplies because their
                institution&apos;s procurement process is stuck in 2005. Phone calls, paper
                POs, spreadsheet budgets, and email approval chains slow down the science
                that matters.
              </p>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Aurex replaces all of that with a single, modern platform that respects
                institutional hierarchy while dramatically reducing cycle time. We
                believe the best scientific discoveries happen when researchers can focus
                on research, not paperwork.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-1">
              {values.map((v) => (
                <div key={v.title} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50">
                    <v.icon className="text-aurex-blue" size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{v.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <p className="section-label">Timeline</p>
            <h2 className="section-title mt-2">How we got here</h2>
          </div>
          <div className="mt-12 relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-gray-200" />
            <div className="flex flex-col gap-8">
              {milestones.map((m) => (
                <div key={m.year + m.event} className="relative flex items-start gap-6">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-aurex-blue text-xs font-bold text-white ml-12 z-10 -translate-x-4">
                    <span className="sr-only">{m.year}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-aurex-teal">{m.year}</span>
                    <p className="text-sm text-gray-700">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white py-24 sm:py-32" id="team">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="section-label">The Team</p>
            <h2 className="section-title mt-2">People behind the platform</h2>
            <p className="section-subtitle mx-auto max-w-xl">
              We&apos;re scientists, engineers, and operators who&apos;ve all lived the
              pain of institutional procurement firsthand.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="card group">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-aurex-blue text-lg font-bold text-white">
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-xs font-medium text-aurex-teal">{member.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-gray-500">{member.bio}</p>
                <a
                  href={member.linkedin}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-aurex-blue hover:underline"
                >
                  <Linkedin size={13} /> LinkedIn
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring CTA */}
      <section className="bg-navy-900 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold text-white">We&apos;re hiring</h2>
          <p className="mt-3 text-gray-400">
            Help us build the future of institutional science procurement. Open roles in
            engineering, sales, and customer success.
          </p>
          <a
            href="mailto:jobs@aurexmedical.com"
            className="btn-primary mt-6 inline-flex px-8 py-3"
          >
            View Open Roles
          </a>
        </div>
      </section>
    </>
  );
}
