/**
 * Tokki 챗 위젯 백엔드 클라이언트.
 *
 * 무련 사이트(muryen-front)를 Tokki 백엔드(my-server-test)의 첫 임베드
 * 고객으로 연결한다. 백엔드의 공개 엔드포인트 3개(인증 불필요, CORS 전면
 * 허용)를 브라우저에서 직접 호출한다:
 *
 *   POST /v2/widget/view          → 페르소나 + 이전 대화 복원
 *   POST /v2/widget/create-thread → 새 스레드 발급(여기선 view가 대신 처리)
 *   POST /v2/ask                  → SSE 토큰 스트리밍 + 양쪽 메시지 영속화
 *
 * ⚠️ SSE 인코딩: 백엔드가 청크를 부분적으로 퍼센트 인코딩해서 보낸다
 * (widget-endpoints.ts의 sendChunk 참고). 순서대로 "%"→%25, 공백→%20,
 * 줄바꿈→%0a, 캐리지리턴→%0d. 한글 등 나머지 문자는 raw로 오므로
 * decodeURIComponent가 아니라 이 네 패턴만 되돌린다(decodeChunk 참고).
 */

/** 배포된 Tokki 백엔드. 커스텀 백엔드는 NEXT_PUBLIC_TOKKI_API_URL로 덮어쓴다. */
export const TOKKI_API_URL = (
  process.env.NEXT_PUBLIC_TOKKI_API_URL || "https://my-server-test.vercel.app"
).replace(/\/$/, "");

/** 이 사이트의 위젯 식별자. 백엔드 widget 테이블의 row id와 일치해야 한다. */
export const TOKKI_WIDGET_ID =
  process.env.NEXT_PUBLIC_TOKKI_WIDGET_ID || "muryen";

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/** /v2/widget/view 가 돌려주는 위젯 페르소나(우리가 쓰는 필드만). */
export interface WidgetPersona {
  name: string;
  theme: string;
  welcome_message: string;
  description: string;
  questions: string[];
  icon: string | null;
  widget_bubble_size: string | null;
}

export interface WidgetView {
  threadId: string;
  messages: ChatMessage[];
  persona: WidgetPersona;
}

interface ViewResponse {
  success: boolean;
  thread_id: string;
  messages: ChatMessage[];
  widget: Partial<WidgetPersona>;
}

function normalizePersona(w: Partial<WidgetPersona> | undefined): WidgetPersona {
  return {
    name: w?.name?.trim() || "AI 도우미",
    theme: w?.theme || "noir",
    welcome_message:
      w?.welcome_message?.trim() || "안녕하세요! 무엇이든 편하게 물어봐 주세요.",
    description: w?.description?.trim() || "온라인 · 보통 몇 초 안에 답해요",
    questions: Array.isArray(w?.questions) ? w!.questions : [],
    icon: w?.icon ?? null,
    widget_bubble_size: w?.widget_bubble_size ?? null,
  };
}

/**
 * POST /v2/widget/view — 페르소나를 가져오고, threadId가 살아있으면 그
 * 스레드의 이전 메시지를 복원한다. 백엔드는 항상 유효한 thread_id를 돌려준다
 * (보낸 게 없거나 만료됐으면 새로 발급). 호출 측은 그 값을 저장해 재사용한다.
 */
export async function loadWidget(threadId?: string): Promise<WidgetView> {
  const res = await fetch(`${TOKKI_API_URL}/v2/widget/view`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      widgetId: TOKKI_WIDGET_ID,
      threadId: threadId ?? "",
    }),
  });
  if (!res.ok) {
    throw new Error(`/v2/widget/view 실패: HTTP ${res.status}`);
  }
  const data = (await res.json()) as ViewResponse;
  return {
    threadId: data.thread_id ?? "",
    messages: Array.isArray(data.messages) ? data.messages : [],
    persona: normalizePersona(data.widget),
  };
}

/**
 * 백엔드의 퍼센트 인코딩을 역으로 되돌린다.
 *
 * 백엔드는 "%"를 가장 먼저 %25로 escape한 뒤 공백/개행을 인코딩하므로,
 * 디코딩은 그 역순 — %25를 반드시 **마지막**에 풀어야 한다. 먼저 풀면
 * 모델이 실제로 출력한 "%20" 같은 문자열(와이어에선 "%2520")이 공백으로
 * 잘못 복원된다.
 */
function decodeChunk(s: string): string {
  return s
    .replace(/%20/g, " ")
    .replace(/%0a/g, "\n")
    .replace(/%0d/g, "\r")
    .replace(/%25/g, "%");
}

export interface AskOptions {
  message: string;
  threadId?: string;
  /** 토큰이 도착할 때마다 호출(디코딩된 조각). */
  onToken: (token: string) => void;
  signal?: AbortSignal;
}

/**
 * POST /v2/ask — SSE 스트림을 읽어 토큰마다 onToken을 호출하고, 누적된 전체
 * 응답 문자열을 반환한다. "data: [DONE]" 을 만나면 종료한다.
 *
 * 주의: 빈 threadId로 보내면 백엔드가 새 스레드를 만들지만 그 id를 응답에
 * 주지 않으므로, 호출 전에 loadWidget으로 받은 threadId를 반드시 넘겨야
 * 대화 맥락이 유지된다.
 */
export async function ask({
  message,
  threadId,
  onToken,
  signal,
}: AskOptions): Promise<string> {
  const res = await fetch(`${TOKKI_API_URL}/v2/ask`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      widgetId: TOKKI_WIDGET_ID,
      threadId: threadId ?? "",
      message,
    }),
    signal,
  });
  if (!res.ok || !res.body) {
    throw new Error(`/v2/ask 실패: HTTP ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  const handleLine = (line: string): boolean => {
    const trimmed = line.replace(/\r$/, "");
    if (!trimmed.startsWith("data:")) return false;
    // "data:" 다음의 선택적 공백 1개를 제거하면 인코딩된 토큰만 남는다.
    const payload = trimmed.slice(5).replace(/^ /, "");
    if (payload === "[DONE]") return true; // 종료 신호
    const token = decodeChunk(payload);
    full += token;
    onToken(token);
    return false;
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? ""; // 마지막 줄은 미완성일 수 있어 보류
    for (const line of lines) {
      if (handleLine(line)) {
        await reader.cancel().catch(() => {});
        return full;
      }
    }
  }
  // [DONE] 없이 끝난 경우 버퍼 잔여 처리
  if (buffer) handleLine(buffer);
  return full;
}
