# Live Production Forensic Audit Report: AI Chat, External Integrations, Deep Performance & Headers

**Auditor Agent**: `auditor_live_chat_perf`  
**Working Directory**: `/Users/a7890/src/muryen-front/.agents/auditor_live_chat_perf`  
**Timestamp**: `2026-09-10T15:15:00Z` (`2026-09-11T00:15:00+09:00`)  
**Target Live Production Site**: `https://muryen-front.vercel.app`  

---

## 1. Observation

All observations were captured directly from the live production deployment on Vercel edge nodes (`icn1::iad1`) using Chrome DevTools MCP (Chromium 152.0.7977.83) in isolated browser context (`isolatedContext: auditor_live_chat_perf`) and HTTP/2 network analysis.

---

### 1.1 Tokki AI Chat Widget (`components/chat/chat-widget.tsx` & `lib/tokki.ts`)

#### 1.1.1 Launcher Bubble Inspection
- **DOM Selector**: `button[aria-label="채팅 도우미 열기"]`
- **Computed Styles**:
  - `position`: `fixed`
  - `bottom`: `20px` (with `marginBottom: env(safe-area-inset-bottom)`)
  - `right`: `20px` (with `marginRight: env(safe-area-inset-right)`)
  - `zIndex`: `90`
  - `width`: `56px` (`h-14 w-14`), `height`: `56px`, `borderRadius`: `9999px` (circular)
  - `backgroundColor`: `rgb(153, 27, 27)` (`bg-red-800`)
  - `boxShadow`: `0 10px 15px -3px rgba(0, 0, 0, 0.3)`
  - `aria-label`: `"채팅 도우미 열기"`
  - `aria-expanded`: `"false"`
- **Interaction (Opening)**:
  - Clicking the launcher bubble changes its state to `aria-label="채팅 도우미 닫기"`, `aria-expanded="true"`, renders the `X` icon, and mounts the dialog.

#### 1.1.2 Chat Panel Dialog Inspection
- **DOM Selector**: `div[role="dialog"][aria-label="무련봇 채팅"]`
- **Geometry & Styles**:
  - `position`: `fixed`, `bottom`: `96px` (`bottom-24`), `right`: `20px` (`right-5`), `zIndex`: `95`
  - `width`: `360px`, `maxWidth`: `calc(100vw - 2.5rem)`
  - `height`: `min(560px, calc(100vh - 8rem))`
  - `borderRadius`: `1rem` (`rounded-2xl`), `border`: `1px solid rgba(255, 255, 255, 0.1)` (dark mode) / `border-gray-200` (light mode)
- **Initial Loading State**:
  - Displays `<Loader2 className="animate-spin" />` with text `"불러오는 중…"`.
  - Fires POST request to `https://my-server-test.vercel.app/v2/widget/view`.

#### 1.1.3 Network Request: `POST /v2/widget/view`
- **Preflight (OPTIONS)**:
  - URL: `https://my-server-test.vercel.app/v2/widget/view`
  - Status: `204 No Content`
  - Headers: `access-control-allow-origin: https://muryen-front.vercel.app`, `access-control-allow-methods: POST`
