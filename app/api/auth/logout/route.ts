import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // 쿠키 삭제
    (await cookies()).delete("accessToken");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "로그아웃 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
