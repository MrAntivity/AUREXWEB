import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Team — Aurex Medical",
  description: "Meet the people behind Aurex Medical.",
};

const founders = [
  {
    name: "Aiden Yue",
    role: "CEO & Co-Founder",
    initials: "AY",
    bio: "Aiden co-founded Aurex Medical and serves as co-CEO. He drives company strategy and platform development — focused on building procurement infrastructure that fits how research institutions actually operate, rather than forcing labs to adapt to tools designed for someone else.",
  },
  {
    name: "Kevin Niu",
    role: "CEO & Co-Founder",
    initials: "KN",
    bio: "Kevin co-founded Aurex Medical and serves as co-CEO. He leads product procurement, building direct relationships with manufacturers to source and vet every item on the Aurex catalog. He works hands-on with institutions to understand what their labs need and makes sure the supply side delivers on it.",
  },
];

const operations = [
  {
    name: "Michael Lang",
    role: "CTO & Head of Operations",
    initials: "ML",
    bio: "Michael leads technology and oversees the operational backbone of Aurex Medical — ensuring orders move efficiently, processes scale cleanly, and the team delivers for institutions.",
  },
  {
    name: "Petar Milenkov",
    role: "Director, West Coast Operations",
    initials: "PM",
    bio: "Petar manages institutional relationships and day-to-day operations across the West Coast, working closely with universities and research labs to ensure smooth procurement workflows.",
  },
  {
    name: "Devin Swartz",
    role: "Director, West Coast Operations",
    initials: "DS",
    bio: "Devin supports West Coast operations alongside Petar, focused on fulfillment logistics and building strong partnerships with institutions in the region.",
  },
];

export default function TeamPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-dark-bg px-6 pt-28 pb-20 sm:pt-36 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-label">The Team</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            The people behind Aurex
          </h1>
          <p className="mt-6 text-lg text-gray-500">
            A small team that saw how broken lab procurement was for research
            institutions — and decided to fix it from the ground up.
          </p>
        </div>
      </section>

      {/* Founders */}
      <section className="bg-dark-elevated py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <p className="section-label mb-10">Founders</p>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            {founders.map((f) => (
              <div key={f.name} className="flex flex-col gap-6">
                <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-dark-card border border-white/10 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-aurex-blue/40 to-aurex-blue-light/20 border border-aurex-blue/30">
                      <span className="text-2xl font-extrabold text-aurex-blue">
                        {f.initials}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 tracking-widest uppercase">Photo coming soon</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{f.name}</h2>
                  <p className="mt-1 text-sm font-medium text-aurex-blue">{f.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">{f.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operations */}
      <section className="bg-dark-bg py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <p className="section-label mb-10">Operations</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {operations.map((m) => (
              <div key={m.name} className="card-dark flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-aurex-blue/20 to-aurex-blue-light/10 border border-aurex-blue/20">
                  <span className="text-sm font-bold text-aurex-blue">{m.initials}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{m.name}</h3>
                  <p className="mt-0.5 text-xs font-medium text-aurex-blue">{m.role}</p>
                  <p className="mt-3 text-xs leading-relaxed text-gray-500">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join us */}
      <section className="bg-dark-elevated py-20 sm:py-28">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Want to work with us?
          </h2>
          <p className="mt-4 text-gray-500">
            We&apos;re a small team building something meaningful. If you&apos;re interested in
            joining or partnering with Aurex Medical, reach out.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="mailto:hello@aurexmedical.com" className="btn-primary px-6 py-3">
              Get in touch <ArrowRight size={15} />
            </a>
            <Link href="/partnerships" className="btn-secondary px-6 py-3">
              Partnerships
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
