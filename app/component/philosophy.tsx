"use client";

import { motion } from "framer-motion";
import { useTheme } from "../context/theme-context";

export default function Philosophy() {
  const { theme } = useTheme();

  const philosophies = [
    {
      title: "우리는 자연스러움을 추구해요",
      description:
        "검 속에서 잃어버린 자연스러운 움직임과 신체의 본질적 기능을 되찾는 과정을 밝고 있어요",
    },
    {
      title: "야생 - 본질성",
      description: "우리는 야생에서의 인간의 본성을 탐구해요",
    },
    {
      title: "우리는 진행이이에요",
      description: "항상 더 좋은 방향을 고민 하는 복원 무예",
    },
  ];

  return (
    <section className="w-full">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className={`py-16 text-center ${
            theme === "dark" ? "glassmorphism-dark" : "glassmorphism-light"
          } rounded-lg mb-8`}
        >
          <h2
            className={`text-4xl font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            무련이란?
          </h2>
          <p
            className={`text-xl mb-12 max-w-2xl mx-auto leading-relaxed ${
              theme === "dark" ? "text-gray-200" : "text-gray-600"
            }`}
          >
            무련은 무예 24반 경당 소속의 사회인 동아리입니다. 우리는
            무예도보통지의 가르침을 기초로 기술의 습득을 넘어, 인간 본연의
            움직임을 회복하고 자연스러운 신체의 지혜를 일꺠우고 있습니다.
          </p>
        </motion.div>
        <div className="space-y-8">
          {philosophies.map((philosophy, index) => (
            <motion.div
              key={philosophy.title}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className={`flex flex-col items-center text-center ${
                theme === "dark" ? "glassmorphism-dark" : "glassmorphism-light"
              } p-8 rounded-lg`}
            >
              <h3
                className={`text-3xl font-bold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {philosophy.title}
              </h3>
              <p
                className={`text-xl max-w-2xl leading-relaxed ${
                  theme === "dark" ? "text-gray-200" : "text-gray-600"
                }`}
              >
                {philosophy.description}
              </p>
              <div
                className={`w-1/3 h-px mt-16 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                }`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
