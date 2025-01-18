"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ShoppingBasket, Shield, Sword, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const equipmentData = [
  {
    title: "전통 갑옷",
    description: "조선시대 전통 갑옷 복원품",
    details:
      "조선시대 전통 갑옷을 현대적으로 복원한 제품입니다. 고품질 가죽과 철판을 사용하여 제작되었으며, 실제 착용 가능합니다.",
    materials: "가죽, 철판, 끈",
    purchase: "https://example.com/traditional-armor",
    makingMethod: "1. 가죽 재단\n2. 철판 가공\n3. 가죽에 철판 부착\n4. 끈 연결",
  },
  {
    title: "전투용 투구",
    description: "고려시대 스타일의 전투용 투구",
    details:
      "고려시대 전투용 투구를 현대적 기술로 재현한 제품입니다. 강철로 제작되어 높은 방어력을 자랑합니다.",
    materials: "강철, 가죽",
    purchase: "https://example.com/battle-helmet",
    makingMethod: "1. 강철 성형\n2. 내부 가죽 부착\n3. 도장 및 마감",
  },
  {
    title: "장창",
    description: "전통 장병기의 대표, 장창",
    details:
      "전통 무예에서 사용되는 장창입니다. 단단한 나무로 제작되어 내구성이 뛰어납니다.",
    materials: "참나무, 철",
    purchase: "https://example.com/long-spear",
    makingMethod:
      "1. 나무 선별 및 가공\n2. 창날 제작\n3. 창날 부착\n4. 도장 및 마감",
  },
];

export default function Equipment() {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const modalRef = useRef(null);

  const openModal = (equipment) => {
    setSelectedEquipment(equipment);
  };

  const closeModal = () => {
    setSelectedEquipment(null);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">전통 무예 장비 소개</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipmentData.map((item, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src={`/images/${item.title
                    .toLowerCase()
                    .replace(" ", "-")}.jpg`}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="rounded-lg mb-4"
                />
              </CardContent>
              <CardFooter>
                <Button onClick={() => openModal(item)}>자세히 보기</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {selectedEquipment && (
        <div
          ref={modalRef}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedEquipment.title}</h2>
              <Button onClick={closeModal} variant="ghost">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <p className="mb-4">{selectedEquipment.details}</p>
            <h3 className="font-bold mb-2">재료</h3>
            <p className="mb-4">{selectedEquipment.materials}</p>
            <h3 className="font-bold mb-2">제작 방법</h3>
            <pre className="bg-gray-100 p-4 rounded mb-4">
              {selectedEquipment.makingMethod}
            </pre>
            <Button asChild>
              <a
                href={selectedEquipment.purchase}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ShoppingBasket className="mr-2 h-4 w-4" /> 구매하기
              </a>
            </Button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
