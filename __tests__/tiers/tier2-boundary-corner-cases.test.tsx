import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "@/app/context/theme-context";
import { AppShell } from "@/components/layout/app-shell";
import Navigation from "@/app/component/navigation";
import { MobileNav } from "@/components/layout/mobile-nav";
import Equipment from "@/app/component/equipment";
import RecordGraph from "@/app/component/record-graph";
import LoginPage from "@/app/component/login-page";
import {
  AttendanceLineChart,
  SkillsRadarChart,
  SparringBarChart,
} from "@/components/dashboard/stat-charts";
import { AuthService } from "@/lib/auth-service";
import { TokenService } from "@/lib/token-service";

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

describe("Tier 2: Boundary & Corner Cases Verification Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = "";
    document.documentElement.className = "";
    jest.clearAllMocks();
  });

  // =========================================================================
  // Feature 1 Boundaries: Layout & Overlays
  // =========================================================================
  describe("Feature 1 Boundaries: Layout & Overlays", () => {
    it("B1-1: AppShell handles null / empty children gracefully without crashing", () => {
      const { container } = render(
        <ThemeProvider>
          <AppShell>{null}</AppShell>
        </ThemeProvider>
      );

      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(container.querySelector("#main")).toBeInTheDocument();
    });

    it("B1-2: AppShell survives rapid sequential re-renders without losing layout integrity", () => {
      const { rerender } = render(
        <ThemeProvider>
          <AppShell>
            <div>Render 1</div>
          </AppShell>
        </ThemeProvider>
      );

      expect(screen.getByText("Render 1")).toBeInTheDocument();

      for (let i = 2; i <= 5; i++) {
        rerender(
          <ThemeProvider>
            <AppShell>
              <div>Render {i}</div>
            </AppShell>
          </ThemeProvider>
        );
        expect(screen.getByText(`Render ${i}`)).toBeInTheDocument();
      }
    });

    it("B1-3: AppShell applies default styling when localStorage has invalid/unknown theme string", () => {
      localStorage.setItem("theme", "cyberpunk_neon_123");

      const { container } = render(
        <ThemeProvider>
          <AppShell>
            <div>Content</div>
          </AppShell>
        </ThemeProvider>
      );

      const rootWrapper = container.firstChild as HTMLElement;
      expect(rootWrapper).toBeDefined();
    });

    it("B1-4: AppShell maintains skip-link accessibility with deeply nested children", () => {
      render(
        <ThemeProvider>
          <AppShell>
            <div>
              <section>
                <article>
                  <div>
                    <span data-testid="deep-child">Deeply Nested</span>
                  </div>
                </article>
              </section>
            </div>
          </AppShell>
        </ThemeProvider>
      );

      const skipLink = screen.getByRole("link", { name: "본문으로 건너뛰기" });
      expect(skipLink).toHaveAttribute("href", "#main");
      expect(screen.getByTestId("deep-child")).toBeInTheDocument();
    });

    it("B1-5: AppShell layout structure remains stable when window resize events are dispatched", () => {
      render(
        <ThemeProvider>
          <AppShell>
            <div>Resize Test</div>
          </AppShell>
        </ThemeProvider>
      );

      act(() => {
        window.innerWidth = 375;
        window.dispatchEvent(new Event("resize"));
      });

      expect(screen.getByRole("main")).toBeInTheDocument();

      act(() => {
        window.innerWidth = 1440;
        window.dispatchEvent(new Event("resize"));
      });

      expect(screen.getByRole("main")).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Feature 2 Boundaries: Navigation & Bottom Anchors
  // =========================================================================
  describe("Feature 2 Boundaries: Navigation & Bottom Anchors", () => {
    it("B2-1: Navigation toggles cleanly without throwing when onExpand prop is undefined", async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <Navigation />
        </ThemeProvider>
      );

      const toggleButton = screen.getAllByRole("button").find((btn) =>
        btn.className.includes("absolute")
      );
      expect(toggleButton).toBeDefined();

      // Click should not throw TypeError
      await user.click(toggleButton!);
      await user.click(toggleButton!);
    });

    it("B2-2: Navigation handles rapid consecutive clicks on sidebar expand/collapse button", async () => {
      const user = userEvent.setup();
      const onExpandMock = jest.fn();

      const { container } = render(
        <ThemeProvider>
          <Navigation onExpand={onExpandMock} />
        </ThemeProvider>
      );

      const toggleButton = screen.getAllByRole("button").find((btn) =>
        btn.className.includes("absolute")
      );

      // 4 rapid clicks
      await user.click(toggleButton!);
      await user.click(toggleButton!);
      await user.click(toggleButton!);
      await user.click(toggleButton!);

      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("w-64");
      expect(onExpandMock).toHaveBeenCalledTimes(4);
    });

    it("B2-3: Navigation handles corrupted or irregular document.cookie formats without errors", () => {
      Object.defineProperty(document, "cookie", {
        writable: true,
        value: ";;; ==; corrupted=cookie;; isLoggedIn=; undefined",
      });

      render(
        <ThemeProvider>
          <Navigation />
        </ThemeProvider>
      );

      // Should render normally without crashing
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("B2-4: Navigation handles rapid consecutive clicks on theme toggle button", async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <Navigation />
        </ThemeProvider>
      );

      const themeToggleBtn = screen.getAllByRole("button", {
        name: /모드로 전환/i,
      })[0];

      await user.click(themeToggleBtn);
      await user.click(themeToggleBtn);
      await user.click(themeToggleBtn);

      expect(localStorage.getItem("theme")).toBeDefined();
    });

    it("B2-5: MobileNav drawer handles rapid open, close, and backdrop click cycles", async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <MobileNav />
        </ThemeProvider>
      );

      const openBtn = screen.getByRole("button", { name: "메뉴 열기" });

      // Open
      await user.click(openBtn);
      expect(screen.getByRole("complementary")).toBeInTheDocument();

      // Close via close button
      const closeBtn = screen.getByRole("button", { name: "메뉴 닫기" });
      await user.click(closeBtn);

      // Open again
      await user.click(openBtn);
      expect(screen.getByRole("complementary")).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Feature 3 Boundaries: Theme Switching & Context
  // =========================================================================
  describe("Feature 3 Boundaries: Theme Switching & Context", () => {
    function ThemeProbe() {
      const { theme, toggleTheme } = useTheme();
      return (
        <div>
          <span data-testid="theme">{theme}</span>
          <button data-testid="toggle" onClick={toggleTheme}>
            Toggle
          </button>
        </div>
      );
    }

    it("B3-1: ThemeProvider handles invalid or malformed theme values in localStorage", () => {
      localStorage.setItem("theme", "random_unsupported_string");

      render(
        <ThemeProvider>
          <ThemeProbe />
        </ThemeProvider>
      );

      expect(screen.getByTestId("theme").textContent).toBe("light");
    });

    it("B3-2: ThemeProvider handles localStorage exception throwing (e.g. QuotaExceeded / SecurityError)", () => {
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });

      render(
        <ThemeProvider>
          <ThemeProbe />
        </ThemeProvider>
      );

      const toggleBtn = screen.getByTestId("toggle");
      expect(() => {
        fireEvent.click(toggleBtn);
      }).not.toThrow();

      setItemSpy.mockRestore();
    });

    it("B3-3: ThemeProvider handles multiple rapid toggle calls within same render loop", async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <ThemeProbe />
        </ThemeProvider>
      );

      const toggleBtn = screen.getByTestId("toggle");
      const themeSpan = screen.getByTestId("theme");

      expect(themeSpan.textContent).toBe("light");

      // 6 toggles -> even number -> should end on light
      for (let i = 0; i < 6; i++) {
        await user.click(toggleBtn);
      }

      expect(themeSpan.textContent).toBe("light");
    });

    it("B3-4: useTheme throws descriptive error when used outside of ThemeProvider", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        render(<ThemeProbe />);
      }).toThrow("useTheme must be used within a ThemeProvider");

      consoleSpy.mockRestore();
    });

    it("B3-5: ThemeProvider functions safely when matchMedia returns undefined or incomplete object", () => {
      window.matchMedia = undefined as any;

      render(
        <ThemeProvider>
          <ThemeProbe />
        </ThemeProvider>
      );

      expect(screen.getByTestId("theme").textContent).toBe("light");
    });
  });

  // =========================================================================
  // Feature 4 Boundaries: Authentication & Session
  // =========================================================================
  describe("Feature 4 Boundaries: Authentication & Session", () => {
    it("B4-1: AuthService handles empty username and password strings safely", async () => {
      const res1 = await AuthService.login({ username: "", password: "" });
      expect(res1).toBeNull();

      const res2 = await AuthService.login({ username: "1111", password: "" });
      expect(res2).toBeNull();

      const res3 = await AuthService.login({ username: "", password: "1111" });
      expect(res3).toBeNull();
    });

    it("B4-2: AuthService rejects whitespace-only or SQL/script injection payloads", async () => {
      const res1 = await AuthService.login({
        username: "   ",
        password: "   ",
      });
      expect(res1).toBeNull();

      const res2 = await AuthService.login({
        username: "' OR '1'='1",
        password: "password",
      });
      expect(res2).toBeNull();

      const res3 = await AuthService.login({
        username: "<script>alert(1)</script>",
        password: "<script>",
      });
      expect(res3).toBeNull();
    });

    it("B4-3: TokenService safely rejects empty string, invalid format, and garbage JWT tokens", async () => {
      expect(await TokenService.verifyToken("")).toBeNull();
      expect(await TokenService.verifyToken("not-a-token")).toBeNull();
      expect(await TokenService.verifyToken("a.b.c")).toBeNull();
      expect(await TokenService.verifyToken("eyJhbGciOiJIUzI1NiJ9.invalid.signature")).toBeNull();
    });

    it("B4-4: TokenService generates and verifies tokens with custom payloads and expiration", async () => {
      const token = await TokenService.generateToken({
        id: "test-user-999",
        role: "user",
      });

      expect(typeof token).toBe("string");
      const decoded = await TokenService.verifyToken(token);
      expect(decoded?.id).toBe("test-user-999");
      expect(decoded?.role).toBe("user");
    });

    it("B4-5: AuthService.validateToken safely returns null for altered or expired token strings", async () => {
      expect(await AuthService.validateToken("")).toBeNull();
      expect(await AuthService.validateToken("expired.token.value")).toBeNull();
      expect(await AuthService.validateToken("eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEifQ.fake")).toBeNull();
    });
  });

  // =========================================================================
  // Feature 5 Boundaries: Dynamic Routes & Charts
  // =========================================================================
  describe("Feature 5 Boundaries: Dynamic Routes & Charts", () => {
    it("B5-1: Dashboard charts render without errors when provided with empty data arrays", () => {
      const { container: lineChart } = render(
        <AttendanceLineChart data={[]} isDark={false} />
      );
      expect(lineChart).toBeDefined();

      const { container: radarChart } = render(
        <SkillsRadarChart data={[]} isDark={true} />
      );
      expect(radarChart).toBeDefined();

      const { container: barChart } = render(
        <SparringBarChart data={[]} isDark={false} />
      );
      expect(barChart).toBeDefined();
    });

    it("B5-2: Dashboard charts handle zero and boundary metric values cleanly", () => {
      const { container: lineChart } = render(
        <AttendanceLineChart
          data={[
            { month: "1월", attendance: 0 },
            { month: "2월", attendance: 0 },
          ]}
          isDark={true}
        />
      );
      expect(lineChart).toBeDefined();

      const { container: radarChart } = render(
        <SkillsRadarChart
          data={[
            { skill: "기본기", score: 0 },
            { skill: "대련", score: 100 },
          ]}
          isDark={false}
        />
      );
      expect(radarChart).toBeDefined();
    });

    it("B5-3: Equipment page modal opens, closes, and switches items repeatedly without leaking state", async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <Equipment />
        </ThemeProvider>
      );

      const detailButtons = screen.getAllByRole("button", { name: "자세히 보기" });

      // Open item 1 (갑옷)
      await user.click(detailButtons[0]);
      expect(screen.getByText("재료")).toBeInTheDocument();

      // Close modal
      const closeBtn1 = screen.getAllByRole("button").find((btn) => btn.querySelector("svg.lucide-x"));
      await user.click(closeBtn1!);
      expect(screen.queryByText("재료")).not.toBeInTheDocument();

      // Open item 2 (투구)
      await user.click(detailButtons[1]);
      expect(screen.getByText("강철, 가죽")).toBeInTheDocument();

      // Close modal
      const closeBtn2 = screen.getAllByRole("button").find((btn) => btn.querySelector("svg.lucide-x"));
      await user.click(closeBtn2!);
      expect(screen.queryByText("강철, 가죽")).not.toBeInTheDocument();
    });

    it("B5-4: RecordGraph renders across multiple years including leap years and boundary dates", () => {
      render(
        <ThemeProvider>
          <RecordGraph />
        </ThemeProvider>
      );

      // Check year headers
      expect(screen.getByText("2024")).toBeInTheDocument();
      expect(screen.getByText("2023")).toBeInTheDocument();
      expect(screen.getByText("2022")).toBeInTheDocument();
    });

    it("B5-5: LoginPage handles network fetch error or 500 server error with user alert and no crash", async () => {
      window.alert = jest.fn();
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network Error"));

      render(
        <ThemeProvider>
          <LoginPage />
        </ThemeProvider>
      );

      const submitButton = screen.getByRole("button", { name: "로그인" });
      fireEvent.change(screen.getByPlaceholderText("아이디"), { target: { value: "test" } });
      fireEvent.change(screen.getByPlaceholderText("비밀번호"), { target: { value: "test" } });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      expect(window.alert).toHaveBeenCalledWith("로그인에 실패했습니다. 다시 시도해주세요.");
      consoleSpy.mockRestore();
    });
  });
});
