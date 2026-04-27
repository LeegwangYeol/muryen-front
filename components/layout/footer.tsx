"use client";

import Link from "next/link";
import { Youtube, Instagram } from "lucide-react";
import { useTheme } from "@/app/context/theme-context";
import { SITE, CONTACT } from "@/lib/contact";
import { Body } from "@/components/ui/typography";

const navGroups = [
  {
    title: "소개",
    links: [
      { label: "무련이란", href: "/about#muryeon" },
      { label: "24반 무예경당협회", href: "/about#association" },
      { label: "무예도보통지", href: "/about#dobo" },
      { label: "도보통지 속 기예", href: "/about#techniques" },
    ],
  },
  {
    title: "수련",
    links: [
      { label: "기본기", href: "/basic" },
      { label: "투로", href: "/pattern" },
      { label: "베기", href: "/cutting" },
      { label: "대련", href: "/sparring" },
      { label: "수련일지", href: "/daily" },
    ],
  },
  {
    title: "참여",
    links: [
      { label: "입회 안내", href: "/#inquiry" },
      { label: "24반 둘러보기", href: "/basic-sense" },
      { label: "참고 자료", href: "/reference" },
    ],
  },
];

export function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const linkBase = isDark
    ? "text-white/70 hover:text-white"
    : "text-gray-600 hover:text-gray-900";
  const heading = isDark ? "text-white" : "text-gray-900";
  const divider = isDark ? "border-white/10" : "border-gray-200";
  const iconBtn = isDark
    ? "bg-white/10 hover:bg-white/20 text-white"
    : "bg-gray-900/5 hover:bg-gray-900/10 text-gray-900";

  return (
    <footer
      className={`mt-16 sm:mt-24 border-t ${divider} px-4 sm:px-6 lg:px-8 py-10 sm:py-14`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10">
          {/* 브랜드 */}
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/"
              className={`inline-block text-lg font-bold ${heading}`}
            >
              {SITE.name} <span className="opacity-60">{SITE.hanja}</span>
            </Link>
            <Body size="xs" muted className="mt-3 max-w-[18ch]">
              {SITE.tagline}
            </Body>
            <div className="mt-4 flex items-center gap-2">
              <a
                href={CONTACT.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube @muryeon"
                className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${iconBtn}`}
              >
                <Youtube size={16} />
              </a>
              {CONTACT.instagram ? (
                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${iconBtn}`}
                >
                  <Instagram size={16} />
                </a>
              ) : (
                <span
                  aria-disabled="true"
                  title="Instagram 준비 중"
                  className={`flex items-center justify-center w-9 h-9 rounded-full opacity-40 ${iconBtn}`}
                >
                  <Instagram size={16} />
                </span>
              )}
            </div>
          </div>

          {navGroups.map((group) => (
            <div key={group.title}>
              <h3 className={`text-sm font-semibold mb-3 sm:mb-4 ${heading}`}>
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-xs sm:text-sm transition-colors ${linkBase}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className={`mt-10 sm:mt-12 pt-6 border-t ${divider} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}
        >
          <Body size="xs" muted>
            © {new Date().getFullYear()} {SITE.name} {SITE.hanja} · {SITE.location} · {SITE.schedule}
          </Body>
          <Body size="xs" muted className="italic">
            &ldquo;{SITE.slogan}&rdquo;
          </Body>
        </div>
      </div>
    </footer>
  );
}
