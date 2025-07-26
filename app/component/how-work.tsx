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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-4xl mb-16"
      >
        <h2
          className={`text-2xl font-bold mb-6 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          어떻게 <span className="highlight-word">수련</span>할까요?
        </h2>
        <p
          className={`text-lg leading-relaxed max-w-2xl mb-4 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <span className="highlight-word">무련</span>의 수련은 단순한 기술의
          습득을 넘어, 몸과 마음의 조화로운 발전을 추구합니다. 우리는 이를
          '수련의 삼각형'이라는 체계적인 방법론으로 구현하고 있습니다.
        </p>
        <p
          className={`text-lg leading-relaxed max-w-2xl ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          베기, 투로, <span className="highlight-word">대련</span>이라는 세 가지
          핵심 요소를 통해 수련자는 단계적으로 성장하며, 이 모든 것의 중심에는
          견고한 기본기가 자리잡고 있습니다. 각각의 요소들은 독립적이면서도 서로
          긴밀하게 연결되어 있어, 진정한 무예의 길을 열어줍니다.
        </p>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`text-xl font-semibold mb-8 text-center ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        수련의 삼각형
      </motion.h1>

      <div className="relative w-full max-w-4xl">
        {/* SVG Triangle */}
        <motion.svg
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          width="100%"
          height="500"
          viewBox="0 0 500 500"
          className="mb-10"
        >
          {/* Triangle */}
          <motion.path
            d="M250 50 L450 450 L50 450 Z"
            fill="none"
            stroke={isDark ? "#fff" : "#000"}
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          {/* Center Circle for 기본기 */}
          <motion.circle
            cx="250"
            cy="250"
            r="35"
            fill={isDark ? "#1a1a1a" : "#fff"}
            stroke={isDark ? "#fff" : "#000"}
            strokeWidth="3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
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
            y="250"
            dy="8"
            textAnchor="middle"
            fill={isDark ? "#fff" : "#000"}
            className="text-lg font-semibold"
            dominantBaseline="middle"
          >
            기본기
          </text>

          {/* Connecting Lines */}
          <line
            x1="250"
            y1="250"
            x2="250"
            y2="50"
            stroke={isDark ? "#fff" : "#000"}
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          <line
            x1="250"
            y1="250"
            x2="50"
            y2="450"
            stroke={isDark ? "#fff" : "#000"}
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          <line
            x1="250"
            y1="250"
            x2="450"
            y2="450"
            stroke={isDark ? "#fff" : "#000"}
            strokeWidth="1"
            strokeDasharray="5,5"
          />
        </motion.svg>

        {/* Description Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
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
              <span className="highlight-word">베기</span>
            </h3>
            <p className="text-base">
              검법의 핵심인 베기를 통해 무기의 특성과 그 원리를 이해합니다.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="p-6 rounded-lg"
          >
            <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
              <Image
                src="/images/hero.jpeg"
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
              <span className="highlight-word">투로</span>
            </h3>
            <p className="text-base">
              정형화된 동작 패턴을 통해 기본기와 응용기를 연마합니다.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="p-6 rounded-lg"
          >
            <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
              <Image
                src="/images/sparring.png"
                alt={"대련 이미지"}
                fill
                className="object-contain hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3
              className={`text-xl font-semibold mb-3 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <span className="highlight-word">대련</span>
            </h3>
            <p className="text-base">
              실전적인 상황에서 기술을 적용하며 실전 감각을 키웁니다.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.6 }}
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
            기본기는 베기, 투로, <span className="highlight-word">대련</span>
            의 모든 영역에서 필수적인 요소입니다.
          </p>
        </motion.div>
      </div>
    </div>
  );
}