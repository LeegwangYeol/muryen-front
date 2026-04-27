import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/contact";

export const metadata: Metadata = {
  title: "페이지를 찾지 못했어요",
  description: "요청하신 페이지가 존재하지 않습니다. 무련 메인으로 돌아가세요.",
  robots: { index: false, follow: false },
};

const quickLinks = [
  { href: "/", label: "홈" },
  { href: "/about", label: "소개" },
  { href: "/basic-sense", label: "24반 무예" },
  { href: "/basic", label: "기본기" },
  { href: "/pattern", label: "투로" },
  { href: "/sparring", label: "대련" },
  { href: "/#inquiry", label: "입회 안내" },
];

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 text-[rgb(var(--foreground))]">
      <div className="max-w-xl w-full text-center">
        <p className="text-xs sm:text-sm tracking-[0.3em] uppercase opacity-60 mb-3">
          404 · NOT FOUND
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          <span className="highlight-word">武緣</span>
        </h1>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3">
          이 길은 비어 있습니다
        </h2>
        <p className="text-sm sm:text-base opacity-80 mb-8 leading-relaxed">
          요청하신 페이지를 찾지 못했어요.
          <br className="hidden sm:inline" /> 아래 길 중 하나로 이어가세요.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center px-4 py-2 text-sm rounded-full border border-current/30 hover:bg-current/5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[rgb(var(--accent))] text-white font-semibold text-sm sm:text-base shadow-md hover:opacity-90 transition-opacity"
        >
          {SITE.name} 메인으로 돌아가기 →
        </Link>
      </div>
    </main>
  );
}
