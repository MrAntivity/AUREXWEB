"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

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
    <header
      className="fixed inset-x-0 top-0 z-50 backdrop-blur-md"
      style={{
        backgroundColor: "color-mix(in oklch, var(--mkt-bg) 92%, transparent)",
        borderBottom: "1px solid var(--mkt-border)",
      }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4 sm:px-12 lg:px-16">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className="font-display text-lg font-black uppercase tracking-wider"
            style={{ color: "var(--mkt-text)" }}
          >
            Aurex{" "}
            <span style={{ color: "var(--mkt-accent)" }}>Medical</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium transition-colors duration-150"
              style={{ color: "var(--mkt-text-secondary)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--mkt-text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--mkt-text-secondary)")
              }
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/portal/sign-in"
            className="text-sm font-medium transition-colors duration-150"
            style={{ color: "var(--mkt-text-secondary)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--mkt-text)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--mkt-text-secondary)")
            }
          >
            Portal Login
          </Link>
          <Link href="/quote" className="btn-primary py-2 text-sm">
            Request a Demo
          </Link>
        </div>

        <button
          className="transition-colors duration-150 md:hidden"
          style={{ color: "var(--mkt-text-secondary)" }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div
          className="px-8 pb-6 md:hidden"
          style={{ borderTop: "1px solid var(--mkt-border)" }}
        >
          <div className="flex flex-col gap-4 pt-4">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium"
                style={{ color: "var(--mkt-text-secondary)" }}
              >
                {l.label}
              </Link>
            ))}
            <hr style={{ borderColor: "var(--mkt-border)" }} />
            <Link
              href="/portal/sign-in"
              onClick={() => setOpen(false)}
              className="text-sm font-medium"
              style={{ color: "var(--mkt-text-secondary)" }}
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
