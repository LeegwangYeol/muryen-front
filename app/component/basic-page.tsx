"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "../context/theme-context";
import { MainLayout } from "@/components/layout/main-layout";

const basicPrinciplesData = {
  title: "기본기의 본질",
  overview: {
    // image: "/images/basic.avif",
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
            "무예의 기본은 강함과 부드러움이 조화를 이루는 거예요. 단순히 완력의 강약이 아닌, 힘의 사용에 있어서 완급 조절이 중요 포인트에요.",
        },
        {
          title: "바른 자세와 호흡",
          content:
            "바른 자세는 모든 기술의 시작이에요. 올바른 자세가 있어야 몸에 무리 가지 않고도 강한 힘을 낼 수 있어요.",
        },
      ],
    },
    {
      title: "응용",
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
            "기본기는 그냥 반복해서 외우는 게 아니에요. 실제로 써먹을 수 있는 의미 있는 움직임이어야 해요. 이렇게 해야 실제 상황에서도 자연스럽게 기술을 쓸 수 있답니다.",
        },
      ],
    },
  ],
};

export default function BasicPage() {
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
          {basicPrinciplesData.title}
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
              {/* <Image
                src={basicPrinciplesData.overview.image}
                alt={basicPrinciplesData.title}
                width={200}
                height={200}
                className="rounded-lg object-cover"
              /> */}
            </div>
            <div className="md:w-1/2 space-y-6">
              <p
                className={`text-lg ${
                  theme === "dark" ? "text-gray-200" : "text-gray-600"
                }`}
              >
                {basicPrinciplesData.overview.description}
              </p>
            </div>
          </div>
        </motion.section>

        {basicPrinciplesData.sections.map((section, index) => (
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
