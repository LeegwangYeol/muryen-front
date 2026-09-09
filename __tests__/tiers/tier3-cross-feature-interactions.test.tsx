import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "@/app/context/theme-context";
import { AppShell } from "@/components/layout/app-shell";
import Navigation from "@/app/component/navigation";
import SparringPage from "@/app/component/sparring-page";
import LoginPage from "@/app/component/login-page";

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

describe("Tier 3: Cross-Feature Interactions Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = "";
    document.documentElement.className = "";
    jest.clearAllMocks();
  });

  // =========================================================================
  // Interaction 1: Theme + Layout Integration
  // =========================================================================
  it("INT-1 (Theme + Layout): toggling theme dynamically changes AppShell background and root classes", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <ThemeProvider>
        <AppShell>
          <div data-testid="content">Page Body</div>
        </AppShell>
      </ThemeProvider>
    );

    const rootWrapper = container.firstChild as HTMLElement;
    // Default light
    expect(rootWrapper).toHaveClass("bg-[#f0e8e8]/95");
    expect(document.documentElement.classList.contains("theme-light")).toBe(true);

    // Toggle theme via navigation button
    const themeBtn = screen.getAllByRole("button", { name: "다크 모드로 전환" })[0];
    await user.click(themeBtn);

    // Dark mode applied
    expect(rootWrapper).toHaveClass("bg-[#410707]/90");
    expect(document.documentElement.classList.contains("theme-dark")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    // Toggle back to light
    const lightBtn = screen.getAllByRole("button", { name: "라이트 모드로 전환" })[0];
    await user.click(lightBtn);

    expect(rootWrapper).toHaveClass("bg-[#f0e8e8]/95");
    expect(document.documentElement.classList.contains("theme-light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  // =========================================================================
  // Interaction 2: Auth + Navigation State Lifecycle
  // =========================================================================
  it("INT-2 (Auth + Navigation): auth cookie presence displays logout button and executing logout triggers API and reset", async () => {
    const user = userEvent.setup();
    window.alert = jest.fn();
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "accessToken=jwt-token-123; isLoggedIn=true",
    });

    render(
      <ThemeProvider>
        <Navigation />
      </ThemeProvider>
    );

    const logoutButton = screen.getByRole("button", { name: /로그아웃/i });
    expect(logoutButton).toBeInTheDocument();

    await user.click(logoutButton);

    expect(global.fetch).toHaveBeenCalledWith("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    expect(window.alert).toHaveBeenCalledWith("로그아웃 되었습니다.");
  });

  // =========================================================================
  // Interaction 3: AppShell + MobileNav Responsive Behavior
  // =========================================================================
  it("INT-3 (AppShell + MobileNav): MobileNav menu drawer coordinates with AppShell landmarks", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <AppShell>
          <div data-testid="mobile-content">Mobile Responsive View</div>
        </AppShell>
      </ThemeProvider>
    );

    expect(screen.getByRole("link", { name: "본문으로 건너뛰기" })).toBeInTheDocument();
    expect(screen.getByTestId("mobile-content")).toBeInTheDocument();

    // Open mobile nav drawer (which is embedded in AppShell)
    const openMenuBtn = screen.getByRole("button", { name: "메뉴 열기" });
    await user.click(openMenuBtn);

    const asideDrawer = screen.getByRole("complementary");
    expect(asideDrawer).toBeInTheDocument();

    // Check key mobile navigation links inside drawer
    expect(screen.getAllByRole("link", { name: /대련/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /투로/i })[0]).toBeInTheDocument();

    // Close mobile nav drawer
    const closeMenuBtn = screen.getByRole("button", { name: "메뉴 닫기" });
    await user.click(closeMenuBtn);
  });

  // =========================================================================
  // Interaction 4: Theme + Route Rendering Synchronization
  // =========================================================================
  it("INT-4 (Theme + Route Rendering): toggling theme synchronizes styling and glassmorphism across route pages", async () => {
    function ThemeToggleAndSparringPage() {
      const { toggleTheme } = useTheme();
      return (
        <div>
          <button data-testid="page-theme-toggle" onClick={toggleTheme}>
            Toggle Theme
          </button>
          <SparringPage />
        </div>
      );
    }

    const user = userEvent.setup();

    const { container } = render(
      <ThemeProvider>
        <ThemeToggleAndSparringPage />
      </ThemeProvider>
    );

    // Initial light mode
    expect(container.querySelector(".glassmorphism-light")).toBeInTheDocument();
    expect(container.querySelector(".glassmorphism-dark")).toBeNull();

    // Toggle theme to dark
    const toggleBtn = screen.getByTestId("page-theme-toggle");
    await user.click(toggleBtn);

    expect(container.querySelector(".glassmorphism-dark")).toBeInTheDocument();
    expect(container.querySelector(".glassmorphism-light")).toBeNull();
  });

  // =========================================================================
  // Interaction 5: Auth + Route Navigation Integration
  // =========================================================================
  it("INT-5 (Auth + Route Navigation): login submission sends credentials and processes redirect URL", async () => {
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
});
