import { TokenService } from "@/lib/token-service";
import { User } from "@/types/auth";
import { SignJWT } from "jose";

describe("TokenService", () => {
  const adminUser: User = { id: "1", role: "admin" };
  const standardUser: User = { id: "2", role: "user" };

  it("generates a valid JWT token string for an admin user", async () => {
    const token = await TokenService.generateToken(adminUser);
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3); // Standard JWT format (header.payload.signature)
  });

  it("generates a valid JWT token string for a standard user", async () => {
    const token = await TokenService.generateToken(standardUser);
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);
  });

  it("verifies a valid token and returns the user payload", async () => {
    const token = await TokenService.generateToken(adminUser);
    const verifiedUser = await TokenService.verifyToken(token);

    expect(verifiedUser).not.toBeNull();
    expect(verifiedUser?.id).toBe("1");
    expect(verifiedUser?.role).toBe("admin");
  });

  it("verifies a standard user token correctly", async () => {
    const token = await TokenService.generateToken(standardUser);
    const verifiedUser = await TokenService.verifyToken(token);

    expect(verifiedUser).not.toBeNull();
    expect(verifiedUser?.id).toBe("2");
    expect(verifiedUser?.role).toBe("user");
  });

  it("returns null when verifying a malformed token", async () => {
    const result = await TokenService.verifyToken("invalid.token.string");
    expect(result).toBeNull();
  });

  it("returns null when verifying an empty token string", async () => {
    const result = await TokenService.verifyToken("");
    expect(result).toBeNull();
  });

  it("returns null when verifying a token signed with a different key", async () => {
    const foreignKey = new TextEncoder().encode("completely-different-secret-key-12345");
    const foreignToken = await new SignJWT({ sub: "99", role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(foreignKey);

    const result = await TokenService.verifyToken(foreignToken);
    expect(result).toBeNull();
  });
});
