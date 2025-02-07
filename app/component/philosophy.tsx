"use client";

import { motion } from "framer-motion";
import { useTheme } from "../context/theme-context";

export default function Philosophy() {
  const { theme } = useTheme();

  const philosophies = [
    {
      title: "우리는 원리의 깨달음을 추구해요",
      description:
        "우리는 검과 곤방을 기본으로써 각 무기의 특성과 그에 따른 원리를 깨닫는데 집중해요. 이를 통해 우리는 자신의 방식대로 무를 발현하고 또 표현할 수 있는 수준을 목표로 잡고 있어요",
    },
    {
      title: "개인과 단체",
      description:
        "우리는 개개인의 실력을 향상하고 모두의 실력을 통합한 진을 짜고 그 안에서 유기적인 협동을 추구해요",
    },
    {
      title: "우리는 진행이이에요",
      description:
        "우리는 옛 방식을 따름과 동시에, 새로운 방식을 맞이하여 더 좋은 방향으로의 보완과 개선을 추구해요",
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
            무련은 무예 24반 경당 소속의 사회인 동아리에요. 우리는
            무예도보통지의 가르침을 기초로 기술의 습득을 넘어, 이를 어떻게
            계승하고 발전시켜 현대의 무예에 적응 및 적용할지를 고민해요.
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
