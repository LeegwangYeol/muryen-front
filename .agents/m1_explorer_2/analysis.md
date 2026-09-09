# Milestone 1 Part B — Comprehensive Technical Analysis & Implementation Plan

**Author**: M1 Explorer 2 (`teamwork_preview_explorer`)  
**Date**: 2026-08-28  
**Scope**: Milestone 1 Part B (Asset integrity, image filenames, layout margin synchronization, animation/audio resource cleanup, secure auth cookies)

---

## Executive Summary

This report establishes the precise, line-by-line implementation blueprint for the 5 key deliverables of **Milestone 1 Part B**:
1. **Asset Integrity in `equipment.tsx`**: Eliminating runtime 404 image errors on the `/equipment` page by explicitly mapping each equipment item to existing assets in `public/images/`.
2. **Double Extension Fix in `public/images/foot/`**: Renaming `muye24ki_core_18_woldo.gif.gif` to `muye24ki_core_18_woldo.gif` and updating referencing code in `app/component/intro-basic.tsx`.
3. **Layout & Margin Alignment**: Synchronizing sidebar width in `app/component/navigation.tsx` (`w-44` → `w-64`) with `<main>` left margin in `components/layout/app-shell.tsx` (`md:ml-64`), eliminating an 80px desktop rendering gap.
4. **Resource & Stream Memory Leak Elimination**:
   - `app/component/video-circle.tsx`: Registering `cancelAnimationFrame` cleanup on unmount and correcting the progress calculation denominator from `fastRotationDuration` (1000ms) to `expansionDuration` (500ms).
   - `components/ai/vad-analyzer.tsx`: Ensuring comprehensive teardown of `MicVAD`, MediaStream tracks, and `AudioContext` when pausing or unmounting.
5. **Secure Authentication Cookies**: Enforcing `httpOnly: true`, `secure: process.env.NODE_ENV === "production"`, `sameSite: "lax"`, and introducing a client-safe `isLoggedIn` cookie to preserve UI authentication state in `Navigation` and `MobileNav`.

---

## 1. Fix 404 Broken Image Paths in `app/component/equipment.tsx`

### 1.1 Root Cause Analysis
In `app/component/equipment.tsx` (lines 87–89), image URLs are dynamically generated using Korean titles:
```tsx
src={`/images/${item.title.toLowerCase().replace(" ", "-")}.jpg`}
```
This produces the following URLs:
- `/images/전통-갑옷.jpg`
- `/images/전투용-투구.jpg`
- `/images/장창.jpg`

None of these filenames exist in the `public/images/` directory, causing 404 HTTP errors for every card on `/equipment` and broken image placeholders in the browser.

### 1.2 Asset Inventory Mapping
The `public/images/` directory contains appropriate, high-resolution assets for each item:
- **전통 갑옷 (Traditional Armour)**: `/images/armour.png`
- **전투용 투구 (Battle Helmet)**: `/images/sparring.png`
- **장창 (Long Spear)**: `/images/foot/muye24ki_core_01_jangchang.gif`

### 1.3 Implementation Specification

**Target File**: `/Users/a7890/src/muryen-front/app/component/equipment.tsx`

#### Step 1: Update `Equipment` Interface & `equipmentData`
Add `image: string` property to the `Equipment` interface (lines 17–24) and assign valid image paths in `equipmentData` (lines 26–55):

```tsx
interface Equipment {
  title: string;
  description: string;
  details: string;
  materials: string;
  purchase: string;
  makingMethod: string;
  image: string;
}

const equipmentData: Equipment[] = [
  {
    title: "전통 갑옷",
    description: "조선시대 전통 갑옷 복원품",
    details:
      "조선시대 전통 갑옷을 현대적으로 복원한 제품입니다. 고품질 가죽과 철판을 사용하여 제작되었으며, 실제 착용 가능합니다.",
    materials: "가죽, 철판, 끈",
    purchase: "https://example.com/traditional-armor",
    makingMethod: "1. 가죽 재단\n2. 철판 가공\n3. 가죽에 철판 부착\n4. 끈 연결",
    image: "/images/armour.png",
  },
  {
    title: "전투용 투구",
    description: "고려시대 스타일의 전투용 투구",
    details:
      "고려시대 전투용 투구를 현대적 기술로 재현한 제품입니다. 강철로 제작되어 높은 방어력을 자랑합니다.",
    materials: "강철, 가죽",
    purchase: "https://example.com/battle-helmet",
    makingMethod: "1. 강철 성형\n2. 내부 가죽 부착\n3. 도장 및 마감",
    image: "/images/sparring.png",
  },
  {
    title: "장창",
    description: "전통 장병기의 대표, 장창",
    details:
      "전통 무예에서 사용되는 장창입니다. 단단한 나무로 제작되어 내구성이 뛰어납니다.",
    materials: "참나무, 철",
    purchase: "https://example.com/long-spear",
    makingMethod:
      "1. 나무 선별 및 가공\n2. 창날 제작\n3. 창날 부착\n4. 도장 및 마감",
    image: "/images/foot/muye24ki_core_01_jangchang.gif",
  },
];
```

