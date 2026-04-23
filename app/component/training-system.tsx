"use client";

import { BookOpen, Waypoints, Shield } from "lucide-react";
import { useTheme } from "../context/theme-context";

/**
 * 수련 시간 3교시 구성 섹션.
 * 기존 /sparring에 있던 단일 문단을 홈으로 이전하면서,
 * 기본기·투로·대련 3축을 시각적 카드로 병기.
 */
export default function TrainingSystem() {
  const { theme } = useTheme();

  const glass =
    theme === "dark" ? "glassmorphism-dark" : "glassmorphism-light";
  const border =
    theme === "dark" ? "border-white/10" : "border-gray-200";
  const subtext = theme === "dark" ? "text-white/70" : "text-gray-600";
  const heading = theme === "dark" ? "text-white" : "text-gray-900";
  const accent = theme === "dark" ? "text-white" : "text-gray-900";

  const periods = [
    {
      icon: BookOpen,
      title: "1교시 · 기본기",
      hint: "자세·보법·베기의 토대",
    },
    {
      icon: Waypoints,
      title: "2교시 · 투로",
      hint: "형(形)으로 체화하는 원리",
    },
    {
      icon: Shield,
      title: "3교시 · 대련",
      hint: "실전 감각과 전술의 완성",
    },
  ];

  return (
    <section className="w-full py-10 sm:py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6 sm:mb-10">
          <p
            className={`text-xs sm:text-sm tracking-[0.3em] mb-3 ${subtext}`}
          >
            TRAINING SYSTEM
          </p>
          <h2
            className={`text-xl sm:text-2xl md:text-3xl font-bold ${heading}`}
          >
            수련 시간 구성 — 3교시 체제
          </h2>
        </div>

        <div
          className={`rounded-2xl p-5 sm:p-8 border ${glass} ${border} mb-6 sm:mb-8`}
        >
          <p
            className={`text-sm sm:text-base md:text-lg leading-relaxed text-center ${subtext}`}
          >
            기본기를 바탕으로 한 균형 잡힌 무인을 양성하기 위해, 한 번의 수련
            시간을 3교시로 나누어 각 주제에 맞는 수련을 집중적으로 진행해요.
            이렇게 함으로써 기본기·투로·대련이 각자의 시간 안에서 충분히
            숙성되고, 동시에 서로를 받쳐주는 유기적인 수련이 가능해집니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {periods.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className={`rounded-xl p-5 sm:p-6 border ${glass} ${border} text-center`}
              >
                <div
                  className={`inline-flex items-center justify-center w-11 h-11 rounded-lg mb-3 ${
                    theme === "dark" ? "bg-white/10" : "bg-gray-900/5"
                  } ${accent}`}
                >
                  <Icon size={20} />
                </div>
                <h3 className={`text-base sm:text-lg font-bold mb-1 ${heading}`}>
                  {p.title}
                </h3>
                <p className={`text-xs sm:text-sm ${subtext}`}>{p.hint}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
