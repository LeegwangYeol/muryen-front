import React from "react";
import ReactDOMServer from "react-dom/server";
import { render, screen, fireEvent, act } from "@testing-library/react";
import VideoCircle from "@/app/component/video-circle";
import LoginPage from "@/app/component/login-page";
import { ThemeProvider } from "@/app/context/theme-context";
import { AppShell } from "@/components/layout/app-shell";
import fs from "fs";
import path from "path";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/login"),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useSession: () => ({ data: null, status: "unauthenticated" }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

describe("M2 Empirical Challenger: Layout, SSR Hydration & Legacy Cleanliness", () => {
  const sampleVideos = [
    {
      id: "vid-1",
      title: "본국검 (Bon Guk Geom)",
      description: "조선 24반 무예 중 본국검세",
      story: "신라 화랑 황창랑의 고사에서 유래된 검법",
      thumbnail: "/images/bon-guk-geom.webp",
      cta: { label: "수련 안내", href: "/basic" },
    },
    {
      id: "vid-2",
      title: "제독검 (Je Dok Geom)",
      description: "명나라 이여송 제독이 전수한 검법",
      thumbnail: "/images/je-dok-geom.webp",
    },
    {
      id: "vid-3",
      title: "쌍수도 (Ssang Su Do)",
      description: "조선 장검 양손 검술",
      thumbnail: "/images/ssang-su-do.webp",
    },
  ];

  describe("1. VideoCircle SSR Hydration Safety & Lifecycle Integrity", () => {
    it("renders server-side with ReactDOMServer.renderToString without runtime errors", () => {
      const ssrHtml = ReactDOMServer.renderToString(
        <ThemeProvider>
          <VideoCircle videos={sampleVideos} />
        </ThemeProvider>
      );

      expect(ssrHtml).toContain("본국검 (Bon Guk Geom)");
      expect(ssrHtml).toContain("제독검 (Je Dok Geom)");
      expect(ssrHtml).toContain("쌍수도 (Ssang Su Do)");
      expect(ssrHtml).toContain("translate(0px, 0px)"); // Initial state is radius 0
    });

    it("renders empty video list gracefully on SSR without NaN or division by zero errors", () => {
      const ssrHtml = ReactDOMServer.renderToString(
        <ThemeProvider>
          <VideoCircle videos={[]} />
        </ThemeProvider>
      );

      expect(ssrHtml).toBeDefined();
      expect(ssrHtml).not.toContain("NaN");
    });

    it("renders on client and supports interactive modal open and close via Escape key", () => {
      render(
        <ThemeProvider>
          <VideoCircle videos={sampleVideos} />
        </ThemeProvider>
      );

      // Click first video thumbnail
      const bonGuk = screen.getByText("본국검 (Bon Guk Geom)");
      fireEvent.click(bonGuk);

      // Modal dialog should now be open
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("신라 화랑 황창랑의 고사에서 유래된 검법")).toBeInTheDocument();
      expect(screen.getByText("수련 안내 →")).toBeInTheDocument();

      // Press Escape key to close
      fireEvent.keyDown(window, { key: "Escape" });
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("supports closing modal via Close button and outside backdrop click", () => {
      render(
        <ThemeProvider>
          <VideoCircle videos={sampleVideos} />
        </ThemeProvider>
      );

      // Open modal
      fireEvent.click(screen.getByText("본국검 (Bon Guk Geom)"));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Click Close button
      fireEvent.click(screen.getByRole("button", { name: "닫기" }));
      expect(screen.queryByRole("dialog")).toBeNull();

      // Re-open and click backdrop
      fireEvent.click(screen.getByText("본국검 (Bon Guk Geom)"));
      const dialogBackdrop = screen.getByRole("dialog");
      fireEvent.click(dialogBackdrop);
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("handles non-Escape keypresses and rapid prop changes without crashing", () => {
      const { rerender } = render(
        <ThemeProvider>
          <VideoCircle videos={sampleVideos} />
        </ThemeProvider>
      );

      // Open modal
      fireEvent.click(screen.getByText("본국검 (Bon Guk Geom)"));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Press non-Escape keys
      fireEvent.keyDown(window, { key: "Enter" });
      fireEvent.keyDown(window, { key: "ArrowRight" });
      fireEvent.keyDown(window, { key: "Space" });
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Rerender with single video
      rerender(
        <ThemeProvider>
          <VideoCircle videos={[sampleVideos[0]]} />
        </ThemeProvider>
      );
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Close via Escape
      fireEvent.keyDown(window, { key: "Escape" });
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  describe("2. Login Page Viewport Alignment & Layout Centering", () => {
    it("verifies LoginPage has zero left-margin offset classes that would break AppShell centering", () => {
      const { container } = render(
        <ThemeProvider>
          <LoginPage />
        </ThemeProvider>
      );

      const rootDiv = container.firstElementChild as HTMLElement;
      expect(rootDiv).toBeInTheDocument();

      // Must be flex centered
      expect(rootDiv.className).toContain("flex");
      expect(rootDiv.className).toContain("items-center");
      expect(rootDiv.className).toContain("justify-center");

      // Must NOT contain md:ml-24 or md:ml-64 which causes double-offset inside AppShell
      expect(rootDiv.className).not.toContain("md:ml-24");
      expect(rootDiv.className).not.toContain("md:ml-64");
      expect(rootDiv.className).not.toContain("ml-24");
    });

    it("verifies AppShell applies responsive sidebar offsets on #main correctly", () => {
      const { container } = render(
        <ThemeProvider>
          <AppShell>
            <div>Test Page Content</div>
          </AppShell>
        </ThemeProvider>
      );

      const mainElement = container.querySelector("#main");
      expect(mainElement).toBeInTheDocument();
      expect(mainElement?.className).toContain("md:ml-64");
    });

    it("LoginPage handles submit event and extracts redirect parameter cleanly", async () => {
      window.history.pushState({}, "", "/login?redirect=%2Fdaily%2Fsparring");
      expect(new URLSearchParams(window.location.search).get("redirect")).toBe("/daily/sparring");

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ user: { id: "1", role: "admin" } }),
      });

      render(
        <ThemeProvider>
          <LoginPage />
        </ThemeProvider>
      );

      const usernameInput = screen.getByPlaceholderText("아이디");
      const passwordInput = screen.getByPlaceholderText("비밀번호");
      const submitBtn = screen.getByRole("button", { name: "로그인" });

      fireEvent.change(usernameInput, { target: { value: "1111" } });
      fireEvent.change(passwordInput, { target: { value: "1111" } });

      await act(async () => {
        fireEvent.click(submitBtn);
      });

      expect(global.fetch).toHaveBeenCalledWith("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "1111", password: "1111" }),
      });
    });

    it("LoginPage handles fetch network failure gracefully with alert dialog fallback", async () => {
      const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
      const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: "잘못된 아이디 또는 비밀번호입니다." }),
      });

      render(
        <ThemeProvider>
          <LoginPage />
        </ThemeProvider>
      );

      const submitBtn = screen.getByRole("button", { name: "로그인" });
      await act(async () => {
        fireEvent.click(submitBtn);
      });

      expect(alertSpy).toHaveBeenCalledWith("로그인에 실패했습니다. 다시 시도해주세요.");
      alertSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });

  describe("3. Legacy Code Cleanliness & Zero Dangling References", () => {
    const deletedFiles = [
      "app/component/VideoModal.tsx",
      "app/component/introduction.tsx",
      "app/component/main-open.tsx",
      "app/component/call-to-action.tsx",
      "app/component/techniques.tsx",
      "app/component/vanta-background.tsx",
      "app/component/llami-chat-widget.tsx",
    ];

    it("confirms all 7 legacy files are completely deleted from filesystem", () => {
      for (const relPath of deletedFiles) {
        const fullPath = path.resolve(process.cwd(), relPath);
        expect(fs.existsSync(fullPath)).toBe(false);
      }
    });

    it("verifies zero import statements reference any of the deleted legacy modules", () => {
      const srcRoots = ["app", "components", "lib"];
      const bannedModulePatterns = [
        /from\s+["'].*\/VideoModal["']/i,
        /import\(["'].*\/VideoModal["']\)/i,
        /from\s+["'].*\/introduction["']/i,
        /from\s+["'].*\/main-open["']/i,
        /from\s+["'].*\/call-to-action["']/i,
        /from\s+["'].*\/techniques["']/i,
        /from\s+["'].*\/vanta-background["']/i,
        /from\s+["'].*\/llami-chat-widget["']/i,
      ];

      function checkDir(dir: string) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            if (entry.name !== "node_modules" && entry.name !== ".next" && entry.name !== ".git") {
              checkDir(full);
            }
          } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
            const content = fs.readFileSync(full, "utf-8");
            for (const pattern of bannedModulePatterns) {
              const match = content.match(pattern);
              expect(match).toBeNull();
            }
          }
        }
      }

      for (const root of srcRoots) {
        const fullRoot = path.resolve(process.cwd(), root);
        if (fs.existsSync(fullRoot)) {
          checkDir(fullRoot);
        }
      }
    });
  });
});
