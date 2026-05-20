"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Section,
  SectionHeading,
  Eyebrow,
  Body,
} from "@/components/ui/typography";

const photos = [
  {
    src: "/images/photos/galju-spar-1.webp",
    alt: "야간 항만에서의 갑주 대련 — 두 수련생이 검을 들고 마주섬",
    caption: "갑주 대련",
    span: "lg",
  },
  {
    src: "/images/photos/palace-demo.webp",
    alt: "궁궐 야간 시연 — 도복을 입은 24반 무예인들의 단체 자세",
    caption: "수원 화성 시연",
    span: "md",
  },
  {
    src: "/images/photos/galju-archer.webp",
    alt: "갑주 차림의 수련생이 활시위를 당기는 야간 장면",
    caption: "갑주 + 궁시",
    span: "md",
  },
  {
    src: "/images/photos/suwon-flag.webp",
    alt: "수원 화성 성벽 위에서 깃발을 들고 선 도복 차림의 수련생들",
    caption: "성벽 위의 깃발",
    span: "md",
  },
  {
    src: "/images/photos/armor-full.webp",
    alt: "두정갑 전신 — 갑옷을 입은 수련생이 검을 들고 선 풀샷",
    caption: "두정갑 풀샷",
    span: "md",
  },
  {
    src: "/images/photos/archer-stance.webp",
    alt: "수련 자세 — 갑주를 입고 활을 든 정자세",
    caption: "수련 자세",
    span: "md",
  },
] as const;

export default function TrainingGallery() {
  return (
    <Section width="wide" padding="loose">
      <div className="text-center mb-8 sm:mb-12">
        <Eyebrow className="mb-3 text-center">REAL TRAINING</Eyebrow>
        <SectionHeading align="center" size="lg" className="mb-3 sm:mb-4">
          실제 수련 현장
        </SectionHeading>
        <Body size="sm" muted className="max-w-2xl mx-auto">
          연출이 아닌, 무련의 실제 수련·시연·대련 장면입니다.
        </Body>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
        {photos.map((p, i) => (
          <motion.figure
            key={p.src}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
            className={`relative overflow-hidden rounded-lg sm:rounded-xl border border-current/10 ${
              p.span === "lg" ? "col-span-2 row-span-2 aspect-square sm:aspect-[4/3]" : "aspect-square sm:aspect-[4/3]"
            }`}
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
            <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-3 py-2 text-white text-xs sm:text-sm font-medium">
              {p.caption}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </Section>
  );
}
