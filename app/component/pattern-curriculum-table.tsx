"use client";

import { useTheme } from "../context/theme-context";
import { CardContainer, SubHeading, Body } from "@/components/ui/typography";

/**
 * 투로 수련 과정 시각화 테이블.
 * 원문 텍스트는 건드리지 않고 시각 부가물로 덧붙임.
 */
export default function PatternCurriculumTable() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const border = isDark ? "border-white/10" : "border-gray-200";
  const textMuted = isDark ? "text-white/60" : "text-gray-500";
  const textBody = isDark ? "text-white/90" : "text-gray-800";
  const textHeading = isDark ? "text-white" : "text-gray-900";
  const headerBg = isDark ? "bg-white/10" : "bg-gray-900/5";

  const rows: Array<{
    step: string;
    track1: string;
    track2: string;
    etc: string;
  }> = [
    { step: "0", track1: "검 기본기", track2: "—", etc: "—" },
    { step: "1", track1: "본국검", track2: "왜검 교전", etc: "등패" },
    { step: "2", track1: "제독검", track2: "예도 24세", etc: "곤방" },
    { step: "3", track1: "쌍수도", track2: "—", etc: "월도" },
    { step: "4", track1: "예도총보", track2: "—", etc: "기창" },
    { step: "5", track1: "쌍검", track2: "—", etc: "—" },
  ];

  return (
    <div className="mt-8 sm:mt-12">
      <CardContainer>
        <div className="flex items-baseline justify-between mb-4 sm:mb-6 gap-3 flex-wrap">
          <SubHeading size="md" className="mb-0">
            커리큘럼 한눈에 보기
          </SubHeading>
          <Body as="span" size="xs" muted>
            검술 2트랙은 1트랙과 <b>병렬</b>로 진행됩니다.
          </Body>
        </div>

        {/* Desktop: table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className={headerBg}>
                <th className={`text-left px-4 py-3 ${textHeading} font-semibold w-20`}>단계</th>
                <th className={`text-left px-4 py-3 ${textHeading} font-semibold`}>검술 1트랙 (순차)</th>
                <th className={`text-left px-4 py-3 ${textHeading} font-semibold`}>검술 2트랙 (병렬)</th>
                <th className={`text-left px-4 py-3 ${textHeading} font-semibold`}>기타 무기</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.step} className={`border-t ${border}`}>
                  <td className={`px-4 py-3 ${textMuted} font-mono`}>{r.step}</td>
                  <td className={`px-4 py-3 ${textBody}`}>{r.track1}</td>
                  <td className={`px-4 py-3 ${textBody}`}>{r.track2}</td>
                  <td className={`px-4 py-3 ${textBody}`}>{r.etc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: stacked cards per step */}
        <div className="sm:hidden space-y-3">
          {rows.map((r) => (
            <div key={r.step} className={`border ${border} rounded-lg p-3`}>
              <div className={`text-xs font-mono ${textMuted} mb-2`}>
                단계 {r.step}
              </div>
              <dl className="space-y-1 text-sm">
                <div className="flex gap-2">
                  <dt className={`w-24 shrink-0 ${textMuted}`}>1트랙</dt>
                  <dd className={textBody}>{r.track1}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className={`w-24 shrink-0 ${textMuted}`}>2트랙</dt>
                  <dd className={textBody}>{r.track2}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className={`w-24 shrink-0 ${textMuted}`}>기타무기</dt>
                  <dd className={textBody}>{r.etc}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </CardContainer>
    </div>
  );
}
