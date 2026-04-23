"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "../context/theme-context";
import { MainLayout } from "@/components/layout/main-layout";

const sparringData = {
  title: "대련의 특성과 의미",
  overview: {
    image: "/images/sparring.png",
    description:
      "대련은 실제 상황에서의 거리감과 타이밍을 익히는 중요한 과정이에요. 단순한 형식 수련을 넘어서 상황에 유동적으로 대응하는 능력을 키울 수 있어요.",
  },
  sections: [
    {
      title: "전술적 감각 재고",
      content:
        "교전이란, 본능의 영역에서 치고 받는 양상을 띠기도 하지만, 동시에 판을 짜서 자신이 원하는 방향으로 교전을 이끌어가려는 전술 싸움의 양상도 띠어요. 우리는 교전 연습을 통해, 급박한 상황에서 이러한 요소들을 통제해 나가는 감각을 키워나가요",
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
      title: "대련 교육 과정",
      subsections: [
        {
          title: "1단계 · 기본 개념 교육",
          content:
            "대련 시에 염두에 두고 관리해야 할 요소를 인지하는 단계예요. 거리·박자·시선·무게 중심 등 핵심 개념을 체계적으로 이해하고, 각 요소가 실제 교전에서 어떻게 작동하는지 머리로 먼저 정리합니다.",
        },
        {
          title: "2단계 · 공방 연습",
          content:
            "기본적인 교전의 박자를 체득하고, 상대의 검격에 대한 스트레스에 적응하는 단계. 약속된 공방 시퀀스를 반복하면서 실전 감각의 토대를 만들어 나가요.",
        },
        {
          title: "3단계 · 30% 대련",
          content:
            "속도를 제한한 자유 대련이에요. 안전하고 여유 있는 감각 하에서 큰 틀의 전술 계획을 세우고 실행하는 방법을 터득하는 것이 목적. 매 라운드 종료 후 사범 피드백이 반드시 뒤따릅니다.",
        },
        {
          title: "4단계 · 자유 대련",
          content:
            "검을 안전하게 제어할 수 있게 된 수련생이 진입하는 마지막 단계. 실제 속도 하에서 자신의 전술을 시험하고 재정비하며, 그동안 체득한 모든 요소를 실전의 틀 안에서 통합합니다.",
        },
      ],
    },
    {
      title: "교전과 여타 수련의 연결점",
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
      title: "마음가짐",
      content: [
        "불리한 상황에서도 포기하지 않고 승리의 기회를 찾는 것이 중요해요. 이는 단순한 기술의 문제가 아닌, 외부의 스트레스에 대항하는 불굴의 정신력과 극한의 상황에서도 평정을 잃지 않고 전략적 사고를 하는 능력을 키우는 과정이랍니다.",
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
          title: "항상 준비된 마음가짐",
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
            "무예에서 베기와 대련은 단순한 기술 연마가 아닌, 마음을 닦는 과정이기도 해요. 힘든 수련과정을 통해 자신을 성찰하고, 더 나아가 내 앞의 상대 역시 나의 반대편에 서있기 위해 부단한 노력을 했음을 인정하고 존중할 줄 아는 사람이 되는 것 또한 성숙한 무예인의 자세랍니다.",
        },
      ],
    },
  ],
};

export default function SparringPage() {
  const { theme } = useTheme();
  if (!theme) return null;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <motion.h1
          initial={{ y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-2xl sm:text-xl sm:text-2xl md:text-3xl md:text-4xl font-bold mb-6 sm:mb-12 text-center ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          <span className="highlight-word">{sparringData.title}</span>
        </motion.h1>

        <motion.section
          initial={{ y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className={`p-5 sm:p-8 rounded-lg ${
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
                <span className="highlight-word">
                  {sparringData.overview.description}
                </span>
              </p>
            </div>
          </div>
        </motion.section>

        {sparringData.sections.map((section, index) => (
          <motion.section
            key={section.title}
            initial={{ y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: index * 0.1 }}
            className={`mt-12 p-5 sm:p-8 rounded-lg ${
              theme === "dark" ? "glassmorphism-dark" : "glassmorphism-light"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-4 sm:mb-6 ${
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
                    initial={{ x: -20 }}
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
                            className={`$${
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
                        className={`$${
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
                        className={`$${
                          theme === "dark" ? "text-gray-200" : "text-gray-600"
                        }`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    className={`$${
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
