import { AuthService } from "@/lib/auth-service";
import { TokenService } from "@/lib/token-service";

describe("AuthService", () => {
  describe("login", () => {
    it("successfully authenticates admin credentials (1111 / 1111)", async () => {
      const response = await AuthService.login({
        username: "1111",
        password: "1111",
      });

      expect(response).not.toBeNull();
      expect(response?.user).toEqual({
        id: "1",
        role: "admin",
      });
      expect(typeof response?.accessToken).toBe("string");

      // Verify token integrity with TokenService
      const validated = await TokenService.verifyToken(response!.accessToken);
      expect(validated?.id).toBe("1");
      expect(validated?.role).toBe("admin");
    });

    it("successfully authenticates standard user credentials (2222 / 2222)", async () => {
      const response = await AuthService.login({
        username: "2222",
        password: "2222",
      });

      expect(response).not.toBeNull();
      expect(response?.user).toEqual({
        id: "2",
        role: "user",
      });
      expect(typeof response?.accessToken).toBe("string");

      const validated = await TokenService.verifyToken(response!.accessToken);
      expect(validated?.id).toBe("2");
      expect(validated?.role).toBe("user");
    });

    it("returns null for non-existent username", async () => {
      const response = await AuthService.login({
        username: "9999",
        password: "password",
      });

      expect(response).toBeNull();
    });

    it("returns null for wrong password", async () => {
      const response = await AuthService.login({
        username: "1111",
        password: "wrong-password",
      });

      expect(response).toBeNull();
    });

    it("returns null for empty credentials", async () => {
      const response = await AuthService.login({
        username: "",
        password: "",
      });

      expect(response).toBeNull();
    });
  });

  describe("validateToken", () => {
    it("validates and decodes a valid token", async () => {
      const loginRes = await AuthService.login({
        username: "1111",
        password: "1111",
      });
      expect(loginRes).not.toBeNull();

      const user = await AuthService.validateToken(loginRes!.accessToken);
      expect(user).toEqual({
        id: "1",
        role: "admin",
      });
    });

    it("returns null for invalid or expired token", async () => {
      const user = await AuthService.validateToken("invalid.bearer.token");
      expect(user).toBeNull();
    });
  });
});
