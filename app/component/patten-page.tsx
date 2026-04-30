"use client";

import { Fragment } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "../context/theme-context";
import { MainLayout } from "@/components/layout/main-layout";
import { PageCTA } from "@/components/layout/page-cta";
import PatternCurriculumTable from "./pattern-curriculum-table";

const turoData = {
  title: "투로의 의미",
  overview: {
    image: "/images/pattern.png",
    description:
      "투로는 동작 반복을 통해 겉으로 보이는 동작을 완벽하게 소화해내고 체화하기 위해 수련한다고들 믿습니다. 분명히 그런 목적도 존재하지만, 무련은 투로를 익힌다는 것은 하나의 무술서를 읽어내는 것과 같다는 생각 하에 수련을 진행하고 있습니다. 우리가 책을 읽으면서 작가가 독자에게 무엇을 전달하고 싶어하는지를 생각하면서 읽듯이, 우리는 이 투로를 엮어낸 분께서 후학들에게 어떤 것들을 깨닫고 연습하기를 원하시는지를 생각하며 수련합니다.",
  },
  sections: [
    {
      title: "투로 수련의 철학",
      content:
        "단순히 투로를 암기하고 따라하는 것을 넘어, 각 동작의 이유와 원리를 함께 가르침으로써 수련생의 연무 능력과 동기를 동시에 끌어올립니다. 왜 이 동작이 이 순서인지, 어떤 상황을 가정한 움직임인지를 이해하고 연습하는 것이 무련의 방식입니다.",
    },
    {
      title: "투로의 구성",
      subsections: [
        {
          title: "기본 원리",
          content:
            "투로는 혼자서도 연습할 수 있게 만들어진 체계적인 수련법입니다. 기본기를 바탕으로 “실제로” 쓸 수 있는 기술들을 자연스럽게 익힐 수 있도록 구성되어 있습니다.",
        },
        {
          title: "교전과의 연결",
          content:
            "단순한 동작의 반복이 아닌, 실제 “교전” 상황에서 쓸 수 있는 의미 있는 움직임들로 이루어져 있습니다. 각각의 동작에는 공격과 방어의 의미가 담겨 있습니다.",
        },
      ],
    },
    {
      title: "실전적 의미",
      subsections: [
        {
          title: "움직임의 본질",
          content:
            "투로의 연속된 움직임은 기본기의 자연스러운 연장선입니다. 특히 창이나 검과 같은 병기를 다룰 때는 몸의 자연스러운 흐름이 특히 중요합니다.",
          image: "/images/announce/gumi1.webp",
        },
        {
          title: "실전 상황의 이해",
          content:
            "투로 하나만으로는 모든 상황을 해결할 수 없습니다. 하지만 다양한 상황에서 병기를 어떻게 활용할지에 대한 좋은 지침이 될 수 있습니다.",
          image: "/images/announce/gumi2.webp",
        },
        {
          title: "다양한 상황 대처",
          content:
            "투로는 계속 변하는 상대의 위치에 대응하는 법을 배우는 과정입니다. 여러 명을 상대하는 상황까지 고려한 종합적인 훈련 방법입니다.",
          image: "/images/announce/gumi3.webp",
        },
      ],
    },
    {
      title: "투로 수련 과정",
      subsections: [
        {
          title: "0. 검 기본기",
          content:
            "모든 검술 투로의 출발점입니다. 세우기·베기·자세·보법의 토대를 세워, 이후 투로 수련에서 기술이 자연스럽게 흐를 수 있도록 합니다.",
        },
        {
          title: "검술 1트랙",
          content:
            "본국검 → 제독검 → 쌍수도 → 예도총보 → 쌍검 순서로 진행. 점차 난이도를 높이며 검술의 폭을 넓혀 나갑니다.",
        },
        {
          title: "검술 2트랙 (병렬)",
          content:
            "왜검 교전 → 예도 24세. 검술 1트랙과 동시에 병렬로 진행되어 입체적인 검술 이해를 돕고, 서로 다른 체계의 비교·응용 감각을 길러줍니다.",
        },
        {
          title: "기타 무기",
          content:
            "등패 → 곤방 → 월도 → 기창 순으로 단계적 학습. 검술에서 다져진 원리를 바탕으로 서로 다른 병기의 특성과 쓰임을 몸에 익힙니다.",
        },
      ],
    },
    {
      title: "수련의 방향",
      subsections: [
        {
          title: "단계적 접근",
          content:
            "투로는 실제 교전에서 써야 할 동작들을 엮어내어 반복 연습할 수 있게 해주는 방법입니다. 또한, 실제로 쓰일 수 있는 동작들 외에도 교전 상황에 도움이 될 수 있는 신체 및 정신 단련 동작이 섞여있기도 합니다. 이러한 동작들을 소화해내기 위해선 혼자 연습할 때도 상대방이 있다고 생각하며 정확한 동작을 하는 것이 중요합니다.",
          image: "/images/announce/gumi4.webp",
        },
        {
          title: "교전 감각 유지",
          content:
            "투로는 실전에서 써야 할 기술들을 안전하게 연습할 수 있게 해주는 방법입니다. 혼자 연습할 때도 상대방이 있다고 생각하며 정확한 동작을 하는 것이 중요합니다.",
          // image: "/images/announce/gumi5.webp",
        },
      ],
    },
    {
      title: "현대적 의미",
      content:
        "투로는 오랜 시간 동안 많은 무예인들의 경험이 담긴 소중한 수련 방법입니다. 혼자서도 꾸준히 연습할 수 있고, 기본기를 탄탄히 다질 수 있는 효과적인 방법입니다.",
    },
  ],
};

