"use client";

import { BookOpen, Waypoints, Shield } from "lucide-react";
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

/**
 * 수련 시간 3교시 구성 섹션.
 * 기존 /sparring에 있던 단일 문단을 홈으로 이전하면서,
 * 기본기·투로·대련 3축을 시각적 카드로 병기.
 */
export default function TrainingSystem() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const iconBg = isDark ? "bg-white/10" : "bg-gray-900/5";
  const iconColor = isDark ? "text-white" : "text-gray-900";

  const periods = [
    { icon: BookOpen, title: "1교시 · 기본기", hint: "자세·보법·베기의 토대" },
    { icon: Waypoints, title: "2교시 · 투로", hint: "형(形)으로 체화하는 원리" },
    { icon: Shield, title: "3교시 · 대련", hint: "실전 감각과 전술의 완성" },
  ];

  return (
    <Section width="wide">
      <div className="text-center mb-6 sm:mb-10">
        <Eyebrow className="mb-3 text-center">TRAINING SYSTEM</Eyebrow>
        <SectionHeading align="center" size="md" className="mb-0">
          수련 시간 구성 — 3교시 체제
        </SectionHeading>
      </div>

      <CardContainer className="mb-6 sm:mb-8">
        <Body className="text-center">
          기본기를 바탕으로 한 균형 잡힌 무인을 양성하기 위해, 한 번의 수련
          시간을 3교시로 나누어 각 주제에 맞는 수련을 집중적으로 진행해요.
          이렇게 함으로써 기본기·투로·대련이 각자의 시간 안에서 충분히
          숙성되고, 동시에 서로를 받쳐주는 유기적인 수련이 가능해집니다.
        </Body>
      </CardContainer>

      <CardGrid cols={3} gap="compact">
        {periods.map((p) => {
          const Icon = p.icon;
          return (
            <CardContainer key={p.title} padding="compact" className="text-center">
              <div
                className={`inline-flex items-center justify-center w-11 h-11 rounded-lg mb-3 ${iconBg} ${iconColor}`}
              >
                <Icon size={20} />
              </div>
              <SubHeading align="center" size="sm" className="mb-1">
                {p.title}
              </SubHeading>
              <Body size="sm" muted>
                {p.hint}
              </Body>
            </CardContainer>
          );
        })}
      </CardGrid>
    </Section>
  );
}
