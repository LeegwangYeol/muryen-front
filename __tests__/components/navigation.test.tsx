import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/app/context/theme-context";
import Navigation from "@/app/component/navigation";
import { CONTACT } from "@/lib/contact";

describe("Navigation Component (app/component/navigation.tsx)", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = "";
    jest.clearAllMocks();
  });

  it("renders all key navigation links", () => {
    render(
      <ThemeProvider>
        <Navigation />
      </ThemeProvider>
    );

    expect(screen.getByRole("link", { name: /홈/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /소개/i })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: /24반/i })).toHaveAttribute("href", "/basic-sense");
    expect(screen.getByRole("link", { name: /기본기/i })).toHaveAttribute("href", "/basic");
    expect(screen.getByRole("link", { name: /투로/i })).toHaveAttribute("href", "/pattern");
    expect(screen.getByRole("link", { name: /베기/i })).toHaveAttribute("href", "/cutting");
    expect(screen.getByRole("link", { name: /대련/i })).toHaveAttribute("href", "/sparring");
    expect(screen.getByRole("link", { name: /수련일지/i })).toHaveAttribute("href", "/daily");
    expect(screen.getByRole("link", { name: /입회 안내/i })).toHaveAttribute("href", "/#inquiry");
    expect(screen.getByRole("link", { name: /나의 수련/i })).toHaveAttribute("href", "/mypage");
  });

  it("toggles sidebar expanded/collapsed state and calls onExpand callback", async () => {
    const user = userEvent.setup();
    const handleExpand = jest.fn();

    const { container } = render(
      <ThemeProvider>
        <Navigation onExpand={handleExpand} />
      </ThemeProvider>
    );

    const nav = container.querySelector("nav");
    expect(nav).toHaveClass("w-64");

    // Click collapse button
    const collapseButton = screen.getAllByRole("button").find(
      (btn) => btn.className.includes("absolute")
    );
    expect(collapseButton).toBeDefined();

    await user.click(collapseButton!);

    expect(handleExpand).toHaveBeenCalledWith(false);
    expect(nav).toHaveClass("w-24");

    // Click expand button
    await user.click(collapseButton!);
    expect(handleExpand).toHaveBeenCalledWith(true);
    expect(nav).toHaveClass("w-64");
  });

  it("toggles theme when theme toggle button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <Navigation />
      </ThemeProvider>
    );

    const themeToggleBtn = screen.getAllByRole("button", {
      name: "다크 모드로 전환",
    })[0];
    expect(themeToggleBtn).toBeInTheDocument();

    await user.click(themeToggleBtn);

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("renders external YouTube link pointing to CONTACT.youtube", () => {
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

  it("displays logout button when authenticated cookie is present and handles logout", async () => {
    const user = userEvent.setup();
    window.alert = jest.fn();

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "accessToken=valid-jwt-token",
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
    expect(window.location.pathname).toBe("/");
  });

  it("does not render any VideoModal elements or orphaned video containers in bottom bar", () => {
    const { container } = render(
      <ThemeProvider>
        <Navigation />
      </ThemeProvider>
    );

    // Ensure no iframe, video modal, or unexpected modal backdrop exists in nav
    const bottomContainer = container.querySelector(".absolute.bottom-4");
    expect(bottomContainer).toBeInTheDocument();
    expect(bottomContainer?.querySelector("iframe")).toBeNull();
    expect(bottomContainer?.querySelector("[data-testid='video-modal']")).toBeNull();
  });
});
