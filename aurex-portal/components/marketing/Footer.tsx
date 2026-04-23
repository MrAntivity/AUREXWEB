import Link from "next/link";
import { FlaskConical } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Products", href: "/products" },
    { label: "Request a Quote", href: "/quote" },
    { label: "Partnerships", href: "/partnerships" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Team", href: "/team" },
  ],
  Portal: [
    { label: "Sign In", href: "/portal/sign-in" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-dark-bg">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <FlaskConical size={18} className="text-aurex-blue" />
              <span className="text-sm font-bold text-white">Aurex Medical</span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-gray-500">
              Modern lab supply procurement for schools and research institutions.
            </p>
            <p className="mt-4 text-xs text-gray-600">
              <a
                href="mailto:hello@aurexmedical.com"
                className="transition hover:text-gray-400"
              >
                hello@aurexmedical.com
              </a>
            </p>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-600">
                {group}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 sm:flex-row">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Aurex Medical, Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-600">
            <a href="#" className="transition hover:text-gray-400">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-gray-400">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
