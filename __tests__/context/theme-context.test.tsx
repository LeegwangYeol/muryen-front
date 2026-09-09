import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "@/app/context/theme-context";

// Test consumer component
function ThemeConsumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggleTheme} data-testid="toggle-button">
        Toggle
      </button>
    </div>
  );
}

describe("ThemeContext (app/context/theme-context.tsx)", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
    jest.clearAllMocks();
  });

  it("provides default 'light' theme when localStorage and media query are not dark", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme-value").textContent).toBe("light");
    expect(document.documentElement.classList.contains("theme-light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("loads stored 'dark' theme from localStorage on mount", () => {
    localStorage.setItem("theme", "dark");

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme-value").textContent).toBe("dark");
    expect(document.documentElement.classList.contains("theme-dark")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("toggles theme between light and dark when toggleTheme is called", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByTestId("toggle-button");
    const themeSpan = screen.getByTestId("theme-value");

    expect(themeSpan.textContent).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    // Toggle to dark
    await user.click(toggleBtn);
    expect(themeSpan.textContent).toBe("dark");
    expect(document.documentElement.classList.contains("theme-dark")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");

    // Toggle back to light
    await user.click(toggleBtn);
    expect(themeSpan.textContent).toBe("light");
    expect(document.documentElement.classList.contains("theme-light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("respects prefers-color-scheme dark if localStorage is empty", () => {
    // Mock matchMedia returning matches: true for dark mode
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
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme-value").textContent).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("throws an error when useTheme is used outside of ThemeProvider", () => {
    // Suppress console.error for expected React error boundary output
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<ThemeConsumer />);
    }).toThrow("useTheme must be used within a ThemeProvider");

    consoleSpy.mockRestore();
  });
});