- **Main Request**:
  - URL: `https://my-server-test.vercel.app/v2/widget/view`
  - Status: `200 OK`
  - Request Method: `POST`
  - Request Payload:
    ```json
    {
      "widgetId": "muryen",
      "threadId": "6df348af-119c-4833-ac2d-5e5b2b50c5c2"
    }
    ```
  - Response Headers:
    - `access-control-allow-origin: https://muryen-front.vercel.app`
    - `access-control-allow-credentials: true`
    - `content-type: application/json`
    - `x-vercel-cache: MISS`
  - Response Body (Verbatim):
    ```json
    {
      "success": true,
      "thread_id": "6df348af-119c-4833-ac2d-5e5b2b50c5c2",
      "remain_limit": 999,
      "messages": [],
      "widget": {
        "name": "무련봇",
        "theme": "noir",
        "animation_theme": null,
        "welcome_message": "무련에 오신 것을 환영합니다. 조선 24반 무예와 갑주 대련, 수련·입회에 대해 무엇이든 물어보세요.",
        "description": "온라인 · 24반 무예·갑주 대련 안내",
        "questions": [
          "무련은 어떤 곳인가요?",
          "갑주 대련은 뭐가 다른가요?",
          "초보자도 할 수 있나요?",
          "어떻게 가입하나요?"
        ],
        "widget_message_title": null,
        "widget_message_content": null,
        "widget_margin_bottom": 24,
        "widget_margin_right": 24,
        "widget_bubble_size": null,
        "widget_auto_open": false,
        "payment_type": "",
        "font_family": null,
        "icon": null,
        "accept_contact": false,
        "avatar_src": null,
        "widget_id": "muryen"
      }
    }
    ```
  - Result in UI: Populates header with name `"무련봇"`, description `"온라인 · 24반 무예·갑주 대련 안내"`, welcome bubble, and 4 quick question buttons.

#### 1.1.4 Prompt Execution & Live SSE Streaming: `POST /v2/ask`
- **User Action**: Triggered prompt `"무련은 어떤 곳인가요?"` (or custom input `"무련 소개"`).
- **Preflight (OPTIONS)**:
  - URL: `https://my-server-test.vercel.app/v2/ask`
  - Status: `204 No Content`
- **Main Request**:
  - URL: `https://my-server-test.vercel.app/v2/ask`
  - Status: `200 OK`
  - Request Method: `POST`
  - Request Payload:
    ```json
    {
      "widgetId": "muryen",
      "threadId": "6df348af-119c-4833-ac2d-5e5b2b50c5c2",
      "message": "무련은 어떤 곳인가요?"
    }
    ```
  - Response Headers:
    - `content-type`: `text/event-stream`
    - `cache-control`: `no-cache, no-transform`
    - `access-control-allow-origin`: `https://muryen-front.vercel.app`
    - `x-vercel-cache`: `MISS`
  - Raw Wire Stream Payload (Verbatim):
    ```text
    data: %0a[LLM%20error]%20[openai]%20429%20Too%20Many%20Requests:%20{%0a%20%20%20%20"error":%20{%0a%20%20%20%20%20%20%20%20"message":%20"You%20have%20no%20credits%20remaining.%20Add%20credits%20to%20continue%20using%20the%20API%20at%20https://platform.openai.com/settings/organization/billing/.",%0a%20%20%20%20%20%20%20%20"type":%20"insufficient_quota",%0a%20%20%20%20%20%20%20%20"param":%20null,%0a%20%20%20%20%20%20%20%20"code":%20"credit_balance_exhausted"%0a%20%20%20%20}%0a}%0a

    data: [DONE]
    ```
  - **Client Decoding & Rendering**:
    - `lib/tokki.ts` `decodeChunk` decoded the percent-encoded wire stream.
    - Because the server responded with HTTP 200 (rather than an HTTP 4xx/5xx or structured error SSE event), the client code treated the payload as a normal assistant response.
    - The assistant chat bubble in the UI rendered the raw OpenAI error message directly to the user:
      `[LLM error] [openai] 429 Too Many Requests: {"error":{"message":"You have no credits remaining...","type":"insufficient_quota","code":"credit_balance_exhausted"}}`.

#### 1.1.5 Dialog Close Controls
- **Header Close Button**:
  - Selector: `button[aria-label="닫기"]` inside `div[role="dialog"] header`
  - Action: Clicking triggers `setOpen(false)`.
  - Observed Result: Dialog cleanly unmounts from DOM immediately; launcher button returns to `aria-label="채팅 도우미 열기"`, `aria-expanded="false"`.
- **Floating Launcher Button**:
  - When open, clicking the launcher button (which displays the `X` icon) cleanly toggles the dialog closed.

---

### 1.2 3D Vanta Background (`#vanta-bg`)

