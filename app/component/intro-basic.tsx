"use client";

import React, { useState, memo, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import Image from "next/image";
import { MainLayout } from "@/components/layout/main-layout";
import { createPortal } from "react-dom";
import { useTheme } from "../context/theme-context";

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

interface Technique {
  name: string;
  description: string;
  image?: string;
  images?: string[];
  variants?: string[];
}

interface Book {
  title: string;
  description: string;
  techniques: Technique[];
}

interface Muye24DataType {
  [key: string]: Book;
}

interface TechniqueData {
  name: string;
  value: number;
  image: string;
  description: string;
  index: number;
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

const footTechniques = [
  { name: "도보 무예", value: 18, color: "hsl(var(--chart-1))" },
];

const mountedTechniques = [
  { name: "기마 무예", value: 6, color: "hsl(var(--chart-2))" },
];

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
  footTechniques: {
    label: "도보 무예",
    color: "hsl(var(--chart-1))",
  },
  mountedTechniques: {
    label: "기마 무예",
    color: "hsl(var(--chart-2))",
  },
};

const muye24Data: Muye24DataType = {
  book1: {
    title: "무예도보통지 제1권",
    description: "찌르는 기법",
    techniques: [
      {
        name: "장창",
        description:
          "긴 창을 말하며, 전보와 후보로 이루어져 있는 장창의 자세는 대적, 기만, 방어, 공격세로 구성되어 있다. 임진왜란 중 남병(절강병) 참장 낙상지가 왜군이 지키고 있는 평양성을 공격할 때에 주로 사용된 무기이며, 이후 총·포가 개발된 시기에도 여전히 실전성을 갖고 있어 그 유용함이 계속되었다.",
        image: "/images/foot/muye24ki_core_01_jangchang.gif",
      },
      {
        name: "죽장창",
        description:
          "자루가 길므로 자세는 아주 단순하며, 대나무를 여러 겹 붙여 만든 긴 창으로 주 용도는 적의 기병을 막는데 쓰였다. 특히 찌른 후에 창을 뽑으며 급히 물러나는 [백원타도세]가 중요한 특징이다.",
        image: "/images/foot/muye24ki_core_02_jukjangchang.gif",
      },
      {
        name: "기창",
        description:
          "단창이라고도 불렸으며 고려시대에 임금의 수레를 호위하는 군사들이 익혔던 무예이다. 특히, 창에 달린 깃발을 이용하여 우뢰와 같은 소리를 내 야간 기습공격시 효용성이 높았던 기예이다.",
        image: "/images/foot/muye24ki_core_03_gichang.gif",
      },
      {
        name: "당파",
        description:
          "삼지창으로 더 많이 알려진 당파는 창을 막기에 좋은 무기이며, 명의 척계광이 왜구의 장도를 무력화시키기 위해 고안한 대표적인 무기이다. 기룡, 나창, 가창과 같은 자세는 평지에서 창을 든 상대와 대적하는 자세이다.",
        image: "/images/foot/muye24ki_core_04_dangpa.gif",
      },
      {
        name: "기창(騎槍)",
        description:
          "말을 타고 창을 사용하는 기법을 말하며, 조선 초기부터 무과 시험의 주요한 과목이었다. 전체적으로 기병무예는 조선건국 초기 여진족을 비롯한 북방의 오랑캐들을 방어하고 공격하기 위해 중점적으로 연마 되었다.",
        image: "/images/mounted/muye24ki_core_05_h-gichang.gif",
      },
      {
        name: "낭선",
        description:
          "긴 대나무에 가지를 세우고 사이에 철심을 붙여 적의 접근을 막는데 효과적으로 사용한 무기이다. 원앙진이라는 진법에서 그 위용을 드높였는데, 등패와 한짝을 이뤄 상대를 근접하지 못하게 하였다.",
        image: "/images/foot/muye24ki_core_06_nangsun.gif",
      },
    ],
  },
  book2: {
    title: "무예도보통지 제2권",
    description: "베는 기법 1번째",
    techniques: [
      {
        name: "쌍수도",
        description:
          "중국에서는 장도라 하였으며, 길고 큰 칼을 쓰는 법으로 왜구의 검에 대적하기 위해 고안되었다. 특히, 칼이 길어 칼의 중심을 잡아주는 동호인이 상당히 크게 발달하였다.",
        image: "/images/foot/muye24ki_core_07_ssangsudo.gif",
      },
      {
        name: "예도",
        description:
          "중국에서 조선세법이라고 불리울 만큼 조선의 독특한 칼쓰는 법이 수록된 검법이다. 전체 28개의 자세로 구성되어 있으며, 조선 검법의 핵심이며 가장 기본적인 칼쓰는 법이다.",
        image: "/images/foot/muye24ki_core_08_yedo.gif",
      },
      {
        name: "왜검",
        variants: ["토유류", "천유류", "운광류", "류피류"],
        description:
          "회수력 때문에 打法이 독특하게 발달한 검법이다. 아주 빠르고 강렬한 검법으로 앞을 향하여 쭉쭉 질러 가는 것이 특징이다.",
        images: [
          "/images/foot/muye24ki_core_09_waegum.gif",
          "/images/foot/muye24ki_core_10_waegum.gif",
          "/images/foot/muye24ki_core_11_waegum.gif",
          "/images/foot/muye24ki_core_12_waegum.gif",
        ],
      },
      {
        name: "교전",
        description:
          "조선의 검선 김체건이 왜검을 응용하여 격검하도록 만든 것이며, 무예 24기 가운데 가장 늦게 완성된 검법이다. 압(壓)과 접(接)을 적절히 응용하여 상대의 검을 제압한다.",
        image: "/images/foot/muye24ki_core_13_gyojun.gif",
      },
    ],
  },
  book3: {
    title: "무예도보통지 제3권",
    description: "베는 기법 2번째",
    techniques: [
      {
        name: "제독검",
        description:
          "이여송의 '제독'이라는 계급이 검보의 명칭에 붙은 것으로 중국에서 전해졌으나 조선에서 완성된 검법이다. 총 14세로 되어 있으며 일대 다수의 전투에서 효과적이다.",
        image: "/images/foot/muye24ki_core_14_jedokgum.gif",
      },
      {
        name: "본국검",
        description:
          "이덕무는 본국검을 신라의 화랑 황창이 창안한 검보라고 소개하였다. 총 24세로 구성되어 있으며 전후좌우 자유롭게 공격과 방어가 이뤄져 정갈한 맛이 나는 검법이다.",
        image: "/images/foot/muye24ki_core_15_bongukgum.gif",
      },
      {
        name: "쌍검",
        description:
          "두 개의 검을 들고 구사하는 검법으로, 공격과 방어가 동시에 이루어져 좁은 공간에서 그 위력이 배가된다. 오화전신세와 장검수광처럼 두개의 검이 조화롭게 움직이는 것이 특징이다.",
        image: "/images/foot/muye24ki_core_16_ssanggum.gif",
      },
      {
        name: "마상쌍검",
        description:
          "말위에서 검 두 개를 사용하는 기법을 말하며, 특히 중국 무장들(항우,손책,유방,관우)의 이름이 자세에 사용되었다.",
        image: "/images/mounted/muye24ki_core_17_h-ssanggum.gif",
      },
      {
        name: "월도",
        description:
          "삼국지에 나오는 관운장이 사용한 청룡언월도와 유사하며, 동선이 크고 위력이 있어 참마도라 불리울 정도로 파괴적인 검법이다.",
        image: "/images/foot/muye24ki_core_18_woldo.gif.gif",
      },
      {
        name: "마상월도",
        description:
          "말 위에서 월도를 사용하는 기법으로, 조선의 기병들이 필수로 익혔던 기예이다. 특히 월도의 무게와 길이 문제로 월도, 중월도, 청룡도 등으로 다양하게 무기를 변형하여 익혔다.",
        image: "/images/mounted/muye24ki_core_19_h-woldo.gif",
      },
      {
        name: "협도",
        description:
          "눈썹 모양이어서 미첨도라 불리우고, 적의 진을 부수는데 효과적이어서 파도라 불렸다. 무예24기 가운데 가장 무거운 병기이다.",
        image: "/images/foot/muye24ki_core_20_hyubdo.gif",
      },
      {
        name: "등패",
        description:
          "등나무로 만든 방패와 요도, 표창을 사용하는 무예이다. 기병은 둥근 방패, 보병은 긴 사각 방패를 사용하였고 조총과 화살을 막아내기도 하였다.",
        image: "/images/foot/muye24ki_core_21_dungpae.gif",
      },
    ],
  },
  book4: {
    title: "무예도보통지 제4권",
    description: "치는 기법",
    techniques: [
      {
        name: "권법",
        description:
          "맨손으로 익히는 무예로 검을 배우기 전에 익혔다. 백병전시에 무기없이 맨손으로 적을 제압하여야 했기 때문이다. 발보다는 손을 주로 사용하는 수박의 형태가 남아있다.",
        image: "/images/foot/muye24ki_core_22_gyunbub.gif",
      },
      {
        name: "곤방",
        description:
          "무기술의 기초로 익혀야 했으며, 특히 음양수(陰陽手)를 익히는 기본이 되는 무기술이다. 우리나라는 연봉과 강봉이 함께 사용되었으며, 무예도보통지에는 강봉을 사용하였다.",
        image: "/images/foot/muye24ki_core_23_gonbang.gif",
      },
      {
        name: "편곤",
        description:
          "쇠도리깨를 연상시키는 무기술로 연속 공격이 쉽고 강한 타격력을 바탕으로 기병들의 주요한 무기로 사용되었다. 성을 공격할때 굽어지는 속성으로 인하여 효과적으로 사용하였다.",
        image: "/images/foot/muye24ki_core_24_pyungon.gif",
      },
      {
        name: "마상편곤",
        description:
          "말위에서 편곤을 사용하는 법으로 자루를 약간 짧게하여 기병들이 항시 착용하였던 기본 무기였다. 보통때의 연습은 편추라 하여 짚으로 만든 인형을 세워두고 연습하였다.",
        image: "/images/mounted/muye24ki_core_25_h-pyungon.gif",
      },
      {
        name: "격구",
        description:
          "서양의 폴로와 비슷하며, 고려의 귀족들이 즐겨하였고, 여인들 또한 그 기술을 익혀 널리 말을 활용한 기마민족의 전통을 경기로써 이어지게 하는 기예이다.",
        image: "/images/mounted/muye24ki_core_26_gyukgu.gif",
      },
      {
        name: "마상재",
        description:
          "말 위에서 일종의 재주를 부리는 기예이며, 정조 시대에는 조선의 모든 기병들이 필히 익혀야만 했던 기예이다. 특히 일본의 통신사로 가서 시연을 보였던 기병들은 칭송이 일본열도를 뒤흔들 정도였다.",
        image: "/images/mounted/muye24ki_core_27_masangje.gif",
      },
    ],
  },
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
}: {
  name: string;
  description: string;
}) => {
  const { theme } = useTheme();

  return createPortal(
    <div
      className={`fixed top-1/3 left-1/2 -translate-x-1/2 backdrop-blur-sm shadow-lg rounded-xl z-[9999] p-6 w-[500px] transition-colors duration-200
      ${
        theme === "dark"
          ? "bg-gray-800/90 border border-gray-700 text-gray-200"
          : "bg-white/95 border border-gray-200 text-gray-800"
      }`}
    >
      <h3
        className={`font-bold mb-3 text-xl ${
          theme === "dark" ? "text-gray-100" : "text-gray-900"
        }`}
      >
        {name}
      </h3>
      <p
        className={`text-lg leading-relaxed whitespace-pre-wrap ${
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
  const { theme } = useTheme();
  const RADIAN = Math.PI / 180;
  const midAngle = (startAngle + endAngle) / 2;
  const radius = (innerRadius + outerRadius) / 2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN) - 80;
  const y = cy + radius * Math.sin(-midAngle * RADIAN) - 80;

  return (
    <>
      <foreignObject x={x} y={y} width={160} height={160}>
        <div className="relative w-full h-full">
          <Image
            src={payload.image}
            alt={payload.name}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            fill
            className={`object-contain transition-all duration-200 ${
              theme === "dark"
                ? "opacity-40 contrast-200 dark:invert"
                : "opacity-60 contrast-150"
            }`}
          />
        </div>
      </foreignObject>
      {isHovered && (
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Tooltip name={payload.name} description={payload.description} />
        </div>
      )}
    </>
  );
};

const TechniqueImages = memo(({ images }: { images: { image: string }[] }) => {
  return (
    <>
      {images.map((item, index) => (
        <div key={`${item.image}-${index}`} className="hidden">
          <Image
            src={item.image}
            alt=""
            width={500}
            height={500}
            priority={index < 4} // First 4 images load with priority
          />
        </div>
      ))}
    </>
  );
});
TechniqueImages.displayName = "TechniqueImages";

const DonutChart = ({ book }: { book: Book }) => {
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
      className={`p-6 backdrop-blur-md shadow-lg border-0 ${
        theme === "dark" ? "glassmorphism-dark" : "glassmorphism-light"
      }`}
    >
      <CardHeader className="text-center">
        <CardTitle
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {book.title}
        </CardTitle>
        <p
          className={`text-lg mt-2 ${
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
        <TechniqueImages images={techniqueData} />
      </CardContent>
    </Card>
  );
};

export default function Muye24Introduction() {
  return (
    <MainLayout>
      <div className="grid gap-4">
        {Object.entries(muye24Data).map(([bookKey, book]) => (
          <DonutChart key={bookKey} book={book} />
        ))}
      </div>
    </MainLayout>
  );
}
