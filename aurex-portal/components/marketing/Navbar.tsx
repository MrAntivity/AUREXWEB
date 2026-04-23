"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, FlaskConical } from "lucide-react";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/solutions", label: "Solutions" },
  { href: "/partnerships", label: "Partnerships" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-dark-bg/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <FlaskConical size={20} className="text-aurex-blue" />
          <span className="text-sm font-bold tracking-tight text-white">Aurex Medical</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-400 transition hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/portal/sign-in"
            className="text-sm font-medium text-gray-400 transition hover:text-white"
          >
            Portal Login
          </Link>
          <Link href="/quote" className="btn-primary py-2 text-sm">
            Request a Demo
          </Link>
        </div>

        <button
          className="text-gray-400 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/8 bg-dark-bg px-6 pb-6 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-gray-400 transition hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <hr className="border-white/10" />
            <Link
              href="/portal/sign-in"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-gray-400 transition hover:text-white"
            >
              Portal Login
            </Link>
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="btn-primary py-2.5 text-center text-sm"
            >
              Request a Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
