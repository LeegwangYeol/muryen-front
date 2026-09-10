"use client";

import React, {
  useState,
  useMemo,
  useEffect,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useTheme } from "../context/theme-context";

export interface Technique {
  name: string;
  description: string;
  image?: string;
  images?: string[];
  variants?: string[];
}

export interface Book {
  title: string;
  description: string;
  techniques: Technique[];
}

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  payload: any;
}

const generateTechniqueData = (book: Book) => {
  const total = book.techniques.length;
  const data = book.techniques.map((technique, index) => ({
    name: technique.name,
    value: 100 / total,
    image: technique.images?.[0] || technique.image || "",
    description: technique.description,
    index,
  }));
  return data;
};

const CustomLabel = (props: LabelProps) => {
  const { cx, cy, midAngle, outerRadius, payload } = props;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <foreignObject x={x - 25} y={y - 25} width={50} height={50}>
      <div className="relative w-full h-full group">
        <Image
          src={payload.image}
          alt={payload.name}
          fill
          sizes="50px"
          className="object-contain rounded-full border-2 border-white"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 rounded-full flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 text-white text-xs text-center p-1">
            {payload.name}
          </div>
        </div>
      </div>
    </foreignObject>
  );
};

const Tooltip = ({
  name,
  description,
  x,
  y,
}: {
  name: string;
  description: string;
  x: number;
  y: number;
}) => {
  const { theme } = useTheme();
  const left = Math.max(
    12,
    Math.min(
      x + 18,
      typeof window !== "undefined" && window.innerWidth ? window.innerWidth - 320 : x + 18
    )
  );
  const top = Math.max(
    12,
    Math.min(
      y + 18,
      typeof window !== "undefined" && window.innerHeight ? window.innerHeight - 200 : y + 18
    )
  );

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      style={{ position: "fixed", top, left, pointerEvents: "none" }}
      className={`shadow-lg rounded-xl z-[9999] p-4 sm:p-6 w-[min(90vw,500px)] transition-colors duration-200
      ${
        theme === "dark"
          ? "bg-gray-800/95 border border-gray-700 text-gray-200"
          : "bg-white/95 border border-gray-200 text-gray-800"
      }`}
    >
      <h3
        className={`font-bold mb-3 text-lg sm:text-xl md:text-2xl ${
          theme === "dark" ? "text-gray-100" : "text-gray-900"
        }`}
      >
        {name}
      </h3>

      <p
        className={`text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-wrap ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {description}
      </p>
    </div>,
    document.body
  );
};

const CustomSectionContent = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, payload } =
    props;
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const { theme } = useTheme();
  const RADIAN = Math.PI / 180;
  const midAngle = (startAngle + endAngle) / 2;
  const radius = (innerRadius + outerRadius) / 2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN) - 80;
  const y = cy + radius * Math.sin(-midAngle * RADIAN) - 80;

  const handleEnter = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setIsHovered(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      <foreignObject x={x} y={y} width={160} height={160}>
        <div
          className="relative w-full h-full"
          onMouseEnter={handleEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleLeave}
        >
          <Image
            src={payload.image}
            alt={payload.name}
            fill
            sizes="160px"
            className={`object-contain transition-all duration-200 pointer-events-none ${
              theme === "dark"
                ? "opacity-40 contrast-200 dark:invert"
                : "opacity-60 contrast-150"
            }`}
          />
        </div>
      </foreignObject>
      {isHovered && (
        <Tooltip
          name={payload.name}
          description={payload.description}
          x={mousePos.x}
          y={mousePos.y}
        />
      )}
    </>
  );
};

export default function DonutChart({ book }: { book: Book }) {
  const { theme } = useTheme();
  const techniqueData = useMemo(() => generateTechniqueData(book), [book]);

  useEffect(() => {
    const imageUrls = techniqueData.map((item) => item.image);
    imageUrls.forEach((url) => {
      if (url) {
        const img: HTMLImageElement = new window.Image();
        img.src = url;
      }
    });
  }, [techniqueData]);

  return (
    <Card
      className={`p-4 sm:p-6 backdrop-blur-md shadow-lg border-0 ${
        theme === "dark" ? "glassmorphism-dark" : "glassmorphism-light"
      }`}
    >
      <CardHeader className="text-center">
        <CardTitle
          className={`text-xl sm:text-2xl md:text-3xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {book.title}
        </CardTitle>
        <p
          className={`text-sm sm:text-base md:text-lg mt-2 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {book.description}
        </p>
      </CardHeader>
      <CardContent className="relative h-[800px]">
        <div className="relative w-full h-full flex justify-center items-center">
          <ResponsiveContainer
            width="100%"
            height={800}
            className={`rounded-lg ${
              theme === "dark" ? "glassmorphism-dark" : "glassmorphism-light"
            }`}
          >
            <PieChart>
              <Pie
                data={techniqueData}
                cx="50%"
                cy="50%"
                innerRadius={120}
                outerRadius={350}
                paddingAngle={2}
                startAngle={90}
                endAngle={450}
                dataKey="value"
                label={CustomLabel}
                labelLine={false}
              >
                {techniqueData.map((entry) => (
                  <Cell
                    key={`cell-${entry.index}`}
                    fill={
                      theme === "dark" ? "hsl(var(--card))" : "hsl(var(--card))"
                    }
                    stroke={
                      theme === "dark"
                        ? "rgb(var(--card-foreground-dark))"
                        : "rgb(var(--card-foreground))"
                    }
                    style={{
                      filter: "brightness(0.98)",
                    }}
                  />
                ))}
              </Pie>
              <Pie
                data={techniqueData}
                cx="50%"
                cy="50%"
                innerRadius={120}
                outerRadius={350}
                paddingAngle={2}
                startAngle={90}
                endAngle={450}
                dataKey="value"
                activeIndex={techniqueData.map((_, index) => index)}
                activeShape={CustomSectionContent}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
