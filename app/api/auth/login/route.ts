import { AuthService } from "@/lib/auth-service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const authResponse = await AuthService.login({ username, password });

    console.log("authResponse:", authResponse); // 로그 추가

    if (!authResponse) {
      return NextResponse.json(
        { error: "잘못된 아이디 또는 비밀번호입니다." },
        { status: 401 }
      );
    }

    // Set the access token cookie
    (await cookies()).set("accessToken", authResponse.accessToken, {
      // httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
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