#### 1.2.1 Desktop Viewports (> 768px, e.g., 1920x1080)
- **CDN Scripts Injected**:
  1. `https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js` (`async="true"`, `data-loaded="true"`)
  2. `https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.cells.min.js` (`async="true"`, `data-loaded="true"`)
- **DOM Container & Canvas**:
  - `<div id="vanta-bg" aria-hidden="true" class="fixed inset-0 z-[-1] pointer-events-none">`
  - Child Canvas: `<canvas class="vanta-canvas" width="1920" height="1080" style="width: 1920px; height: 1080px;"></canvas>`
- **Global Variables**: `window.THREE` is defined; `window.VANTA.CELLS` is active.
- **Resource Footprint & Performance**:
  - `performance.memory.totalJSHeapSize`: `13.52 MB`
  - `performance.memory.usedJSHeapSize`: `11.46 MB`
  - Animation Frame Delta: `16.61 ms` average
  - Measured Frame Rate: `60.2 FPS`
  - Long Frames (>33.3ms): `0` out of 60 sampled animation frames
  - Main thread blocking: None detected during steady state.

#### 1.2.2 Mobile Viewports (<= 768px, tested at 390x844 iPhone 14)
- **Media Query Check**: `window.matchMedia("(max-width: 768px)").matches` evaluates to `true`.
- **Code Execution Path**: In `app/component/vanta-main-background.tsx` lines 29-33:
  ```ts
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isMobile || reducedMotion) return;
  ```
- **Observed Results on Mobile**:
  - `#vanta-bg` container exists as an empty placeholder `<div>`.
  - `document.querySelector('#vanta-bg canvas')`: `null` (NO canvas created).
  - `document.querySelectorAll('script[src*="three"], script[src*="vanta"]')`: `0` scripts injected into DOM.
  - `window.VANTA`: `undefined`.
  - `window.THREE`: `undefined`.
  - Network overhead: 0 bytes transferred for Three.js / Vanta on mobile.
  - Conclusion: 3D background is 100% cleanly bypassed on mobile viewports.

---

### 1.3 Meta Endpoints Audit

#### 1.3.1 `/feed.xml`
- **HTTP Status**: `200 OK`
- **Headers**:
  - `content-type`: `application/rss+xml; charset=utf-8`
  - `cache-control`: `public, max-age=3600`
  - `x-matched-path`: `/feed.xml`
  - `x-vercel-cache`: `MISS`
- **XML Validation & Content**:
  - Root: `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">`
  - Self link: `<atom:link href="https://muryen-front.vercel.app/feed.xml" rel="self" type="application/rss+xml" />`
  - Channel: Title, link, description (CDATA), language (`ko-KR`), copyright (`© 2026 무련 (武聯)`), lastBuildDate (RFC 822 format), ttl (`1440`), image url (`/images/announce/gumiAllone.webp`).
  - Total Items: Exactly 8 `<item>` elements:
    1. `/` (소개)
    2. `/sparring` (대련)
    3. `/basic-sense` (24반 무예)
    4. `/basic` (기본기)
    5. `/pattern` (투로)
    6. `/cutting` (베기)
    7. `/equipment` (장비)
    8. `/reference` (참고)
  - All items contain valid `<guid isPermaLink="true">`, `<description><![CDATA[...]]></description>`, and RFC 822 `<pubDate>`.

#### 1.3.2 `/sitemap.xml`
- **HTTP Status**: `200 OK`
- **Headers**:
  - `content-type`: `application/xml`
  - `cache-control`: `public, max-age=0, must-revalidate`
  - `x-matched-path`: `/sitemap.xml`
  - `x-vercel-cache`: `HIT`
