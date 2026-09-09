/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import { AuthService } from "@/lib/auth-service";

jest.mock("@/lib/auth-service", () => ({
  AuthService: {
    validateToken: jest.fn(),
  },
}));

describe("Middleware Route Guard & Redirection (middleware.ts)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Public Route Access", () => {
    it("allows unrestricted access to public routes without redirect", async () => {
      const publicPaths = ["/", "/about", "/basic", "/cutting", "/sparring", "/login"];

      for (const path of publicPaths) {
        const req = new NextRequest(`http://localhost:3000${path}`);
        const res = await middleware(req);

        // NextResponse.next() returns a response without 307/308 or redirect Location
        expect(res.headers.get("location")).toBeNull();
        expect(res.status).toBe(200);
      }
    });
  });

  describe("Protected Route Guard (/daily)", () => {
    it("redirects to /login with encoded redirect query param when accessToken is missing", async () => {
      const req = new NextRequest("http://localhost:3000/daily");
      const res = await middleware(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      expect(location).toBe("http://localhost:3000/login?redirect=%2Fdaily");
    });

    it("preserves nested protected subpaths in redirect query parameter", async () => {
      const req = new NextRequest("http://localhost:3000/daily/records/123");
      const res = await middleware(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      expect(location).toBe("http://localhost:3000/login?redirect=%2Fdaily%2Frecords%2F123");
    });

    it("preserves query parameters in redirect query parameter when unauthenticated", async () => {
      const req = new NextRequest("http://localhost:3000/daily?tab=schedule");
      const res = await middleware(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      expect(location).toBe("http://localhost:3000/login?redirect=%2Fdaily%3Ftab%3Dschedule");
    });

    it("preserves complex nested subpaths and multiple query parameters", async () => {
      const req = new NextRequest("http://localhost:3000/daily/sub?tab=foo&filter=recent");
      const res = await middleware(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      expect(location).toBe("http://localhost:3000/login?redirect=%2Fdaily%2Fsub%3Ftab%3Dfoo%26filter%3Drecent");
    });

    it("redirects and purges cookies when accessToken is invalid or expired", async () => {
      (AuthService.validateToken as jest.Mock).mockResolvedValueOnce(null);

      const req = new NextRequest("http://localhost:3000/daily", {
        headers: {
          cookie: "accessToken=invalid_token; isLoggedIn=true",
        },
      });

      const res = await middleware(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      expect(location).toBe("http://localhost:3000/login?redirect=%2Fdaily");

      // Verify cookies are deleted
      const setCookieHeader = res.headers.get("set-cookie") || "";
      expect(setCookieHeader).toContain("accessToken=;");
      expect(setCookieHeader).toContain("isLoggedIn=;");
    });

    it("redirects with query params preserved when accessToken is invalid or expired", async () => {
      (AuthService.validateToken as jest.Mock).mockResolvedValueOnce(null);

      const req = new NextRequest("http://localhost:3000/daily/sparring?tab=schedule&page=1", {
        headers: {
          cookie: "accessToken=invalid_token; isLoggedIn=true",
        },
      });

      const res = await middleware(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      expect(location).toBe(
        "http://localhost:3000/login?redirect=%2Fdaily%2Fsparring%3Ftab%3Dschedule%26page%3D1"
      );

      // Verify cookies are deleted
      const setCookieHeader = res.headers.get("set-cookie") || "";
      expect(setCookieHeader).toContain("accessToken=;");
      expect(setCookieHeader).toContain("isLoggedIn=;");
    });

    it("allows access to /daily when accessToken is valid and verified", async () => {
      (AuthService.validateToken as jest.Mock).mockResolvedValueOnce({
        id: "1",
        role: "admin",
      });

      const req = new NextRequest("http://localhost:3000/daily", {
        headers: {
          cookie: "accessToken=valid_jwt_token",
        },
      });

      const res = await middleware(req);

      expect(res.headers.get("location")).toBeNull();
      expect(res.status).toBe(200);
      expect(AuthService.validateToken).toHaveBeenCalledWith("valid_jwt_token");
    });
  });
});
