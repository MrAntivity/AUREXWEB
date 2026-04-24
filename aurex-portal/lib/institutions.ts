// Client-safe institution store

export type InstitutionStatus = "active" | "inactive";

export type Institution = {
  id: string;
  name: string;
  domain: string;
  superAdminEmail: string;
  status: InstitutionStatus;
  createdAt: string;
};

const INSTITUTIONS_KEY = "aurex_institutions";

const DEFAULT_INSTITUTIONS: Institution[] = [
  {
    id: "aurex",
    name: "Aurex Medical",
    domain: "aurex.dev",
    superAdminEmail: "admin@aurex.dev",
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
];

export function getInstitutions(): Institution[] {
  if (typeof window === "undefined") return [...DEFAULT_INSTITUTIONS];
  try {
    const raw = localStorage.getItem(INSTITUTIONS_KEY);
    if (raw) return JSON.parse(raw) as Institution[];
  } catch { /* ignore */ }
  return [...DEFAULT_INSTITUTIONS];
}

function saveInstitutions(institutions: Institution[]): void {
  localStorage.setItem(INSTITUTIONS_KEY, JSON.stringify(institutions));
}

export function getInstitutionById(id: string): Institution | null {
  return getInstitutions().find((i) => i.id === id) ?? null;
}

export function createInstitution(data: {
  name: string;
  domain: string;
  superAdminEmail: string;
}): { ok: true; id: string } | { ok: false; error: string } {
  const institutions = getInstitutions();
  const domainLower = data.domain.toLowerCase().replace(/^@/, "");
  if (institutions.some((i) => i.domain.toLowerCase() === domainLower)) {
    return { ok: false, error: "An institution with this domain already exists." };
  }
  const id = `inst_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const newInst: Institution = {
    id,
    name: data.name,
    domain: domainLower,
    superAdminEmail: data.superAdminEmail.toLowerCase(),
    status: "active",
    createdAt: new Date().toISOString(),
  };
  saveInstitutions([...institutions, newInst]);
  return { ok: true, id };
}

export function setInstitutionStatus(id: string, status: InstitutionStatus): boolean {
  const institutions = getInstitutions();
  const idx = institutions.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  institutions[idx] = { ...institutions[idx], status };
  saveInstitutions(institutions);
  return true;
}

export function deleteInstitution(id: string): boolean {
  if (id === "aurex") return false;
  const institutions = getInstitutions();
  const filtered = institutions.filter((i) => i.id !== id);
  if (filtered.length === institutions.length) return false;
  saveInstitutions(filtered);
  return true;
}