- **XML Validation & Content**:
  - Root: `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`
  - Total `<url>` Nodes: **Exactly 10 canonical links**
    1. `https://muryen-front.vercel.app` (priority: 1.0, changefreq: weekly)
    2. `https://muryen-front.vercel.app/about` (priority: 0.9, changefreq: monthly)
    3. `https://muryen-front.vercel.app/gallery` (priority: 0.8, changefreq: weekly)
    4. `https://muryen-front.vercel.app/basic-sense` (priority: 0.9, changefreq: monthly)
    5. `https://muryen-front.vercel.app/sparring` (priority: 0.9, changefreq: monthly)
    6. `https://muryen-front.vercel.app/basic` (priority: 0.8, changefreq: monthly)
    7. `https://muryen-front.vercel.app/pattern` (priority: 0.8, changefreq: monthly)
    8. `https://muryen-front.vercel.app/cutting` (priority: 0.8, changefreq: monthly)
    9. `https://muryen-front.vercel.app/equipment` (priority: 0.7, changefreq: monthly)
    10. `https://muryen-front.vercel.app/reference` (priority: 0.6, changefreq: monthly)
  - Image sitemap extensions (`<image:image><image:loc>...</image:loc></image:image>`) are present and valid on all 10 entries.

#### 1.3.3 `/robots.txt`
- **HTTP Status**: `200 OK`
- **Headers**:
  - `content-type`: `text/plain`
  - `x-matched-path`: `/robots.txt`
  - `x-vercel-cache`: `HIT`
- **Content (Verbatim)**:
  ```text
  User-Agent: *
  Allow: /
  Disallow: /daily
  Disallow: /api
  Disallow: /test
  Disallow: /test2
  Disallow: /login
  Disallow: /location
  Disallow: /know-how

  Host: https://muryen-front.vercel.app
  Sitemap: https://muryen-front.vercel.app/sitemap.xml
  ```
- All protected and non-public routes (`/daily`, `/api`, `/test`, `/test2`, `/login`, `/location`, `/know-how`) are cleanly disallowed.

---

### 1.4 Security Headers Audit (Vercel Edge Node `icn1`)

Direct inspection of live HTTP/2 response headers across HTML and API routes yielded the following audit matrix:

| Header Name | Live Production Value | Status | Forensic Evaluation |
|---|---|---|---|
| **`Strict-Transport-Security`** | `max-age=63072000; includeSubDomains; preload` | **PASS** | Exemplary 2-year HSTS policy with preload & subdomain enforcement. Injected by Vercel edge. |
| **`X-Content-Type-Options`** | `nosniff` | **PASS** | Prevents MIME sniffing attacks. Matches `next.config.ts:13`. |
| **`X-Frame-Options`** | `SAMEORIGIN` | **PASS** | Protects against external framing / clickjacking. Matches `next.config.ts:17`. |
| **`Referrer-Policy`** | `strict-origin-when-cross-origin` | **PASS** | Preserves referrers on same origin while omitting sensitive path data on cross-origin requests. Matches `next.config.ts:21`. |
| **`Permissions-Policy`** | `camera=(), microphone=(self), geolocation=()` | **PASS** | Explicitly disables camera and geolocation. Restricts microphone to `(self)` for VadAnalyzer on `/cutting`. Matches `next.config.ts:25`. |
| **`Content-Security-Policy`** | *(Header is completely absent)* | **FAIL (Defect)** | Neither `Content-Security-Policy` nor `Content-Security-Policy-Report-Only` is emitted on any route. Leaves the site without defense-in-depth against XSS or rogue CDN injections. |
| **`Access-Control-Allow-Origin`** | `*` | **WARNING** | Vercel emits `access-control-allow-origin: *` on root HTML documents (`/`, `/about`, etc.). While standard for static public pages, should be restricted on sensitive endpoints. |

---

### 1.5 Full Lighthouse & Deep Performance Audits

#### 1.5.1 Desktop Lighthouse Scores (`device: desktop`, `mode: navigation`)

| Category | Score | Status | Key Notes |
|---|---|---|---|
| **Accessibility** | **91 / 100** | Needs Attention | 2 DOM accessibility defects in sidebar |
| **Best Practices** | **96 / 100** | Minor Defect | Deducted solely due to NextAuth 500 error in console |
| **SEO** | **100 / 100** | **Perfect** | All meta, robots, sitemap, canonicals 100% compliant |
| **Agentic Browsing**| **50 / 100** | Degraded | Caused by unlabelled button and invalid aria on span |

