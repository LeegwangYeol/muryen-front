"use client";

import { motion } from "framer-motion";
import { Shield, ScrollText, Coins } from "lucide-react";
import { useTheme } from "../context/theme-context";
import {
  Section,
  SectionHeading,
  SubHeading,
  Body,
  Eyebrow,
  CardContainer,
  CardGrid,
} from "@/components/ui/typography";

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
  const isDark = theme === "dark";
  const iconBg = isDark ? "bg-white/10 text-white" : "bg-gray-900/5 text-gray-900";

  return (
    <Section width="wide" padding="loose">
      <div className="text-center mb-8 sm:mb-12">
        <Eyebrow className="mb-3 text-center">WHY MURYEON</Eyebrow>
        <SectionHeading align="center" size="lg" className="mb-0">
          왜 무련인가?
        </SectionHeading>
      </div>

      <CardGrid cols={3}>
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.title}
              initial={{ y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <CardContainer padding="loose" className="transition-colors duration-200">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 ${iconBg}`}
                >
                  <Icon size={22} />
                </div>
                <SubHeading size="md" className="mb-1">
                  {c.title}
                </SubHeading>
                <Body size="xs" muted className="mb-3">
                  {c.subtitle}
                </Body>
                <Body size="sm">{c.body}</Body>
              </CardContainer>
            </motion.div>
          );
        })}
      </CardGrid>
    </Section>
  );
}
