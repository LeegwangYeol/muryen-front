"use client";

import { motion } from "framer-motion";
import {
  Swords,
  Shield,
  Users,
  Drama,
  Flame,
  Sparkles,
  Flag,
} from "lucide-react";
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

const visionPoints = [
  "배운 투로를 실제 교전에서 써보는 활터수범형 수련",
  "사람이 모이면 원앙진 등 진법 기반의 합동 무예까지 확장",
  "전통 군사 컨텐츠를 함께 발굴하고 즐기는 공동체",
];

const fitItems = [
  {
    icon: Swords,
    title: "배운 투로를 실제로 써보고 싶은 사람",
    body: "형(形)에서 멈추지 않고, 교전에서 내 투로가 실제로 작동하는지 확인하고 싶은 분.",
  },
  {
    icon: Shield,
    title: "갑주를 입어보고 싶은 사람",
    body: "두정갑을 실제로 착용하고, 그 무게와 시야 속에서 움직여 보고 싶은 분.",
  },
  {
    icon: Users,
    title: "진을 짜보고 싶은 사람",
    body: "원앙진 같은 합동 진법을 함께 구상하고 몸으로 구현해보고 싶은 분.",
  },
  {
    icon: Flag,
    title: "함께 전통 군사 컨텐츠를 즐길 사람",
    body: "조선 군영 문화·의례·장비를 취향이 맞는 동료들과 공유하고 싶은 분.",
  },
  {
    icon: Flame,
    title: "조선의 군사무예로 강해지고 싶은 사람",
    body: "관상용이 아닌 실사용 가능한 무예로 몸과 정신을 단련하고 싶은 분.",
  },
  {
    icon: Drama,
    title: "대하드라마를 보고 삘 받은 사람",
    body: "화면 속 그 장면을 내 몸으로도 구현해 보고 싶어진, 지금 이 순간의 분.",
  },
  {
    icon: Sparkles,
    title: "철릭 자락 휘날리며 뽐내고 싶은 사람",
    body: "자신의 무예를 자기다운 태(態)로 표현하고 싶은 분, 환영합니다.",
  },
];

export default function TargetAudience() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const iconBg = isDark ? "bg-white/10 text-white" : "bg-gray-900/5 text-gray-900";

  return (
    <Section width="wide" padding="loose">
      {/* 비전 */}
      <div className="text-center mb-10 sm:mb-16">
        <Eyebrow className="mb-3 text-center">OUR VISION</Eyebrow>
        <SectionHeading align="center" size="lg" className="mb-4 sm:mb-6">
          무련이 걸어가려는 길
        </SectionHeading>
        <div className="max-w-2xl mx-auto space-y-2 sm:space-y-3 text-left sm:text-center">
          {visionPoints.map((line, i) => (
            <Body key={i} size="base">
              · {line}
            </Body>
          ))}
        </div>
      </div>

      {/* 이런 사람과 맞습니다 */}
      <div className="text-center mb-8 sm:mb-12">
        <Eyebrow className="mb-3 text-center">WHO FITS</Eyebrow>
        <SectionHeading align="center" size="lg" className="mb-3 sm:mb-4">
          이런 분과 잘 맞습니다
        </SectionHeading>
        <Body size="sm" muted className="max-w-2xl mx-auto">
          한 가지라도 해당된다면, 주말에 한 번 들러 보십시오.
        </Body>
      </div>

      <CardGrid cols={3}>
        {fitItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <CardContainer padding="normal" className="h-full transition-colors duration-200">
                <div
                  className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 ${iconBg}`}
                >
                  <Icon size={20} />
                </div>
                <SubHeading size="md" className="mb-2">
                  {item.title}
                </SubHeading>
                <Body size="sm">{item.body}</Body>
              </CardContainer>
            </motion.div>
          );
        })}
      </CardGrid>
    </Section>
  );
}
