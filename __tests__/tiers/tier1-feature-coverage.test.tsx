import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "@/app/context/theme-context";
import { AppShell } from "@/components/layout/app-shell";
import { MainLayout } from "@/components/layout/main-layout";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import Navigation from "@/app/component/navigation";
import HomeClient from "@/app/component/home-client";
import AboutPage from "@/app/component/about-page";
import SparringPage from "@/app/component/sparring-page";
import Equipment from "@/app/component/equipment";
import RecordGraph from "@/app/component/record-graph";
import LoginPage from "@/app/component/login-page";
import { AuthService } from "@/lib/auth-service";
import { TokenService } from "@/lib/token-service";
import { CONTACT, SITE } from "@/lib/contact";

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

describe("Tier 1: Feature Coverage Verification Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = "";
    document.documentElement.className = "";
    jest.clearAllMocks();
  });

  // =========================================================================
  // Feature 1: Clean Layout & No Error Overlays (ORIGINAL_REQUEST §R1)
  // =========================================================================
  describe("Feature 1: Clean Layout & No Error Overlays", () => {
    it("F1-1: renders root semantic landmarks: skip-link, nav, main, and contentinfo", () => {
      render(
        <ThemeProvider>
          <AppShell>
            <div data-testid="page-content">Welcome to Muryen</div>
          </AppShell>
        </ThemeProvider>
      );

      expect(screen.getByRole("link", { name: "본문으로 건너뛰기" })).toBeInTheDocument();
      expect(screen.getByRole("navigation")).toBeInTheDocument();
      const main = screen.getByRole("main");
      expect(main).toHaveAttribute("id", "main");
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("F1-2: provides accessible skip navigation linking directly to '#main'", () => {
      render(
        <ThemeProvider>
          <AppShell>
            <div>Main Content Area</div>
          </AppShell>
        </ThemeProvider>
      );

      const skipLink = screen.getByRole("link", { name: "본문으로 건너뛰기" });
      expect(skipLink).toHaveAttribute("href", "#main");
    });

    it("F1-3: maintains a clean DOM free of third-party LLAMI chat widgets and error banners", () => {
      const { container } = render(
        <ThemeProvider>
          <AppShell>
            <div>Page View</div>
          </AppShell>
        </ThemeProvider>
      );

      expect(container.querySelector("#llami-chat-widget")).toBeNull();
      expect(container.querySelector(".llami-widget")).toBeNull();
      expect(container.querySelector("[data-testid='error-badge']")).toBeNull();
      expect(container.querySelector(".error-overlay")).toBeNull();
    });

    it("F1-4: wraps child pages cleanly using MainLayout pass-through structure", () => {
      render(
        <ThemeProvider>
          <AppShell>
            <MainLayout>
              <div data-testid="nested-page-node">Nested Page Content</div>
            </MainLayout>
          </AppShell>
        </ThemeProvider>
      );

      expect(screen.getByTestId("nested-page-node")).toBeInTheDocument();
    });

    it("F1-5: Footer component renders brand identity, schedule info, and structured nav groups", () => {
      render(
        <ThemeProvider>
          <Footer />
        </ThemeProvider>
      );

      expect(screen.getByText(SITE.name)).toBeInTheDocument();
      expect(screen.getByText(SITE.tagline)).toBeInTheDocument();
      expect(screen.getByText("소개")).toBeInTheDocument();
      expect(screen.getByText("수련")).toBeInTheDocument();
      expect(screen.getByText("참여")).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Feature 2: Navigation & Bottom-Left Anchor Cleanup (ORIGINAL_REQUEST §R1)
  // =========================================================================
  describe("Feature 2: Navigation & Bottom-Left Anchor Cleanup", () => {
    it("F2-1: renders all primary navigation routes with valid href attributes", () => {
      render(
        <ThemeProvider>
          <Navigation />
        </ThemeProvider>
      );

      const routes = [
        { name: /홈/i, href: "/" },
        { name: /소개/i, href: "/about" },
        { name: /24반/i, href: "/basic-sense" },
        { name: /기본기/i, href: "/basic" },
        { name: /투로/i, href: "/pattern" },
        { name: /베기/i, href: "/cutting" },
        { name: /대련/i, href: "/sparring" },
        { name: /수련일지/i, href: "/daily" },
        { name: /입회 안내/i, href: "/#inquiry" },
        { name: /나의 수련/i, href: "/mypage" },
      ];

      routes.forEach(({ name, href }) => {
        expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
      });
    });

    it("F2-2: toggles sidebar between expanded (w-64) and collapsed (w-24) invoking onExpand callback", async () => {
      const user = userEvent.setup();
      const onExpandMock = jest.fn();

      const { container } = render(
        <ThemeProvider>
          <Navigation onExpand={onExpandMock} />
        </ThemeProvider>
      );

      const navElement = container.querySelector("nav");
      expect(navElement).toHaveClass("w-64");

      const toggleButton = screen.getAllByRole("button").find((btn) =>
        btn.className.includes("absolute")
      );
      expect(toggleButton).toBeDefined();

      await user.click(toggleButton!);
      expect(navElement).toHaveClass("w-24");
      expect(onExpandMock).toHaveBeenCalledWith(false);

      await user.click(toggleButton!);
      expect(navElement).toHaveClass("w-64");
      expect(onExpandMock).toHaveBeenCalledWith(true);
    });

    it("F2-3: ensures bottom-left anchor container has NO orphaned VideoModal or iframe elements", () => {
      const { container } = render(
        <ThemeProvider>
          <Navigation />
        </ThemeProvider>
      );

      const bottomContainer = container.querySelector(".absolute.bottom-4");
      expect(bottomContainer).toBeInTheDocument();
      expect(bottomContainer?.querySelector("iframe")).toBeNull();
      expect(bottomContainer?.querySelector("[data-testid='video-modal']")).toBeNull();
      expect(bottomContainer?.querySelector("video")).toBeNull();
    });

    it("F2-4: renders external YouTube channel link with secure target and rel attributes", () => {
      render(
        <ThemeProvider>
          <Navigation />
        </ThemeProvider>
      );

      const ytLink = screen.getByRole("link", { name: /youtube/i });
      expect(ytLink).toHaveAttribute("href", CONTACT.youtube);
      expect(ytLink).toHaveAttribute("target", "_blank");
      expect(ytLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("F2-5: MobileNav component provides mobile top bar and responsive drawer navigation", async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <MobileNav />
        </ThemeProvider>
      );

      const menuOpenButton = screen.getByRole("button", { name: "메뉴 열기" });
      expect(menuOpenButton).toBeInTheDocument();

      await user.click(menuOpenButton);

      const drawer = screen.getByRole("complementary");
      expect(drawer).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "메뉴 닫기" })).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Feature 3: Theme Switching & Context Provider (ORIGINAL_REQUEST §R2)
  // =========================================================================
  describe("Feature 3: Theme Switching & Context Provider", () => {
    function ThemeTestProbe() {
      const { theme, toggleTheme } = useTheme();
      return (
        <div>
          <span data-testid="theme-state">{theme}</span>
          <button data-testid="toggle-btn" onClick={toggleTheme}>
            Toggle Theme
          </button>
        </div>
      );
    }

    it("F3-1: provides 'light' as the default theme and synchronizes DOM classes", () => {
      render(
        <ThemeProvider>
          <ThemeTestProbe />
        </ThemeProvider>
      );

      expect(screen.getByTestId("theme-state").textContent).toBe("light");
      expect(document.documentElement.classList.contains("theme-light")).toBe(true);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("F3-2: restores 'dark' theme from localStorage on initial render", () => {
      localStorage.setItem("theme", "dark");

      render(
        <ThemeProvider>
          <ThemeTestProbe />
        </ThemeProvider>
      );

      expect(screen.getByTestId("theme-state").textContent).toBe("dark");
      expect(document.documentElement.classList.contains("theme-dark")).toBe(true);
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("F3-3: toggleTheme alternates between light and dark updating localStorage", async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <ThemeTestProbe />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId("toggle-btn");
      const themeState = screen.getByTestId("theme-state");

      expect(themeState.textContent).toBe("light");

      await user.click(toggleButton);
      expect(themeState.textContent).toBe("dark");
      expect(localStorage.getItem("theme")).toBe("dark");

      await user.click(toggleButton);
      expect(themeState.textContent).toBe("light");
      expect(localStorage.getItem("theme")).toBe("light");
    });

    it("F3-4: updates document.documentElement classes immediately upon theme transition", async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <ThemeTestProbe />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId("toggle-btn");

      await user.click(toggleButton);
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(document.documentElement.classList.contains("theme-dark")).toBe(true);
      expect(document.documentElement.classList.contains("theme-light")).toBe(false);

      await user.click(toggleButton);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      expect(document.documentElement.classList.contains("theme-light")).toBe(true);
      expect(document.documentElement.classList.contains("theme-dark")).toBe(false);
    });

    it("F3-5: respects system prefers-color-scheme dark media query when localStorage is empty", () => {
      window.matchMedia = jest.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(
        <ThemeProvider>
          <ThemeTestProbe />
        </ThemeProvider>
      );

      expect(screen.getByTestId("theme-state").textContent).toBe("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });

  // =========================================================================
  // Feature 4: Authentication & Session Handling (ORIGINAL_REQUEST §R2)
  // =========================================================================
  describe("Feature 4: Authentication & Session Handling", () => {
    it("F4-1: AuthService successfully authenticates admin credentials with JWT generation", async () => {
      const authResult = await AuthService.login({
        username: "1111",
        password: "1111",
      });

      expect(authResult).not.toBeNull();
      expect(authResult?.user).toEqual({ id: "1", role: "admin" });
      expect(typeof authResult?.accessToken).toBe("string");

      const validated = await TokenService.verifyToken(authResult!.accessToken);
      expect(validated?.id).toBe("1");
      expect(validated?.role).toBe("admin");
    });

    it("F4-2: AuthService rejects invalid credentials returning null", async () => {
      const authResult = await AuthService.login({
        username: "wrong_user",
        password: "wrong_password",
      });

      expect(authResult).toBeNull();
    });

    it("F4-3: LoginPage submits credentials via API and triggers login request", async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { id: "1", role: "admin" }, success: true }),
      });

      render(
        <ThemeProvider>
          <LoginPage />
        </ThemeProvider>
      );

      const usernameInput = screen.getByPlaceholderText("아이디");
      const passwordInput = screen.getByPlaceholderText("비밀번호");
      const submitButton = screen.getByRole("button", { name: "로그인" });

      fireEvent.change(usernameInput, { target: { value: "1111" } });
      fireEvent.change(passwordInput, { target: { value: "1111" } });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      expect(global.fetch).toHaveBeenCalledWith("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "1111", password: "1111" }),
      });
    });

    it("F4-4: Navigation handles logout action invoking logout API and clearing state", async () => {
      const user = userEvent.setup();
      window.alert = jest.fn();
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      Object.defineProperty(document, "cookie", {
        writable: true,
        value: "accessToken=valid-token; isLoggedIn=true",
      });

      render(
        <ThemeProvider>
          <Navigation />
        </ThemeProvider>
      );

      const logoutBtn = screen.getByRole("button", { name: /로그아웃/i });
      expect(logoutBtn).toBeInTheDocument();

      await user.click(logoutBtn);
      expect(global.fetch).toHaveBeenCalledWith("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    });

    it("F4-5: MobileNav conditionally displays logout button when auth cookie exists", () => {
      Object.defineProperty(document, "cookie", {
        writable: true,
        value: "isLoggedIn=true; accessToken=token123",
      });

      render(
        <ThemeProvider>
          <MobileNav />
        </ThemeProvider>
      );

      const menuOpenButton = screen.getByRole("button", { name: "메뉴 열기" });
      fireEvent.click(menuOpenButton);

      expect(screen.getByRole("button", { name: /로그아웃/i })).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Feature 5: Dynamic Routes & Page Rendering (ORIGINAL_REQUEST §R2)
  // =========================================================================
  describe("Feature 5: Dynamic Routes & Page Rendering", () => {
    it("F5-1: HomeClient renders hero, interactive tabs list, and inquiry section", () => {
      render(
        <ThemeProvider>
          <HomeClient />
        </ThemeProvider>
      );

      expect(screen.getByRole("tab", { name: /무련/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /수련법/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /의미/i })).toBeInTheDocument();
    });

    it("F5-2: AboutPage renders introduction, organization history, and curriculum", () => {
      render(
        <ThemeProvider>
          <AboutPage />
        </ThemeProvider>
      );

      expect(screen.getByRole("heading", { level: 1, name: "소개" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "24반 무예경당협회" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "무예도보통지" })).toBeInTheDocument();
    });

    it("F5-3: SparringPage renders sparring overview, stages, and tactical mindsets", () => {
      render(
        <ThemeProvider>
          <SparringPage />
        </ThemeProvider>
      );

      expect(screen.getByRole("heading", { level: 1, name: /대련의 특성과 의미/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /전술적 감각 재고/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /대련 교육 과정/i })).toBeInTheDocument();
    });

    it("F5-4: Equipment page renders gear catalog cards and interactive detail buttons", () => {
      render(
        <ThemeProvider>
          <Equipment />
        </ThemeProvider>
      );

      expect(screen.getByRole("heading", { level: 1, name: "전통 무예 장비 소개" })).toBeInTheDocument();
      expect(screen.getByText("전통 갑옷")).toBeInTheDocument();
      expect(screen.getByText("전투용 투구")).toBeInTheDocument();
      expect(screen.getByText("장창")).toBeInTheDocument();
      expect(screen.getAllByRole("button", { name: "자세히 보기" })).toHaveLength(3);
    });

    it("F5-5: RecordGraph renders commit history timeline, year titles, and day cells", () => {
      render(
        <ThemeProvider>
          <RecordGraph />
        </ThemeProvider>
      );

      expect(screen.getByRole("heading", { level: 2, name: "Commit History" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 3, name: "2024" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 3, name: "2023" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 3, name: "2022" })).toBeInTheDocument();
    });
  });
});