#### Step 2: Update Image Element Rendering
In `CardContent` (lines 85–95), use `src={item.image}`:

```tsx
              <CardContent>
                <div className="relative w-full h-[200px] mb-4 overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </CardContent>
```

#### Step 3: Remove Unused Icon Imports
On line 5:
- `import { ShoppingBasket, Shield, Sword, X } from "lucide-react";` → `import { ShoppingBasket, X } from "lucide-react";`

---

## 2. Fix Double-Extension Filename in `public/images/foot/`

### 2.1 Root Cause Analysis
The file `/Users/a7890/src/muryen-front/public/images/foot/muye24ki_core_18_woldo.gif.gif` was saved with an accidental duplicate `.gif.gif` extension.
In `app/component/intro-basic.tsx` (line 225), the asset was referenced with the duplicate extension:
```tsx
image: "/images/foot/muye24ki_core_18_woldo.gif.gif",
```

### 2.2 Implementation Specification

#### Step 1: Rename the Disk File
Run Git move:
```bash
git mv public/images/foot/muye24ki_core_18_woldo.gif.gif public/images/foot/muye24ki_core_18_woldo.gif
```

#### Step 2: Update `app/component/intro-basic.tsx` (Line 225)
**Target File**: `/Users/a7890/src/muryen-front/app/component/intro-basic.tsx`

```tsx
// Before:
        image: "/images/foot/muye24ki_core_18_woldo.gif.gif",

// After:
        image: "/images/foot/muye24ki_core_18_woldo.gif",
```

---

## 3. Fix Layout Margin Alignment (`navigation.tsx` vs `app-shell.tsx`)

### 3.1 Root Cause Analysis
In `components/layout/app-shell.tsx` (line 37):
```tsx
className={`flex-1 transition-all duration-300 md:!pt-0 ${
  isNavExpanded ? "md:ml-64" : "md:ml-24"
}`}
```
- `md:ml-64` translates to `margin-left: 16rem` (256px).
- `md:ml-24` translates to `margin-left: 6rem` (96px).

However, in `app/component/navigation.tsx` (line 135):
```tsx
className={`${isExpanded ? "w-44" : "w-24"} ...`}
```
- `w-44` translates to `width: 11rem` (176px).
- When expanded, navigation occupies 176px while the main content is pushed by 256px, leaving an **80px blank gap** between the sidebar and the main content on desktop displays.
- When collapsed, `w-24` (96px) matches `md:ml-24` (96px) correctly.

### 3.2 Interface Contract Verification
According to `PROJECT.md` (Lines 47–49):
> Layout Width Contract: Sidebar expanded width `w-64` matches main content offset `md:ml-64`; collapsed width `w-24` matches main content offset `md:ml-24`.

### 3.3 Implementation Specification

**Target File**: `/Users/a7890/src/muryen-front/app/component/navigation.tsx`

Update line 135:
```tsx
// Before:
      <nav
        className={`${isExpanded ? "w-44" : "w-24"} ${
          theme === "dark"
            ? "bg-[#280505] border-r border-white/10 text-white"
            : "bg-[#f5efef] border-r border-gray-300 text-gray-900"
        } h-screen p-4 fixed top-0 left-0 z-50 transition-all duration-300 rounded-r-lg shadow-lg`}
      >

// After:
      <nav
        className={`${isExpanded ? "w-64" : "w-24"} ${
          theme === "dark"
            ? "bg-[#280505] border-r border-white/10 text-white"
            : "bg-[#f5efef] border-r border-gray-300 text-gray-900"
        } h-screen p-4 fixed top-0 left-0 z-50 transition-all duration-300 rounded-r-lg shadow-lg`}
      >
```

