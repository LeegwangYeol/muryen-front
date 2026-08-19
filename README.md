# muryen-front

무련(武緣) 공식 웹사이트 — 조선 24반 무예를 갑주 입고 대련하는 서울 수련 모임.
《무예도보통지》(1790) 기반의 수련 내용과 사진첩, 입회 안내를 제공한다.

- 운영 주소: https://muryen-front.vercel.app
- 문의 채널: YouTube [@muryeon](https://www.youtube.com/@muryeon)

## 기술 스택

Next.js 15 (App Router) · React 18 · TypeScript · Tailwind CSS · Framer Motion · Radix UI

## 시작하기

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인한다.

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm start` | 빌드 결과 실행 |
| `npm run lint` | ESLint |

## 구조

| 경로 | 내용 |
| --- | --- |
| `app/` | App Router 페이지 (소개·기본기·투로·베기·대련·장비·사진첩 등) |
| `app/component/` | 페이지별 콘텐츠 컴포넌트 |
| `components/layout/` | 전역 레이아웃(내비게이션·푸터·AppShell) |
| `components/chat/` | 챗 위젯(무련봇) UI |
| `lib/photos.ts` | 사진첩 데이터 |
| `lib/contact.ts` | 사이트 메타·연락처·SEO 키워드 |
| `lib/tokki.ts` | 챗 위젯 백엔드 클라이언트 |

## 챗 위젯(무련봇)

사이트 우하단 챗봇은 자체 운영 백엔드(`my-server-test`)의 위젯 API에 직접 붙는다.
페르소나·시스템 프롬프트는 백엔드의 `widget` 테이블(`widgetId: muryen`)에서 관리한다.

기본값이 배포 백엔드를 가리키므로 별도 설정 없이 동작하며, 다른 백엔드로 바꾸려면
`.env`에 아래를 넣는다(`.env.example` 참고).

```bash
NEXT_PUBLIC_TOKKI_API_URL=https://my-server-test.vercel.app
NEXT_PUBLIC_TOKKI_WIDGET_ID=muryen
```

## 배포

`main` 브랜치에 푸시하면 Vercel이 자동 배포한다.