**Specific Desktop Audit Failures**:
1. **`errors-in-console`** (Score: 0):
   - Description: `[next-auth][error][CLIENT_FETCH_ERROR] There is a problem with the server configuration. Check the server logs for more information. [object Object]`
   - Network Resource: `GET https://muryen-front.vercel.app/api/auth/session` -> HTTP 500
2. **`aria-prohibited-attr`** (Score: 0):
   - Element Snippet: `<span aria-label="Instagram (준비 중)" aria-disabled="true" class="flex items-center justify-center w-10 h-10 rounded-full opacity-40 cursor-…">`
   - Location: `app/component/navigation.tsx:223`
   - Failure: `aria-label attribute cannot be used on a span with no valid role attribute.`
3. **`button-name`** (Score: 0):
   - Element Snippet: `<button class="absolute -right-3 top-1/2 -translate-y-1/2 bg-[#280505] border border-whit…">`
   - Location: `app/component/navigation.tsx:139`
   - Failure: Sidebar collapse chevron toggle button lacks an accessible name (`aria-label` is missing).
4. **`agent-accessibility-tree`** (Score: 0):
   - Failure: Accessibility tree generation flagged due to prohibited aria attributes on generic inline tags.

#### 1.5.2 Mobile Lighthouse Scores (`device: mobile`, `mode: navigation`)

| Category | Score | Status | Key Notes |
|---|---|---|---|
| **Accessibility** | **100 / 100** | **Perfect** | Desktop sidebar is hidden on mobile; no violations in mobile drawer |
| **Best Practices** | **73 / 100** | Needs Attention | NextAuth 500 error + Naver Analytics 3rd-party cookie issues |
| **SEO** | **100 / 100** | **Perfect** | 100% compliant |
| **Agentic Browsing**| **100 / 100**| **Perfect** | Clean accessibility tree on mobile DOM |

**Specific Mobile Audit Failures**:
1. **`errors-in-console`** (Score: 0): NextAuth 500 error on `/api/auth/session`.
2. **`third-party-cookies`** (Score: 0, Display Value: `2 cookies found`):
   - Endpoint: `https://wcs.naver.com/b` (Naver Analytics)
   - Failure: Third-party cookie deprecation warning in modern Chromium.
3. **`inspector-issues`** (Score: 0):
   - Description: Cookie domain context warnings logged by Naver Analytics tracker (`wcslog.js`).

#### 1.5.3 Real-Time Performance & Core Web Vitals (Chrome Performance Trace)

Captured via synthetic trace engine (`performance_start_trace`) and native `PerformanceObserver`:

| Metric | Measured Value | Web Vitals Threshold | Assessment |
|---|---|---|---|
| **LCP (Largest Contentful Paint)** | **182 ms** | < 2500 ms (Good) | **Outstanding (< 200 ms)** |
| **TTFB (Time to First Byte)** | **6.80 ms – 8 ms** | < 800 ms (Good) | **Blazing fast (Edge CDN Cache HIT)** |
| **LCP Render Delay** | **174 ms** | N/A | Sub-200ms render pipeline |
| **CLS (Cumulative Layout Shift)** | **0.00** | < 0.1 (Good) | **Zero layout shift** |
| **FCP (First Contentful Paint)** | **184 ms** | < 1800 ms (Good) | **Instant render** |
| **DOMContentLoaded** | **43.6 ms** | N/A | Sub-50ms DOM parsing |
| **Full Load Event** | **240.7 ms** | N/A | Total page fully settled in < 250 ms |
| **Long Tasks Count** | **0** | 0 | Zero main-thread blocking tasks during load |
| **Render-Blocking Delay Savings** | **0 ms** | 0 ms | CSS/JS bundles completely unblock critical path |

---

## 2. Logic Chain

