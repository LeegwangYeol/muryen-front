import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/app/context/theme-context";
import { AppShell } from "@/components/layout/app-shell";

describe("AppShell Layout Component (components/layout/app-shell.tsx)", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders skip link with href '#main' for accessibility", () => {
    render(
      <ThemeProvider>
        <AppShell>
          <div>Page Content</div>
        </AppShell>
      </ThemeProvider>
    );

    const skipLink = screen.getByRole("link", { name: "본문으로 건너뛰기" });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main");
  });

  it("renders main container with id 'main' and renders children", () => {
    render(
      <ThemeProvider>
        <AppShell>
          <div data-testid="test-child-page">Welcome to Muryen</div>
        </AppShell>
      </ThemeProvider>
    );

    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main");
    expect(screen.getByTestId("test-child-page")).toBeInTheDocument();
  });

  it("includes the Footer component inside the main landmark", () => {
    render(
      <ThemeProvider>
        <AppShell>
          <div>Body</div>
        </AppShell>
      </ThemeProvider>
    );

    // Footer contains copyright and contact info
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("applies dark background class when dark theme is active", () => {
    localStorage.setItem("theme", "dark");

    const { container } = render(
      <ThemeProvider>
        <AppShell>
          <div>Body</div>
        </AppShell>
      </ThemeProvider>
    );

    const rootWrapper = container.firstChild as HTMLElement;
    expect(rootWrapper).toHaveClass("bg-[#410707]/90");
  });

  it("applies light background class when light theme is active", () => {
    localStorage.setItem("theme", "light");

    const { container } = render(
      <ThemeProvider>
        <AppShell>
          <div>Body</div>
        </AppShell>
      </ThemeProvider>
    );

    const rootWrapper = container.firstChild as HTMLElement;
    expect(rootWrapper).toHaveClass("bg-[#f0e8e8]/95");
  });

  it("adjusts main margin when sidebar navigation expands or collapses", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <AppShell>
          <div>Body</div>
        </AppShell>
      </ThemeProvider>
    );

    const main = screen.getByRole("main");
    expect(main).toHaveClass("md:ml-64");

    // The collapse button in Navigation
    const chevronButtons = screen.getAllByRole("button");
    const collapseButton = chevronButtons.find(
      (btn) => btn.querySelector("svg") && btn.className.includes("absolute")
    );

    if (collapseButton) {
      await user.click(collapseButton);
      expect(main).toHaveClass("md:ml-24");
    }
  });
});
