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
    { label: "Our Team", href: "/about#team" },
  ],
  Portal: [
    { label: "Sign In", href: "/portal/sign-in" },
    { label: "Sign Up", href: "/portal/sign-up" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <FlaskConical size={18} className="text-aurex-teal" />
              <span className="text-sm font-bold text-aurex-blue">Aurex Medical</span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-gray-500">
              Modern lab supply procurement for schools and research institutions.
            </p>
            <p className="mt-4 text-xs text-gray-400">
              <a
                href="mailto:hello@aurexmedical.com"
                className="transition hover:text-aurex-blue"
              >
                hello@aurexmedical.com
              </a>
            </p>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
                {group}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 transition hover:text-aurex-blue"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Aurex Medical, Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="transition hover:text-gray-600">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-gray-600">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
