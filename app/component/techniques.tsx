"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Share2, BookmarkPlus } from "lucide-react";

interface Technique {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

const techniques: Technique[] = [
  {
    id: "1",
    title: "기본 자세",
    description:
      "무예의 기본이 되는 자세입니다. 발의 위치와 손의 위치, 그리고 중심의 이동을 배웁니다. 올바른 자세는 모든 기술의 기초가 됩니다.",
    imageUrl: "/images/basic-stance.jpg",
    category: "기초",
  },
  {
    id: "2",
    title: "발놀림",
    description:
      "전진, 후진, 좌우 이동 등 기본적인 발놀림을 연습합니다. 빠르고 안정적인 이동은 공방의 핵심입니다.",
    imageUrl: "/images/footwork.jpg",
    category: "기초",
  },
  {
    id: "3",
    title: "중단베기",
    description:
      "허리선을 수평으로 가로지르는 기본적인 베기 동작입니다. 칼의 궤적과 힘의 전달, 그리고 신체의 협응을 배웁니다.",
    imageUrl: "/images/middle-cut.jpg",
    category: "베기",
  },
  {
    id: "4",
    title: "상단베기",
    description:
      "머리를 향해 수직으로 내리는 베기 동작입니다. 정확한 타이밍과 거리 조절이 중요합니다.",
    imageUrl: "/images/upper-cut.jpg",
    category: "베기",
  },
  {
    id: "5",
    title: "일본검술 기본형",
    description:
      "일본 검도의 기본이 되는 형입니다. 정확한 타격 지점과 올바른 자세를 익힙니다.",
    imageUrl: "/images/kendo-basic.jpg",
    category: "투로",
  },
  {
    id: "6",
    title: "대련 기초",
    description:
      "실전 대련을 위한 기본 동작들을 배웁니다. 거리 조절, 타이밍, 그리고 상대방의 동작을 읽는 법을 익힙니다.",
    imageUrl: "/images/sparring-basic.jpg",
    category: "대련",
  },
  {
    id: "7",
    title: "방어와 받아치기",
    description:
      "상대의 공격을 막고 즉각적으로 반격하는 기술입니다. 빠른 판단력과 반응속도가 요구됩니다.",
    imageUrl: "/images/defense.jpg",
    category: "대련",
  },
  {
    id: "8",
    title: "거리 단련",
    description:
      "적절한 거리를 유지하며 공방을 주고받는 연습입니다. 무예에서 가장 중요한 거리감을 익힙니다.",
    imageUrl: "/images/distance.jpg",
    category: "대련",
  },
  {
    id: "9",
    title: "초식 1번",
    description:
      "기본적인 검술 동작들을 연결한 첫 번째 형입니다. 자연스러운 동작의 흐름을 익힙니다.",
    imageUrl: "/images/form-1.jpg",
    category: "투로",
  },
  {
    id: "10",
    title: "초식 2번",
    description:
      "좀 더 복잡한 동작들이 포함된 두 번째 형입니다. 다양한 각도의 베기와 찌르기가 포함됩니다.",
    imageUrl: "/images/form-2.jpg",
    category: "투로",
  },
  {
    id: "11",
    title: "하단베기",
    description:
      "무릎 아래를 겨냥한 베기 동작입니다. 낮은 자세에서의 안정성과 정확한 타격이 중요합니다.",
    imageUrl: "/images/lower-cut.jpg",
    category: "베기",
  },
  {
    id: "12",
    title: "찌르기",
    description:
      "검끝으로 직선 공격을 하는 기술입니다. 정확한 타점과 빠른 되돌림이 핵심입니다.",
    imageUrl: "/images/thrust.jpg",
    category: "베기",
  },
];

export default function Techniques() {
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(
    null
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (technique: Technique) => {
    setHoveredId(technique.id);
    hoverTimerRef.current = setTimeout(() => {
      setSelectedTechnique(technique);
    }, 20000);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const TechniqueCard = ({
    technique,
    isClone = false,
  }: {
    technique: Technique;
    isClone?: boolean;
  }) => (
    <div
      key={isClone ? `${technique.id}-clone` : technique.id}
      className="break-inside-avoid mb-4 cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative hover:scale-[1.02] hover:-translate-y-1"
      onMouseEnter={() => handleMouseEnter(technique)}
      onMouseLeave={handleMouseLeave}
      onClick={() => setSelectedTechnique(technique)}
    >
      <div className="relative group">
        <Image
          src={technique.imageUrl}
          alt={technique.title}
          width={500}
          height={300}
          className="w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
        {hoveredId === technique.id && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/10">
            <div className="w-16 h-16 rounded-full border-4 border-white border-t-transparent animate-spin" />
          </div>
        )}
      </div>
      <div className="p-4 bg-white transition-colors duration-300 group-hover:bg-gray-50">
        <h3 className="text-lg font-semibold mb-2 transition-colors duration-300 group-hover:text-blue-600">
          {technique.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 transition-colors duration-300 group-hover:text-gray-700">
          {technique.description}
        </p>
        <div className="mt-3 flex items-center justify-between text-gray-500">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full transition-all duration-300 group-hover:bg-blue-50 group-hover:text-blue-600">
            {technique.category}
          </span>
          <div className="flex gap-2">
            <BookmarkPlus className="w-5 h-5 cursor-pointer hover:text-gray-700 transition-transform duration-300 hover:scale-110" />
            <Share2 className="w-5 h-5 cursor-pointer hover:text-gray-700 transition-transform duration-300 hover:scale-110" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-hidden">
        <div className="animate-infinite-scroll-fast hover:pause-animation">
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 mb-4">
            {techniques.map((technique) => (
              <TechniqueCard key={technique.id} technique={technique} />
            ))}
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4">
            {techniques.map((technique) => (
              <TechniqueCard
                key={`${technique.id}-clone`}
                technique={technique}
                isClone={true}
              />
            ))}
          </div>
        </div>
      </div>

      <Dialog
        open={!!selectedTechnique}
        onOpenChange={() => setSelectedTechnique(null)}
      >
        <DialogContent className="max-w-3xl">
          {selectedTechnique && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <Image
                  src={selectedTechnique.imageUrl}
                  alt={selectedTechnique.title}
                  width={500}
                  height={300}
                  className="w-full rounded-lg"
                />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold mb-4">
                  {selectedTechnique.title}
                </DialogTitle>
                <p className="text-gray-600 mb-6">
                  {selectedTechnique.description}
                </p>
                <div className="flex items-center gap-4">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {selectedTechnique.category}
                  </span>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                      <BookmarkPlus className="w-5 h-5" />
                      저장
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                      <Share2 className="w-5 h-5" />
                      공유
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
