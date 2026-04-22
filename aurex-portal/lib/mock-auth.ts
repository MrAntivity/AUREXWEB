// Client-safe — no server-only imports. Used everywhere.

export type MockRole = "super_admin" | "department_admin" | "requester" | "finance_viewer";

export type MockUser = {
  email: string;
  name: string;
  role: MockRole;
  department: string;
  initials: string;
};

type MockUserRecord = MockUser & { password: string };

export const MOCK_USERS: Record<string, MockUserRecord> = {
  "admin@aurex.dev": {
    email: "admin@aurex.dev",
    password: "password",
    name: "Alex Admin",
    role: "super_admin",
    department: "Administration",
    initials: "AA",
  },
  "dept@aurex.dev": {
    email: "dept@aurex.dev",
    password: "password",
    name: "Dana Dept",
    role: "department_admin",
    department: "Chemistry",
    initials: "DD",
  },
  "req@aurex.dev": {
    email: "req@aurex.dev",
    password: "password",
    name: "Riley Requester",
    role: "requester",
    department: "Biology",
    initials: "RR",
  },
  "finance@aurex.dev": {
    email: "finance@aurex.dev",
    password: "password",
    name: "Fran Finance",
    role: "finance_viewer",
    department: "Finance",
    initials: "FF",
  },
};

export const ROLE_LABELS: Record<MockRole, string> = {
  super_admin: "Super Admin",
  department_admin: "Dept Admin",
  requester: "Requester",
  finance_viewer: "Finance Viewer",
};

const SESSION_KEY = "aurex_mock_session";

export function authenticate(email: string, password: string): MockUser | null {
  const record = MOCK_USERS[email];
  if (!record || record.password !== password) return null;
  const { password: _pw, ...user } = record;
  return user;
}

export function getStoredUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as MockUser) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: MockUser): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  localStorage.removeItem(SESSION_KEY);
}
