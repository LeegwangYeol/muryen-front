# Analysis Report: Bottom-Left UI Error & Architecture Audit

**Target Project**: `muryen-front` (Next.js 15.5.15 App Router, React 18.2.0, TypeScript 5, Tailwind CSS 3.4.1)  
**Agent**: Explorer Survey 1  
**Timestamp**: 2026-09-01T09:12:30+09:00  

---

## 1. Executive Summary

A comprehensive forensic investigation was conducted to determine the root cause of the error message displaying in the bottom-left corner of the UI upon application load, and to audit the repository for any related or systemic failures across layout components, root providers, error boundaries, and external scripts.

### Core Findings:
1. **Primary Cause of Bottom-Corner Error: External LLAMI Chat Widget Script Injection (`app/layout.tsx:358-382`)**:
   - `app/layout.tsx` unconditionally injects third-party CSS (`https://static.llami.net/widget-v1.css`) and loads an external module script (`https://static.llami.net/widget-v1.js`) executing `run("9afddf76-2d21-422c-a4fc-a369fcf21d09")` on every page load.
   - LLAMI is a floating chatbot widget designed to mount in the viewport bottom corner. Because the remote backend / widget ID is unavailable, unauthenticated, or blocked by network/CORS policies, the widget runtime throws network exceptions and renders an error state / alert bubble in the bottom corner of the viewport on application mount.
   - An orphaned component `app/component/llami-chat-widget.tsx` also exists in the codebase attempting the same failed script injection.
2. **Bottom-Left Viewport Element: Desktop Sidebar Navigation (`app/component/navigation.tsx:210-265`)**:
   - The desktop navigation sidebar is `fixed top-0 left-0 h-screen`.
   - At line 210, `navigation.tsx` defines `<div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">` which sits precisely in the bottom-left corner.
   - Inside this container, an orphaned `<VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} videoId="" />` is dynamically imported and mounted with an empty string `videoId=""` and dead `isVideoModalOpen` state.
3. **Root Provider & NextAuth Session Fragility (`app/providers.tsx` & `app/api/auth/[...nextauth]/route.ts`)**:
   - `app/providers.tsx` wraps the whole application in `SessionProvider`.
   - `app/api/auth/[...nextauth]/route.ts` registers `GoogleProvider` with non-null assertion operators (`process.env.GOOGLE_CLIENT_ID!` and `process.env.GOOGLE_CLIENT_SECRET!`), while `.env.local` only provides `NEXTAUTH_URL` and `NEXTAUTH_SECRET`. Unconfigured OAuth providers can trigger session check errors on application load.
4. **Current Repository Health**:
   - `npm test`: **17/17 test suites passing, 97/97 tests passed**.
   - `npm run lint`: **0 ESLint errors, 0 warnings**.
   - `npm run build`: **24/24 static & dynamic pages successfully generated**.

---

## 2. Forensic Evidence & Root Cause Analysis

### 2.1 Failure Mechanism: LLAMI Chat Widget Injection in `app/layout.tsx`
- **Location**: `app/layout.tsx` (Lines 358–362 and 377–382)
- **Observed Code**:
  ```tsx
  <link
    rel="stylesheet"
    type="text/css"
    href="https://static.llami.net/widget-v1.css"
  />
  ...
  <Script type="module" id="llami-chat-widget" strategy="lazyOnload">
    {`
      import { initialize, run } from "https://static.llami.net/widget-v1.js";
      run("9afddf76-2d21-422c-a4fc-a369fcf21d09");
    `}
  </Script>
  ```
- **Mechanism of Failure**:
  - `Script strategy="lazyOnload"` executes immediately after page hydration.
  - The script attempts to import `initialize, run` from `https://static.llami.net/widget-v1.js` and connect to the bot ID `9afddf76-2d21-422c-a4fc-a369fcf21d09`.
  - When the service host `static.llami.net` is unreachable, returns 404/500, or the bot configuration is invalid/expired, the script either:
    1. Injects a floating widget DOM element with an error banner/toast indicating connection or bot load failure at the bottom corner of the viewport.
    2. Causes an unhandled rejection in the browser console that can trigger error overlays in development environments.
  - Furthermore, `app/component/llami-chat-widget.tsx` is an orphaned component duplicating this logic that is not imported anywhere in active routes.

### 2.2 Bottom-Left Viewport Structure: `app/component/navigation.tsx`
- **Location**: `app/component/navigation.tsx` (Lines 135–141, 210–265)
- **Observed Code**:
  ```tsx
  <nav
    className={`${isExpanded ? "w-64" : "w-24"} ... fixed top-0 left-0 z-50 ...`}
  >
    ...
    <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <a href={CONTACT.youtube} ...> <Youtube size={18} /> </a>
        {CONTACT.instagram ? ( ... ) : (
          <span
            aria-label="Instagram (준비 중)"
            aria-disabled="true"
            title="Instagram 계정 준비 중"
            className="flex items-center justify-center w-10 h-10 rounded-full opacity-40 cursor-not-allowed ..."
          >
            <Instagram size={18} />
          </span>
        )}
      </div>
      {isLoggedIn && (
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white ...">
          <LogOut size={18} /> 로그아웃
        </button>
      )}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoId=""
      />
    </div>
  </nav>
  ```
