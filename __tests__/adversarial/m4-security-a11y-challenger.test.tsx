import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import nextConfig from "@/next.config";
import LoginPage, { sanitizeRedirectUrl } from "@/app/component/login-page";
import Navigation from "@/app/component/navigation";
import VideoCircle from "@/app/component/video-circle";
import { ThemeProvider } from "@/app/context/theme-context";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/"),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

describe("Empirical Challenge Suite: Security Boundaries & Accessibility Behaviors", () => {
  /* =========================================================================
   * Challenge 1: HTTP Security Headers in next.config.ts
   * ========================================================================= */
  describe("Challenge 1: HTTP Security Headers (next.config.ts)", () => {
    let headerMap: Map<string, string>;

    beforeAll(async () => {
      expect(nextConfig.headers).toBeDefined();
      const headersConfig = await nextConfig.headers!();
      expect(headersConfig).toBeDefined();
      expect(headersConfig.length).toBeGreaterThan(0);

      const rootRoute = headersConfig.find((entry: { source: string }) => entry.source === "/:path*");
      expect(rootRoute).toBeDefined();

      headerMap = new Map(
        rootRoute!.headers.map((h: { key: string; value: string }) => [h.key, h.value])
      );
    });

    it("verifies poweredByHeader is explicitly disabled", () => {
      expect(nextConfig.poweredByHeader).toBe(false);
    });

    it("verifies Strict-Transport-Security (HSTS) format and parameters", () => {
      const hsts = headerMap.get("Strict-Transport-Security");
      expect(hsts).toBeDefined();

      // RFC 6797 compliance: max-age=<seconds>; includeSubDomains; preload
      expect(hsts).toMatch(/^max-age=\d+(;\s*includeSubDomains)?(;\s*preload)?$/);

      const maxAgeMatch = hsts!.match(/max-age=(\d+)/);
      expect(maxAgeMatch).not.toBeNull();
      const maxAgeSeconds = parseInt(maxAgeMatch![1], 10);

      // Preload requires at least 31536000 seconds (1 year). 63072000 is 2 years.
      expect(maxAgeSeconds).toBeGreaterThanOrEqual(31536000);
      expect(hsts).toContain("includeSubDomains");
      expect(hsts).toContain("preload");
    });

    it("verifies X-Content-Type-Options is exactly nosniff", () => {
      const xcto = headerMap.get("X-Content-Type-Options");
      expect(xcto).toBe("nosniff");
    });

    it("verifies X-Frame-Options is SAMEORIGIN or DENY for clickjacking defense", () => {
      const xfo = headerMap.get("X-Frame-Options");
      expect(xfo).toBeDefined();
      expect(["SAMEORIGIN", "DENY"]).toContain(xfo);
    });

    it("verifies Referrer-Policy enforces strict origin on cross-origin requests", () => {
      const rp = headerMap.get("Referrer-Policy");
      expect(rp).toBe("strict-origin-when-cross-origin");
    });

    it("verifies Permissions-Policy restricts sensitive hardware APIs", () => {
      const pp = headerMap.get("Permissions-Policy");
      expect(pp).toBeDefined();
      expect(pp).toContain("camera=()");
      expect(pp).toContain("geolocation=()");
      expect(pp).toContain("microphone=");
    });

    it("verifies Content-Security-Policy (CSP) syntax, directives, and restrictions", () => {
      const csp = headerMap.get("Content-Security-Policy");
      expect(csp).toBeDefined();

      // Directives must be semicolon-separated
      const directives = csp!.split(";").map((d) => d.trim()).filter(Boolean);
      const directiveMap = new Map<string, string[]>();

      directives.forEach((d) => {
        const parts = d.split(/\s+/);
        const name = parts[0];
        const values = parts.slice(1);
        directiveMap.set(name, values);
      });

      // default-src must be 'self'
      expect(directiveMap.has("default-src")).toBe(true);
      expect(directiveMap.get("default-src")).toContain("'self'");

      // script-src must contain 'self' and whitelisted hosts
      expect(directiveMap.has("script-src")).toBe(true);
      const scriptSrc = directiveMap.get("script-src")!;
      expect(scriptSrc).toContain("'self'");
      // Must not contain wildcards like '*'
      expect(scriptSrc).not.toContain("*");

      // frame-src must allow youtube embeds securely
      expect(directiveMap.has("frame-src")).toBe(true);
      const frameSrc = directiveMap.get("frame-src")!;
      expect(frameSrc).toContain("'self'");
      expect(frameSrc).toContain("https://www.youtube.com");
      expect(frameSrc).toContain("https://www.youtube-nocookie.com");

      // connect-src must allow api backend
      expect(directiveMap.has("connect-src")).toBe(true);
      const connectSrc = directiveMap.get("connect-src")!;
      expect(connectSrc).toContain("'self'");
      expect(connectSrc).toContain("https://my-server-test.vercel.app");

      // media-src must allow audio/video playback
      expect(directiveMap.has("media-src")).toBe(true);
      const mediaSrc = directiveMap.get("media-src")!;
      expect(mediaSrc).toContain("'self'");
      expect(mediaSrc).toContain("blob:");
    });
  });

  /* =========================================================================
   * Challenge 2: Open Redirect Boundary Testing in LoginPage
   * ========================================================================= */
  describe("Challenge 2: Open Redirect Boundary Attacks (app/component/login-page.tsx)", () => {
    it("neutralizes standard adversarial inputs required by challenge specification", () => {
      // 1. Protocol-relative URL
      expect(sanitizeRedirectUrl("//evil.com")).toBe("/");

      // 2. Backslash evasion
      expect(sanitizeRedirectUrl("/\\evil.com")).toBe("/");

      // 3. Script scheme execution
      expect(sanitizeRedirectUrl("javascript:alert(1)")).toBe("/");

      // 4. Absolute external HTTPS URL
      expect(sanitizeRedirectUrl("https://attacker.com")).toBe("/");

      // 5. Empty string
      expect(sanitizeRedirectUrl("")).toBe("/");

      // 6. Valid internal relative path
      expect(sanitizeRedirectUrl("/daily")).toBe("/daily");
    });

    it("neutralizes null, undefined, whitespace-only, and blank inputs", () => {
      expect(sanitizeRedirectUrl(null)).toBe("/");
      expect(sanitizeRedirectUrl(undefined as any)).toBe("/");
      expect(sanitizeRedirectUrl("   ")).toBe("/");
      expect(sanitizeRedirectUrl("\t\n\r")).toBe("/");
    });

    it("neutralizes scheme variations and dangerous protocols", () => {
      expect(sanitizeRedirectUrl("http://attacker.com")).toBe("/");
      expect(sanitizeRedirectUrl("ftp://attacker.com")).toBe("/");
      expect(sanitizeRedirectUrl("data:text/html,<script>alert(1)</script>")).toBe("/");
      expect(sanitizeRedirectUrl("vbscript:msgbox(1)")).toBe("/");
      expect(sanitizeRedirectUrl("blob:https://evil.com/uuid")).toBe("/");
      expect(sanitizeRedirectUrl("file:///etc/passwd")).toBe("/");
    });

    it("neutralizes multi-slash, backslash-slash, and CRLF / null-byte bypasses", () => {
      expect(sanitizeRedirectUrl("///attacker.com")).toBe("/");
      expect(sanitizeRedirectUrl("////attacker.com")).toBe("/");
      expect(sanitizeRedirectUrl("/\\/attacker.com")).toBe("/");
      expect(sanitizeRedirectUrl("/\\//attacker.com")).toBe("/");
      expect(sanitizeRedirectUrl("/ /attacker.com")).toBe("/");
      expect(sanitizeRedirectUrl("/\t/attacker.com")).toBe("/");
      expect(sanitizeRedirectUrl("/\r\n/attacker.com")).toBe("/");
      expect(sanitizeRedirectUrl("/\0/attacker.com")).toBe("/");
    });

    it("neutralizes Windows UNC and network share evasion patterns", () => {
      expect(sanitizeRedirectUrl("\\\\attacker.com\\share")).toBe("/");
      expect(sanitizeRedirectUrl("\\attacker.com")).toBe("/");
      expect(sanitizeRedirectUrl("c:\\windows\\system32")).toBe("/");
    });

    it("allows complex valid internal application routes and query strings", () => {
      expect(sanitizeRedirectUrl("/")).toBe("/");
      expect(sanitizeRedirectUrl("/about")).toBe("/about");
      expect(sanitizeRedirectUrl("/mypage?tab=records&sort=desc")).toBe("/mypage?tab=records&sort=desc");
      expect(sanitizeRedirectUrl("/daily#section-2")).toBe("/daily#section-2");
      expect(sanitizeRedirectUrl("/basic-sense/detail/123")).toBe("/basic-sense/detail/123");
      expect(sanitizeRedirectUrl("  /cutting/pattern  ")).toBe("/cutting/pattern");
    });
  });

  /* =========================================================================
   * Challenge 3: Navigation Component Escape Key Event Listener
   * ========================================================================= */
  describe("Challenge 3: Mobile & Desktop Navigation Escape Key Listener (app/component/navigation.tsx)", () => {
    beforeEach(() => {
      localStorage.clear();
      document.cookie = "";
      jest.clearAllMocks();
    });

    it("collapses expanded sidebar when Escape key is pressed", () => {
      const handleExpand = jest.fn();
      const { container } = render(
        <ThemeProvider>
          <Navigation onExpand={handleExpand} />
        </ThemeProvider>
      );

      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("w-64"); // initially expanded

      // Fire Escape keydown on window
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      });

      expect(handleExpand).toHaveBeenCalledWith(false);
      expect(nav).toHaveClass("w-24");
    });

    it("does not trigger extra onExpand calls when Escape is pressed while already collapsed", () => {
      const handleExpand = jest.fn();
      const { container } = render(
        <ThemeProvider>
          <Navigation onExpand={handleExpand} />
        </ThemeProvider>
      );

      const nav = container.querySelector("nav");
      // Collapse first via Escape
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      });
      expect(handleExpand).toHaveBeenCalledTimes(1);
      expect(handleExpand).toHaveBeenCalledWith(false);
      expect(nav).toHaveClass("w-24");

      // Press Escape again while already collapsed
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      });
      // Should not call handleExpand again since isExpanded is false
      expect(handleExpand).toHaveBeenCalledTimes(1);
      expect(nav).toHaveClass("w-24");
    });

    it("ignores non-Escape keys (Enter, Space, Tab, ArrowDown)", () => {
      const handleExpand = jest.fn();
      const { container } = render(
        <ThemeProvider>
          <Navigation onExpand={handleExpand} />
        </ThemeProvider>
      );

      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("w-64");

      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Space" }));
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      });

      expect(handleExpand).not.toHaveBeenCalled();
      expect(nav).toHaveClass("w-64");
    });

    it("cleans up keydown event listener upon unmount to prevent memory leaks", () => {
      const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
      const { unmount } = render(
        <ThemeProvider>
          <Navigation />
        </ThemeProvider>
      );

      unmount();
      expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
      removeEventListenerSpy.mockRestore();
    });
  });

  /* =========================================================================
   * Challenge 4: VideoCircle Modal Close aria-label and Accessibility
   * ========================================================================= */
  describe("Challenge 4: VideoCircle Modal Close & A11y Verification (app/component/video-circle.tsx)", () => {
    const mockVideos = [
      {
        id: "vid-test-1",
        title: "조선 검법 수련",
        description: "기본 세법과 투로 수련",
        story: "상세 수련 배경 이야기",
        thumbnail: "/images/sword.webp",
        cta: { label: "배우러 가기", href: "/basic" },
      },
    ];

    it("verifies modal close button has aria-label='닫기' and visible text '닫기'", () => {
      render(
        <ThemeProvider>
          <VideoCircle videos={mockVideos} />
        </ThemeProvider>
      );

      // Open modal by clicking video thumbnail button
      const trigger = screen.getByRole("button", { name: "조선 검법 수련 상세 보기" });
      expect(trigger).toBeInTheDocument();
      fireEvent.click(trigger);

      // Verify modal dialog accessibility attributes
      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-labelledby", "circle-modal-title");

      // Verify close button aria-label and text
      const closeBtn = screen.getByRole("button", { name: "닫기" });
      expect(closeBtn).toBeInTheDocument();
      expect(closeBtn).toHaveAttribute("aria-label", "닫기");
      expect(closeBtn.textContent).toBe("닫기");
    });

    it("verifies modal closes when Escape key is pressed", () => {
      render(
        <ThemeProvider>
          <VideoCircle videos={mockVideos} />
        </ThemeProvider>
      );

      // Open modal
      fireEvent.click(screen.getByRole("button", { name: "조선 검법 수련 상세 보기" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Press Escape
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      });

      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("verifies backdrop click closes modal but inner dialog click does not propagate", () => {
      render(
        <ThemeProvider>
          <VideoCircle videos={mockVideos} />
        </ThemeProvider>
      );

      // Open modal
      fireEvent.click(screen.getByRole("button", { name: "조선 검법 수련 상세 보기" }));
      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();

      // Click inside dialog content (should not close)
      const modalTitle = document.getElementById("circle-modal-title");
      expect(modalTitle).not.toBeNull();
      fireEvent.click(modalTitle!);
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Click backdrop container (should close)
      fireEvent.click(dialog);
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("verifies keyboard activation of circular thumbnail items (Enter / Space)", () => {
      render(
        <ThemeProvider>
          <VideoCircle videos={mockVideos} />
        </ThemeProvider>
      );

      const trigger = screen.getByRole("button", { name: "조선 검법 수련 상세 보기" });
      expect(trigger).toHaveAttribute("tabIndex", "0");

      // Press Space
      fireEvent.keyDown(trigger, { key: " " });
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Close modal
      fireEvent.click(screen.getByRole("button", { name: "닫기" }));
      expect(screen.queryByRole("dialog")).toBeNull();

      // Press Enter
      fireEvent.keyDown(trigger, { key: "Enter" });
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  /* =========================================================================
   * Challenge 5: Cross-Component Interaction & Collision Analysis
   * ========================================================================= */
  describe("Challenge 5: Global Escape Key Collision & MobileNav Findings", () => {
    it("empirically demonstrates global Escape collision between modal and Navigation", () => {
      const handleExpand = jest.fn();
      const mockVideos = [
        {
          id: "vid-cross-1",
          title: "본국검",
          description: "설명",
          thumbnail: "/img.webp",
        },
      ];

      render(
        <ThemeProvider>
          <Navigation onExpand={handleExpand} />
          <VideoCircle videos={mockVideos} />
        </ThemeProvider>
      );

      // Open VideoCircle modal
      const trigger = screen.getByRole("button", { name: "본국검 상세 보기" });
      fireEvent.click(trigger);
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // User presses Escape to close the modal
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      });

      // Modal is closed
      expect(screen.queryByRole("dialog")).toBeNull();

      // SIDE EFFECT OBSERVED: Navigation sidebar is ALSO collapsed simultaneously!
      expect(handleExpand).toHaveBeenCalledWith(false);
    });
  });
});

