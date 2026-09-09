import { AuthService } from "@/lib/auth-service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON or request body" },
      { status: 400 }
    );
  }

  try {
    const { username, password } = body || {};

    if (
      !username ||
      !password ||
      typeof username !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    const authResponse = await AuthService.login({ username, password });

    console.log("authResponse:", authResponse); // 로그 추가

    if (!authResponse) {
      return NextResponse.json(
        { error: "잘못된 아이디 또는 비밀번호입니다." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    // 1. Secure HTTP-only access token (protected against XSS)
    cookieStore.set("accessToken", authResponse.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    // 2. Non-sensitive client indicator cookie for UI state
    cookieStore.set("isLoggedIn", "true", {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return NextResponse.json({
      user: authResponse.user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "로그인 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
