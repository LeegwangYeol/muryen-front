import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthService } from "./lib/auth-service";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // daily 경로가 아니면 통과
  if (!pathname.startsWith("/daily")) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 토큰 검증
  const user = await AuthService.validateToken(accessToken);

  if (!user) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("accessToken");
    return response;
  }

  return NextResponse.next();
}
