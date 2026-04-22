import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Aurex Medical — Lab Supply Procurement for Schools & Research",
    template: "%s | Aurex Medical",
  },
  description:
    "Aurex Medical is the modern procurement platform for schools, universities, and research institutions to manage lab supply purchases with budget controls and role-based approvals.",
  keywords: ["lab supplies", "procurement", "medical supplies", "research institutions", "school supplies"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Aurex Medical",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
