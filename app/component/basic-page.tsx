"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "../context/theme-context";
import { MainLayout } from "@/components/layout/main-layout";

const basicPrinciplesData = {
  title: "기본기의 본질",
  overview: {
    image: "/reference/basic-principles.jpg",
    description:
      "기본기란 병기를 다루는 시작입니다. 치고 베는 것에 대한 내용을 담고 있습니다. 단병기(검)와 장병기(창)에 있어서 가장 중요한 것은 몸의 자연스러운 움직임이에요.",
  },
  sections: [
    {
      title: "기본 원리",
      subsections: [
        {
          title: "강함과 부드러움의 조화",
          content:
            "무예의 기본은 강함과 부드러움이 조화를 이루는 거예요. 단순히 힘이 세고 약한 게 아니라, 필요한 순간에 힘을 모았다가 자연스럽게 풀어주는 균형을 말하는 거예요.",
        },
        {
          title: "바른 자세와 호흡",
          content:
            "바른 자세는 모든 기술의 시작이에요. 올바른 자세가 있어야 몸에 무리 가지 않고도 강한 힘을 낼 수 있어요.",
        },
      ],
    },
    {
      title: "실전에서의 활용",
      subsections: [
        {
          title: "우리 몸의 이해",
          content:
            "효과적으로 기술을 쓰려면 우리 몸이 어떻게 움직이는지 아는 게 중요해요. 이걸 알면 쓸데없는 힘을 빼고 효율적으로 움직일 수 있어요.",
        },
        {
          title: "움직임의 핵심",
          content: [
            "안정된 발놀림으로 중심 잡기",
            "호흡과 동작을 하나로 만들기",
            "자연스럽게 힘 전달하기",
          ],
        },
      ],
    },
    {
      title: "수련의 방향",
      subsections: [
        {
          title: "차근차근 배우기",
          content:
            "기본 동작부터 시작해서 천천히 실전 기술로 발전시켜 나가요. 이렇게 하면 몸에 무리 가지 않고도 제대로 된 기술을 배울 수 있어요.",
        },
        {
          title: "실전처럼 연습하기",
          content:
            "기본기는 그냥 반복해서 외우는 게 아니에요. 실제로 써먹을 수 있는 의미 있는 움직임이어야 해요. 이렇게 해야 실전에서도 자연스럽게 기술을 쓸 수 있답니다.",
        },
      ],
    },
  ],
};

export default function ReferencePage() {
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
        <h1 className="text-4xl font-bold mb-8">{basicPrinciplesData.title}</h1>

        <motion.section
          className="mb-12 p-6 bg-opacity-20 bg-gray-200 rounded-lg shadow-lg w-full"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row items-center mb-4">
            <Image
              src={basicPrinciplesData.overview.image}
              alt={basicPrinciplesData.title}
              width={300}
              height={200}
              className="rounded-lg mb-4 md:mb-0 md:mr-6"
            />
            <p className="text-lg">
              {basicPrinciplesData.overview.description}
            </p>
          </div>

          {basicPrinciplesData.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h2 className="text-2xl font-semibold mb-3">{section.title}</h2>
              {section.subsections.map((subsection, subsectionIndex) => (
                <div key={subsectionIndex} className="mb-4">
                  <h3 className="text-xl font-medium mb-2">
                    {subsection.title}
                  </h3>
                  {Array.isArray(subsection.content) ? (
                    <ul className="list-disc list-inside">
                      {subsection.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="mb-1">
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{subsection.content}</p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </motion.section>
      </motion.main>
    </MainLayout>
  );
}
