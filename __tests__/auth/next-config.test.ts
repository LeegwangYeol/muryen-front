import nextConfig from "@/next.config";

describe("Next.js Configuration Security Hardening (next.config.ts)", () => {
  it("disables the X-Powered-By header", () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });

  it("enables React Strict Mode", () => {
    expect(nextConfig.reactStrictMode).toBe(true);
  });

  it("configures HTTP security headers for all paths (/:path*)", async () => {
    expect(nextConfig.headers).toBeDefined();
    const headersConfig = await nextConfig.headers!();

    expect(headersConfig).toHaveLength(1);
    const globalRule = headersConfig[0];
    expect(globalRule.source).toBe("/:path*");

    const headerMap = new Map(
      globalRule.headers.map((h: { key: string; value: string }) => [h.key, h.value])
    );

    expect(headerMap.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headerMap.get("X-Frame-Options")).toBe("SAMEORIGIN");
    expect(headerMap.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(headerMap.get("Permissions-Policy")).toBe(
      "camera=(), microphone=(self), geolocation=()"
    );
    expect(headerMap.get("Content-Security-Policy")).toContain("default-src 'self'");
    expect(headerMap.get("Content-Security-Policy")).toContain("https://my-server-test.vercel.app");
  });
});
