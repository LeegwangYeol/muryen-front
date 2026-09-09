"use client";

import dynamic from "next/dynamic";
import { useTheme } from "@/app/context/theme-context";

const AttendanceLineChart = dynamic(
  () => import("./stat-charts").then((mod) => mod.AttendanceLineChart),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse bg-white/5 rounded-lg flex items-center justify-center text-sm text-gray-400">차트 로딩 중...</div>,
  }
);

const SkillsRadarChart = dynamic(
  () => import("./stat-charts").then((mod) => mod.SkillsRadarChart),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse bg-white/5 rounded-lg flex items-center justify-center text-sm text-gray-400">차트 로딩 중...</div>,
  }
);

const SparringBarChart = dynamic(
  () => import("./stat-charts").then((mod) => mod.SparringBarChart),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse bg-white/5 rounded-lg flex items-center justify-center text-sm text-gray-400">차트 로딩 중...</div>,
  }
);

const attendanceData = [
  { month: "1월", attendance: 4 },
  { month: "2월", attendance: 6 },
  { month: "3월", attendance: 5 },
  { month: "4월", attendance: 8 },
  { month: "5월", attendance: 7 },
  { month: "6월", attendance: 9 },
];

const skillsData = [
  { skill: "본국검", score: 85 },
  { skill: "쌍수도", score: 70 },
  { skill: "제독검", score: 60 },
  { skill: "월도", score: 45 },
  { skill: "장창", score: 55 },
  { skill: "갑주대련", score: 80 },
];

const sparringData = [
  { name: "머리", hits: 40 },
  { name: "손목", hits: 25 },
  { name: "허리", hits: 15 },
  { name: "찌름", hits: 5 },
  { name: "하단", hits: 10 },
];

export function DashboardStatCards() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const textColor = isDark ? "#fff" : "#333";
  const gridColor = isDark ? "#444" : "#ccc";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Attendance Chart */}
      <div
        className={`p-6 rounded-lg ${
          isDark ? "bg-[#111] border border-gray-800" : "bg-white shadow-md border border-gray-200"
        }`}
      >
        <h3 className="text-lg font-bold mb-4">월별 수련 출석률</h3>
        <div className="h-64 w-full">
          <AttendanceLineChart
            data={attendanceData}
            isDark={isDark}
            textColor={textColor}
            gridColor={gridColor}
          />
        </div>
      </div>

      {/* Skills Radar Chart */}
      <div
        className={`p-6 rounded-lg ${
          isDark ? "bg-[#111] border border-gray-800" : "bg-white shadow-md border border-gray-200"
        }`}
      >
        <h3 className="text-lg font-bold mb-4">무예 숙련도 (스탯)</h3>
        <div className="h-64 w-full">
          <SkillsRadarChart
            data={skillsData}
            isDark={isDark}
            textColor={textColor}
            gridColor={gridColor}
          />
        </div>
      </div>

      {/* Sparring Target Stats */}
      <div
        className={`p-6 rounded-lg ${
          isDark ? "bg-[#111] border border-gray-800" : "bg-white shadow-md border border-gray-200"
        }`}
      >
        <h3 className="text-lg font-bold mb-4">대련 주요 타격 부위</h3>
        <div className="h-64 w-full">
          <SparringBarChart
            data={sparringData}
            isDark={isDark}
            textColor={textColor}
            gridColor={gridColor}
          />
        </div>
      </div>
    </div>
  );
}
