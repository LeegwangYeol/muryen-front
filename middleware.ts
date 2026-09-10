import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthService } from "./lib/auth-service";

const PROTECTED_PREFIXES = ["/daily", "/mypage"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // daily 또는 mypage 경로가 아니면 통과
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (!isProtected) {
    return NextResponse.next();
  }

  const targetUrl = request.nextUrl.pathname + request.nextUrl.search;
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(targetUrl)}`, request.url)
    );
  }

  // 토큰 검증
  try {
    const user = await AuthService.validateToken(accessToken);

    if (!user) {
      const response = NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(targetUrl)}`, request.url)
      );
      response.cookies.delete("accessToken");
      response.cookies.delete("isLoggedIn");
      return response;
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware auth verification error:", error);
    const response = NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(targetUrl)}`, request.url)
    );
    response.cookies.delete("accessToken");
    response.cookies.delete("isLoggedIn");
    return response;
  }
}

export const config = {
  matcher: ["/daily/:path*", "/mypage/:path*"],
};
