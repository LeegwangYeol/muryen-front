"use client";

import { motion } from "framer-motion";
import { Shield, ScrollText, Coins } from "lucide-react";
import { useTheme } from "../context/theme-context";

const cards = [
  {
    icon: Shield,
    title: "갑주 대련",
    subtitle: "시연이 아닌 실전",
    body:
      "두정갑 방호구를 착용하고 실제 타격이 오가는 대련을 진행합니다. 무예도보통지가 기록한 군영 무예의 본질 — '쓰이는 무예'를 잇습니다.",
  },
  {
    icon: ScrollText,
    title: "대학경당 계보",
    subtitle: "24반 복원의 본류",
    body:
      "대학경당에서 비롯된 계보를 이어 받아 수련합니다. 무예도보통지(1790) 원전 기반 해석과 복원 전통을 존중합니다.",
  },
  {
    icon: Coins,
    title: "회비 없음 · 주말 수련",
    subtitle: "누구나 바로 시작",
    body:
      "회비나 강제 의무가 없습니다. 숙련도 요구도 없습니다. 서울에서 주말(토 오후·일 오전)에 모이는 자율 수련 공동체입니다.",
  },
];

export default function WhyMuryeon() {
  const { theme } = useTheme();
  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p
            className={`text-xs sm:text-sm tracking-[0.3em] mb-3 ${
              theme === "dark" ? "text-white/60" : "text-gray-500"
            }`}
          >
            WHY MURYEON
          </p>
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            왜 무련인가?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                initial={{ y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`rounded-2xl p-6 sm:p-8 border transition-colors duration-200 ${
                  theme === "dark"
                    ? "glassmorphism-dark border-white/10"
                    : "glassmorphism-light border-gray-200"
                }`}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 ${
                    theme === "dark"
                      ? "bg-white/10 text-white"
                      : "bg-gray-900/5 text-gray-900"
                  }`}
                >
                  <Icon size={22} />
                </div>
                <h3
                  className={`text-lg sm:text-xl font-bold mb-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {c.title}
                </h3>
                <p
                  className={`text-xs sm:text-sm mb-3 ${
                    theme === "dark" ? "text-white/60" : "text-gray-500"
                  }`}
                >
                  {c.subtitle}
                </p>
                <p
                  className={`text-sm leading-relaxed ${
                    theme === "dark" ? "text-white/80" : "text-gray-700"
                  }`}
                >
                  {c.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
