"use client";

import { useTheme } from "@/app/context/theme-context";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
} from "recharts";

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
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={textColor} fontSize={12} />
              <YAxis stroke={textColor} fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#222" : "#fff",
                  color: isDark ? "#fff" : "#000",
                  borderColor: gridColor,
                }}
              />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#d4af37" // accent color
                strokeWidth={3}
                dot={{ r: 4, fill: "#d4af37" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
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
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsData}>
              <PolarGrid stroke={gridColor} />
              <PolarAngleAxis dataKey="skill" stroke={textColor} fontSize={12} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="숙련도"
                dataKey="score"
                stroke="#d4af37"
                fill="#d4af37"
                fillOpacity={0.5}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#222" : "#fff",
                  color: isDark ? "#fff" : "#000",
                  borderColor: gridColor,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sparringData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={textColor} fontSize={12} />
              <YAxis stroke={textColor} fontSize={12} />
              <Tooltip
                cursor={{ fill: isDark ? "#333" : "#f5f5f5" }}
                contentStyle={{
                  backgroundColor: isDark ? "#222" : "#fff",
                  color: isDark ? "#fff" : "#000",
                  borderColor: gridColor,
                }}
              />
              <Bar dataKey="hits" fill="#d4af37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
