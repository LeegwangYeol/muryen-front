"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "../context/theme-context";
import { MainLayout } from "@/components/layout/main-layout";

const turoData = {
  title: "투로의 의미",
  overview: {
    image: "/reference/turo.jpg",
    description:
      "투로는 무예의 기본 동작들을 하나의 흐름으로 엮어놓은 연습 체계예요. 마치 이야기처럼 각각의 동작이 서로 자연스럽게 이어지면서 실전에서 쓸 수 있는 기술들을 담고 있어요.",
  },
  sections: [
    {
      title: "투로의 구성",
      subsections: [
        {
          title: "기본 원리",
          content:
            "투로는 혼자서도 연습할 수 있게 만들어진 체계적인 수련법이에요. 기본기를 바탕으로 실전에서 쓸 수 있는 기술들을 자연스럽게 익힐 수 있도록 구성되어 있어요.",
        },
        {
          title: "실전과의 연결",
          content:
            "단순한 동작의 반복이 아닌, 실제 상황에서 쓸 수 있는 의미 있는 움직임들로 이루어져 있어요. 각각의 동작에는 공격과 방어의 의미가 담겨 있답니다.",
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
            "처음에는 기본 동작을 하나씩 익히고, 점차 연결된 동작으로 발전시켜 나가요. 이렇게 하면 몸에 무리 가지 않고도 효과적으로 기술을 배울 수 있어요.",
        },
        {
          title: "실전 감각 유지",
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
