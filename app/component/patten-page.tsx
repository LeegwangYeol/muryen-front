"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "../context/theme-context";
import { MainLayout } from "@/components/layout/main-layout";

const turoData = {
  title: "투로의 의미",
  overview: {
    image: "/images/pattern.png",
    description:
      "투로는 동작 반복을 통해 겉으로 보이는 동작을 완벽하게 소화해내고 체화하기 위해 수련한다고들 믿습니다. 분명히 그런 목적도 존재하지만, 무련은 투로를 익힌다는 것은 하나의 무술서를 읽어내는 것과 같다는 생각 하에 수련을 진행하고 있어요. 우리가 책을 읽으면서 작가가 독자에게 무엇을 전달하고 싶어하는지를 생각하면서 읽듯이, 우리는 이 투로를 엮어낸 분께서 후학들에게 어떤 것들을 깨닫고 연습하기를 원하시는지를 생각하며 수련합니다.",
  },
  sections: [
    {
      title: "투로의 구성",
      subsections: [
        {
          title: "기본 원리",
          content:
            "투로는 혼자서도 연습할 수 있게 만들어진 체계적인 수련법이에요. 기본기를 바탕으로 “실제로” 쓸 수 있는 기술들을 자연스럽게 익힐 수 있도록 구성되어 있어요.",
        },
        {
          title: "교전과의 연결",
          content:
            "단순한 동작의 반복이 아닌, 실제 “교전” 상황에서 쓸 수 있는 의미 있는 움직임들로 이루어져 있어요. 각각의 동작에는 공격과 방어의 의미가 담겨 있답니다.",
        },
      ],
    },
    {
      title: "실전적 의미",
      subsections: [
        {
          title: "움직임의 본질",
          content:
            "투로의 연속된 움직임은 기본기의 자연스러운 연장선이에요. 특히 창이나 검과 같은 병기를 다룰 때는 몸의 자연스러운 흐름이 특히 중요해요.",
        },
        {
          title: "실전 상황의 이해",
          content:
            "투로 하나만으로는 모든 상황을 해결할 수 없어요. 하지만 다양한 상황에서 병기를 어떻게 활용할지에 대한 좋은 지침이 될 수 있답니다.",
        },
        {
          title: "다양한 상황 대처",
          content:
            "투로는 계속 변하는 상대의 위치에 대응하는 법을 배우는 과정이에요. 여러 명을 상대하는 상황까지 고려한 종합적인 훈련 방법이랍니다.",
        },
      ],
    },
    {
      title: "수련의 방향",
      subsections: [
        {
          title: "단계적 접근",
          content:
            "투로는 실제 교전에서 써야 할 동작들을 엮어내어 반복 연습할 수 있게 해주는 방법이에요. 또한, 실제로 쓰일 수 있는 동작들 외에도 교전 상황에 도움이 될 수 있는 신체 및 정신 단련 동작이 섞여있기도 해요. 이러한 동작들을 소화해내기 위해선 혼자 연습할 때도 상대방이 있다고 생각하며 정확한 동작을 하는 것이 중요해요.",
        },
        {
          title: "교전 감각 유지",
          content:
            "투로는 실전에서 써야 할 기술들을 안전하게 연습할 수 있게 해주는 방법이에요. 혼자 연습할 때도 상대방이 있다고 생각하며 정확한 동작을 하는 것이 중요해요.",
        },
      ],
    },
    {
      title: "현대적 의미",
      content:
        "투로는 오랜 시간 동안 많은 무예인들의 경험이 담긴 소중한 수련 방법이에요. 혼자서도 꾸준히 연습할 수 있고, 기본기를 탄탄히 다질 수 있는 효과적인 방법이랍니다.",
    },
  ],
};

export default function PatternPage() {
  const { theme } = useTheme();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-4xl font-bold mb-12 text-center ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {turoData.title}
        </motion.h1>

        <motion.section
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className={`p-8 rounded-lg ${
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

        {turoData.sections.map((section, index) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: index * 0.1 }}
            className={`mt-12 p-8 rounded-lg ${
              theme === "dark" ? "glassmorphism-dark" : "glassmorphism-light"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {section.title}
            </h2>

            {section.subsections ? (
              <div className="grid md:grid-cols-2 gap-6">
                {section.subsections.map((subsection, idx) => (
                  <motion.div
                    key={subsection.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="space-y-3"
                  >
                    <h3
                      className={`text-xl font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {subsection.title}
                    </h3>
                    <p
                      className={`${
                        theme === "dark" ? "text-gray-200" : "text-gray-600"
                      }`}
                    >
                      {subsection.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p
                className={`${
                  theme === "dark" ? "text-gray-200" : "text-gray-600"
                }`}
              >
                {section.content}
              </p>
            )}
          </motion.section>
        ))}
      </div>
    </MainLayout>
  );
}
