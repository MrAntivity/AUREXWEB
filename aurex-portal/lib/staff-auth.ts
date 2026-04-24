export type StaffUser = {
  email: string;
  name: string;
  role: string;
  initials: string;
};

type StaffUserRecord = StaffUser & { password: string };

const STAFF_SESSION_KEY = "aurex_staff_session";
const STAFF_USERS_KEY = "aurex_staff_users_store";

const DEFAULT_STAFF: StaffUserRecord[] = [
  { email: "aidenyue@aurexmed.com",      name: "Aiden Yue",      role: "CEO & Co-Founder",           initials: "AY", password: "password" },
  { email: "kevinniu@aurexmed.com",      name: "Kevin Niu",      role: "CEO & Co-Founder",           initials: "KN", password: "password" },
  { email: "andyyoong@aurexmed.com",     name: "Andy Yoong",     role: "CFO",                        initials: "AO", password: "password" },
  { email: "michaellang@aurexmed.com",   name: "Michael Lang",   role: "CTO & Head of Operations",   initials: "ML", password: "password" },
  { email: "petarmilenkov@aurexmed.com", name: "Petar Milenkov", role: "Director, West Coast Ops",   initials: "PM", password: "password" },
  { email: "devinswartz@aurexmed.com",   name: "Devin Swartz",   role: "Director, West Coast Ops",   initials: "DS", password: "password" },
  { email: "drewvo@aurexmed.com",        name: "Drew Vo",        role: "Director, East Coast Ops",   initials: "DV", password: "password" },
];

function buildInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getStaffUsersFromStore(): Record<string, StaffUserRecord> {
  if (typeof window === "undefined") {
    return Object.fromEntries(DEFAULT_STAFF.map((u) => [u.email, u]));
  }
  try {
    const raw = localStorage.getItem(STAFF_USERS_KEY);
    if (raw) return JSON.parse(raw) as Record<string, StaffUserRecord>;
  } catch { /* ignore */ }
  return Object.fromEntries(DEFAULT_STAFF.map((u) => [u.email, u]));
}

function saveStaffUsersToStore(users: Record<string, StaffUserRecord>): void {
  localStorage.setItem(STAFF_USERS_KEY, JSON.stringify(users));
}

export function getAllStaffUsers(): StaffUser[] {
  const store = getStaffUsersFromStore();
  return Object.values(store).map(({ password: _pw, ...u }) => u);
}

export function createStaffUser(data: {
  email: string;
  password: string;
  name: string;
  role: string;
}): { ok: true } | { ok: false; error: string } {
  const store = getStaffUsersFromStore();
  const key = data.email.toLowerCase();
  if (store[key]) {
    return { ok: false, error: "A staff user with this email already exists." };
  }
  store[key] = {
    email: key,
    name: data.name,
    role: data.role,
    initials: buildInitials(data.name),
    password: data.password,
  };
  saveStaffUsersToStore(store);
  return { ok: true };
}

export function updateStaffProfile(
  email: string,
  updates: { name?: string; role?: string }
): boolean {
  const store = getStaffUsersFromStore();
  if (!store[email]) return false;
  const updated = { ...store[email], ...updates };
  if (updates.name) updated.initials = buildInitials(updates.name);
  store[email] = updated;
  saveStaffUsersToStore(store);
  const session = getStoredStaffUser();
  if (session?.email === email) {
    const { password: _pw, ...userWithoutPw } = updated;
    setStoredStaffUser(userWithoutPw);
  }
  return true;
}

export function changeStaffPassword(
  email: string,
  currentPassword: string,
  newPassword: string
): { ok: true } | { ok: false; error: string } {
  const store = getStaffUsersFromStore();
  const record = store[email];
  if (!record) return { ok: false, error: "User not found." };
  if (record.password !== currentPassword) return { ok: false, error: "Current password is incorrect." };
  store[email] = { ...record, password: newPassword };
  saveStaffUsersToStore(store);
  const session = getStoredStaffUser();
  if (session?.email === email) {
    const { password: _pw, ...userWithoutPw } = store[email];
    setStoredStaffUser(userWithoutPw);
  }
  return { ok: true };
}

export function staffAuthenticate(email: string, password: string): StaffUser | null {
  const store = getStaffUsersFromStore();
  const record = store[email.toLowerCase()];
  if (!record || record.password !== password) return null;
  const { password: _, ...user } = record;
  return user;
}

export function getStoredStaffUser(): StaffUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STAFF_SESSION_KEY);
    return raw ? (JSON.parse(raw) as StaffUser) : null;
  } catch {
    return null;
  }
}

export function setStoredStaffUser(user: StaffUser) {
  localStorage.setItem(STAFF_SESSION_KEY, JSON.stringify(user));
}

export function clearStoredStaffUser() {
  localStorage.removeItem(STAFF_SESSION_KEY);
}