---

## 4. Fix Animation Frame & Audio Stream Memory Leaks

### 4.1 `app/component/video-circle.tsx`

#### Root Cause Analysis
1. **Missing `cancelAnimationFrame` Cleanup**:
   In `useEffect` (lines 32–66), `requestAnimationFrame(animateInitial)` is called repeatedly when `initialAnimation` is true. The cleanup function only returns `clearInterval` for the `false` branch. If the component unmounts before 1500ms, the rAF loop continues to trigger state updates (`setRotation`, `setCurrentRadius`, `setInitialAnimation`) on an unmounted component.
2. **Incorrect Progress Calculation in Phase 2**:
   In lines 46–51:
   ```tsx
   const duration = 1500;
   const fastRotationDuration = 1000;
   ...
   const progress = (elapsed - fastRotationDuration) / fastRotationDuration;
   setCurrentRadius(radius * progress);
   ```
   Phase 2 runs from 1000ms to 1500ms (duration = 500ms). Dividing `(elapsed - 1000)` by 1000 means `progress` only reaches `500 / 1000 = 0.5`. When `elapsed >= 1500`, `setCurrentRadius(radius)` causes the circle to abruptly jump from 50% radius to 100% radius.

#### Implementation Specification
**Target File**: `/Users/a7890/src/muryen-front/app/component/video-circle.tsx`

Update `useEffect` (lines 32–66):
```tsx
  useEffect(() => {
    let animationFrameId: number;

    if (initialAnimation) {
      const startTime = Date.now();
      const duration = 1500;
      const fastRotationDuration = 1000;
      const expansionDuration = duration - fastRotationDuration; // 500ms

      const animateInitial = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;

        if (elapsed < fastRotationDuration) {
          setRotation((prev) => (prev + 5) % 360);
          setCurrentRadius(radius * (1 - elapsed / fastRotationDuration));
          animationFrameId = requestAnimationFrame(animateInitial);
        } else if (elapsed < duration) {
          const progress = Math.min((elapsed - fastRotationDuration) / expansionDuration, 1);
          setCurrentRadius(radius * progress);
          setRotation((prev) => (prev + 5 * (1 - progress)) % 360);
          animationFrameId = requestAnimationFrame(animateInitial);
        } else {
          setInitialAnimation(false);
          setCurrentRadius(radius);
        }
      };

      animationFrameId = requestAnimationFrame(animateInitial);
      return () => cancelAnimationFrame(animationFrameId);
    } else {
      const interval = setInterval(() => {
        setRotation((prev) => (prev + 0.2) % 360);
      }, 50);

      return () => clearInterval(interval);
    }
  }, [initialAnimation, radius]);
```

---

### 4.2 `components/ai/vad-analyzer.tsx`

#### Root Cause Analysis
In `components/ai/vad-analyzer.tsx` (lines 22–28 and 31–37):
```tsx
  useEffect(() => {
    return () => {
      if (myVad) {
        myVad.pause();
      }
    };
  }, [myVad]);
```
`MicVAD` acquires the user's microphone via `navigator.mediaDevices.getUserMedia()`. Calling `pause()` only suspends voice classification events; it does **not** stop the active `MediaStreamTrack`s or close the underlying `AudioContext`. Consequently, the browser's microphone indicator remains on indefinitely after the user navigates away.

#### Implementation Specification
**Target File**: `/Users/a7890/src/muryen-front/components/ai/vad-analyzer.tsx`

Add a comprehensive teardown helper and use it in both `useEffect` cleanup and `toggleListening`:

