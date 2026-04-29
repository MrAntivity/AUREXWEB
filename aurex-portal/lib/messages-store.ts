// Messaging data store — localStorage-based

export const CONVOS_KEY = "aurex_convos";
export const MSGS_KEY = "aurex_msgs";
export const STAFF_READ_KEY = "aurex_staff_msgs_read";

export type MessageAttachment =
  | { type: "order"; orderNumber: string; total: number; itemCount: number }
  | { type: "catalog"; sku: string; name: string; price: number; unit: string };

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;     // user email or "aurex_staff"
  senderName: string;
  text: string;
  attachment?: MessageAttachment;
  sentAt: string;
  readBy: string[];     // emails (or "aurex_staff") that have read this
};

export type Conversation = {
  id: string;
  type: "direct" | "staff_support";
  participants: string[]; // emails; "aurex_staff" is a participant for staff_support
  institutionId: string;
  lastMessageAt: string;
  lastMessageText: string;
  lastSenderId: string;
};

// ─── raw accessors ──────────────────────────────────────────────────────────

function getConvosRaw(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CONVOS_KEY);
    return raw ? (JSON.parse(raw) as Conversation[]) : [];
  } catch { return []; }
}

function getMsgsRaw(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MSGS_KEY);
    return raw ? (JSON.parse(raw) as Message[]) : [];
  } catch { return []; }
}

function saveConvos(convos: Conversation[]): void {
  localStorage.setItem(CONVOS_KEY, JSON.stringify(convos));
}

function saveMsgs(msgs: Message[]): void {
  localStorage.setItem(MSGS_KEY, JSON.stringify(msgs));
}

// ─── public API ─────────────────────────────────────────────────────────────

export function getConversationsForUser(userEmail: string): Conversation[] {
  return getConvosRaw()
    .filter((c) => c.participants.includes(userEmail))
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
}

export function getStaffConversations(): Conversation[] {
  return getConvosRaw()
    .filter((c) => c.type === "staff_support")
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
}

export function getOrCreateDirectConvo(
  emailA: string,
  emailB: string,
  institutionId: string,
): Conversation {
  const convos = getConvosRaw();
  const sorted = [emailA, emailB].sort();
  const existing = convos.find(
    (c) => c.type === "direct" && [...c.participants].sort().join(",") === sorted.join(","),
  );
  if (existing) return existing;

  const convo: Conversation = {
    id: `convo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: "direct",
    participants: sorted,
    institutionId,
    lastMessageAt: new Date().toISOString(),
    lastMessageText: "",
    lastSenderId: "",
  };
  saveConvos([...convos, convo]);
  return convo;
}

export function getOrCreateStaffConvo(userEmail: string, institutionId: string): Conversation {
  const convos = getConvosRaw();
  const existing = convos.find(
    (c) => c.type === "staff_support" && c.participants.includes(userEmail),
  );
  if (existing) return existing;

  const convo: Conversation = {
    id: `staff_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: "staff_support",
    participants: [userEmail, "aurex_staff"],
    institutionId,
    lastMessageAt: new Date().toISOString(),
    lastMessageText: "",
    lastSenderId: "",
  };
  saveConvos([...convos, convo]);
  return convo;
}

export function getMessages(conversationId: string): Message[] {
  return getMsgsRaw()
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
}

export function sendMessage(
  conversationId: string,
  senderId: string,
  senderName: string,
  text: string,
  attachment?: MessageAttachment,
): Message {
  const msg: Message = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    conversationId,
    senderId,
    senderName,
    text,
    attachment,
    sentAt: new Date().toISOString(),
    readBy: [senderId],
  };
  saveMsgs([...getMsgsRaw(), msg]);

  const convos = getConvosRaw().map((c) =>
    c.id === conversationId
      ? { ...c, lastMessageAt: msg.sentAt, lastMessageText: text, lastSenderId: senderId }
      : c,
  );
  saveConvos(convos);
  return msg;
}

export function markConversationRead(conversationId: string, userId: string): void {
  const msgs = getMsgsRaw().map((m) =>
    m.conversationId === conversationId && !m.readBy.includes(userId)
      ? { ...m, readBy: [...m.readBy, userId] }
      : m,
  );
  saveMsgs(msgs);
}

export function getUnreadCount(userEmail: string): number {
  const convos = getConvosRaw().filter((c) => c.participants.includes(userEmail));
  const ids = new Set(convos.map((c) => c.id));
  return getMsgsRaw().filter(
    (m) => ids.has(m.conversationId) && m.senderId !== userEmail && !m.readBy.includes(userEmail),
  ).length;
}

// ─── staff-side read tracking ────────────────────────────────────────────────

function getStaffReadSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STAFF_READ_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch { return new Set(); }
}

export function markStaffConversationRead(conversationId: string): void {
  const msgs = getMsgsRaw().filter(
    (m) => m.conversationId === conversationId && m.senderId !== "aurex_staff",
  );
  const readSet = getStaffReadSet();
  for (const m of msgs) readSet.add(m.id);
  localStorage.setItem(STAFF_READ_KEY, JSON.stringify([...readSet]));
}

export function getStaffUnreadCount(): number {
  const convos = getConvosRaw().filter((c) => c.type === "staff_support");
  const ids = new Set(convos.map((c) => c.id));
  const readSet = getStaffReadSet();
  return getMsgsRaw().filter(
    (m) => ids.has(m.conversationId) && m.senderId !== "aurex_staff" && !readSet.has(m.id),
  ).length;
}

export function purgeAllMessages(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CONVOS_KEY);
  localStorage.removeItem(MSGS_KEY);
  localStorage.removeItem(STAFF_READ_KEY);
}
