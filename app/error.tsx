"use client";

import Link from "next/link";
import { useEffect } from "react";
import { SITE } from "@/lib/contact";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 콘솔에 남기기 (Sentry 같은 서비스가 있다면 여기서 전송)
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [error]);

  return (
    <main className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12 text-[rgb(var(--foreground))]">
      <div className="max-w-xl w-full text-center">
        <p className="text-xs sm:text-sm tracking-[0.3em] uppercase opacity-60 mb-3">
          ERROR
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          잠시 길이 막혔습니다
        </h1>
        <p className="text-sm sm:text-base opacity-80 mb-8 leading-relaxed">
          페이지를 불러오는 중에 문제가 생겼어요. 다시 시도하시거나 메인으로
          돌아가 주세요.
        </p>
        {error?.digest && (
          <p className="text-xs opacity-50 mb-6 font-mono">
            ref: {error.digest}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[rgb(var(--accent))] text-white font-semibold text-sm sm:text-base shadow-md hover:opacity-90 transition-opacity"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-current/30 text-sm sm:text-base hover:bg-current/5 transition-colors"
          >
            {SITE.name} 메인 →
          </Link>
        </div>
      </div>
    </main>
  );
}
