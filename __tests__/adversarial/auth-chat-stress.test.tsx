import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/app/context/theme-context";
import { ChatWidget } from "@/components/chat/chat-widget";
import { sanitizeRedirectUrl } from "@/app/component/login-page";
import { TokenService } from "@/lib/token-service";
import { User } from "@/types/auth";
import * as tokki from "@/lib/tokki";
import { SignJWT } from "jose";

jest.mock("@/lib/tokki", () => ({
  TOKKI_WIDGET_ID: "muryen",
  loadWidget: jest.fn(),
  ask: jest.fn(),
}));

describe("Adversarial Empirical Stress-Testing: Auth & Chat Remediations", () => {
  // =========================================================================
  // 1. NextAuth Fallback Secret & Configuration Stress-Testing
  // =========================================================================
  describe("1. NextAuth Fallback Secret & Configuration Stress-Testing", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it("uses exact fallback secret when process.env.NEXTAUTH_SECRET is undefined", () => {
      delete process.env.NEXTAUTH_SECRET;

      const mockNextAuth = jest.fn((options) => options);
      jest.doMock("next-auth", () => mockNextAuth);
      jest.doMock("next-auth/providers/google", () => jest.fn());

      require("@/app/api/auth/[...nextauth]/route");
      const passedOptions = mockNextAuth.mock.calls[0][0];

      expect(passedOptions.secret).toBe("muryen-production-fallback-secret-2026-auth");
      expect(passedOptions.secret.length).toBeGreaterThanOrEqual(32);
    });

    it("prioritizes process.env.NEXTAUTH_SECRET when explicitly defined", () => {
      process.env.NEXTAUTH_SECRET = "production-override-super-secret-key-32chars!";

      const mockNextAuth = jest.fn((options) => options);
      jest.doMock("next-auth", () => mockNextAuth);
      jest.doMock("next-auth/providers/google", () => jest.fn());

      require("@/app/api/auth/[...nextauth]/route");
      const passedOptions = mockNextAuth.mock.calls[0][0];

      expect(passedOptions.secret).toBe("production-override-super-secret-key-32chars!");
    });

    it("falls back gracefully when NEXTAUTH_SECRET is an empty string", () => {
      process.env.NEXTAUTH_SECRET = "";

      const mockNextAuth = jest.fn((options) => options);
      jest.doMock("next-auth", () => mockNextAuth);
      jest.doMock("next-auth/providers/google", () => jest.fn());

      require("@/app/api/auth/[...nextauth]/route");
      const passedOptions = mockNextAuth.mock.calls[0][0];

      expect(passedOptions.secret).toBe("muryen-production-fallback-secret-2026-auth");
    });

    it("handles anomalous JWT callback account payloads safely", async () => {
      const mockNextAuth = jest.fn((options) => options);
      jest.doMock("next-auth", () => mockNextAuth);
      jest.doMock("next-auth/providers/google", () => jest.fn());

      require("@/app/api/auth/[...nextauth]/route");
      const passedOptions = mockNextAuth.mock.calls[0][0];
      const jwtCallback = passedOptions.callbacks?.jwt;

      // Case: Account without access_token
      const res1 = await jwtCallback({ token: { sub: "123" }, account: {} as any, user: {} as any });
      expect(res1).toEqual({ sub: "123", accessToken: undefined });

      // Case: Undefined account
      const res2 = await jwtCallback({ token: { sub: "123" }, account: undefined as any, user: {} as any });
      expect(res2).toEqual({ sub: "123" });
    });
  });

  // =========================================================================
  // 2. TokenService Cryptographic Fallback & Claims Stress-Testing
  // =========================================================================
  describe("2. TokenService Cryptographic Fallback & Claims Stress-Testing", () => {
    const adminUser: User = { id: "admin-101", role: "admin" };
    const standardUser: User = { id: "user-202", role: "user" };
    const originalEnv = process.env.NODE_ENV;
    const originalSecret = process.env.JWT_SECRET;

    afterEach(() => {
      (process.env as any).NODE_ENV = originalEnv;
      if (originalSecret !== undefined) {
        process.env.JWT_SECRET = originalSecret;
      } else {
        delete process.env.JWT_SECRET;
      }
    });

    it("operates normally in production when JWT_SECRET is undefined", async () => {
      (process.env as any).NODE_ENV = "production";
      delete process.env.JWT_SECRET;

      const token = await TokenService.generateToken(adminUser);
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);

      const verified = await TokenService.verifyToken(token);
      expect(verified).toEqual({ id: "admin-101", role: "admin" });
    });

    it("signs and verifies tokens with custom JWT_SECRET when defined", async () => {
      process.env.JWT_SECRET = "custom-high-entropy-jwt-secret-key-for-muryen-2026";

      const token = await TokenService.generateToken(standardUser);
      const verified = await TokenService.verifyToken(token);
      expect(verified).toEqual({ id: "user-202", role: "user" });
    });

    it("enforces strict cryptographic isolation between fallback and custom secrets", async () => {
      // 1. Generate token with fallback secret
      delete process.env.JWT_SECRET;
      const fallbackToken = await TokenService.generateToken(adminUser);

      // 2. Set custom secret and attempt verification -> MUST FAIL (null)
      process.env.JWT_SECRET = "different-secret-key-99999999999999";
      const crossVerified1 = await TokenService.verifyToken(fallbackToken);
      expect(crossVerified1).toBeNull();

      // 3. Generate token with custom secret
      const customToken = await TokenService.generateToken(adminUser);

      // 4. Remove secret (revert to fallback) and attempt verification -> MUST FAIL (null)
      delete process.env.JWT_SECRET;
      const crossVerified2 = await TokenService.verifyToken(customToken);
      expect(crossVerified2).toBeNull();
    });

    it("rejects tokens with expired timestamps", async () => {
      delete process.env.JWT_SECRET;
      const fallbackKey = new TextEncoder().encode("muryen-fallback-jwt-secret-key-2026");

      // Expired 10 seconds ago
      const expiredToken = await new SignJWT({ sub: "admin-101", role: "admin" })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("-10s")
        .sign(fallbackKey);

      const result = await TokenService.verifyToken(expiredToken);
      expect(result).toBeNull();
    });

    it("rejects token tampering on payload and signature", async () => {
      delete process.env.JWT_SECRET;
      const token = await TokenService.generateToken(standardUser);
      const parts = token.split(".");

      // Tamper signature by appending a character
      const tamperedSigToken = `${parts[0]}.${parts[1]}.${parts[2]}x`;
      expect(await TokenService.verifyToken(tamperedSigToken)).toBeNull();

      // Tamper payload (decode, modify role to admin, base64url re-encode without resigning)
      const decodedPayload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
      decodedPayload.role = "admin";
      const forgedPayload = Buffer.from(JSON.stringify(decodedPayload)).toString("base64url");
      const forgedToken = `${parts[0]}.${forgedPayload}.${parts[2]}`;

      expect(await TokenService.verifyToken(forgedToken)).toBeNull();
    });

    it("strictly validates claim types and rejects unauthorized roles", async () => {
      delete process.env.JWT_SECRET;
      const fallbackKey = new TextEncoder().encode("muryen-fallback-jwt-secret-key-2026");

      const invalidRoles = [
        "superadmin",
        "root",
        "guest",
        "ADMIN",
        "USER",
        "",
        null,
        123,
        true,
        {},
        [],
      ];

      for (const role of invalidRoles) {
        const token = await new SignJWT({ sub: "user-1", role: role as any })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("1h")
          .sign(fallbackKey);

        const res = await TokenService.verifyToken(token);
        expect(res).toBeNull();
      }

      const invalidSubs = ["", null, undefined, 12345, true, {}, []];
      for (const sub of invalidSubs) {
        const token = await new SignJWT({ sub: sub as any, role: "user" })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("1h")
          .sign(fallbackKey);

        const res = await TokenService.verifyToken(token);
        expect(res).toBeNull();
      }
    });
  });

  // =========================================================================
  // 3. Login Open-Redirect Sanitization Adversarial Payloads
  // =========================================================================
  describe("3. Login Open-Redirect Sanitization Adversarial Payloads", () => {
    const baseOrigin = "https://muryen-front.vercel.app";

    it("neutralizes standard protocol-relative and evil scheme attacks", () => {
      const maliciousPayloads = [
        // Protocol-relative
        "//evil.com",
        "//evil.com/phish",
        "///evil.com",
        "////evil.com",
        "//localhost:8080",
        // Backslash bypasses
        "/\\evil.com",
        "/\\/evil.com",
        "/\\\\evil.com",
        "\\evil.com",
        "\\\\evil.com",
        "\\/evil.com",
        // Script / Data schemes
        "javascript:alert(document.cookie)",
        "javascript://alert(1)",
        "java\0script:alert(1)",
        "data:text/html,<script>alert(1)</script>",
        "vbscript:msgbox(1)",
        "file:///etc/passwd",
        "blob:https://evil.com/uuid",
        // External URLs
        "https://evil.com",
        "http://evil.com",
        "ftp://evil.com",
        // Empty / Whitespace
        "",
        " ",
        "   ",
        "\t",
        "\n",
        "\r\n",
        // Unicode non-slash variations that do not start with ASCII '/'
        "／／evil.com",
        "∕∕evil.com",
      ];

      for (const payload of maliciousPayloads) {
        const sanitized = sanitizeRedirectUrl(payload);
        expect(sanitized).toBe("/");
      }
    });

    it("safely handles null and undefined inputs", () => {
      expect(sanitizeRedirectUrl(null)).toBe("/");
      expect(sanitizeRedirectUrl(undefined as any)).toBe("/");
    });

    it("allows valid internal application paths and search queries", () => {
      const safePaths = [
        "/",
        "/login",
        "/daily",
        "/mypage",
        "/equipment",
        "/pattern",
        "/sparring",
        "/about",
        "/mypage?tab=records&page=2",
        "/daily/edit?id=42#notes",
        "/reference?search=무예도보통지",
      ];

      for (const path of safePaths) {
        expect(sanitizeRedirectUrl(path)).toBe(path);
      }
    });

    it("confirms that Unicode slash-like paths remain confined to the origin", () => {
      // Inputs like "/\uFF0F\uFF0Fevil.com" start with ASCII '/' and are not '//' or '/\'
      // When resolved by WHATWG URL standard, verify they DO NOT escape origin
      const unicodeSlashPath = "/\uFF0F\uFF0Fevil.com";
      const sanitized = sanitizeRedirectUrl(unicodeSlashPath);
      const resolved = new URL(sanitized, baseOrigin);
      expect(resolved.origin).toBe(baseOrigin);
    });

    it("safely prevents control character (\\t, \\r, \\n) bypasses and neutralizes open redirects", () => {
      // In the WHATWG URL Standard (Section 4.3), browsers strip tab (\t), CR (\r), and LF (\n).
      // sanitizeRedirectUrl strips control characters and validates that the path does not start with '//' or '/\',
      // safely neutralizing evasion payloads to "/" and keeping resolution confined to baseOrigin.
      const controlCharPayloads = [
        "/\t/evil.com",
        "/\r/evil.com",
        "/\n/evil.com",
        "/\t\\evil.com",
        "/\r\\evil.com",
        "/\n\\evil.com",
      ];

      for (const payload of controlCharPayloads) {
        const sanitized = sanitizeRedirectUrl(payload);

        // 1. Verify that sanitizeRedirectUrl safely neutralizes the control character bypass to "/":
        expect(sanitized).toBe("/");

        // 2. Verify that when resolved against baseOrigin, it remains confined to baseOrigin:
        const resolved = new URL(sanitized, baseOrigin);
        expect(resolved.origin).toBe(baseOrigin);
      }
    });
  });

  // =========================================================================
  // 4. Tokki Chat Defensive Masking for Streaming Chunk Edge Cases
  // =========================================================================
  describe("4. Tokki Chat Defensive Masking for Streaming Chunk Edge Cases", () => {
    beforeEach(() => {
      localStorage.clear();
      jest.clearAllMocks();
      (tokki.loadWidget as jest.Mock).mockResolvedValue({
        persona: {
          name: "무련봇",
          description: "온라인 · 안내",
          welcome_message: "무련에 오신 것을 환영합니다.",
          questions: ["무련은 어떤 곳인가요?"],
        },
        threadId: "test-thread-id",
        messages: [],
      });
    });

    it("defensively masks fragmented streaming chunks containing [LLM error]", async () => {
      const user = userEvent.setup();

      // Simulate token-by-token streaming fragmentation: "[LLM" -> " error]" -> " 500 fail"
      (tokki.ask as jest.Mock).mockImplementation(async ({ onToken }) => {
        onToken("[LLM");
        await new Promise((r) => setTimeout(r, 10));
        onToken(" error]");
        await new Promise((r) => setTimeout(r, 10));
        onToken(" server failure trace");
        return "[LLM error] server failure trace";
      });

      render(
        <ThemeProvider>
          <ChatWidget />
        </ThemeProvider>
      );

      await user.click(screen.getByRole("button", { name: "채팅 도우미 열기" }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText("메시지를 입력하세요…")).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText("메시지를 입력하세요…");
      await user.type(input, "무련 소개{enter}");

      await waitFor(() => {
        expect(
          screen.getByText("AI 도우미가 현재 점검 중입니다. 잠시 후 다시 이용해 주세요.")
        ).toBeInTheDocument();
      });

      // Confirm raw error fragments are masked
      expect(screen.queryByText(/server failure trace/)).toBeNull();
      expect(screen.queryByText(/\[LLM error\]/)).toBeNull();
    });

    it("defensively masks fragmented streaming chunks containing insufficient_quota", async () => {
      const user = userEvent.setup();

      // Simulate split token: "insufficient_" -> "quota"
      (tokki.ask as jest.Mock).mockImplementation(async ({ onToken }) => {
        onToken('{"error": "insufficient_');
        await new Promise((r) => setTimeout(r, 10));
        onToken('quota", "code": 429}');
        return '{"error": "insufficient_quota", "code": 429}';
      });

      render(
        <ThemeProvider>
          <ChatWidget />
        </ThemeProvider>
      );

      await user.click(screen.getByRole("button", { name: "채팅 도우미 열기" }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText("메시지를 입력하세요…")).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText("메시지를 입력하세요…");
      await user.type(input, "질문{enter}");

      await waitFor(() => {
        expect(
          screen.getByText("AI 도우미가 현재 점검 중입니다. 잠시 후 다시 이용해 주세요.")
        ).toBeInTheDocument();
      });

      expect(screen.queryByText(/insufficient_quota/)).toBeNull();
    });

    it("masks error when mixed with initial valid text chunks", async () => {
      const user = userEvent.setup();

      (tokki.ask as jest.Mock).mockImplementation(async ({ onToken }) => {
        onToken("안녕하세요! ");
        await new Promise((r) => setTimeout(r, 10));
        onToken("[LLM error] unexpected backend crash");
        return "안녕하세요! [LLM error] unexpected backend crash";
      });

      render(
        <ThemeProvider>
          <ChatWidget />
        </ThemeProvider>
      );

      await user.click(screen.getByRole("button", { name: "채팅 도우미 열기" }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText("메시지를 입력하세요…")).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText("메시지를 입력하세요…");
      await user.type(input, "테스트{enter}");

      await waitFor(() => {
        expect(
          screen.getByText("AI 도우미가 현재 점검 중입니다. 잠시 후 다시 이용해 주세요.")
        ).toBeInTheDocument();
      });

      expect(screen.queryByText(/unexpected backend crash/)).toBeNull();
    });

    it("handles empty string responses cleanly without breaking", async () => {
      const user = userEvent.setup();

      (tokki.ask as jest.Mock).mockImplementation(async ({ onToken }) => {
        onToken("");
        return "";
      });

      render(
        <ThemeProvider>
          <ChatWidget />
        </ThemeProvider>
      );

      await user.click(screen.getByRole("button", { name: "채팅 도우미 열기" }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText("메시지를 입력하세요…")).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText("메시지를 입력하세요…");
      await user.type(input, "빈 응답 테스트{enter}");

      await waitFor(() => {
        expect(screen.getByText("(빈 응답)")).toBeInTheDocument();
      });
    });

    it("handles network rejection gracefully with error banner and re-enabled input", async () => {
      const user = userEvent.setup();

      (tokki.ask as jest.Mock).mockRejectedValue(new Error("Network connection lost"));

      render(
        <ThemeProvider>
          <ChatWidget />
        </ThemeProvider>
      );

      await user.click(screen.getByRole("button", { name: "채팅 도우미 열기" }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText("메시지를 입력하세요…")).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText("메시지를 입력하세요…");
      await user.type(input, "네트워크 에러 테스트{enter}");

      await waitFor(() => {
        expect(
          screen.getByText("답변을 받지 못했어요. 네트워크를 확인하고 다시 시도해 주세요.")
        ).toBeInTheDocument();
      });

      // Input should be re-enabled after failure
      expect(screen.getByPlaceholderText("메시지를 입력하세요…")).not.toBeDisabled();
    });
  });
});
