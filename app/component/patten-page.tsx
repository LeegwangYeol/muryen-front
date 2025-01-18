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
      <motion.main
        className={`flex min-h-screen flex-col items-center justify-between p-24 ${
          theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">{turoData.title}</h1>

        <motion.section
          className="mb-12 p-6 bg-opacity-20 bg-gray-200 rounded-lg shadow-lg w-full"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row items-center mb-4">
            <Image
              src={turoData.overview.image}
              alt={turoData.title}
              width={300}
              height={200}
              className="rounded-lg mb-4 md:mb-0 md:mr-6"
            />
            <p className="text-lg">{turoData.overview.description}</p>
          </div>

          {turoData.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h2 className="text-2xl font-semibold mb-3">{section.title}</h2>
              {section.subsections ? (
                section.subsections.map((subsection, subsectionIndex) => (
                  <div key={subsectionIndex} className="mb-4">
                    <h3 className="text-xl font-medium mb-2">
                      {subsection.title}
                    </h3>
                    <p>{subsection.content}</p>
                  </div>
                ))
              ) : (
                <p>{section.content}</p>
              )}
            </div>
          ))}
        </motion.section>
      </motion.main>
    </MainLayout>
  );
}
