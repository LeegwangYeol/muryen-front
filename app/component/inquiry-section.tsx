"use client";

import { MapPin, CalendarDays, CircleDollarSign, Target, Youtube, Instagram } from "lucide-react";
import { useTheme } from "../context/theme-context";
import { CONTACT, SITE } from "@/lib/contact";

const infoRows = [
  { icon: MapPin, label: "장소", value: SITE.location },
  { icon: CalendarDays, label: "일정", value: SITE.schedule },
  { icon: CircleDollarSign, label: "회비", value: SITE.fee },
  { icon: Target, label: "조건", value: SITE.entryBarrier },
];

export default function InquirySection() {
  const { theme } = useTheme();
  return (
    <section
      id="inquiry"
      className="w-full py-16 sm:py-24 px-4 sm:px-6 md:px-8 scroll-mt-24"
    >
      <div className="max-w-3xl mx-auto text-center">
        <p
          className={`text-xs sm:text-sm tracking-[0.3em] mb-3 ${
            theme === "dark" ? "text-white/60" : "text-gray-500"
          }`}
        >
          JOIN MURYEON
        </p>
        <h2
          className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          입회 안내
        </h2>
        <p
          className={`text-sm sm:text-base mb-10 leading-relaxed ${
            theme === "dark" ? "text-white/80" : "text-gray-700"
          }`}
        >
          {CONTACT.inquiryNotice}
        </p>

        <ul
          className={`grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 text-left rounded-2xl p-6 border ${
            theme === "dark"
              ? "glassmorphism-dark border-white/10"
              : "glassmorphism-light border-gray-200"
          }`}
        >
          {infoRows.map((row) => {
            const Icon = row.icon;
            return (
              <li
                key={row.label}
                className={`flex items-center gap-3 ${
                  theme === "dark" ? "text-white/90" : "text-gray-800"
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${
                    theme === "dark" ? "bg-white/10" : "bg-gray-900/5"
                  }`}
                >
                  <Icon size={16} />
                </span>
                <span className="text-sm">
                  <span
                    className={`font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {row.label}
                  </span>
                  <span className="mx-2 opacity-40">·</span>
                  {row.value}
                </span>
              </li>
            );
          })}
        </ul>

        <blockquote
          className={`italic text-sm sm:text-base mb-10 leading-relaxed border-l-2 pl-4 mx-auto max-w-xl text-left ${
            theme === "dark"
              ? "text-white/90 border-white/30"
              : "text-gray-700 border-gray-400"
          }`}
        >
          &ldquo;{SITE.slogan}&rdquo;
        </blockquote>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <a
            href={CONTACT.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200"
          >
            <Youtube size={18} /> YouTube @muryeon 방문
          </a>
          {CONTACT.instagram ? (
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-current font-medium transition-colors duration-200"
            >
              <Instagram size={18} /> Instagram
            </a>
          ) : (
            <span
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border text-sm opacity-60 cursor-not-allowed ${
                theme === "dark" ? "border-white/30 text-white/70" : "border-gray-300 text-gray-500"
              }`}
              aria-disabled="true"
              title="Instagram 계정 준비 중"
            >
              <Instagram size={18} /> Instagram · 준비 중
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
