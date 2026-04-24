"use client";

import Link from "next/link";
import { Fragment } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/main-layout";
import {
  PageHeading,
  SectionHeading,
  SubHeading,
  Body,
  CardContainer,
  ProseContainer,
  Divider,
} from "@/components/ui/typography";

type Section = {
  id: string;
  title: string;
  eyebrow?: string;
  paragraphs: string[];
  bullets?: { title: string; content: string }[];
  cta?: { label: string; href: string };
};

const aboutData: { title: string; lead: string; sections: Section[] } = {
  title: "소개",
  lead:
    "무련은 무예도보통지를 읽어내는 방식으로 24반 무예를 수련하는 사회인 동아리입니다. 아래는 무련이 무엇이고, 어떤 계보 위에 있으며, 무엇을 교범으로 삼는지에 대한 이야기입니다.",
  sections: [
    {
      id: "muryeon",
      title: "무련",
      eyebrow: "무련이란",
      paragraphs: [
        "무련(武緣)은 무예도보통지를 바탕으로 24반 무예를 수련하는 사회인 동아리입니다. 기술의 암기를 넘어, 각 동작의 원리·용도·맥락을 이해하며 수련하는 것을 지향합니다.",
        "우리는 책을 읽듯 투로를 읽고, 교전에서 시험하며, 갑주를 입고 대련합니다. 혼자서는 짤 수 없는 진(陣)을 함께 짜는 것이 장기적인 지향점입니다.",
      ],
      bullets: [
        {
          title: "원리의 깨달음",
          content:
            "검과 곤방을 기본으로 각 무기의 특성과 원리를 이해 — 자기 방식으로 무(武)를 발현할 수 있는 수준을 목표로 합니다.",
        },
        {
          title: "개인과 단체",
          content:
            "개개인의 기량을 끌어올리면서 진을 짜고 유기적 합동을 이루는 것 — 무련은 이 둘을 동시에 추구합니다.",
        },
        {
          title: "전통과 개선",
          content:
            "옛 방식을 따름과 동시에, 현대의 조건에서 더 나은 방향으로의 보완·개선을 계속합니다.",
        },
      ],
      cta: { label: "왜 무련인가 · 수련 방식 보기", href: "/" },
    },
    {
      id: "association",
      title: "24반 무예경당협회",
      eyebrow: "계보",
      paragraphs: [
        "무련은 대학경당의 수련 전통을 잇는 24반 무예경당협회의 맥락 위에 있습니다. 대학경당은 대학생 중심의 24반 무예 수련 단체로, 학교 밖에서도 이 계보를 이어가고자 하는 사회인들이 모여 무련을 구성했습니다.",
        "경당협회는 '복원'에 그치지 않고, 무예도보통지의 원리를 오늘의 몸으로 해석·실험하는 방식을 지향합니다. 무련도 그 기조를 공유합니다.",
      ],
    },
    {
      id: "dobo",
      title: "무예도보통지",
      eyebrow: "교범",
      paragraphs: [
        "《무예도보통지(武藝圖譜通志)》는 조선 정조가 군사 개혁과 국방력 강화를 위해 편찬을 명한 공식 군사 무예서입니다. 1790년(정조 14년), 규장각 검서관 이덕무·박제가와 장용영 무관 백동수 등이 참여해 완성한 훈련용 병서(兵書)로, 어제무예도보통지·어정무예도보통지라고도 불립니다.",
      ],
      bullets: [
        {
          title: "무엇이 들어 있나",
          content:
            "무예24기(24반)라 불리는 24가지 무예를 4권에 나누어 수록. 1권 — 찌르는 무기(창류: 장창·죽장창·기창·당파·낭선·기창). 2·3권 — 베는 무기(쌍수도·예도·왜검·교전·제독검·본국검·쌍검·마상쌍검·월도·마상월도·협도·등패). 4권 — 타격·체술·마상무예(권법·곤봉·편곤·마상편곤·격구·마상재).",
        },
        {
          title: "어떻게 구성되었나",
          content:
            "각 기예는 자세와 동작을 보여주는 그림(圖譜)과 기술 설명·활용법을 정리한 글(通志)로 구성 — 당시 군사들이 그대로 보고 익힐 수 있는 표준 교범 역할을 했습니다.",
        },
        {
          title: "왜 중요한가",
          content:
            "오늘날 학계·무예계·정부 모두 무예도보통지를 '조선 시대 무예를 대표하는 표준 무예서'로 인정합니다. 24반 무예는 지상무예 18기와 마상무예 6기를 합한 24가지 국방 무예에서 비롯된 이름으로, 조선 후기 군사 무예의 종합 정리판입니다.",
        },
      ],
    },
    {
      id: "techniques",
      title: "도보통지 속 기예",
      eyebrow: "24반",
      paragraphs: [
        "무예도보통지에는 지상무예 18기 + 마상무예 6기 = 24기(24반)가 수록되어 있습니다. 무련은 이 중 검술을 중심으로 투로·기본기·대련을 단계적으로 쌓아 나갑니다.",
        "각 기예의 자세·역사·그림 설명은 별도 페이지에서 원형 차트와 함께 확인할 수 있습니다.",
      ],
      cta: { label: "24반 기예 전체 보기", href: "/basic-sense" },
    },
  ],
};

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <motion.div initial={false} animate={{ opacity: 1, y: 0 }}>
          <PageHeading size="lg">{aboutData.title}</PageHeading>
        </motion.div>

        {/* 목차 */}
        <motion.section
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <CardContainer>
            <Body size="base" className="mb-5 sm:mb-6">
              {aboutData.lead}
            </Body>
            <nav
              className="flex flex-wrap gap-2 sm:gap-3"
              aria-label="소개 섹션 바로가기"
            >
              {aboutData.sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm rounded-full border border-current/20 hover:bg-current/5 transition-colors"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </CardContainer>
        </motion.section>

        {/* 섹션들 — 글/카드 교차 리듬 */}
        {aboutData.sections.map((section, index) => {
          const isProse = index % 2 === 0;
          return (
            <Fragment key={section.id}>
              <motion.div
                id={section.id}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.05 }}
                className="mt-12 sm:mt-16 scroll-mt-24"
              >
                {isProse ? (
                  <ProseContainer className="text-center">
                    <Divider />
                    {section.eyebrow && (
                      <Body
                        as="span"
                        size="xs"
                        muted
                        className="block tracking-[0.3em] uppercase mb-2"
                      >
                        {section.eyebrow}
                      </Body>
                    )}
                    <SectionHeading
                      align="center"
                      size="lg"
                      className="mb-5 sm:mb-7"
                    >
                      {section.title}
                    </SectionHeading>

                    <div className="text-left space-y-5 sm:space-y-6">
                      {section.paragraphs.map((p, i) => (
                        <Body key={i} size="base">
                          {p}
                        </Body>
                      ))}
                    </div>

                    {section.bullets && (
                      <div className="mt-8 space-y-6 text-left">
                        {section.bullets.map((b) => (
                          <div key={b.title}>
                            <SubHeading size="md" className="mb-2">
                              {b.title}
                            </SubHeading>
                            <Body size="base">{b.content}</Body>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.cta && (
                      <div className="mt-8 sm:mt-10 flex justify-center">
                        <Link
                          href={section.cta.href}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-current/20 text-sm font-semibold hover:bg-current/5 transition-colors"
                        >
                          {section.cta.label} →
                        </Link>
                      </div>
                    )}
                  </ProseContainer>
                ) : (
                  <CardContainer>
                    {section.eyebrow && (
                      <Body
                        as="span"
                        size="xs"
                        muted
                        className="block tracking-[0.3em] uppercase mb-2"
                      >
                        {section.eyebrow}
                      </Body>
                    )}
                    <SectionHeading size="md" className="mb-4 sm:mb-6">
                      {section.title}
                    </SectionHeading>

                    <div className="space-y-4 sm:space-y-5">
                      {section.paragraphs.map((p, i) => (
                        <Body key={i} size="sm">
                          {p}
                        </Body>
                      ))}
                    </div>

                    {section.bullets && (
                      <div className="grid md:grid-cols-2 gap-5 sm:gap-6 mt-6 sm:mt-8">
                        {section.bullets.map((b, idx) => (
                          <motion.div
                            key={b.title}
                            initial={{ x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="space-y-2"
                          >
                            <SubHeading size="md">{b.title}</SubHeading>
                            <Body size="sm">{b.content}</Body>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {section.cta && (
                      <div className="mt-6 sm:mt-8">
                        <Link
                          href={section.cta.href}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-current/20 text-sm font-semibold hover:bg-current/5 transition-colors"
                        >
                          {section.cta.label} →
                        </Link>
                      </div>
                    )}
                  </CardContainer>
                )}
              </motion.div>
            </Fragment>
          );
        })}
      </div>
    </MainLayout>
  );
}
