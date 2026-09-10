describe("NextAuth Route & Configuration (app/api/auth/[...nextauth]/route.ts)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("initializes NextAuth without GoogleProvider when credentials are missing", () => {
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;

    const mockNextAuth = jest.fn((options) => options);
    jest.doMock("next-auth", () => mockNextAuth);
    const mockGoogle = jest.fn();
    jest.doMock("next-auth/providers/google", () => mockGoogle);

    const route = require("@/app/api/auth/[...nextauth]/route");
    expect(route.GET).toBeDefined();
    expect(route.POST).toBeDefined();

    expect(mockNextAuth).toHaveBeenCalled();
    const passedOptions = mockNextAuth.mock.calls[0][0];
    expect(passedOptions.providers).toHaveLength(0);
    expect(passedOptions.pages?.signIn).toBe("/login");
    expect(mockGoogle).not.toHaveBeenCalled();
  });

  it("configures GoogleProvider when GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are provided", () => {
    process.env.GOOGLE_CLIENT_ID = "mock-client-id-123";
    process.env.GOOGLE_CLIENT_SECRET = "mock-client-secret-456";

    const mockNextAuth = jest.fn((options) => options);
    jest.doMock("next-auth", () => mockNextAuth);
    const mockGoogle = jest.fn((options) => ({ id: "google", name: "Google", ...options }));
    jest.doMock("next-auth/providers/google", () => mockGoogle);

    require("@/app/api/auth/[...nextauth]/route");
    expect(mockGoogle).toHaveBeenCalledWith(
      expect.objectContaining({
        clientId: "mock-client-id-123",
        clientSecret: "mock-client-secret-456",
      })
    );

    const passedOptions = mockNextAuth.mock.calls[0][0];
    expect(passedOptions.providers).toHaveLength(1);
  });

  it("attaches access_token in jwt callback if account is present", async () => {
    const mockNextAuth = jest.fn((options) => options);
    jest.doMock("next-auth", () => mockNextAuth);
    jest.doMock("next-auth/providers/google", () => jest.fn());

    require("@/app/api/auth/[...nextauth]/route");
    const passedOptions = mockNextAuth.mock.calls[0][0];
    const jwtCallback = passedOptions.callbacks?.jwt;
    expect(jwtCallback).toBeDefined();

    const token = { name: "Test User" };
    const account = { access_token: "mock-oauth-token" } as any;

    const result = await jwtCallback({ token, account, user: {} as any });
    expect(result).toEqual({
      name: "Test User",
      accessToken: "mock-oauth-token",
    });
  });

  it("leaves token unchanged in jwt callback if account is null", async () => {
    const mockNextAuth = jest.fn((options) => options);
    jest.doMock("next-auth", () => mockNextAuth);
    jest.doMock("next-auth/providers/google", () => jest.fn());

    require("@/app/api/auth/[...nextauth]/route");
    const passedOptions = mockNextAuth.mock.calls[0][0];
    const jwtCallback = passedOptions.callbacks?.jwt;

    const token = { name: "Test User", accessToken: "existing" };
    const result = await jwtCallback({ token, account: null as any, user: {} as any });
    expect(result).toEqual({
      name: "Test User",
      accessToken: "existing",
    });
  });

  it("attaches accessToken from token to session in session callback", async () => {
    const mockNextAuth = jest.fn((options) => options);
    jest.doMock("next-auth", () => mockNextAuth);
    jest.doMock("next-auth/providers/google", () => jest.fn());

    require("@/app/api/auth/[...nextauth]/route");
    const passedOptions = mockNextAuth.mock.calls[0][0];
    const sessionCallback = passedOptions.callbacks?.session;
    expect(sessionCallback).toBeDefined();

    const session = { user: { name: "Test User" }, expires: "2099-01-01" };
    const token = { accessToken: "mock-session-token" };

    const result = await sessionCallback({ session, token, user: {} as any });
    expect(result).toEqual({
      user: { name: "Test User" },
      expires: "2099-01-01",
      accessToken: "mock-session-token",
    });
  });

  it("provides a resilient fallback secret when NEXTAUTH_SECRET is unset", () => {
    delete process.env.NEXTAUTH_SECRET;

    const mockNextAuth = jest.fn((options) => options);
    jest.doMock("next-auth", () => mockNextAuth);
    jest.doMock("next-auth/providers/google", () => jest.fn());

    require("@/app/api/auth/[...nextauth]/route");
    const passedOptions = mockNextAuth.mock.calls[0][0];
    expect(passedOptions.secret).toBe(
      "muryen-production-fallback-secret-2026-auth"
    );
  });
});
