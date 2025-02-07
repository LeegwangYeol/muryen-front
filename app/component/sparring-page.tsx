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
      "대련은 실제 상황에서의 거리감과 타이밍을 익히는 중요한 과정이에요. 단순한 형식 수련을 넘어서 상황에 유동적으로 대응하는 능력을 키울 수 있어요.",
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
            "베기와 대련은 기본기와 투로를 바탕으로 해야 해요. 이를 통해 실제 상황에서도 자연스럽게 기술을 구사할 수 있게 되죠.",
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
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-4xl font-bold mb-12 text-center ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {sparringData.title}
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
                src={sparringData.overview.image}
                alt={sparringData.title}
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
                {sparringData.overview.description}
              </p>
            </div>
          </div>
        </motion.section>

        {sparringData.sections.map((section, index) => (
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
                    {Array.isArray(subsection.content) ? (
                      <ul className="space-y-2">
                        {subsection.content.map((item, itemIdx) => (
                          <li
                            key={itemIdx}
                            className={`${
                              theme === "dark"
                                ? "text-gray-200"
                                : "text-gray-600"
                            }`}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p
                        className={`${
                          theme === "dark" ? "text-gray-200" : "text-gray-600"
                        }`}
                      >
                        {subsection.content}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {Array.isArray(section.content) ? (
                  <ul className="space-y-2">
                    {section.content.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className={`${
                          theme === "dark" ? "text-gray-200" : "text-gray-600"
                        }`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    className={`${
                      theme === "dark" ? "text-gray-200" : "text-gray-600"
                    }`}
                  >
                    {section.content}
                  </p>
                )}
              </div>
            )}
          </motion.section>
        ))}
      </div>
    </MainLayout>
  );
}
