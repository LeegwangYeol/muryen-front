"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, MessageCircle, Send, X } from "lucide-react";
import { useTheme } from "@/app/context/theme-context";
import {
  ask,
  loadWidget,
  TOKKI_WIDGET_ID,
  type ChatMessage,
  type WidgetPersona,
} from "@/lib/tokki";

/** 스레드 id를 위젯별로 분리해 localStorage에 보관한다. */
const STORAGE_KEY = `tokki:${TOKKI_WIDGET_ID}:thread`;

/**
 * 무련 사이트 전역에 떠 있는 챗 도우미. 우하단 런처 버블 + 대화 패널.
 * Tokki 백엔드(lib/tokki.ts)에 직접 연결해 토큰을 스트리밍으로 받는다.
 * AppShell에 한 번 마운트하면 모든 페이지에 노출된다.
 */
export function ChatWidget() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [persona, setPersona] = useState<WidgetPersona | null>(null);
  const [threadId, setThreadId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 패널을 처음 열 때 한 번 페르소나 + 이전 대화를 복원한다.
  useEffect(() => {
    if (!open || loaded) return;
    let cancelled = false;
    (async () => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY) ?? "";
        const view = await loadWidget(stored);
        if (cancelled) return;
        setPersona(view.persona);
        setThreadId(view.threadId);
        setMessages(view.messages);
        if (view.threadId) {
          window.localStorage.setItem(STORAGE_KEY, view.threadId);
        }
        setLoaded(true);
      } catch {
        if (!cancelled) {
          setError("도우미를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, loaded]);

  // 새 메시지/스트리밍마다 맨 아래로 스크롤.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streamingText, open]);

  // 패널이 열리고 준비되면 입력란에 포커스.
  useEffect(() => {
    if (open && loaded) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open, loaded]);

  const send = useCallback(
    async (raw: string) => {
      const message = raw.trim();
      if (!message || streaming || !loaded) return;
      setError(null);
      setInput("");
      setMessages((prev) => [...prev, { role: "user", content: message }]);
      setStreaming(true);
      setStreamingText("");
      try {
        const full = await ask({
          message,
          threadId,
          onToken: (tk) => setStreamingText((s) => s + tk),
        });
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: full || "(빈 응답)" },
        ]);
      } catch {
        setError("답변을 받지 못했어요. 네트워크를 확인하고 다시 시도해 주세요.");
      } finally {
        setStreaming(false);
        setStreamingText("");
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    },
    [streaming, loaded, threadId],
  );

  const showWelcome = loaded && messages.length === 0 && !streaming;

  return (
    <>
      {/* 런처 버블 */}
      <button
        type="button"
        aria-label={open ? "채팅 도우미 닫기" : "채팅 도우미 열기"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-red-800 text-white shadow-lg shadow-black/30 transition-transform hover:scale-105 hover:bg-red-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2"
        style={{
          marginBottom: "env(safe-area-inset-bottom)",
          marginRight: "env(safe-area-inset-right)",
        }}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* 대화 패널 */}
      {open && (
        <div
          role="dialog"
          aria-label={`${persona?.name ?? "AI 도우미"} 채팅`}
          className={`fixed bottom-24 right-5 z-[95] flex w-[360px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl ${
            isDark
              ? "border-white/10 bg-[#2a0707] text-white"
              : "border-gray-200 bg-white text-gray-900"
          }`}
          style={{
            height: "min(560px, calc(100vh - 8rem))",
            marginBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {/* 헤더 */}
          <header
            className={`flex items-center gap-3 px-4 py-3 ${
              isDark ? "bg-white/5" : "bg-gray-50"
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-red-800 text-white">
              {persona?.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={persona.icon}
                  alt=""
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <MessageCircle size={18} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {persona?.name ?? "AI 도우미"}
              </p>
              <p
                className={`truncate text-xs ${
                  isDark ? "text-white/60" : "text-gray-500"
                }`}
              >
                {streaming ? "입력 중…" : persona?.description ?? "온라인"}
              </p>
            </div>
            <button
              type="button"
              aria-label="닫기"
              onClick={() => setOpen(false)}
              className={`rounded-full p-1.5 transition-colors ${
                isDark ? "hover:bg-white/10" : "hover:bg-gray-200"
              }`}
            >
              <X size={18} />
            </button>
          </header>

          {/* 메시지 목록 */}
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {!loaded && (
              <div
                className={`flex items-center justify-center gap-2 py-8 text-sm ${
                  isDark ? "text-white/60" : "text-gray-500"
                }`}
              >
                <Loader2 size={16} className="animate-spin" />
                불러오는 중…
              </div>
            )}

            {showWelcome && persona && (
              <Bubble role="assistant" isDark={isDark}>
                {persona.welcome_message}
              </Bubble>
            )}

            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} isDark={isDark}>
                {m.content}
              </Bubble>
            ))}

            {streaming && (
              <Bubble role="assistant" isDark={isDark}>
                {streamingText ? (
                  <>
                    {streamingText}
                    <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-current align-middle" />
                  </>
                ) : (
                  <TypingDots />
                )}
              </Bubble>
            )}

            {error && (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-center text-xs text-red-400">
                {error}
              </p>
            )}
          </div>

          {/* 추천 질문 */}
          {showWelcome && persona && persona.questions.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 pb-3">
              {persona.questions.slice(0, 4).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    isDark
                      ? "border-white/20 text-white/80 hover:bg-white/10"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* 입력 */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className={`flex items-center gap-2 border-t px-3 py-3 ${
              isDark ? "border-white/10" : "border-gray-200"
            }`}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!loaded || streaming}
              placeholder={loaded ? "메시지를 입력하세요…" : "준비 중…"}
              aria-label="메시지 입력"
              className={`flex-1 rounded-full px-4 py-2 text-sm outline-none transition-colors disabled:opacity-50 ${
                isDark
                  ? "bg-white/10 text-white placeholder:text-white/40 focus:bg-white/15"
                  : "bg-gray-100 text-gray-900 placeholder:text-gray-400 focus:bg-gray-200"
              }`}
            />
            <button
              type="submit"
              aria-label="보내기"
              disabled={!loaded || streaming || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-800 text-white transition-colors hover:bg-red-700 disabled:opacity-40"
            >
              {streaming ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function Bubble({
  role,
  isDark,
  children,
}: {
  role: ChatMessage["role"];
  isDark: boolean;
  children: React.ReactNode;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-red-800 text-white"
            : isDark
              ? "rounded-bl-sm bg-white/10 text-white"
              : "rounded-bl-sm bg-gray-100 text-gray-900"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
    </span>
  );
}
