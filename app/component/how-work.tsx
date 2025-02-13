"use client";

import React from "react";
import { useTheme } from "../context/theme-context";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HowWork() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="container mx-auto px-4 py-16 min-h-screen flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-4xl mb-16"
      >
        <h2
          className={`text-2xl font-bold mb-6 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          어떻게 수련할까요?
        </h2>
        <p
          className={`text-lg leading-relaxed max-w-2xl mb-4 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          무련의 수련은 단순한 기술의 습득을 넘어, 몸과 마음의 조화로운 발전을
          추구합니다. 우리는 이를 '수련의 삼각형'이라는 체계적인 방법론으로
          구현하고 있습니다.
        </p>
        <p
          className={`text-lg leading-relaxed max-w-2xl ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          베기, 투로, 대련이라는 세 가지 핵심 요소를 통해 수련자는 단계적으로
          성장하며, 이 모든 것의 중심에는 견고한 기본기가 자리잡고 있습니다.
          각각의 요소들은 독립적이면서도 서로 긴밀하게 연결되어 있어, 진정한
          무예의 길을 열어줍니다.
        </p>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`text-4xl font-bold mb-12 text-center ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        수련의 삼각형
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center justify-center max-w-4xl mx-auto"
      >
        <svg
          width="500"
          height="500"
          viewBox="0 0 500 500"
          className="w-full max-w-2xl"
        >
          {/* Triangle */}
          <polygon
            points="250,50 50,450 450,450"
            fill="none"
            stroke={isDark ? "#fff" : "#000"}
            strokeWidth="3"
            className="transition-colors duration-200"
          />

          {/* Center circle */}
          <circle
            cx="250"
            cy="300"
            r="40"
            fill={isDark ? "#1a1a1a" : "#fff"}
            stroke={isDark ? "#fff" : "#000"}
            strokeWidth="3"
            className="transition-colors duration-200"
          />

          {/* Axes */}
          <line
            x1="250"
            y1="50"
            x2="250"
            y2="300"
            stroke={isDark ? "#fff" : "#000"}
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <line
            x1="50"
            y1="450"
            x2="250"
            y2="300"
            stroke={isDark ? "#fff" : "#000"}
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <line
            x1="450"
            y1="450"
            x2="250"
            y2="300"
            stroke={isDark ? "#fff" : "#000"}
            strokeWidth="2"
            strokeDasharray="5,5"
          />

          {/* Circles at corners */}
          <circle
            cx="250"
            cy="50"
            r="35"
            fill={isDark ? "#1a1a1a" : "#fff"}
            stroke={isDark ? "#fff" : "#000"}
            strokeWidth="3"
          />
          <circle
            cx="50"
            cy="450"
            r="35"
            fill={isDark ? "#1a1a1a" : "#fff"}
            stroke={isDark ? "#fff" : "#000"}
            strokeWidth="3"
          />
          <circle
            cx="450"
            cy="450"
            r="35"
            fill={isDark ? "#1a1a1a" : "#fff"}
            stroke={isDark ? "#fff" : "#000"}
            strokeWidth="3"
          />

          {/* Labels */}
          <text
            x="250"
            y="50"
            dy="8"
            textAnchor="middle"
            fill={isDark ? "#fff" : "#000"}
            className="text-lg font-semibold"
            dominantBaseline="middle"
          >
            베기
          </text>
          <text
            x="50"
            y="450"
            dy="8"
            textAnchor="middle"
            fill={isDark ? "#fff" : "#000"}
            className="text-lg font-semibold"
            dominantBaseline="middle"
          >
            투로
          </text>
          <text
            x="450"
            y="450"
            dy="8"
            textAnchor="middle"
            fill={isDark ? "#fff" : "#000"}
            className="text-lg font-semibold"
            dominantBaseline="middle"
          >
            대련
          </text>
          <text
            x="250"
            y="300"
            dy="8"
            textAnchor="middle"
            fill={isDark ? "#fff" : "#000"}
            className="text-lg font-semibold"
            dominantBaseline="middle"
          >
            기본기
          </text>
        </svg>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className={`mt-24 space-y-8 text-center max-w-2xl ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <p className="text-lg leading-relaxed">
            무련의 수련 체계는 베기, 투로, 대련의 세 가지 축을 중심으로 구성되어
            있습니다. 이 세 가지 요소의 중심에는 기본기가 있으며, 이를 바탕으로
            각 요소가 조화롭게 통합될 때 진정한 수련의 완성을 이룰 수 있습니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 rounded-lg"
            >
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                <Image
                  src="/images/cutting.png"
                  alt="베기 이미지"
                  fill
                  className="object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3
                className={`text-xl font-semibold mb-3 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                베기
              </h3>
              <p className="text-base">
                검을 통한 절단의 기술을 연마하며, 정확성과 힘의 조절을 배웁니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="p-6 rounded-lg"
            >
              <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/images/pattern.png"
                  alt="투로 이미지"
                  fill
                  className="object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3
                className={`text-xl font-semibold mb-3 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                투로
              </h3>
              <p className="text-base">
                정해진 형식 속에서 움직임의 완성도를 높이고 기술을 체화합니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="p-6 rounded-lg"
            >
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                <Image
                  src="/images/sparring.png"
                  alt="대련 이미지"
                  fill
                  className="object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3
                className={`text-xl font-semibold mb-3 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                대련
              </h3>
              <p className="text-base">
                실전적인 상황에서 기술을 적용하며 실전 감각을 키웁니다.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-12 p-6 rounded-lg"
          >
            <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
              <Image
                src="/images/hero.jpeg"
                alt="기본기 이미지"
                fill
                className="object-contain hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3
              className={`text-xl font-semibold mb-3 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              기본기
            </h3>
            <p className="text-base">
              모든 수련의 근간이 되는 기본 동작과 자세를 연마합니다. 탄탄한
              기본기는 베기, 투로, 대련의 모든 영역에서 필수적인 요소입니다.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