- **Observations**:
  - The desktop navigation sidebar is `fixed top-0 left-0`, so its bottom container is anchored to the bottom-left corner of the browser window.
  - `VideoModal` is dynamically loaded (`const VideoModal = dynamic(() => import("./VideoModal"), { ssr: false });`) and rendered with `videoId=""`.
  - `isVideoModalOpen` is initialized to `false` and is never toggled anywhere in `Navigation`.
  - If `VideoModal` were triggered, `ReactPlayer` would attempt to load `https://www.youtube.com/watch?v=`, causing a player error.

### 2.3 NextAuth SessionProvider OAuth Configuration
- **Location**: `app/providers.tsx:5-7` & `app/api/auth/[...nextauth]/route.ts:5-19`
- **Observed Code**:
  ```tsx
  // app/providers.tsx
  export function Providers({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  // app/api/auth/[...nextauth]/route.ts
  const handler = NextAuth({
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        ...
      }),
    ],
    ...
  });
  ```
- **Observation**:
  - `.env.local` contains `NEXTAUTH_URL` and `NEXTAUTH_SECRET`, but lacks `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
  - While NextAuth handles missing credentials during static build without breaking compilation, client-side session polling by `SessionProvider` on `/api/auth/session` can log runtime warnings or errors if Google OAuth provider initialization fails.

### 2.4 External CDN Script Dependencies in `app/layout.tsx`
- **Observed CDN Scripts**:
  - `https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/ort.js`
  - `https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.19/dist/bundle.min.js`
  - `https://static.llami.net/widget-v1.js`
- **Assessment**:
  - Loading third-party scripts via global CDN tags in `layout.tsx` rather than bundling them or loading them strictly on the pages that use them (e.g. `/test` or `components/ai/vad-analyzer.tsx`) exposes every page in the application to third-party network failures, slow TTFB, or unhandled rejection errors.

---

## 3. Project-wide Error & Systemic Audit Table

| Area / Component | File Location | Observed State | Risk Assessment | Recommended Action |
|---|---|---|---|---|
| **Chatbot Widget** | `app/layout.tsx:358-382` | Injects `static.llami.net` CSS & JS widget globally | 🔴 **High** (Causes bottom-corner network/UI errors) | Remove `llami.net` CSS link and script tag from `app/layout.tsx` |
| **Orphaned Widget Component** | `app/component/llami-chat-widget.tsx` | Unused component importing `llami.net` | 🟡 **Medium** (Dead code, potential runtime confusion) | Delete or clean orphaned file |
| **Navigation Bottom-Left** | `app/component/navigation.tsx:260-264` | Dead `<VideoModal isOpen={false} videoId="" />` mounted in bottom-left | 🟡 **Medium** (Dead component instance, invalid video URL) | Remove `VideoModal` and `isVideoModalOpen` state from `Navigation` |
| **Auth Provider** | `app/api/auth/[...nextauth]/route.ts:5-19` | `GoogleProvider` with non-null assertion on unset env vars | 🟡 **Medium** (Session errors if OAuth unconfigured) | Conditionally register `GoogleProvider` only when `GOOGLE_CLIENT_ID` is present |
| **Global CDN Scripts** | `app/layout.tsx:370-376` | `ort.js` and `vad-web` loaded on all pages via `lazyOnload` | 🟢 **Low** (Harmless if CDN up, but unnecessary payload on non-VAD pages) | Move VAD scripts to dynamic imports or route-specific loaders |
| **Dark Mode & Theming** | `app/context/theme-context.tsx` | Synchronizes `.dark` and `theme-*` classes on `document.documentElement` | 🟢 **Passed** (No errors) | Verified clean |
| **Hydration / Commit Graph** | `app/component/record-graph.tsx` | Deterministic anchor date `2024-12-31` with arithmetic PRNG | 🟢 **Passed** (No errors) | Verified clean |
| **Build & Test Gates** | Project-wide | 17 Jest suites passed (97 tests), 0 lint errors, 24/24 static pages built | 🟢 **Passed** (No errors) | Verified clean |

---

## 4. Concrete Fix Strategy

### Step 1: Clean Global Chatbot Widget from Root Layout (`app/layout.tsx`)
Remove lines 358–362 and 377–382:
```tsx
// REMOVE from app/layout.tsx <head>:
<link
  rel="stylesheet"
  type="text/css"
  href="https://static.llami.net/widget-v1.css"
/>
...
<Script type="module" id="llami-chat-widget" strategy="lazyOnload">
  {`
    import { initialize, run } from "https://static.llami.net/widget-v1.js";
    run("9afddf76-2d21-422c-a4fc-a369fcf21d09");
  `}
</Script>
```
And remove or deprecate `app/component/llami-chat-widget.tsx`.

### Step 2: Remove Dead VideoModal from Bottom-Left Navigation (`app/component/navigation.tsx`)
In `app/component/navigation.tsx`:
1. Remove `const VideoModal = dynamic(() => import("./VideoModal"), { ssr: false });`
2. Remove `const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);`
3. Remove `<VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} videoId="" />` from the bottom-left container.

### Step 3: Guard NextAuth Google Provider Configuration (`app/api/auth/[...nextauth]/route.ts`)
Guard the `GoogleProvider` registration so that if `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET` are undefined, it does not attempt to instantiate the OAuth client with `undefined` credentials:
```tsx
const providers = [];
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/youtube.force-ssl",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    })
  );
}
```

### Step 4: Verification
1. Run `npm test` to verify all 17 test suites pass.
2. Run `npm run lint` to verify zero ESLint errors or warnings.
3. Run `npm run build` to verify all 24 routes compile cleanly.
