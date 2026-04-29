"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  MessageSquare, Send, Building2, ShoppingBag, Package, Trash2,
} from "lucide-react";
import {
  getStaffConversations,
  getMessages as getConvoMsgs,
  sendMessage,
  markStaffConversationRead,
  purgeAllMessages,
  type Conversation,
  type Message,
  type MessageAttachment,
} from "@/lib/messages-store";
import { getUsersFromStore } from "@/lib/mock-auth";
import { getInstitutions } from "@/lib/institutions";

function fmtTime(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getUserEmail(convo: Conversation): string {
  return convo.participants.find((p) => p !== "aurex_staff") ?? "";
}

function AttachmentCard({ attachment }: { attachment: MessageAttachment }) {
  return (
    <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-white/10 dark:bg-white/5">
      {attachment.type === "order" ? (
        <ShoppingBag size={14} className="shrink-0 text-aurex-blue" />
      ) : (
        <Package size={14} className="shrink-0 text-aurex-blue" />
      )}
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-gray-900 dark:text-white">
          {attachment.type === "order" ? attachment.orderNumber : attachment.name}
        </p>
        <p className="text-[10px] text-gray-500 dark:text-gray-400">
          {attachment.type === "order"
            ? `${attachment.itemCount} item${attachment.itemCount !== 1 ? "s" : ""} · $${attachment.total.toFixed(2)}`
            : `${attachment.sku} · $${attachment.price.toFixed(2)} / ${attachment.unit}`}
        </p>
      </div>
    </div>
  );
}

function countUnreadInConvo(convoId: string): number {
  try {
    const raw = localStorage.getItem("aurex_staff_msgs_read");
    const readSet = new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
    return getConvoMsgs(convoId).filter(
      (m) => m.senderId !== "aurex_staff" && !readSet.has(m.id),
    ).length;
  } catch { return 0; }
}

export default function StaffMessagesPage() {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState("");
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const endRef = useRef<HTMLDivElement>(null);

  const institutions = useMemo(() => getInstitutions(), []);
  const usersStore = useMemo(() => getUsersFromStore(), []);

  function getInstitutionName(id: string): string {
    return institutions.find((i) => i.id === id)?.name ?? id;
  }

  function getUserName(email: string): string {
    return usersStore[email]?.name ?? email;
  }

  function refresh() {
    const fresh = getStaffConversations();
    setConvos(fresh);
    const counts: Record<string, number> = {};
    for (const c of fresh) counts[c.id] = countUnreadInConvo(c.id);
    setUnreadCounts(counts);
  }

  useEffect(() => {
    refresh();
    // Pre-select a conversation if navigated here with ?convo= param (e.g. from order modal)
    const params = new URLSearchParams(window.location.search);
    const initConvo = params.get("convo");
    if (initConvo) setSelectedId(initConvo);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!selectedId) { setMsgs([]); return; }
    setMsgs(getConvoMsgs(selectedId));
    markStaffConversationRead(selectedId);
    setTimeout(refresh, 30);
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  function handleSend() {
    if (!selectedId || !replyText.trim()) return;
    const msg = sendMessage(selectedId, "aurex_staff", "Aurex Staff", replyText.trim());
    setMsgs((prev) => [...prev, msg]);
    setReplyText("");
    setTimeout(refresh, 30);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const selectedConvo = convos.find((c) => c.id === selectedId) ?? null;
  const selectedUserEmail = selectedConvo ? getUserEmail(selectedConvo) : "";

  return (
    <div className="-m-6 flex h-[calc(100vh-3.5rem)] overflow-hidden">

      {/* ── Left Panel — Support Inbox ── */}
      <div className="flex w-80 shrink-0 flex-col border-r border-gray-200 bg-white dark:border-white/6 dark:bg-[#0a0a10]">

        <div className="border-b border-gray-200 px-5 py-4 dark:border-white/6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Support Inbox</h2>
            <button
              onClick={() => {
                if (window.confirm("Purge all messages? This cannot be undone.")) {
                  purgeAllMessages();
                  setConvos([]);
                  setSelectedId(null);
                  setMsgs([]);
                  setUnreadCounts({});
                }
              }}
              title="Purge all messages"
              className="rounded p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <p className="mt-0.5 text-xs text-gray-500">Messages from portal users</p>
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          {convos.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <MessageSquare size={24} className="text-gray-300 dark:text-gray-700" />
              <p className="text-xs text-gray-400 dark:text-gray-600">No support messages yet.</p>
            </div>
          ) : (
            convos.map((convo) => {
              const userEmail = getUserEmail(convo);
              const userName = getUserName(userEmail);
              const institution = getInstitutionName(convo.institutionId);
              const unread = unreadCounts[convo.id] ?? 0;
              const isActive = selectedId === convo.id;

              return (
                <button
                  key={convo.id}
                  onClick={() => setSelectedId(convo.id)}
                  className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition ${
                    isActive ? "bg-aurex-blue/10" : "hover:bg-gray-50 dark:hover:bg-white/4"
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-aurex-blue/10 text-xs font-bold text-aurex-blue">
                    {usersStore[userEmail]?.initials ?? "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={`truncate text-xs ${
                          unread > 0
                            ? "font-semibold text-gray-900 dark:text-white"
                            : "font-medium text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {userName}
                      </p>
                      <p className="shrink-0 text-[10px] text-gray-400 dark:text-gray-600">
                        {fmtTime(convo.lastMessageAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 size={9} className="shrink-0 text-gray-400 dark:text-gray-700" />
                      <p className="truncate text-[10px] text-gray-400 dark:text-gray-600">{institution}</p>
                    </div>
                    {convo.lastMessageText && (
                      <p className="mt-0.5 truncate text-[10px] text-gray-400 dark:text-gray-600">
                        {convo.lastMessageText}
                      </p>
                    )}
                  </div>
                  {unread > 0 && (
                    <span className="ml-1 flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-aurex-blue px-1 text-[10px] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right Panel — Messages ── */}
      {!selectedConvo ? (
        <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 dark:bg-[#0c0c13]">
          <MessageSquare size={40} className="text-gray-300 dark:text-gray-700" />
          <p className="mt-3 text-sm font-semibold text-gray-500 dark:text-gray-400">Select a conversation</p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-600">
            Portal users&apos; support messages appear here
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col bg-gray-50 dark:bg-[#0c0c13]">

          {/* Chat header */}
          <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-3.5 dark:border-white/6 dark:bg-[#0a0a10]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-aurex-blue/10 text-xs font-bold text-aurex-blue">
              {usersStore[selectedUserEmail]?.initials ?? "?"}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {getUserName(selectedUserEmail)}
              </p>
              <div className="flex items-center gap-1.5">
                <Building2 size={11} className="text-gray-400 dark:text-gray-600" />
                <p className="text-xs text-gray-500">
                  {getInstitutionName(selectedConvo.institutionId)}
                </p>
                {usersStore[selectedUserEmail]?.department && (
                  <>
                    <span className="text-gray-300 dark:text-gray-700">·</span>
                    <p className="text-xs text-gray-500">
                      {usersStore[selectedUserEmail].department}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {msgs.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <MessageSquare size={28} className="text-gray-300 dark:text-gray-700" />
                <p className="text-sm text-gray-400 dark:text-gray-600">No messages yet.</p>
              </div>
            ) : (
              msgs.map((msg) => {
                const isStaff = msg.senderId === "aurex_staff";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isStaff ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-sm">
                      {!isStaff && (
                        <p className="mb-1 ml-1 text-[10px] font-semibold text-gray-500">
                          {msg.senderName}
                        </p>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2.5 ${
                          isStaff
                            ? "rounded-tr-sm bg-aurex-blue text-white"
                            : "rounded-tl-sm bg-white shadow-sm text-gray-900 dark:bg-[#1a1a2a] dark:text-white"
                        }`}
                      >
                        {msg.text && (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {msg.text}
                          </p>
                        )}
                        {msg.attachment && (
                          <AttachmentCard attachment={msg.attachment} />
                        )}
                      </div>
                      <p
                        className={`mt-1 text-[10px] text-gray-400 ${
                          isStaff ? "text-right mr-1" : "ml-1"
                        }`}
                      >
                        {isStaff && (
                          <span className="mr-1 text-aurex-blue/70">Aurex Staff · </span>
                        )}
                        {fmtTime(msg.sentAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={endRef} />
          </div>

          {/* Reply area */}
          <div className="border-t border-gray-200 bg-white px-4 py-3 dark:border-white/6 dark:bg-[#0a0a10]">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-aurex-blue to-aurex-teal text-[8px] font-bold text-white">
                AS
              </div>
              <p className="text-[10px] font-semibold text-gray-500">
                Replying as <span className="text-aurex-blue">Aurex Staff</span>
              </p>
            </div>
            <div className="flex items-end gap-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a reply… (Enter to send)"
                rows={1}
                style={{ maxHeight: "120px" }}
                className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-aurex-blue/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-aurex-blue/30 dark:border-white/8 dark:bg-white/4 dark:text-white dark:placeholder-gray-600 dark:focus:bg-white/6"
              />
              <button
                onClick={handleSend}
                disabled={!replyText.trim()}
                title="Send reply"
                className="shrink-0 rounded-xl bg-aurex-blue p-2.5 text-white transition hover:bg-aurex-blue-light disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
