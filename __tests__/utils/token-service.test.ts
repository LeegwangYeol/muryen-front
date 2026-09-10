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

  it("returns null when token payload has empty claims (prevents truthy object bypass)", async () => {
    const emptyPayloadToken = await new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(new TextEncoder().encode("your-secret-key"));

    const result = await TokenService.verifyToken(emptyPayloadToken);
    expect(result).toBeNull();
  });

  it("returns null when token sub is not a string", async () => {
    const numericSubToken = await new SignJWT({ sub: 12345 as any, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(new TextEncoder().encode("your-secret-key"));

    const result = await TokenService.verifyToken(numericSubToken);
    expect(result).toBeNull();
  });

  it("returns null when token role is invalid", async () => {
    const invalidRoleToken = await new SignJWT({ sub: "1", role: "superadmin" as any })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(new TextEncoder().encode("your-secret-key"));

    const result = await TokenService.verifyToken(invalidRoleToken);
    expect(result).toBeNull();
  });

  it("guards missing JWT_SECRET in production when generating token", async () => {
    const originalEnv = process.env.NODE_ENV;
    const originalSecret = process.env.JWT_SECRET;
    try {
      (process.env as any).NODE_ENV = "production";
      delete process.env.JWT_SECRET;

      await expect(TokenService.generateToken(adminUser)).rejects.toThrow(
        "JWT_SECRET environment variable is missing in production"
      );
    } finally {
      (process.env as any).NODE_ENV = originalEnv;
      if (originalSecret) {
        process.env.JWT_SECRET = originalSecret;
      }
    }
  });

  it("returns null when JWT_SECRET is missing in production when verifying token", async () => {
    const token = await TokenService.generateToken(adminUser);
    const originalEnv = process.env.NODE_ENV;
    const originalSecret = process.env.JWT_SECRET;
    try {
      (process.env as any).NODE_ENV = "production";
      delete process.env.JWT_SECRET;

      const result = await TokenService.verifyToken(token);
      expect(result).toBeNull();
    } finally {
      (process.env as any).NODE_ENV = originalEnv;
      if (originalSecret) {
        process.env.JWT_SECRET = originalSecret;
      }
    }
  });
});
