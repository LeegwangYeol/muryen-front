/**
 * @jest-environment node
 */

import { POST as loginHandler } from "@/app/api/auth/login/route";
import { POST as logoutHandler } from "@/app/api/auth/logout/route";

// Mock next/headers cookies
const mockCookieStore = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
};

jest.mock("next/headers", () => ({
  cookies: jest.fn(async () => mockCookieStore),
}));

describe("M1 Adversarial Suite: NextAuth & Custom Auth Route Handlers", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("NextAuth Options Configuration Matrix", () => {
    it("handles missing credentials gracefully without registering GoogleProvider", () => {
      delete process.env.GOOGLE_CLIENT_ID;
      delete process.env.GOOGLE_CLIENT_SECRET;

      const mockNextAuth = jest.fn((opts) => opts);
      jest.doMock("next-auth", () => mockNextAuth);
      const mockGoogle = jest.fn();
      jest.doMock("next-auth/providers/google", () => mockGoogle);

      require("@/app/api/auth/[...nextauth]/route");
      const passedOpts = mockNextAuth.mock.calls[0][0];
      expect(passedOpts.providers).toHaveLength(0);
      expect(mockGoogle).not.toHaveBeenCalled();
    });

    it("does not register GoogleProvider if only GOOGLE_CLIENT_ID is present", () => {
      process.env.GOOGLE_CLIENT_ID = "id-without-secret";
      delete process.env.GOOGLE_CLIENT_SECRET;

      const mockNextAuth = jest.fn((opts) => opts);
      jest.doMock("next-auth", () => mockNextAuth);
      const mockGoogle = jest.fn();
      jest.doMock("next-auth/providers/google", () => mockGoogle);

      require("@/app/api/auth/[...nextauth]/route");
      const passedOpts = mockNextAuth.mock.calls[0][0];
      expect(passedOpts.providers).toHaveLength(0);
      expect(mockGoogle).not.toHaveBeenCalled();
    });

    it("does not register GoogleProvider if only GOOGLE_CLIENT_SECRET is present", () => {
      delete process.env.GOOGLE_CLIENT_ID;
      process.env.GOOGLE_CLIENT_SECRET = "secret-without-id";

      const mockNextAuth = jest.fn((opts) => opts);
      jest.doMock("next-auth", () => mockNextAuth);
      const mockGoogle = jest.fn();
      jest.doMock("next-auth/providers/google", () => mockGoogle);

      require("@/app/api/auth/[...nextauth]/route");
      const passedOpts = mockNextAuth.mock.calls[0][0];
      expect(passedOpts.providers).toHaveLength(0);
      expect(mockGoogle).not.toHaveBeenCalled();
    });

    it("registers GoogleProvider when both ID and SECRET are present", () => {
      process.env.GOOGLE_CLIENT_ID = "valid-id";
      process.env.GOOGLE_CLIENT_SECRET = "valid-secret";

      const mockNextAuth = jest.fn((opts) => opts);
      jest.doMock("next-auth", () => mockNextAuth);
      const mockGoogle = jest.fn((opts) => ({ id: "google", ...opts }));
      jest.doMock("next-auth/providers/google", () => mockGoogle);

      require("@/app/api/auth/[...nextauth]/route");
      const passedOpts = mockNextAuth.mock.calls[0][0];
      expect(passedOpts.providers).toHaveLength(1);
      expect(mockGoogle).toHaveBeenCalledWith(
        expect.objectContaining({
          clientId: "valid-id",
          clientSecret: "valid-secret",
        })
      );
    });
  });

  describe("API /api/auth/login Handler", () => {
    it("handles valid admin credentials and sets accessToken + isLoggedIn cookies", async () => {
      const request = new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "1111", password: "1111" }),
      });

      const response = await loginHandler(request);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.user).toEqual({ id: "1", role: "admin" });

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        "accessToken",
        expect.any(String),
        expect.objectContaining({ httpOnly: true, path: "/" })
      );
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        "isLoggedIn",
        "true",
        expect.objectContaining({ httpOnly: false, path: "/" })
      );
    });

    it("returns 400 Bad Request when username or password is missing or not a string", async () => {
      // Empty object
      const emptyReq = new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const res1 = await loginHandler(emptyReq);
      expect(res1.status).toBe(400);
      const json1 = await res1.json();
      expect(json1.message).toBe("Username and password are required");

      // Missing password
      const missingPassReq = new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin" }),
      });
      const res2 = await loginHandler(missingPassReq);
      expect(res2.status).toBe(400);
      const json2 = await res2.json();
      expect(json2.message).toBe("Username and password are required");

      // Non-string types
      const nonStringReq = new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: 1234, password: true }),
      });
      const res3 = await loginHandler(nonStringReq);
      expect(res3.status).toBe(400);
      const json3 = await res3.json();
      expect(json3.message).toBe("Username and password are required");
    });

    it("returns 401 on incorrect credentials", async () => {
      const request = new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "wrong", password: "user" }),
      });

      const response = await loginHandler(request);
      expect(response.status).toBe(401);

      const json = await response.json();
      expect(json.error).toBe("잘못된 아이디 또는 비밀번호입니다.");
    });

    it("returns 400 when JSON parsing fails", async () => {
      const request = new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "invalid-json",
      });

      const response = await loginHandler(request);
      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.message).toBe("Invalid JSON or request body");
    });
  });

  describe("API /api/auth/logout Handler", () => {
    it("deletes accessToken and isLoggedIn cookies and returns success", async () => {
      const response = await logoutHandler();
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);

      expect(mockCookieStore.delete).toHaveBeenCalledWith("accessToken");
      expect(mockCookieStore.delete).toHaveBeenCalledWith("isLoggedIn");
    });
  });
});
