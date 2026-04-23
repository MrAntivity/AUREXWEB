export type StaffUser = {
  email: string;
  name: string;
  role: string;
  initials: string;
};

const STAFF_SESSION_KEY = "aurex_staff_session";

const STAFF_USERS: (StaffUser & { password: string })[] = [
  { email: "aidenyue@aurexmed.com",      name: "Aiden Yue",      role: "CEO & Co-Founder",           initials: "AY", password: "password" },
  { email: "kevinniu@aurexmed.com",      name: "Kevin Niu",      role: "CEO & Co-Founder",           initials: "KN", password: "password" },
  { email: "michaellang@aurexmed.com",   name: "Michael Lang",   role: "Head of Operations",         initials: "ML", password: "password" },
  { email: "petarmilenkov@aurexmed.com", name: "Petar Milenkov", role: "Director, West Coast Ops",   initials: "PM", password: "password" },
  { email: "devinswartz@aurexmed.com",   name: "Devin Swartz",   role: "Director, West Coast Ops",   initials: "DS", password: "password" },
  { email: "drewvo@aurexmed.com",        name: "Drew Vo",        role: "Director, East Coast Ops",   initials: "DV", password: "password" },
];

export function staffAuthenticate(email: string, password: string): StaffUser | null {
  const found = STAFF_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!found) return null;
  const { password: _, ...user } = found;
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
