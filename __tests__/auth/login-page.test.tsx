import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import LoginPage, { sanitizeRedirectUrl } from "@/app/component/login-page";
import { ThemeProvider } from "@/app/context/theme-context";

describe("LoginPage & Open Redirect Protection (app/component/login-page.tsx)", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    window.history.pushState({}, "", "/login");
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  describe("sanitizeRedirectUrl logic (Open Redirect Mitigation)", () => {
    it("returns '/' for null, undefined, or empty input", () => {
      expect(sanitizeRedirectUrl(null)).toBe("/");
      expect(sanitizeRedirectUrl("")).toBe("/");
    });

    it("rejects absolute external URLs", () => {
      expect(sanitizeRedirectUrl("https://malicious-phishing.com")).toBe("/");
      expect(sanitizeRedirectUrl("http://evil.com/login")).toBe("/");
    });

    it("rejects protocol-relative URLs (//evil.com)", () => {
      expect(sanitizeRedirectUrl("//evil.com")).toBe("/");
      expect(sanitizeRedirectUrl("///evil.com")).toBe("/");
    });

    it("rejects backslash evasion attempts (/\\evil.com)", () => {
      expect(sanitizeRedirectUrl("/\\evil.com")).toBe("/");
    });

    it("rejects script scheme URIs", () => {
      expect(sanitizeRedirectUrl("javascript:alert(1)")).toBe("/");
      expect(sanitizeRedirectUrl("data:text/html,<script>alert(1)</script>")).toBe("/");
    });

    it("rejects control character and whitespace bypass attempts (/\\t, /\\r, /\\n, /\\0, / )", () => {
      expect(sanitizeRedirectUrl("/\t/evil.com")).toBe("/");
      expect(sanitizeRedirectUrl("/\r/evil.com")).toBe("/");
      expect(sanitizeRedirectUrl("/\n/evil.com")).toBe("/");
      expect(sanitizeRedirectUrl("/\0/evil.com")).toBe("/");
      expect(sanitizeRedirectUrl("/ /evil.com")).toBe("/");
    });

    it("allows valid relative internal paths", () => {
      expect(sanitizeRedirectUrl("/daily")).toBe("/daily");
      expect(sanitizeRedirectUrl("/mypage")).toBe("/mypage");
      expect(sanitizeRedirectUrl("/mypage?tab=records")).toBe("/mypage?tab=records");
      expect(sanitizeRedirectUrl("/daily/records/123?filter=all")).toBe(
        "/daily/records/123?filter=all"
      );
    });
  });

  describe("Form Accessibility & In-Flight Submit State", () => {
    const renderLoginPage = () =>
      render(
        <ThemeProvider>
          <LoginPage />
        </ThemeProvider>
      );

    it("provides accessible aria-label attributes on username and password inputs", () => {
      renderLoginPage();

      const usernameInput = screen.getByLabelText("아이디");
      const passwordInput = screen.getByLabelText("비밀번호");

      expect(usernameInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(usernameInput).toHaveAttribute("placeholder", "아이디");
      expect(passwordInput).toHaveAttribute("placeholder", "비밀번호");
      expect(usernameInput).toHaveAttribute("id", "username");
      expect(usernameInput).toHaveAttribute("name", "username");
      expect(usernameInput).toHaveAttribute("autoComplete", "username");
      expect(passwordInput).toHaveAttribute("id", "password");
      expect(passwordInput).toHaveAttribute("name", "password");
      expect(passwordInput).toHaveAttribute("autoComplete", "current-password");
    });

    it("disables submit button and inputs while login request is in flight", async () => {
      let resolveFetch: (value: any) => void = () => {};
      (global.fetch as jest.Mock).mockReturnValue(
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
      );

      renderLoginPage();

      const usernameInput = screen.getByLabelText("아이디");
      const passwordInput = screen.getByLabelText("비밀번호");
      const submitBtn = screen.getByRole("button", { name: "로그인" });

      expect(submitBtn).not.toBeDisabled();
      expect(usernameInput).not.toBeDisabled();
      expect(passwordInput).not.toBeDisabled();

      fireEvent.change(usernameInput, { target: { value: "1111" } });
      fireEvent.change(passwordInput, { target: { value: "1111" } });

      await act(async () => {
        fireEvent.click(submitBtn);
      });

      // In flight state: button and inputs are disabled
      expect(submitBtn).toBeDisabled();
      expect(usernameInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();

      // Resolve fetch response
      await act(async () => {
        resolveFetch({
          ok: true,
          json: async () => ({ user: { id: "1", role: "admin" } }),
        });
      });

      expect(global.fetch).toHaveBeenCalledWith("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "1111", password: "1111" }),
      });
    });

    it("re-enables inputs and displays alert on login failure", async () => {
      const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
      const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: "로그인에 실패했습니다." }),
      });

      renderLoginPage();

      const usernameInput = screen.getByLabelText("아이디");
      const passwordInput = screen.getByLabelText("비밀번호");
      const submitBtn = screen.getByRole("button", { name: "로그인" });

      fireEvent.change(usernameInput, { target: { value: "wrong" } });
      fireEvent.change(passwordInput, { target: { value: "pass" } });

      await act(async () => {
        fireEvent.click(submitBtn);
      });

      expect(alertSpy).toHaveBeenCalledWith("로그인에 실패했습니다. 다시 시도해주세요.");
      // After failure, button and inputs are re-enabled
      expect(submitBtn).not.toBeDisabled();
      expect(usernameInput).not.toBeDisabled();
      expect(passwordInput).not.toBeDisabled();

      alertSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });
});
