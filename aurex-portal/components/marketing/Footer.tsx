"use client";

import Link from "next/link";

const footerLinks = {
  Platform: [
    { label: "Products", href: "/products" },
    { label: "Solutions", href: "/solutions" },
    { label: "Request a Demo", href: "/quote" },
    { label: "Partnerships", href: "/partnerships" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Team", href: "/team" },
  ],
  Portal: [{ label: "Sign In", href: "/portal/sign-in" }],
};

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--mkt-bg-elevated)",
        borderTop: "1px solid var(--mkt-border)",
      }}
    >
      <div className="mx-auto max-w-7xl px-8 py-16 sm:px-12 lg:px-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span
                className="font-display text-base font-black uppercase tracking-wider"
                style={{ color: "var(--mkt-text)" }}
              >
                Aurex{" "}
                <span style={{ color: "var(--mkt-accent)" }}>Medical</span>
              </span>
            </Link>
            <p
              className="mt-3 max-w-[28ch] text-xs leading-relaxed"
              style={{ color: "var(--mkt-text-muted)" }}
            >
              Modern lab supply procurement for schools and research
              institutions.
            </p>
            <a
              href="mailto:hello@aurexmedical.com"
              className="mt-4 block text-xs transition-colors duration-150"
              style={{ color: "var(--mkt-text-muted)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--mkt-text-secondary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--mkt-text-muted)")
              }
            >
              hello@aurexmedical.com
            </a>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4
                className="mb-4 text-[10px] font-semibold uppercase tracking-[0.45em]"
                style={{ color: "var(--mkt-text-muted)" }}
              >
                {group}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-150"
                      style={{ color: "var(--mkt-text-secondary)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--mkt-text)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color =
                          "var(--mkt-text-secondary)")
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-12 flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row"
          style={{ borderTop: "1px solid var(--mkt-border-subtle)" }}
        >
          <p
            className="text-xs"
            style={{ color: "var(--mkt-text-muted)" }}
          >
            © {new Date().getFullYear()} Aurex Medical, Inc. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service"].map((label) => (
              <a
                key={label}
                href="#"
                className="text-xs transition-colors duration-150"
                style={{ color: "var(--mkt-text-muted)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--mkt-text-secondary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--mkt-text-muted)")
                }
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
