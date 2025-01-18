"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "../context/theme-context";
import { MainLayout } from "@/components/layout/main-layout";

const cuttingData = {
  title: "베기의 특성과 의미",
  overview: {
    image: "/reference/cutting.jpg",
    description:
      "베기와 대련은 무예24기에서 실전적 기량을 키우는 핵심적인 수련 방법이에요. 기본기와 투로를 바탕으로 실제 상황에서의 활용을 익히는 과정이랍니다.",
  },
  sections: [
    {
      title: "베기의 실제",
      subsections: [
        {
          title: "진검의 운용",
          content:
            "진검을 다루는 것은 목검과는 완전히 다른 느낌이에요. 단순한 힘이 아닌, 바른 자세와 호흡을 통해 자연스러운 힘의 흐름을 만들어내야 해요.",
        },
        {
          title: "수련의 진단",
          content:
            "실제 물체를 베어보는 과정은 그동안의 수련을 점검하는 중요한 과정이에요. 검날의 방향과 힘의 흐름이 정확히 일치하는지, 기본기와 투로에서 배운 동작들이 실제로 효과가 있는지 확인할 수 있어요.",
        },
        {
          title: "단계적 접근",
          content: [
            "목검으로 기본 동작 익히기",
            "진검으로 기본자세와 베기 연습",
            "짚단과 대나무등으로 실제 베기 연습",
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
      <motion.main
        className={`flex min-h-screen flex-col items-center justify-between p-24 ${
          theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">{cuttingData.title}</h1>

        <motion.section
          className="mb-12 p-6 bg-opacity-20 bg-gray-200 rounded-lg shadow-lg w-full"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row items-center mb-4">
            <Image
              src={cuttingData.overview.image}
              alt={cuttingData.title}
              width={300}
              height={200}
              className="rounded-lg mb-4 md:mb-0 md:mr-6"
            />
            <p className="text-lg">{cuttingData.overview.description}</p>
          </div>

          {cuttingData.sections.map((section, sectionIndex) => (
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