1. **AI Chat Pipeline**:
   - `components/chat/chat-widget.tsx` initializes with `open: false`.
   - On user click, `loadWidget` fetches `POST https://my-server-test.vercel.app/v2/widget/view`. The Tokki backend successfully returns HTTP 200 with the full persona and thread ID.
   - When a prompt is submitted, `ask` opens a streaming `POST https://my-server-test.vercel.app/v2/ask` connection with `content-type: text/event-stream`.
   - The Tokki server connects upstream to OpenAI. Because the Tokki OpenAI account has exhausted its balance (`code: credit_balance_exhausted`), OpenAI returns a 429 error.
   - The Tokki backend incorrectly formats this 429 error into an SSE chunk payload (`data: %0a[LLM%20error]...`) with HTTP 200 status code rather than terminating with an HTTP error or SSE error event.
   - The frontend's `ask` function decodes this string and returns it to `send`, which sets it as the assistant message in the chat UI.
   - *Conclusion*: The client-side chat widget code is fully functioning, but the external Tokki backend is failing upstream due to exhausted OpenAI billing credits, exposing raw JSON error text to end users.

2. **3D Background Architecture**:
   - `VantaBackground` utilizes modern viewport matching (`window.matchMedia("(max-width: 768px)")`).
   - On desktop, Three.js (r121) and Vanta Cells script loads dynamically and renders to `#vanta-bg canvas` with negligible memory footprint (11.46MB) and steady 60 FPS.
   - On mobile viewports (<=768px), the hook executes an immediate early-return before `ensureScript` is called.
   - *Conclusion*: The responsive guard is completely airtight — 0 scripts loaded, 0 canvas allocations, and 0 CPU consumption on mobile devices.

3. **SEO & Meta Consistency**:
   - The RSS feed (`/feed.xml`), Sitemap (`/sitemap.xml`), and Robots (`/robots.txt`) share canonical configuration from `lib/contact.ts` (`https://muryen-front.vercel.app`).
   - Content-Types, XML schemas, and URL lists match production specifications with 0 discrepancies.

4. **Edge Security & Lighthouse Deficiencies**:
   - While transport security (HSTS) is exemplary, `next.config.ts` omits a `Content-Security-Policy` header.
   - The desktop navigation component (`navigation.tsx`) contains two localized WCAG AA violations: an unlabelled collapse button and an invalid `aria-label` on an unroled `span`. When viewport narrows to mobile, the desktop sidebar is omitted, causing the mobile Accessibility score to jump to 100/100.
   - Mobile Best Practices score (73/100) is impacted by Naver Analytics' legacy third-party cookie handling and the ubiquitous NextAuth 500 error.

---

## 3. Caveats

1. **Third-Party Tokki Server Infrastructure**: The Tokki AI backend (`https://my-server-test.vercel.app`) is hosted as an independent microservice outside of this repository. Resolving the OpenAI 429 quota error requires adding billing credits to the OpenAI account backing `my-server-test.vercel.app`.
2. **Third-Party Analytics Tracking**: The third-party cookie warnings identified in mobile Lighthouse originate from Naver Analytics (`wcslog.js`). Unless Naver's tracking script is updated or migrated to first-party server-side collection, this warning is expected behavior on modern browsers.
3. **No Code Modifications Applied**: In accordance with the explorer role guidelines, all findings are observational and analytical. Local proposed fixes are provided below for implementation workers.

---

## 4. Conclusion & Actionable Recommendations

### 4.1 Summary of Production Health

| Area | Status | Criticality |
|---|---|---|
| **Core Web Vitals & Speed** | **GRADE A+** (LCP 182ms, CLS 0.00, TTFB 6.8ms) | Healthy |
| **3D Vanta Background** | **GRADE A+** (60 FPS desktop, 100% disabled on mobile) | Healthy |
| **Meta Endpoints (RSS/Sitemap/Robots)** | **GRADE A+** (Valid XML/RSS, 10 canonicals, clean robots) | Healthy |
| **Security Headers** | **GRADE B+** (HSTS/nosniff/SAMEORIGIN PASS; CSP MISSING) | Medium |
| **Lighthouse Desktop** | **A11y 91 / BP 96 / SEO 100** | Medium |
| **Lighthouse Mobile** | **A11y 100 / BP 73 / SEO 100** | Medium |
| **AI Chat External API** | **DEFECT** (OpenAI 429 Quota Exhausted on Tokki server) | High |

