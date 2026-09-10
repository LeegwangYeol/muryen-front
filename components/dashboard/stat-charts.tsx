"use client";

import React from "react";
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

export interface AttendanceItem {
  month: string;
  attendance: number;
}

export interface SkillItem {
  skill: string;
  score: number;
}

export interface SparringItem {
  name: string;
  hits: number;
}

export const AttendanceLineChart = React.memo(function AttendanceLineChart({
  data,
  isDark,
  textColor = isDark ? "#e5e7eb" : "#374151",
  gridColor = isDark ? "#374151" : "#e5e7eb",
}: {
  data: AttendanceItem[];
  isDark: boolean;
  textColor?: string;
  gridColor?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
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
          stroke="#d4af37"
          strokeWidth={3}
          dot={{ r: 4, fill: "#d4af37" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
});

export const SkillsRadarChart = React.memo(function SkillsRadarChart({
  data,
  isDark,
  textColor = isDark ? "#e5e7eb" : "#374151",
  gridColor = isDark ? "#374151" : "#e5e7eb",
}: {
  data: SkillItem[];
  isDark: boolean;
  textColor?: string;
  gridColor?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
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
  );
});

export const SparringBarChart = React.memo(function SparringBarChart({
  data,
  isDark,
  textColor = isDark ? "#e5e7eb" : "#374151",
  gridColor = isDark ? "#374151" : "#e5e7eb",
}: {
  data: SparringItem[];
  isDark: boolean;
  textColor?: string;
  gridColor?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
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
  );
});
