"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import Image from "next/image";

const footTechniques = [
  { name: "Foot Techniques", value: 18, color: "hsl(var(--chart-1))" },
];

const mountedTechniques = [
  { name: "Mounted Techniques", value: 6, color: "hsl(var(--chart-2))" },
];

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: LabelProps) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const chartConfig = {
  "Ground Techniques": {
    label: "Ground Techniques",
    color: "hsl(var(--chart-1))",
  },
  "Mounted Techniques": {
    label: "Mounted Techniques",
    color: "hsl(var(--chart-2))",
  },
};

export default function Muye24Introduction() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Introduction to Korean Martial Arts: Muye 24
      </h1>

      <p className="mb-8 text-lg text-center">
        Muye 24 is a comprehensive system of Korean martial arts, consisting of
        24 techniques divided into foot and mounted categories.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Foot Techniques (18)</CardTitle>
            <CardDescription>Techniques performed on foot</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={footTechniques}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {footTechniques.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mounted Techniques (6)</CardTitle>
            <CardDescription>Techniques performed on horseback</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mountedTechniques}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#82ca9d"
                    dataKey="value"
                  >
                    {mountedTechniques.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Foot Techniques</h2>
          <p className="mb-4">
            The 18 foot techniques in Muye 24 cover a wide range of combat
            skills, including striking, grappling, and weapons-based techniques.
          </p>
          <Image
            src="/placeholder.svg?height=300&width=400"
            alt="Foot Techniques Demonstration"
            width={400}
            height={300}
            className="rounded-lg"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Mounted Techniques</h2>
          <p className="mb-4">
            The 6 mounted techniques focus on combat skills while on horseback,
            an essential aspect of historical Korean martial arts.
          </p>
          <Image
            src="/placeholder.svg?height=300&width=400"
            alt="Mounted Techniques Demonstration"
            width={400}
            height={300}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