---

### 4.2 Remediation Proposals

#### Proposal 1: Fix Tokki AI Chat Error Display & Backend Quota
1. **Immediate Backend Fix**: Top up OpenAI billing balance on the organization backing `https://my-server-test.vercel.app`.
2. **Frontend Defense (`components/chat/chat-widget.tsx`)**:
   Detect raw backend error payloads (e.g. strings containing `[LLM error]` or `insufficient_quota`) and replace them with a user-friendly error message rather than displaying raw JSON stack traces to visitors:
   ```ts
   // In components/chat/chat-widget.tsx inside send():
   if (full.includes("[LLM error]") || full.includes("insufficient_quota")) {
     setError("AI 도우미가 현재 점검 중입니다. 잠시 후 다시 이용해 주세요.");
     return;
   }
   ```

#### Proposal 2: Add Content-Security-Policy to `next.config.ts`
Inject a robust CSP policy into `next.config.ts`:
```ts
{
  key: "Content-Security-Policy",
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://www.googletagmanager.com https://wcs.pstatic.net https://ssl.pstatic.net",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https:",
    "connect-src 'self' https://my-server-test.vercel.app https://www.google-analytics.com https://wcs.naver.com",
    "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
    "media-src 'self' blob:",
  ].join("; "),
}
```

#### Proposal 3: Fix Desktop Sidebar Accessibility Violations in `app/component/navigation.tsx`
1. **Line 139 (Toggle Button)**: Add `aria-label={isExpanded ? "사이드바 접기" : "사이드바 펼치기"}` to the collapse button.
2. **Line 223 (Instagram Placeholder)**: Add `role="img"` or change `<span aria-label="..." aria-disabled="true">` to a semantic `<span role="link" aria-disabled="true" aria-label="...">` or remove `aria-label` in favor of inner screen-reader text `<span className="sr-only">Instagram (준비 중)</span>`.

---

## 5. Verification Method

To independently reproduce and verify all findings:

1. **Verify Tokki Chat Widget & OpenAI 429 Response**:
   ```bash
   # Test widget view endpoint
   curl -s -X POST https://my-server-test.vercel.app/v2/widget/view \
     -H "Content-Type: application/json" \
     -d '{"widgetId":"muryen","threadId":""}' | jq .

   # Test widget ask SSE streaming endpoint (reproduces 429 insufficient quota)
   curl -N -s -X POST https://my-server-test.vercel.app/v2/ask \
     -H "Content-Type: application/json" \
     -d '{"widgetId":"muryen","threadId":"","message":"무련 소개"}'
   ```

2. **Verify Meta Endpoints**:
   ```bash
   # Verify RSS feed
   curl -sI https://muryen-front.vercel.app/feed.xml | grep -i "content-type"
   curl -s https://muryen-front.vercel.app/feed.xml | head -n 25

   # Verify Sitemap canonical count
   curl -s https://muryen-front.vercel.app/sitemap.xml | grep -c "<loc>"

   # Verify Robots.txt rules
   curl -s https://muryen-front.vercel.app/robots.txt
   ```

3. **Verify Security Headers on Edge Node**:
   ```bash
   curl -sI https://muryen-front.vercel.app/ | grep -E -i "(strict-transport|x-content-type|x-frame|referrer-policy|permissions-policy|content-security)"
   ```

4. **Verify 3D Vanta Mobile Disabling**:
   In Chrome DevTools, toggle Device Toolbar to iPhone 14 (390x844), reload `https://muryen-front.vercel.app/`, and inspect:
   `document.querySelector('#vanta-bg canvas') === null` and `document.querySelectorAll('script[src*="vanta"]').length === 0`.
