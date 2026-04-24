"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/main-layout";
import {
  PageHeading,
  SectionHeading,
  SubHeading,
  Body,
  CardContainer,
} from "@/components/ui/typography";

const cuttingData = {
  title: "베기의 특성과 의미",
  overview: {
    image: "/images/cutting.png",
    description:
      "베기는 24반 무예에서 기량을 키우는 핵심적인 수련 방법 중 하나예요 기본기와 투로를 바탕으로 실제 상황에서의 활용을 익히는 과정이랍니다.",
  },
  sections: [
    {
      title: "베기의 실제",
      subsections: [
        {
          title: "진검의 운용",
          content:
            "진검을 다루는 것은 목검과는 완전히 다른 느낌이에요. 단순한 힘이 아닌, 바른 자세와 호흡, 그리고 원리을 통해 효율적으로 힘을 쓸 줄 알아야 해요.",
        },
        {
          title: "수련의 진단",
          content:
            "실제 물체를 베어보는 과정은 그 동안의 수련을 점검하는 중요한 과정이에요. 검날의 방향과 힘의 흐름이 정확히 일치하는지, 기본기와 투로에서 배운 동작들이 실제로 효과가 있는지 확인할 수 있어요.",
        },
        {
          title: "단계적 접근",
          content: [
            "목검으로 기본 동작 익히기",
            "목검으로 종이 베기",
            "베기 후 자세와 균형 점검하기",
            "진검으로 기본자세와 베기 연습",
            "짚단과 대나무등으로 실제 베기",
            "베기 후 자세와 균형 점검하기",
          ],
        },
      ],
    },
  ],
};

export default function CuttingPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <motion.div initial={{ y: 50 }} animate={{ opacity: 1, y: 0 }}>
          <PageHeading size="lg">{cuttingData.title}</PageHeading>
        </motion.div>

        <motion.section
          initial={{ y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <CardContainer>
            <div className="flex flex-col md:flex-row items-start gap-6 sm:gap-8">
              <div className="md:w-1/2">
                <Image
                  src={cuttingData.overview.image}
                  alt={cuttingData.title}
                  width={500}
                  height={300}
                  className="rounded-lg object-cover w-full h-auto"
                />
              </div>
              <div className="md:w-1/2">
                <Body size="base">{cuttingData.overview.description}</Body>
              </div>
            </div>
          </CardContainer>
        </motion.section>

        {cuttingData.sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: index * 0.1 }}
            className="mt-12 sm:mt-16"
          >
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
          </motion.div>
        ))}
      </div>
    </MainLayout>
  );
}