```tsx
  // Helper for complete AudioContext and MediaStream teardown
  const teardownVad = (vadInstance: any) => {
    if (!vadInstance) return;
    try {
      if (typeof vadInstance.destroy === "function") {
        vadInstance.destroy();
      } else if (typeof vadInstance.pause === "function") {
        vadInstance.pause();
      }
      if (vadInstance.stream) {
        vadInstance.stream.getTracks?.().forEach((track: MediaStreamTrack) => {
          track.stop();
        });
      }
      if (vadInstance.audioContext && vadInstance.audioContext.state !== "closed") {
        vadInstance.audioContext.close?.();
      }
    } catch (err) {
      console.error("VAD teardown error:", err);
    }
  };

  useEffect(() => {
    return () => {
      teardownVad(myVad);
    };
  }, [myVad]);

  const toggleListening = async () => {
    if (isListening) {
      teardownVad(myVad);
      setMyVad(null);
      setIsListening(false);
      setFeedback(null);
      setIntensity(0);
      return;
    }
    // ... rest of init logic
```

---

## 5. Secure Auth Cookies in `app/api/auth/login/route.ts`

### 5.1 Root Cause Analysis
In `app/api/auth/login/route.ts` (lines 21–27):
```ts
    // Set the access token cookie
    (await cookies()).set("accessToken", authResponse.accessToken, {
      // httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
    });
```
`httpOnly` was commented out so that client components (`Navigation`, `MobileNav`) could determine login state using `document.cookie.includes("accessToken")`. This security anti-pattern allows any client-side JavaScript (or XSS vulnerability) to access the sensitive JWT token.

### 5.2 Secure Architecture Design
1. **Token Protection**: Enable `httpOnly: true` on `accessToken` so the actual JWT is never readable by client scripts.
2. **Client State Synchronization**: Set a lightweight, non-sensitive indicator cookie `isLoggedIn=true` (`httpOnly: false`, `sameSite: "lax"`, `secure: process.env.NODE_ENV === "production"`).
3. **Logout & Invalidation**: Clear both `accessToken` and `isLoggedIn` cookies upon logout and token invalidation.
4. **Client Component Update**: Update `Navigation` and `MobileNav` to check `document.cookie.includes("isLoggedIn=true")`.

### 5.3 Implementation Specification

#### Step 1: Update `app/api/auth/login/route.ts`
**Target File**: `/Users/a7890/src/muryen-front/app/api/auth/login/route.ts`

```ts
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    // 1. Secure HTTP-only access token (protected against XSS)
    cookieStore.set("accessToken", authResponse.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    // 2. Non-sensitive client indicator cookie for UI state
    cookieStore.set("isLoggedIn", "true", {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });
```

#### Step 2: Update `app/api/auth/logout/route.ts`
**Target File**: `/Users/a7890/src/muryen-front/app/api/auth/logout/route.ts`

```ts
export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("isLoggedIn");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "로그아웃 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
```

#### Step 3: Update `middleware.ts`
**Target File**: `/Users/a7890/src/muryen-front/middleware.ts` (lines 22–26)

```ts
  if (!user) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("isLoggedIn");
    return response;
  }
```

#### Step 4: Update Client Navigation Components
In `app/component/navigation.tsx` (line 98) and `components/layout/mobile-nav.tsx` (line 47):

```tsx
  useEffect(() => {
    setIsLoggedIn(document.cookie.includes("isLoggedIn=true") || document.cookie.includes("accessToken"));
  }, []);
```

---

## 6. Dependency & Coordination Matrix

| Item | Files Modified | Primary Owner | Peer Coordination |
|------|----------------|---------------|-------------------|
| 1. Equipment Images | `app/component/equipment.tsx` | M1 Explorer 2 | Coordinate unused import cleanup with M1 Explorer 3 |
| 2. Woldo Double Extension | `public/images/foot/muye24ki_core_18_woldo.gif`, `app/component/intro-basic.tsx` | M1 Explorer 2 | Check for any other references in mock data |
| 3. Layout Alignment | `app/component/navigation.tsx` | M1 Explorer 2 | Verified against `app-shell.tsx` `md:ml-64` contract |
| 4. Memory Leaks | `app/component/video-circle.tsx`, `components/ai/vad-analyzer.tsx` | M1 Explorer 2 | Aligns with M2 performance optimization goals |
| 5. Secure Auth Cookies | `app/api/auth/login/route.ts`, `app/api/auth/logout/route.ts`, `middleware.ts`, `navigation.tsx`, `mobile-nav.tsx` | M1 Explorer 2 | Ensures seamless login/logout UX without security leaks |
