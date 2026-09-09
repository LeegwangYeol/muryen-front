export type PhotoCategory =
  | "갑주 대련"
  | "검술 시범"
  | "대회"
  | "단체"
  | "인물";

export type Photo = {
  src: string;
  alt: string;
  caption: string;
  cat: PhotoCategory;
  /** "lg" = 그리드에서 2x2 큰 카드, 비워두면 일반 1x1 */
  span?: "lg";
  /** 홈 페이지 티저에 노출할지 여부 */
  hero?: boolean;
};

/**
 * 전체 사진 데이터 — /gallery 페이지가 전체를 보여주고
 * 홈 페이지 TrainingGallery 는 hero === true 인 것만 노출.
 */
export const photos: Photo[] = [
  // ─────────────────────────────────────────────────────────
  // 갑주 대련 (한강 다리 아래 액션 시리즈)
  // ─────────────────────────────────────────────────────────
  {
    src: "/images/gallery/galju-spar-01.webp",
    alt: "한강 다리 아래 갑주 검 대련 — 두 명이 검을 맞대고 선 액션 컷",
    caption: "갑주 대련 · 한강",
    cat: "갑주 대련",
    span: "lg",
    hero: true,
  },
  {
    src: "/images/gallery/galju-spar-02.webp",
    alt: "갑주를 입은 두 수련생이 검을 마주 댄 순간",
    caption: "갑주 대련",
    cat: "갑주 대련",
    hero: true,
  },
  {
    src: "/images/gallery/galju-spar-03.webp",
    alt: "갑주 대련 자세 — 한 명이 무릎을 굽혀 낮은 자세",
    caption: "낮은 자세 공방",
    cat: "갑주 대련",
  },
  {
    src: "/images/gallery/galju-spar-04.webp",
    alt: "갑주 대련 — 두 검이 교차하는 순간",
    caption: "교차 공방",
    cat: "갑주 대련",
  },
  {
    src: "/images/gallery/galju-spar-05.webp",
    alt: "갑주 대련 — 검이 부딪치는 격검",
    caption: "격검",
    cat: "갑주 대련",
  },
  {
    src: "/images/gallery/galju-spar-06.webp",
    alt: "갑주 대련 — 거리 조절 중인 두 수련생",
    caption: "거리 조절",
    cat: "갑주 대련",
  },

  // 야간 항만 갑주 (이전 1차)
  {
    src: "/images/photos/galju-spar-1.webp",
    alt: "야간 항만에서의 갑주 대련 — 두 수련생이 검을 들고 마주섬",
    caption: "야간 갑주 대련",
    cat: "갑주 대련",
    hero: true,
  },
  {
    src: "/images/photos/galju-archer.webp",
    alt: "갑주 차림의 수련생이 활시위를 당기는 야간 장면",
    caption: "갑주 + 궁시",
    cat: "갑주 대련",
  },
  {
    src: "/images/photos/galju-solo-night.webp",
    alt: "야간 갑주 차림 단독 — 활을 든 강한 인물 컷",
    caption: "야간 단독",
    cat: "갑주 대련",
  },
  {
    src: "/images/photos/galju-pair-dock.webp",
    alt: "야간 부두 위 갑주 두 명 풀샷",
    caption: "부두 위 두 무사",
    cat: "갑주 대련",
  },

  // ─────────────────────────────────────────────────────────
  // 검술 시범
  // ─────────────────────────────────────────────────────────
  {
    src: "/images/gallery/pattern-demo-01.webp",
    alt: "검술 시범 — 검을 머리 위로 들어올린 자세",
    caption: "올려베기 자세",
    cat: "검술 시범",
    span: "lg",
    hero: true,
  },
  {
    src: "/images/gallery/pattern-demo-02.webp",
    alt: "검술 시범 — 도복 차림으로 정자세",
    caption: "정자세",
    cat: "검술 시범",
  },
  {
    src: "/images/gallery/pattern-demo-03.webp",
    alt: "검술 시범 — 검을 들고 회전",
    caption: "회전 동작",
    cat: "검술 시범",
  },
  {
    src: "/images/gallery/pattern-demo-04.webp",
    alt: "검술 시범 — 보랏빛 도복 + 검을 가슴 앞에",
    caption: "안정된 자세",
    cat: "검술 시범",
  },
  {
    src: "/images/gallery/pattern-demo-05.webp",
    alt: "검술 시범 — 보랏빛 도복으로 검을 들어 올림",
    caption: "들어 올리기",
    cat: "검술 시범",
  },
  {
    src: "/images/gallery/pattern-comp-01.webp",
    alt: "24반 무예 대회 — 검술 시범 자세 1",
    caption: "대회 시범 1",
    cat: "검술 시범",
  },
  {
    src: "/images/gallery/pattern-comp-02.webp",
    alt: "24반 무예 대회 — 검을 가슴 앞으로",
    caption: "대회 시범 2",
    cat: "검술 시범",
  },
  {
    src: "/images/gallery/pattern-comp-03.webp",
    alt: "24반 무예 대회 — 검을 들어 올리는 자세",
    caption: "대회 시범 3",
    cat: "검술 시범",
  },

  // ─────────────────────────────────────────────────────────
  // 대회 / 시연
  // ─────────────────────────────────────────────────────────
  {
    src: "/images/gallery/tournament-01.webp",
    alt: "24반 무예 전국대회 — 다양한 색의 갑주와 도복을 입은 무예인들",
    caption: "전국대회 정렬",
    cat: "대회",
  },
  {
    src: "/images/gallery/tournament-02.webp",
    alt: "24반 무예 대회 입장 — 화려한 갑주 단독",
    caption: "대회 입장",
    cat: "대회",
    span: "lg",
    hero: true,
  },
  {
    src: "/images/gallery/tournament-03.webp",
    alt: "24반 무예 대회 — 빨간색·파란색 한복 단체",
    caption: "대회 정렬 라인업",
    cat: "대회",
  },

  // ─────────────────────────────────────────────────────────
  // 단체
  // ─────────────────────────────────────────────────────────
  {
    src: "/images/gallery/group-sea-01.webp",
    alt: "빨간 한복 4명 단체 — 바다 배경",
    caption: "바다 앞 단체",
    cat: "단체",
    hero: true,
  },
  {
    src: "/images/gallery/group-tent-01.webp",
    alt: "그늘 막사 안에서 빨간 한복 차림 3명",
    caption: "막사 휴식",
    cat: "단체",
  },
  {
    src: "/images/gallery/group-banner.webp",
    alt: "무예 대회 현수막 앞 단체 — 도복 차림",
    caption: "대회 현수막",
    cat: "단체",
  },
  {
    src: "/images/gallery/rest-group.webp",
    alt: "대회장 휴식 — 도복 차림으로 V 사인",
    caption: "대회장 휴식",
    cat: "단체",
  },
  {
    src: "/images/photos/suwon-flag.webp",
    alt: "수원 화성 성벽 위에서 깃발을 들고 선 도복 차림의 수련생들",
    caption: "성벽 위의 깃발",
    cat: "단체",
  },

  // ─────────────────────────────────────────────────────────
  // 인물 포트레이트
  // ─────────────────────────────────────────────────────────
  {
    src: "/images/gallery/portrait-trio.webp",
    alt: "수원 화성을 배경으로 한 갑주 3인 포트레이트",
    caption: "성루 앞 세 사람",
    cat: "인물",
    span: "lg",
  },
  {
    src: "/images/gallery/portrait-01.webp",
    alt: "철릭과 갑주 차림의 인물 포트레이트 — 수원 성벽 배경",
    caption: "철릭 + 갑주 포트레이트",
    cat: "인물",
  },
  {
    src: "/images/photos/archer-stance.webp",
    alt: "수련 자세 — 갑주를 입고 활을 든 정자세",
    caption: "갑주 + 궁시 자세",
    cat: "인물",
  },
];

export const photoCategories: PhotoCategory[] = [
  "갑주 대련",
  "검술 시범",
  "대회",
  "단체",
  "인물",
];
