// Bump SEED_VERSION to force a data reset on next page load.
const SEED_KEY = "aurex_data_seed";
const SEED_VERSION = "v2";

const RESET_USERS = {
  "admin@aurex.dev": {
    email: "admin@aurex.dev",
    password: "password",
    name: "Alex Admin",
    role: "super_admin",
    department: "Administration",
    initials: "AA",
    institutionId: "aurex",
    location: "Admin HQ, Suite 200",
    status: "active",
  },
  "dept@aurex.dev": {
    email: "dept@aurex.dev",
    password: "password",
    name: "Dana Dept",
    role: "department_admin",
    department: "Chemistry",
    initials: "DD",
    institutionId: "aurex",
    location: "Chemistry Lab, Building A",
    status: "active",
  },
  "req@aurex.dev": {
    email: "req@aurex.dev",
    password: "password",
    name: "Riley Requester",
    role: "requester",
    department: "Biology",
    initials: "RR",
    institutionId: "aurex",
    location: "Biology Lab, Building B",
    status: "active",
  },
  "finance@aurex.dev": {
    email: "finance@aurex.dev",
    password: "password",
    name: "Fran Finance",
    role: "finance_viewer",
    department: "Finance",
    initials: "FF",
    institutionId: "aurex",
    location: "Finance Dept, Floor 2",
    status: "active",
  },
};

const RESET_INSTITUTIONS = [
  {
    id: "aurex",
    name: "Aurex Medical",
    domain: "aurex.dev",
    superAdminEmail: "admin@aurex.dev",
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
];

const PURGE_PREFIXES = [
  "aurex_orders",
  "aurex_cart",
  "aurex_saved",
  "aurex_order_counter",
  "aurex_budgets",
  "aurex_budget_warning",
];

export function runSeedIfNeeded(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(SEED_KEY) === SEED_VERSION) return;

  // Collect all keys to purge in a stable pass (can't mutate during iteration)
  const toPurge: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && PURGE_PREFIXES.some((p) => key.startsWith(p))) {
      toPurge.push(key);
    }
  }
  toPurge.forEach((k) => localStorage.removeItem(k));

  // Reset users and institutions to clean defaults
  localStorage.setItem("aurex_users_store", JSON.stringify(RESET_USERS));
  localStorage.setItem("aurex_institutions", JSON.stringify(RESET_INSTITUTIONS));

  // Force re-login
  localStorage.removeItem("aurex_mock_session");

  localStorage.setItem(SEED_KEY, SEED_VERSION);
}