export default function PatternPage() {
  const { theme } = useTheme();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className={`text-2xl sm:text-xl sm:text-2xl md:text-3xl md:text-4xl font-bold mb-6 sm:mb-12 text-center ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {turoData.title}
        </motion.h1>

        <motion.section
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className={`p-5 sm:p-8 rounded-lg ${
            theme === "dark" ? "glassmorphism-dark" : "glassmorphism-light"
          }`}
        >
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="md:w-1/2">
              <Image
                src={turoData.overview.image}
                alt={turoData.title}
                width={500}
                height={300}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="md:w-1/2 space-y-6">
              <p
                className={`text-lg ${
                  theme === "dark" ? "text-gray-200" : "text-gray-600"
                }`}
              >
                {turoData.overview.description}
              </p>
            </div>
          </div>
        </motion.section>

        {turoData.sections.map((section, index) => {
          // 짝수(0,2,4) = 글(프로즈), 홀수(1,3,5) = 카드(그리드)
          const isProse = index % 2 === 0;
          const isDark = theme === "dark";
          const glass = isDark ? "glassmorphism-dark" : "glassmorphism-light";
          const textBody = isDark ? "text-gray-200" : "text-gray-600";
          const textHead = isDark ? "text-white" : "text-gray-900";
          const rule = isDark ? "border-white/15" : "border-gray-300/60";

          const wrapperClass = isProse
            ? `mt-14 sm:mt-20 max-w-3xl mx-auto px-4 text-center`
            : `mt-12 p-5 sm:p-8 rounded-lg ${glass}`;

          const h2Class = isProse
            ? `text-2xl sm:text-3xl font-bold mb-5 sm:mb-7 ${textHead}`
            : `text-2xl font-bold mb-4 sm:mb-6 ${textHead}`;

          return (
            <Fragment key={section.title}>
              <motion.section
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className={wrapperClass}
              >
                {isProse && (
                  <div className={`w-12 h-px mx-auto mb-5 ${rule} border-t`} />
                )}
                <h2 className={h2Class}>{section.title}</h2>

                {section.subsections ? (
                  isProse ? (
                    <div className="space-y-8 text-left">
                      {section.subsections.map((sub) => (
                        <div key={sub.title}>
                          <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${textHead}`}>
                            {sub.title}
                          </h3>
                          <p className={`text-base sm:text-lg leading-relaxed ${textBody}`}>
                            {sub.content}
                          </p>
                          {sub.image && (
                            <div className="mt-4">
                              <Image
                                src={sub.image}
                                alt={sub.title}
                                width={500}
                                height={300}
                                className="rounded-lg object-cover w-full h-auto"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {section.subsections.map((sub, idx) => (
                        <motion.div
                          key={sub.title}
                          initial={{ x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          className="space-y-3"
                        >
                          <h3 className={`text-xl font-semibold ${textHead}`}>
                            {sub.title}
                          </h3>
                          <p className={textBody}>{sub.content}</p>
                          {sub.image && (
                            <div>
                              <Image
                                src={sub.image}
                                alt={sub.title}
                                width={500}
                                height={300}
                                className="rounded-lg object-cover"
                              />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )
                ) : isProse ? (
                  <p className={`text-base sm:text-lg leading-relaxed ${textBody}`}>
                    {section.content}
                  </p>
                ) : (
                  <p className={textBody}>{section.content}</p>
                )}
              </motion.section>
              {section.title === "투로 수련 과정" && <PatternCurriculumTable />}
            </Fragment>
          );
        })}
        <PageCTA />

      </div>
    </MainLayout>
  );
}
