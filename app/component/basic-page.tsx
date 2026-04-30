"use client";

import { Fragment } from "react";
import Image from "next/image";
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

const basicPrinciplesData = {
  title: "기본기란?",
  overview: {
    image: "/images/basic.jpeg",
    description:
      "기본기란 병기를 다루는 시작입니다. 치고 베는 것에 대한 내용을 담고 있습니다. 단병기(검)와 장병기(창)에 있어서 가장 중요한 것은 몸의 자연스러운 움직임입니다.",
  },
  sections: [
    {
      title: "기본 원리",
      subsections: [
        {
          title: "강함과 부드러움의 조화",
          content:
            "무예의 기본은 강함과 부드러움이 조화를 이루는 것입니다. 단순히 완력의 강약이 아닌, 힘의 사용에 있어서 완급 조절이 중요 포인트입니다.",
        },
        {
          title: "바른 자세와 호흡",
          content:
            "바른 자세는 모든 기술의 시작입니다. 올바른 자세가 있어야 몸에 무리 가지 않고도 강한 힘을 낼 수 있습니다.",
        },
      ],
    },
    {
      title: "응용",
      subsections: [
        {
          title: "우리 몸의 이해",
          content:
            "효과적으로 기술을 쓰려면 우리 몸이 어떻게 움직이는지 아는 게 중요합니다. 이걸 알면 쓸데없는 힘을 빼고 효율적으로 움직일 수 있습니다.",
        },
        {
          title: "움직임의 핵심",
          content: [
            "안정된 발놀림으로 중심 잡기",
            "호흡과 동작을 하나로 만들기",
            "자연스럽게 힘 전달하기",
          ],
        },
      ],
    },
    {
      title: "수련의 방향",
      subsections: [
        {
          title: "차근차근 배우기",
          content:
            "기본 동작부터 시작해서 천천히 실전 기술로 발전시켜 나갑니다. 이렇게 하면 몸에 무리 가지 않고도 제대로 된 기술을 배울 수 있습니다.",
        },
        {
          title: "실전처럼 연습하기",
          content:
            "기본기는 그냥 반복해서 외우는 게 아닙니다. 실제로 써먹을 수 있는 의미 있는 움직임이어야 합니다. 이렇게 해야 실제 상황에서도 자연스럽게 기술을 쓸 수 있습니다.",
        },
      ],
    },
  ],
};

export default function BasicPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <motion.div initial={false} animate={{ opacity: 1, y: 0 }}>
          <PageHeading size="lg">{basicPrinciplesData.title}</PageHeading>
        </motion.div>

        <motion.section
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <CardContainer>
            <div className="flex flex-col md:flex-row items-start gap-6 sm:gap-8">
              <div className="md:w-1/2">
                <Image
                  src={basicPrinciplesData.overview.image}
                  alt={basicPrinciplesData.title}
                  width={500}
                  height={300}
                  className="rounded-lg object-cover w-full h-auto"
                />
              </div>
              <div className="md:w-1/2">
                <Body size="base">
                  {basicPrinciplesData.overview.description}
                </Body>
              </div>
            </div>
          </CardContainer>
        </motion.section>

        {basicPrinciplesData.sections.map((section, index) => {
          const isProse = index % 2 === 0;

          return (
            <Fragment key={section.title}>
              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="mt-12 sm:mt-16"
              >
                {isProse ? (
                  <ProseContainer className="text-center">
                    <Divider />
                    <SectionHeading align="center" size="lg" className="mb-5 sm:mb-7">
                      {section.title}
                    </SectionHeading>

                    <div className="space-y-8 text-left">
                      {section.subsections.map((sub) => (
                        <div key={sub.title}>
                          <SubHeading size="md" className="mb-2">
                            {sub.title}
                          </SubHeading>
                          {Array.isArray(sub.content) ? (
                            <ul className="list-disc pl-5 space-y-1">
                              {sub.content.map((item, i) => (
                                <li key={i}>
                                  <Body as="span" size="base">
                                    {item}
                                  </Body>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <Body size="base">{sub.content}</Body>
                          )}
                        </div>
                      ))}
                    </div>
                  </ProseContainer>
                ) : (
                  <CardContainer>
                    <SectionHeading size="md" className="mb-4 sm:mb-6">
                      {section.title}
                    </SectionHeading>

                    <div className="grid md:grid-cols-2 gap-6">
                      {section.subsections.map((subsection, idx) => (
                        <motion.div
                          key={subsection.title}
                          initial={{ x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          className="space-y-3"
                        >
                          <SubHeading size="md">{subsection.title}</SubHeading>
                          {Array.isArray(subsection.content) ? (
                            <ul className="list-disc pl-5 space-y-2">
                              {subsection.content.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <Body as="span" size="sm">
                                    {item}
                                  </Body>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <Body size="sm">{subsection.content}</Body>
                          )}
                        </motion.div>
                      ))}
                    </div>
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
