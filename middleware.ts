import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let accessToken = request.cookies.get("accessToken");
  if (accessToken) {
    // console.log("accessToken", accessToken);
  }
  const url = request.nextUrl.clone();

  const requestedHost = request.headers.get("X-Forwarded-Host");
}
