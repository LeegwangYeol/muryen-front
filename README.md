# 무련 (武緣, Muryeon) - 웹 프론트엔드

조선 정조 시대 편찬된 『무예도보통지』 24반 무예를 수련하고 연구하는 무예 수련 단체 **무련(武緣)**의 공식 웹사이트 프론트엔드 애플리케이션입니다.

## 주요 기능
- **24반 무예 소개**: 무예도보통지 24기(지상무예 18기 + 마상무예 6기) 인터랙티브 차트 및 상세 정보 제공
- **수련 안내 및 입회 신청**: 수련 장소, 시간, 회비 및 상담 신청
- **수련 일지 & 커뮤니티**: 나의 수련 기록 및 무예 수련 정보 아카이빙
- **다크/라이트 모드 지원**: 사용자 테마 전환 지원

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 결과를 확인할 수 있습니다.

## 빌드 및 검사

```bash
# ESLint 정적 분석
npm run lint

# 프로덕션 빌드
npm run build
```

## 기술 스택
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI / Shadcn UI / Lucide React
- **Data Visualization**: Recharts
