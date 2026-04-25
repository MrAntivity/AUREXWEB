"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  MessageSquare, Send, Paperclip, X, Plus, Search,
  ShoppingBag, Package,
} from "lucide-react";
import { getStoredUser, getUsersFromStore } from "@/lib/mock-auth";
import type { MockUser } from "@/lib/mock-auth";
import {
  getConversationsForUser,
  getOrCreateDirectConvo,
  getOrCreateStaffConvo,
  getMessages as getConvoMsgs,
  sendMessage,
  markConversationRead,
  type Conversation,
  type Message,
  type MessageAttachment,
} from "@/lib/messages-store";
import { ORDERS_KEY } from "@/lib/store";
import type { Order } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";

function fmtTime(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type ContactInfo = {
  email: string;
  name: string;
  role: string;
  department: string;
  initials: string;
};

function getOtherEmail(convo: Conversation, myEmail: string): string {
  return convo.participants.find((p) => p !== myEmail && p !== "aurex_staff") ?? "";
}

function ConvoDisplay({
  convo,
  myEmail,
}: {
  convo: Conversation;
  myEmail: string;
}): { name: string; subtitle: string; initials: string; isStaff: boolean } {
  if (convo.type === "staff_support") {
    return { name: "Aurex Staff", subtitle: "Support Team", initials: "AS", isStaff: true };
  }
  const other = getOtherEmail(convo, myEmail);
  const store = getUsersFromStore();
  const u = store[other];
  if (!u) return { name: other, subtitle: "", initials: "?", isStaff: false };
  return {
    name: u.name,
    subtitle: `${u.department} · ${u.role.replace(/_/g, " ")}`,
    initials: u.initials,
    isStaff: false,
  };
}

function AttachmentCard({
  attachment,
  isMe,
}: {
  attachment: MessageAttachment;
  isMe: boolean;
}) {
  const border = isMe ? "border-white/20" : "border-gray-200 dark:border-white/10";
  const bg = isMe ? "bg-white/10" : "bg-gray-50 dark:bg-white/5";
  const text = isMe ? "text-white" : "text-gray-900 dark:text-white";
  const sub = isMe ? "text-white/70" : "text-gray-500 dark:text-gray-400";
  const icon = isMe ? "text-white/80" : "text-aurex-blue";

  return (
    <div className={`mt-2 flex items-center gap-2.5 rounded-xl border ${border} ${bg} p-2.5`}>
      {attachment.type === "order" ? (
        <ShoppingBag size={14} className={`shrink-0 ${icon}`} />
      ) : (
        <Package size={14} className={`shrink-0 ${icon}`} />
      )}
      <div className="min-w-0">
        <p className={`truncate text-xs font-semibold ${text}`}>
          {attachment.type === "order" ? attachment.orderNumber : attachment.name}
        </p>
        <p className={`text-[10px] ${sub}`}>
          {attachment.type === "order"
            ? `${attachment.itemCount} item${attachment.itemCount !== 1 ? "s" : ""} · $${attachment.total.toFixed(2)}`
            : `${attachment.sku} · $${attachment.price.toFixed(2)} / ${attachment.unit}`}
        </p>
      </div>
    </div>
  );
}

export default function PortalMessagesPage() {
  const user = getStoredUser();

  const [convos, setConvos] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [attachOpen, setAttachOpen] = useState(false);
  const [attachModal, setAttachModal] = useState<"order" | "catalog" | null>(null);
  const [pendingAttachment, setPendingAttachment] = useState<MessageAttachment | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [catSearch, setCatSearch] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  // ── load orders for attachment picker ──
  useEffect(() => {
    try {
      const key = `${ORDERS_KEY}_${user.institutionId}`;
      const raw = localStorage.getItem(key);
      const all: Order[] = raw ? JSON.parse(raw) : [];
      setUserOrders(all.filter((o) => o.requester.email === user.email));
    } catch { /* ignore */ }
  }, [user.email, user.institutionId]);

  // ── load conversations ──
  function refresh() {
    setConvos(getConversationsForUser(user!.email));
  }

  useEffect(() => { refresh(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── load messages when convo changes ──
  useEffect(() => {
    if (!selectedId) { setMsgs([]); return; }
    setMsgs(getConvoMsgs(selectedId));
    markConversationRead(selectedId, user!.email);
    setTimeout(refresh, 30);
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── auto-scroll ──
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  // ── available contacts based on role rules ──
  const availableContacts = useMemo((): ContactInfo[] => {
    const store = getUsersFromStore();
    return Object.values(store)
      .filter((u) => {
        if (u.email === user!.email) return false;
        if (u.status !== "active") return false;
        if (u.institutionId !== user!.institutionId) return false;
        if (u.department === user!.department) return true;
        if (user!.role === "department_admin" && u.role === "super_admin") return true;
        if (user!.role === "super_admin" && u.role === "department_admin") return true;
        return false;
      })
      .map((u) => ({
        email: u.email,
        name: u.name,
        role: u.role,
        department: u.department,
        initials: u.initials,
      }));
  }, [user]);

  const filteredContacts = useMemo(() => {
    if (!pickerSearch) return availableContacts;
    const q = pickerSearch.toLowerCase();
    return availableContacts.filter(
      (c) => c.name.toLowerCase().includes(q) || c.department.toLowerCase().includes(q),
    );
  }, [availableContacts, pickerSearch]);

  // ── unread count in a specific convo ──
  function unreadIn(convoId: string): number {
    return getConvoMsgs(convoId).filter(
      (m) => m.senderId !== user!.email && !m.readBy.includes(user!.email),
    ).length;
  }

  // ── select a conversation ──
  function selectConvo(id: string) {
    setSelectedId(id);
    const loaded = getConvoMsgs(id);
    setMsgs(loaded);
    markConversationRead(id, user!.email);
    setTimeout(refresh, 30);
  }

  // ── open direct convo with a contact ──
  function openDirect(contactEmail: string) {
    const convo = getOrCreateDirectConvo(user!.email, contactEmail, user!.institutionId);
    refresh();
    selectConvo(convo.id);
    setShowPicker(false);
    setPickerSearch("");
  }

  // ── open Aurex Staff support convo ──
  function openStaffConvo() {
    const convo = getOrCreateStaffConvo(user!.email, user!.institutionId);
    refresh();
    selectConvo(convo.id);
    setShowPicker(false);
  }

  // ── send message ──
  function handleSend() {
    if (!selectedId || (!text.trim() && !pendingAttachment)) return;
    const msg = sendMessage(
      selectedId,
      user!.email,
      user!.name,
      text.trim(),
      pendingAttachment ?? undefined,
    );
    setMsgs((prev) => [...prev, msg]);
    setText("");
    setPendingAttachment(null);
    setAttachOpen(false);
    setTimeout(refresh, 30);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const selectedConvo = convos.find((c) => c.id === selectedId) ?? null;
  const selectedDisplay = selectedConvo
    ? ConvoDisplay({ convo: selectedConvo, myEmail: user.email })
    : null;

  const staffConvo = convos.find((c) => c.type === "staff_support");
  const staffUnread = staffConvo ? unreadIn(staffConvo.id) : 0;
  const directConvos = convos.filter((c) => c.type === "direct");

  const filteredProducts = useMemo(() => {
    if (!catSearch) return PRODUCTS;
    const q = catSearch.toLowerCase();
    return PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
    );
  }, [catSearch]);

  return (
    <div className="-m-6 flex h-[calc(100vh-3.5rem)] overflow-hidden">

      {/* ── Left Panel — Conversations ── */}
      <div className="flex w-72 shrink-0 flex-col border-r border-gray-200 bg-white dark:border-white/8 dark:bg-[#0c0c13]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 dark:border-white/8">
          <h2 className="font-semibold text-gray-900 dark:text-white">Messages</h2>
          <button
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-1 rounded-lg bg-aurex-blue px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-aurex-blue-light"
          >
            <Plus size={13} /> New
          </button>
        </div>

        {/* Aurex Staff button */}
        <button
          onClick={openStaffConvo}
          className={`flex items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50 dark:border-white/6 dark:hover:bg-white/4 ${
            selectedConvo?.type === "staff_support"
              ? "bg-aurex-blue/5 dark:bg-aurex-blue/10"
              : ""
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-aurex-blue to-aurex-teal text-xs font-bold text-white">
            AS
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Aurex Staff</p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">Support &amp; Questions</p>
          </div>
          {staffUnread > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-aurex-blue px-1 text-[10px] font-bold text-white">
              {staffUnread}
            </span>
          )}
        </button>

        {/* Direct conversations list */}
        <div className="flex-1 overflow-y-auto">
          {directConvos.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <MessageSquare size={22} className="text-gray-200 dark:text-gray-700" />
              <p className="text-xs text-gray-400 dark:text-gray-500">
                No direct messages yet.
                <br />
                Click <strong className="text-gray-600 dark:text-gray-400">New</strong> to start one.
              </p>
            </div>
          ) : (
            <div className="py-1">
              {directConvos.map((convo) => {
                const display = ConvoDisplay({ convo, myEmail: user.email });
                const unread = unreadIn(convo.id);
                const isActive = selectedId === convo.id;
                return (
                  <button
                    key={convo.id}
                    onClick={() => selectConvo(convo.id)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                      isActive
                        ? "bg-aurex-blue/5 dark:bg-aurex-blue/10"
                        : "hover:bg-gray-50 dark:hover:bg-white/4"
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-aurex-blue/10 text-xs font-bold text-aurex-blue">
                      {display.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p
                          className={`truncate text-sm ${
                            unread > 0
                              ? "font-semibold text-gray-900 dark:text-white"
                              : "font-medium text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {display.name}
                        </p>
                        <p className="shrink-0 text-[10px] text-gray-400">
                          {fmtTime(convo.lastMessageAt)}
                        </p>
                      </div>
                      <p className="truncate text-xs text-gray-400 dark:text-gray-500">
                        {convo.lastMessageText || (
                          <span className="italic">No messages yet</span>
                        )}
                      </p>
                    </div>
                    {unread > 0 && (
                      <span className="ml-1 flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-aurex-blue px-1 text-[10px] font-bold text-white">
                        {unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Right Panel — Chat ── */}
      {!selectedConvo ? (
        <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 dark:bg-[#131320]">
          <MessageSquare size={40} className="text-gray-200 dark:text-gray-700" />
          <p className="mt-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
            Select a conversation
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-600">
            or click <strong>New</strong> to start one
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col bg-gray-50 dark:bg-[#131320]">

          {/* Chat header */}
          <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-3.5 dark:border-white/8 dark:bg-[#0c0c13]">
            {selectedDisplay?.isStaff ? (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-aurex-blue to-aurex-teal text-xs font-bold text-white">
                AS
              </div>
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-aurex-blue/10 text-xs font-bold text-aurex-blue">
                {selectedDisplay?.initials}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {selectedDisplay?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {selectedDisplay?.subtitle}
              </p>
            </div>
          </div>

          {/* Messages scrollable area */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {msgs.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <MessageSquare size={28} className="text-gray-200 dark:text-gray-700" />
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  No messages yet. Say hello!
                </p>
              </div>
            ) : (
              msgs.map((msg) => {
                const isMe = msg.senderId === user.email;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-sm">
                      {!isMe && (
                        <p className="mb-1 ml-1 text-[10px] font-semibold text-gray-500 dark:text-gray-400">
                          {msg.senderName}
                        </p>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2.5 ${
                          isMe
                            ? "rounded-tr-sm bg-aurex-blue text-white"
                            : "rounded-tl-sm bg-white text-gray-900 shadow-sm dark:bg-[#1a1a2a] dark:text-white"
                        }`}
                      >
                        {msg.text && (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        )}
                        {msg.attachment && (
                          <AttachmentCard attachment={msg.attachment} isMe={isMe} />
                        )}
                      </div>
                      <p
                        className={`mt-1 text-[10px] text-gray-400 ${
                          isMe ? "text-right mr-1" : "ml-1"
                        }`}
                      >
                        {fmtTime(msg.sentAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={endRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-gray-200 bg-white px-4 py-3 dark:border-white/8 dark:bg-[#0c0c13]">

            {/* Pending attachment preview */}
            {pendingAttachment && (
              <div className="mb-3 flex items-center gap-3 rounded-xl border border-aurex-blue/20 bg-aurex-blue/5 p-3 dark:border-aurex-blue/30 dark:bg-aurex-blue/10">
                {pendingAttachment.type === "order" ? (
                  <ShoppingBag size={14} className="shrink-0 text-aurex-blue" />
                ) : (
                  <Package size={14} className="shrink-0 text-aurex-blue" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-gray-900 dark:text-white">
                    {pendingAttachment.type === "order"
                      ? pendingAttachment.orderNumber
                      : pendingAttachment.name}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {pendingAttachment.type === "order"
                      ? `${pendingAttachment.itemCount} item${pendingAttachment.itemCount !== 1 ? "s" : ""} · $${pendingAttachment.total.toFixed(2)}`
                      : `${pendingAttachment.sku} · $${pendingAttachment.price.toFixed(2)} / ${pendingAttachment.unit}`}
                  </p>
                </div>
                <button
                  onClick={() => setPendingAttachment(null)}
                  className="shrink-0 rounded p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Attach options bar */}
            {attachOpen && (
              <div className="mb-3 flex items-center gap-2">
                <button
                  onClick={() => { setAttachModal("order"); setAttachOpen(false); }}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                >
                  <ShoppingBag size={13} className="text-aurex-blue" /> Share Order
                </button>
                <button
                  onClick={() => { setAttachModal("catalog"); setAttachOpen(false); }}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                >
                  <Package size={13} className="text-aurex-blue" /> Share Catalog Item
                </button>
                <button
                  onClick={() => setAttachOpen(false)}
                  className="ml-auto rounded p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Text row */}
            <div className="flex items-end gap-2">
              <button
                onClick={() => setAttachOpen((v) => !v)}
                title="Attach"
                className={`shrink-0 rounded-lg p-2.5 transition ${
                  attachOpen
                    ? "bg-aurex-blue/10 text-aurex-blue"
                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/8 dark:hover:text-gray-300"
                }`}
              >
                <Paperclip size={17} />
              </button>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message… (Enter to send)"
                rows={1}
                style={{ maxHeight: "120px" }}
                className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-aurex-blue focus:bg-white focus:outline-none focus:ring-1 focus:ring-aurex-blue dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500 dark:focus:bg-white/8"
              />
              <button
                onClick={handleSend}
                disabled={!text.trim() && !pendingAttachment}
                title="Send"
                className="shrink-0 rounded-xl bg-aurex-blue p-2.5 text-white transition hover:bg-aurex-blue-light disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Contact Picker Modal ── */}
      {showPicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => { setShowPicker(false); setPickerSearch(""); }}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1a2a]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-white/8">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">New Message</h2>
              <button
                onClick={() => { setShowPicker(false); setPickerSearch(""); }}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/8"
              >
                <X size={18} />
              </button>
            </div>
            <div className="border-b border-gray-100 px-4 py-3 dark:border-white/8">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or department…"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  autoFocus
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-aurex-blue focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
                />
              </div>
            </div>
            <div className="max-h-72 overflow-y-auto py-2">
              <button
                onClick={openStaffConvo}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50 dark:hover:bg-white/4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-aurex-blue to-aurex-teal text-xs font-bold text-white">
                  AS
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Aurex Staff</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Support &amp; Questions</p>
                </div>
              </button>

              {filteredContacts.length > 0 && (
                <div className="mx-4 my-1 border-t border-gray-100 dark:border-white/6" />
              )}

              {filteredContacts.map((contact) => (
                <button
                  key={contact.email}
                  onClick={() => openDirect(contact.email)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50 dark:hover:bg-white/4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-aurex-blue/10 text-xs font-bold text-aurex-blue">
                    {contact.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {contact.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {contact.department}
                    </p>
                  </div>
                </button>
              ))}

              {filteredContacts.length === 0 && !pickerSearch && (
                <p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
                  No other contacts in your department.
                </p>
              )}
              {filteredContacts.length === 0 && pickerSearch && (
                <p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
                  No contacts match &ldquo;{pickerSearch}&rdquo;.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Order Attachment Modal ── */}
      {attachModal === "order" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setAttachModal(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1a2a]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-white/8">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Share an Order</h2>
              <button
                onClick={() => setAttachModal(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/8"
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto p-4">
              {userOrders.length === 0 ? (
                <div className="py-12 text-center">
                  <ShoppingBag size={28} className="mx-auto mb-2 text-gray-200 dark:text-gray-700" />
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    You don&apos;t have any orders yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {userOrders.slice(0, 20).map((order) => (
                    <button
                      key={order.id}
                      onClick={() => {
                        setPendingAttachment({
                          type: "order",
                          orderNumber: order.requestNumber,
                          total: order.total,
                          itemCount: order.items.length,
                        });
                        setAttachModal(null);
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50/60 p-3.5 text-left transition hover:border-aurex-blue hover:bg-aurex-blue/5 dark:border-white/10 dark:bg-white/3 dark:hover:border-aurex-blue dark:hover:bg-aurex-blue/10"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {order.requestNumber}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·{" "}
                          {new Date(order.submittedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${order.total.toFixed(2)}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Catalog Attachment Modal ── */}
      {attachModal === "catalog" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setAttachModal(null)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1a2a]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-white/8">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Share from Catalog
              </h2>
              <button
                onClick={() => setAttachModal(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/8"
              >
                <X size={18} />
              </button>
            </div>
            <div className="border-b border-gray-100 px-4 py-3 dark:border-white/8">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search catalog by name or SKU…"
                  value={catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                  autoFocus
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-aurex-blue focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
                />
              </div>
            </div>
            <div className="max-h-[420px] overflow-y-auto p-4">
              {filteredProducts.length === 0 ? (
                <div className="py-10 text-center">
                  <Package size={24} className="mx-auto mb-2 text-gray-200 dark:text-gray-700" />
                  <p className="text-sm text-gray-400 dark:text-gray-500">No products match your search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.sku}
                      onClick={() => {
                        setPendingAttachment({
                          type: "catalog",
                          sku: product.sku,
                          name: product.name,
                          price: product.price,
                          unit: product.unit,
                        });
                        setAttachModal(null);
                      }}
                      className="flex flex-col items-start gap-1.5 rounded-xl border border-gray-200 bg-gray-50/60 p-3 text-left transition hover:border-aurex-blue hover:shadow-sm dark:border-white/10 dark:bg-white/3 dark:hover:border-aurex-blue"
                    >
                      <span className="rounded-full bg-aurex-blue/10 px-2 py-0.5 text-[10px] font-medium text-aurex-blue">
                        {product.category}
                      </span>
                      <p className="line-clamp-2 text-xs font-semibold leading-tight text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="font-mono text-[10px] text-gray-400 dark:text-gray-500">
                        {product.sku}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ${product.price.toFixed(2)} / {product.unit}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
