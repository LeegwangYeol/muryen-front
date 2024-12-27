"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "../context/theme-context";

const referenceData = [
  {
    title: "무예도보통지",
    overview: {
      image: "/reference/muyedobotongji.jpg",
      description:
        "조선 후기의 대표적인 무예 교범으로, 1790년(정조 14년)에 편찬되었습니다.",
    },
    details: [
      "24반무예의 기본이 되는 교본",
      "조선시대 무예의 정수를 담고 있음",
      "실전적인 무예 기술을 체계적으로 정리",
    ],
  },
  {
    title: "조선무예교본",
    overview: {
      image: "/reference/joseon-martial-arts.jpg",
      description: "현대적 관점에서 재해석한 조선시대 무예 교본입니다.",
    },
    details: [
      "현대적 해석과 응용방법 수록",
      "실용적인 훈련 방법론 제시",
      "전통 무예의 현대화 방안 제안",
    ],
  },
];

export default function ReferencePage() {
  const { theme } = useTheme();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-4xl font-bold mb-12 text-center ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        무예 참고 자료
      </motion.h1>

      <div className="space-y-24">
        {referenceData.map((item, index) => (
          <motion.section
            key={item.title}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className={`p-8 rounded-lg ${
              theme === "dark" ? "glassmorphism-dark" : "glassmorphism-light"
            }`}
          >
            <div
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-start gap-8`}
            >
              <div className="md:w-1/2">
                <Image
                  src={item.overview.image}
                  alt={item.title}
                  width={500}
                  height={300}
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="md:w-1/2 space-y-6">
                <div>
                  <h2
                    className={`text-3xl font-bold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {item.title}
                  </h2>
                  <p
                    className={`text-lg ${
                      theme === "dark" ? "text-gray-200" : "text-gray-600"
                    }`}
                  >
                    {item.overview.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3
                    className={`text-xl font-semibold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    주요 특징
                  </h3>
                  <ul className="space-y-3">
                    {item.details.map((detail, detailIndex) => (
                      <motion.li
                        key={detailIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: detailIndex * 0.1 }}
                        className={`flex items-center space-x-2 ${
                          theme === "dark" ? "text-gray-200" : "text-gray-600"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span>{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
