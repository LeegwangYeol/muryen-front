import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "@/app/context/theme-context";
import { AppShell } from "@/components/layout/app-shell";
import Navigation from "@/app/component/navigation";
import HomeClient from "@/app/component/home-client";
import AboutPage from "@/app/component/about-page";
import SparringPage from "@/app/component/sparring-page";
import Equipment from "@/app/component/equipment";
import RecordGraph from "@/app/component/record-graph";
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

describe("Tier 4: Real-World Application Scenarios Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = "";
    document.documentElement.className = "";
    jest.clearAllMocks();
  });

  // =========================================================================
  // Scenario 1: Full Application Load & Route Navigation Workflow
  // =========================================================================
  it("SCENARIO 1: Full Application Load, clean rendering without errors, and Home tab navigation", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <ThemeProvider>
        <AppShell>
          <HomeClient />
        </AppShell>
      </ThemeProvider>
    );

    // Verify clean layout and absence of error overlays
    expect(screen.getByRole("link", { name: "본문으로 건너뛰기" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(container.querySelector("#llami-chat-widget")).toBeNull();
    expect(container.querySelector(".error-overlay")).toBeNull();

    // Verify HomeClient tabs
    const philosophyTab = screen.getByRole("tab", { name: /무련/i });
    const howWorkTab = screen.getByRole("tab", { name: /수련법/i });
    const trainingTab = screen.getByRole("tab", { name: /의미/i });

    expect(philosophyTab).toBeInTheDocument();
    expect(howWorkTab).toBeInTheDocument();
    expect(trainingTab).toBeInTheDocument();

    // Switch tabs to '수련법'
    await user.click(howWorkTab);
    expect(screen.getByText("어떻게 수련하는가")).toBeInTheDocument();

    // Switch tabs to '의미'
    await user.click(trainingTab);
    expect(screen.getByText("왜 수련하는가")).toBeInTheDocument();
  });

  // =========================================================================
  // Scenario 2: Dark/Light Theme Toggle & Persistence Lifecycle
  // =========================================================================
  it("SCENARIO 2: Dark/Light Theme toggle, DOM class sync, and persistence across unmount/remount", async () => {
    const user = userEvent.setup();

    // Initial Mount
    const { unmount } = render(
      <ThemeProvider>
        <AppShell>
          <SparringPage />
        </AppShell>
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains("theme-light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    // Toggle theme to dark
    const themeBtn = screen.getAllByRole("button", { name: "다크 모드로 전환" })[0];
    await user.click(themeBtn);

    expect(document.documentElement.classList.contains("theme-dark")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");

    // Unmount component simulating page reload / navigation
    unmount();

    // Remount with stored theme
    render(
      <ThemeProvider>
        <AppShell>
          <SparringPage />
        </AppShell>
      </ThemeProvider>
    );

    // Verify dark theme is restored
    expect(document.documentElement.classList.contains("theme-dark")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  // =========================================================================
  // Scenario 3: Login & Auth Session State Handling Lifecycle
  // =========================================================================
  it("SCENARIO 3: User login credential submission, auth state reflection, and logout execution", async () => {
    const user = userEvent.setup();
    window.alert = jest.fn();

    // Step 1: User visits login page and submits credentials
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: "1", role: "admin" }, success: true }),
    });

    const { unmount: unmountLogin } = render(
      <ThemeProvider>
        <LoginPage />
      </ThemeProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("아이디"), { target: { value: "1111" } });
    fireEvent.change(screen.getByPlaceholderText("비밀번호"), { target: { value: "1111" } });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "로그인" }));
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "1111", password: "1111" }),
    });

    unmountLogin();

    // Step 2: Set cookie representing authenticated session
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "accessToken=valid-jwt-token; isLoggedIn=true",
    });

    // Step 3: Render navigation showing logged in state
    render(
      <ThemeProvider>
        <Navigation />
      </ThemeProvider>
    );

    const logoutBtn = screen.getByRole("button", { name: /로그아웃/i });
    expect(logoutBtn).toBeInTheDocument();

    // Step 4: Perform logout
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    await user.click(logoutBtn);

    expect(global.fetch).toHaveBeenCalledWith("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    expect(window.alert).toHaveBeenCalledWith("로그아웃 되었습니다.");
  });

  // =========================================================================
  // Scenario 4: Navigation Expansion & Responsive Layout Lifecycle
  // =========================================================================
  it("SCENARIO 4: Sidebar navigation expansion/collapse and responsive layout adaptation", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <AppShell>
          <div>Responsive Layout Page</div>
        </AppShell>
      </ThemeProvider>
    );

    const main = screen.getByRole("main");
    expect(main).toHaveClass("md:ml-64");

    // Click collapse button
    const collapseButton = screen.getAllByRole("button").find(
      (btn) => btn.querySelector("svg") && btn.className.includes("absolute")
    );
    expect(collapseButton).toBeDefined();

    await user.click(collapseButton!);
    expect(main).toHaveClass("md:ml-24");

    // Expand sidebar back
    await user.click(collapseButton!);
    expect(main).toHaveClass("md:ml-64");

    // Test mobile drawer toggle
    const mobileMenuBtn = screen.getByRole("button", { name: "메뉴 열기" });
    await user.click(mobileMenuBtn);

    const drawer = screen.getByRole("complementary");
    expect(drawer).toBeInTheDocument();

    const mobileCloseBtn = screen.getByRole("button", { name: "메뉴 닫기" });
    await user.click(mobileCloseBtn);
  });

  // =========================================================================
  // Scenario 5: Interactive Features (Equipment, Sparring, Record Graph)
  // =========================================================================
  it("SCENARIO 5: Interactive equipment inspection modal and training history record dialog", async () => {
    const user = userEvent.setup();

    // Step 1: Equipment inspection flow
    const { unmount: unmountEquip } = render(
      <ThemeProvider>
        <Equipment />
      </ThemeProvider>
    );

    const detailButtons = screen.getAllByRole("button", { name: "자세히 보기" });
    expect(detailButtons.length).toBe(3);

    // Open first equipment item (전통 갑옷)
    await user.click(detailButtons[0]);
    expect(screen.getByText("재료")).toBeInTheDocument();
    expect(screen.getByText("가죽, 철판, 끈")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /구매하기/i })).toHaveAttribute(
      "href",
      "https://example.com/traditional-armor"
    );

    // Close equipment modal
    const closeBtn = screen.getAllByRole("button").find((btn) => btn.querySelector("svg.lucide-x"));
    await user.click(closeBtn!);
    expect(screen.queryByText("재료")).not.toBeInTheDocument();

    unmountEquip();

    // Step 2: RecordGraph inspection flow
    render(
      <ThemeProvider>
        <RecordGraph />
      </ThemeProvider>
    );

    const dayButtons = screen.getAllByRole("button", { name: /\d{4}-\d{2}-\d{2}: \d+회 수련/ });
    expect(dayButtons.length).toBeGreaterThan(500);

    // Click on a commit day
    await user.click(dayButtons[0]);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /의 수련 기록/ })).toBeInTheDocument();

    // Close dialog
    const dialogCloseBtn = screen.getByRole("button", { name: "Close" });
    await user.click(dialogCloseBtn);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
