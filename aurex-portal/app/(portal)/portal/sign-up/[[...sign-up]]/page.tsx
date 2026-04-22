import Link from "next/link";
import { FlaskConical, Mail } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-aurex-blue">
          <FlaskConical size={24} className="text-aurex-teal" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Account Access</h1>
        <p className="mt-3 text-sm text-gray-500">
          Aurex portal accounts are provisioned by your institution&apos;s Super Admin.
          Contact them to request access, or reach out to our team.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <a
            href="mailto:hello@aurexmedical.com"
            className="btn-primary px-8 py-3 inline-flex"
          >
            <Mail size={16} />
            Contact Support
          </a>
          <Link href="/portal/sign-in" className="text-sm text-aurex-blue hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
