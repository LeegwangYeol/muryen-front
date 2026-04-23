"use client";

import { MapPin, CalendarDays, CircleDollarSign, Target, Youtube, Instagram } from "lucide-react";
import { useTheme } from "../context/theme-context";
import { CONTACT, SITE } from "@/lib/contact";
import {
  SectionHeading,
  Body,
  Eyebrow,
  Quote,
  CardContainer,
} from "@/components/ui/typography";

const infoRows = [
  { icon: MapPin, label: "장소", value: SITE.location },
  { icon: CalendarDays, label: "일정", value: SITE.schedule },
  { icon: CircleDollarSign, label: "회비", value: SITE.fee },
  { icon: Target, label: "조건", value: SITE.entryBarrier },
];

export default function InquirySection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const iconBg = isDark ? "bg-white/10" : "bg-gray-900/5";
  const rowText = isDark ? "text-white/90" : "text-gray-800";
  const rowLabel = isDark ? "text-white" : "text-gray-900";
  const btnDisabled = isDark
    ? "border-white/30 text-white/70"
    : "border-gray-300 text-gray-500";

  return (
    <section
      id="inquiry"
      className="w-full py-14 sm:py-24 px-4 sm:px-6 md:px-8 scroll-mt-24"
    >
      <div className="max-w-3xl mx-auto text-center">
        <Eyebrow className="mb-3 text-center">JOIN MURYEON</Eyebrow>
        <SectionHeading align="center" size="lg" className="mb-4">
          입회 안내
        </SectionHeading>
        <Body size="sm" className="mb-8 sm:mb-10">
          {CONTACT.inquiryNotice}
        </Body>

        <CardContainer className="mb-8 sm:mb-10 text-left">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {infoRows.map((row) => {
              const Icon = row.icon;
              return (
                <li
                  key={row.label}
                  className={`flex items-center gap-3 ${rowText}`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${iconBg}`}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="text-sm sm:text-base">
                    <span className={`font-semibold ${rowLabel}`}>
                      {row.label}
                    </span>
                    <span className="mx-2 opacity-40">·</span>
                    {row.value}
                  </span>
                </li>
              );
            })}
          </ul>
        </CardContainer>

        <Quote className="mb-8 sm:mb-10 mx-auto max-w-xl text-left">
          &ldquo;{SITE.slogan}&rdquo;
        </Quote>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <a
            href={CONTACT.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200 text-sm sm:text-base"
          >
            <Youtube size={18} /> YouTube @muryeon 방문
          </a>
          {CONTACT.instagram ? (
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-current font-medium transition-colors duration-200 text-sm sm:text-base"
            >
              <Instagram size={18} /> Instagram
            </a>
          ) : (
            <span
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border text-sm opacity-60 cursor-not-allowed ${btnDisabled}`}
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
