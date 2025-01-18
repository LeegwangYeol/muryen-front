"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "../context/theme-context";
import { MainLayout } from "@/components/layout/main-layout";

const sparringData = {
  title: "대련의 특성과 의미",
  overview: {
    image: "/reference/sparring.jpg",
    description:
      "대련은 실제 상황에서의 거리감과 타이밍을 익히는 중요한 과정이에요. 단순한 형식 수련을 넘어서 실전적인 감각을 키울 수 있어요.",
  },
  sections: [
    {
      title: "실전 감각",
      content:
        "대련은 실제 상황에서의 거리감과 타이밍을 익히는 중요한 과정이에요. 단순한 형식 수련을 넘어서 실전적인 감각을 키울 수 있어요.",
    },
    {
      title: "불리한 상황의 극복",
      content: [
        "창과 검의 대결처럼 리치가 불리한 상황",
        "체격이나 힘의 열세를 극복하는 방법",
        "여러 상대를 마주하는 상황",
      ],
    },
    {
      title: "전략과 심리",
      content:
        "불리한 상황에서도 포기하지 않고 승리의 기회를 찾는 것이 중요해요. 이는 단순한 기술의 문제가 아닌, 정신력과 전략적 사고를 키우는 과정이랍니다.",
    },
    {
      title: "실전적 수련법",
      subsections: [
        {
          title: "베기 수련의 발전",
          content: [
            "기본 베기 동작 연습",
            "다양한 각도와 방향에서의 베기",
            "연속 동작 속 베기의 정확성 확인",
            "실제 타깃을 통한 베기감 체득",
          ],
        },
        {
          title: "대련의 단계",
          content: [
            "기본 대련: 정해진 동작 연습",
            "자유 대련: 다양한 상황 대처",
            "여러 상대와의 대련",
            "불리한 조건 극복 훈련",
          ],
        },
      ],
    },
    {
      title: "수련의 방향성",
      subsections: [
        {
          title: "균형잡힌 접근",
          content:
            "베기와 대련은 기본기와 투로를 바탕으로 해야 해요. 이를 통해 실전에서도 자연스럽게 기술을 구사할 수 있게 되죠.",
        },
        {
          title: "실전적 마인드",
          content: [
            "항상 실제 상황을 상정한 수련",
            "불리한 상황에서도 포기하지 않는 정신력",
            "상대를 존중하는 태도",
            "끊임없는 자기 수련과 반성",
          ],
        },
        {
          title: "마음의 수련",
          content:
            "전통 무예에서 베기와 대련은 단순한 기술 연마가 아닌, 마음을 닦는 과정이에요. 상대를 이기는 것이 아닌, 자신을 이해하고 발전시키는 것이 목표랍니다.",
        },
      ],
    },
  ],
};

export default function SparringPage() {
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
        <h1 className="text-4xl font-bold mb-8">{sparringData.title}</h1>

        <motion.section
          className="mb-12 p-6 bg-opacity-20 bg-gray-200 rounded-lg shadow-lg w-full"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row items-center mb-4">
            <Image
              src={sparringData.overview.image}
              alt={sparringData.title}
              width={300}
              height={200}
              className="rounded-lg mb-4 md:mb-0 md:mr-6"
            />
            <p className="text-lg">{sparringData.overview.description}</p>
          </div>

          {sparringData.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h2 className="text-2xl font-semibold mb-3">{section.title}</h2>
              {section.subsections ? (
                section.subsections.map((subsection, subsectionIndex) => (
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
                ))
              ) : Array.isArray(section.content) ? (
                <ul className="list-disc list-inside">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="mb-1">
                      {item}
                    </li>
                  ))}
                </ul>
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
