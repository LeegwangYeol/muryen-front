"use client";

import { motion } from "framer-motion";
import {
  Section,
  SectionHeading,
  SubHeading,
  Body,
  CardContainer,
  Divider,
} from "@/components/ui/typography";

export default function Philosophy() {
  const philosophies = [
    {
      title: "우리는 원리의 깨달음을 추구합니다",
      description:
        "우리는 검과 곤방을 기본으로써 각 무기의 특성과 그에 따른 원리를 깨닫는데 집중합니다. 이를 통해 우리는 자신의 방식대로 무를 발현하고 또 표현할 수 있는 수준을 목표로 잡고 있습니다",
    },
    {
      title: "개인과 단체",
      description:
        "우리는 개개인의 실력을 향상하고 모두의 실력을 통합한 진을 짜고 그 안에서 유기적인 협동을 추구합니다",
    },
    {
      title: "우리는 진행이입니다",
      description:
        "우리는 옛 방식을 따름과 동시에, 새로운 방식을 맞이하여 더 좋은 방향으로의 보완과 개선을 추구합니다",
    },
  ];

  return (
    <Section width="narrow" padding="compact">
      <motion.div
        initial={{ y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-6 sm:mb-8"
      >
        <CardContainer padding="loose" className="text-center">
          <SectionHeading align="center" size="lg">
            <span className="highlight-word">무련</span>이란?
          </SectionHeading>
          <Body size="base" className="max-w-2xl mx-auto">
            <span className="highlight-word">무련</span>은{" "}
            <span className="highlight-word">무예 24반 경당</span>의 사회인
            동아리입니다. 우리는 무예도보통지의 가르침을 기초로 기술의 습득을
            넘어, 이를 어떻게 계승하고 발전시켜 현대의 무예에 적응 및 적용할지를
            고민합니다.
          </Body>
        </CardContainer>
      </motion.div>

      <div className="space-y-6 sm:space-y-8">
        {philosophies.map((philosophy) => (
          <motion.div
            key={philosophy.title}
            initial={{ y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <CardContainer padding="loose" className="text-center">
              <SubHeading align="center" size="lg" className="mb-4 sm:mb-6">
                {philosophy.title}
              </SubHeading>
              <Body size="base" className="max-w-2xl mx-auto">
                {philosophy.description}
              </Body>
              <div className="mt-10 sm:mt-14">
                <Divider align="center" width="md" />
              </div>
            </CardContainer>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
