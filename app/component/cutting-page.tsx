"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "../context/theme-context";
import { MainLayout } from "@/components/layout/main-layout";

const cuttingData = {
  title: "베기의 특성과 의미",
  overview: {
    image: "/images/cutting.png",
    description:
      "베기는 24반 무예에서 기량을 키우는 핵심적인 수련 방법 중 하나예요 기본기와 투로를 바탕으로 실제 상황에서의 활용을 익히는 과정이랍니다.",
  },
  sections: [
    {
      title: "베기의 실제",
      subsections: [
        {
          title: "진검의 운용",
          content:
            "진검을 다루는 것은 목검과는 완전히 다른 느낌이에요. 단순한 힘이 아닌, 바른 자세와 호흡, 그리고 원리을 통해 효율적으로 힘을 쓸 줄 알아야 해요.",
        },
        {
          title: "수련의 진단",
          content:
            "실제 물체를 베어보는 과정은 그 동안의 수련을 점검하는 중요한 과정이에요. 검날의 방향과 힘의 흐름이 정확히 일치하는지, 기본기와 투로에서 배운 동작들이 실제로 효과가 있는지 확인할 수 있어요.",
        },
        {
          title: "단계적 접근",
          content: [
            "목검으로 기본 동작 익히기",
            "목검으로 종이 베기",
            "베기 후 자세와 균형 점검하기",
            "진검으로 기본자세와 베기 연습",
            "짚단과 대나무등으로 실제 베기",
            "베기 후 자세와 균형 점검하기",
          ],
        },
      ],
    },
  ],
};

export default function CuttingPage() {
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
          {cuttingData.title}
        </motion.h1>

        <motion.section
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className={`p-8 rounded-lg ${
            theme === "dark" ? "glassmorphism-dark" : "glassmorphism-light"
          }`}
        >
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="md:w-1/2">
              <Image
                src={cuttingData.overview.image}
                alt={cuttingData.title}
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
                {cuttingData.overview.description}
              </p>
            </div>
          </div>
        </motion.section>

        {cuttingData.sections.map((section, index) => (
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
                      {subsection.content}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </MainLayout>
  );
}
