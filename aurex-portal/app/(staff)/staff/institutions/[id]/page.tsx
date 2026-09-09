import InstitutionDetailClient from "./InstitutionDetailClient";

export function generateStaticParams() {
  return [{ id: "aurex" }, { id: "placeholder" }];
}

export default function InstitutionDetailPage() {
  return <InstitutionDetailClient />;
}
