// Client-safe — no server-only imports. Used everywhere.

export type MockRole = "super_admin" | "department_admin" | "requester" | "finance_viewer";

export type MockUser = {
  email: string;
  name: string;
  role: MockRole;
  department: string;
  initials: string;
  institutionId: string;
  location?: string;
  mustChangePassword?: boolean;
  status?: "active" | "inactive" | "deleted";
  deactivationRequested?: boolean;
};

type MockUserRecord = MockUser & { password: string };

const DEFAULT_USERS: Record<string, MockUserRecord> = {
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

export const MOCK_USERS = DEFAULT_USERS;

export const ROLE_LABELS: Record<MockRole, string> = {
  super_admin: "Super Admin",
  department_admin: "Dept Admin",
  requester: "Requester",
  finance_viewer: "Finance Viewer",
};

const SESSION_KEY = "aurex_mock_session";
const USERS_STORE_KEY = "aurex_users_store";

export function getUsersFromStore(): Record<string, MockUserRecord> {
  if (typeof window === "undefined") return { ...DEFAULT_USERS };
  try {
    const raw = localStorage.getItem(USERS_STORE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as Record<string, MockUserRecord>;
      // Backfill institutionId for any legacy records
      let dirty = false;
      for (const key of Object.keys(stored)) {
        if (!stored[key].institutionId) {
          stored[key] = { ...stored[key], institutionId: "aurex" };
          dirty = true;
        }
      }
      if (dirty) saveUsersToStore(stored);
      return stored;
    }
  } catch { /* ignore */ }
  return { ...DEFAULT_USERS };
}

function saveUsersToStore(users: Record<string, MockUserRecord>): void {
  localStorage.setItem(USERS_STORE_KEY, JSON.stringify(users));
}

export function getUsersByInstitution(institutionId: string): MockUserRecord[] {
  const store = getUsersFromStore();
  return Object.values(store).filter((u) => u.institutionId === institutionId);
}

function buildInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function createUser(data: {
  email: string;
  password: string;
  name: string;
  role: MockRole;
  department: string;
  institutionId: string;
  location?: string;
}): { ok: true } | { ok: false; error: string } {
  const store = getUsersFromStore();
  if (store[data.email.toLowerCase()]) {
    return { ok: false, error: "A user with this email already exists." };
  }
  store[data.email.toLowerCase()] = {
    ...data,
    email: data.email.toLowerCase(),
    initials: buildInitials(data.name),
    mustChangePassword: true,
    status: "active",
  };
  saveUsersToStore(store);
  return { ok: true };
}

export function updateUserProfile(
  email: string,
  updates: { name?: string; location?: string }
): boolean {
  const store = getUsersFromStore();
  if (!store[email]) return false;
  const updated: MockUserRecord = { ...store[email], ...updates };
  if (updates.name) updated.initials = buildInitials(updates.name);
  store[email] = updated;
  saveUsersToStore(store);
  const session = getStoredUser();
  if (session?.email === email) {
    const { password: _pw, ...userWithoutPw } = updated;
    setStoredUser(userWithoutPw);
  }
  return true;
}

export function changePassword(
  email: string,
  currentPassword: string,
  newPassword: string
): { ok: true } | { ok: false; error: string } {
  const store = getUsersFromStore();
  const record = store[email];
  if (!record) return { ok: false, error: "User not found." };
  if (record.password !== currentPassword) return { ok: false, error: "Current password is incorrect." };
  store[email] = { ...record, password: newPassword, mustChangePassword: false };
  saveUsersToStore(store);
  const session = getStoredUser();
  if (session?.email === email) {
    const { password: _pw, ...userWithoutPw } = store[email];
    setStoredUser(userWithoutPw);
  }
  return { ok: true };
}

export function forceChangePassword(email: string, newPassword: string): void {
  const store = getUsersFromStore();
  if (!store[email]) return;
  store[email] = { ...store[email], password: newPassword, mustChangePassword: false };
  saveUsersToStore(store);
  const session = getStoredUser();
  if (session?.email === email) {
    const { password: _pw, ...userWithoutPw } = store[email];
    setStoredUser(userWithoutPw);
  }
}

export function setUserStatus(email: string, status: "active" | "inactive"): boolean {
  const store = getUsersFromStore();
  if (!store[email]) return false;
  store[email] = { ...store[email], status };
  saveUsersToStore(store);
  const session = getStoredUser();
  if (session?.email === email) {
    const { password: _pw, ...userWithoutPw } = store[email];
    setStoredUser(userWithoutPw);
  }
  return true;
}

export function deleteUser(email: string): boolean {
  const store = getUsersFromStore();
  if (!store[email]) return false;
  store[email] = { ...store[email], status: "deleted" };
  saveUsersToStore(store);
  const session = getStoredUser();
  if (session?.email === email) {
    const { password: _pw, ...userWithoutPw } = store[email];
    setStoredUser(userWithoutPw);
  }
  return true;
}

export function requestDeactivation(email: string): boolean {
  const store = getUsersFromStore();
  if (!store[email]) return false;
  store[email] = { ...store[email], deactivationRequested: true };
  saveUsersToStore(store);
  return true;
}

export function dismissDeactivationRequest(email: string): boolean {
  const store = getUsersFromStore();
  if (!store[email]) return false;
  store[email] = { ...store[email], deactivationRequested: false };
  saveUsersToStore(store);
  return true;
}

export function getDeactivationRequestCount(institutionId: string): number {
  const store = getUsersFromStore();
  return Object.values(store).filter(
    (u) => u.institutionId === institutionId && u.deactivationRequested === true && u.status !== "deleted"
  ).length;
}

export function authenticate(email: string, password: string): MockUser | null {
  const store = getUsersFromStore();
  const record = store[email.toLowerCase()];
  if (!record || record.password !== password) return null;
  if (record.status === "deleted") return null;
  const { password: _pw, ...user } = record;
  return user;
}

export function getStoredUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as MockUser;
    // Backfill institutionId for legacy sessions
    if (!user.institutionId) {
      const updated = { ...user, institutionId: "aurex" };
      setStoredUser(updated);
      return updated;
    }
    return user;
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
