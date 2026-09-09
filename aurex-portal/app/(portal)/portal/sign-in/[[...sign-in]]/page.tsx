import SignInClient from "./SignInClient";

export function generateStaticParams() {
  return [{ "sign-in": [] }];
}

export default function SignInPage() {
  return <SignInClient />;
}
