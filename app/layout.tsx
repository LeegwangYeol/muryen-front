import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Noto_Sans_KR, Hahmlet } from "next/font/google";
// NOTE: root layout is a Server Component. We cannot use `dynamic(..., { ssr:false })` here.
// VantaBackground itself is a client component, so importing it directly is fine.
import VantaBackground from "./component/vanta-main-background";
import { ThemeProvider } from "./context/theme-context";
import { Providers } from "./providers";
import { AppShell } from "@/components/layout/app-shell";
import { Analytics } from "./component/analytics";
import { WebVitals } from "./component/web-vitals";
import { SITE, KEYWORDS, CONTACT } from "@/lib/contact";

/**
 * 전역 글자체.
 * 다른 한글 폰트로 바꾸고 싶으면 여기 import만 교체하면 사이트 전체 반영됨.
 *
 * 추천 대안:
 *  - Pretendard       (한국 웹 표준급, 단 google fonts에 없어서 self-host 필요)
 *  - Noto_Serif_KR    (전통적인 진중한 느낌)
 *  - Gowun_Dodum      (부드러운 둥근 산세리프)
 *  - IBM_Plex_Sans_KR (현대적·기업스러움)
 *  - Black_Han_Sans   (디스플레이 전용 — 헤딩에만)
 */
const fontSans = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-sans",
  display: "swap",
});

const fontSerif = Hahmlet({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "武로 緣을 잇다",
    template: `%s | ${SITE.name}`,
  },
  description: "武緣 메인",
  keywords: [...KEYWORDS],
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: `${SITE.name} RSS` }],
    },
  },
  icons: {
    icon: "/images/icon/muryeon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  category: "Sports · Education · Korean Traditional Martial Arts",
  other: {
    // Naver 및 구형 검색 엔진용 보조 메타
    subject: "24반 무예 · 갑주 대련 · 대학경당 계보를 잇는 서울 수련 동호회 무련",
    classification: "Sports, Martial Arts, Education",
    "article:author": SITE.name,
    "article:section": "24반 무예",
  },
  verification: {
    // Google Search Console 인증: https://search.google.com/search-console 에서 발급받은 토큰을 아래에 넣으세요.
    // google: "your-google-site-verification-token-here",
    // Naver 웹마스터: https://searchadvisor.naver.com
    // other: { "naver-site-verification": "your-naver-token-here" },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | 24반 무예 · 갑주 대련 · 대학경당 계보`,
    description: SITE.description,
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "무련 24반 무예 · 갑주 대련",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | 24반 무예 · 갑주 대련`,
    description: SITE.description,
    images: ["/og-image.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  alternateName: [SITE.hanja, SITE.fullName],
  url: SITE.url,
  logo: {
    "@type": "ImageObject",
    url: `${SITE.url}/images/icon/muryeon.ico`,
  },
  image: `${SITE.url}/images/announce/gumiAllone.webp`,
  description: SITE.description,
  sport: [
    "Korean Traditional Martial Arts",
    "24 Banmuye",
    "24반 무예",
    "무예도보통지",
    "갑주 대련",
  ],
  slogan: SITE.slogan,
  keywords: [...KEYWORDS].join(", "),
  areaServed: {
    "@type": "Country",
    name: "South Korea",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.location,
    addressCountry: "KR",
  },
  sameAs: [CONTACT.youtube, CONTACT.instagram].filter(Boolean),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.name,
  alternateName: [SITE.hanja, SITE.fullName],
  description: SITE.description,
  inLanguage: "ko-KR",
  publisher: { "@id": `${SITE.url}/#organization` },
  // Sitelinks Search Box (Google) — 사이트 검색 박스가 검색 결과에 등장할 수 있게
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE.url}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": ["SportsClub", "LocalBusiness"],
  "@id": `${SITE.url}/#localbusiness`,
  name: SITE.name,
  alternateName: [SITE.hanja, SITE.fullName],
  description: SITE.description,
  url: SITE.url,
  logo: `${SITE.url}/images/icon/muryeon.ico`,
  image: [
    `${SITE.url}/images/announce/gumiAllone.webp`,
    `${SITE.url}/images/armour.png`,
    `${SITE.url}/images/sparring.png`,
  ],
  slogan: SITE.slogan,
  sport: [
    "24반 무예",
    "갑주 대련",
    "조선 무예",
    "한국 전통무예",
    "Korean Traditional Martial Arts",
  ],
  keywords: [...KEYWORDS].join(", "),
  isAccessibleForFree: true,
  priceRange: "Free",
  currenciesAccepted: "KRW",
  address: {
    "@type": "PostalAddress",
    addressLocality: "서울특별시",
    addressRegion: "서울",
    addressCountry: "KR",
  },
  areaServed: [
    { "@type": "City", name: "서울" },
    { "@type": "City", name: "Seoul" },
    { "@type": "AdministrativeArea", name: "수도권" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "14:00",
      closes: "18:00",
      description: "토요일 오후 수련",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "09:00",
      closes: "12:00",
      description: "일요일 오전 수련",
    },
  ],
  audience: {
    "@type": "Audience",
    audienceType: "일반 성인 · 숙련도 무관 · 전통무예 관심자",
  },
  knowsAbout: [
    "무예도보통지",
    "24반 무예",
    "갑주 대련",
    "본국검",
    "쌍수도",
    "제독검",
    "월도",
    "장창",
    "대학경당 계보",
  ],
  sameAs: [CONTACT.youtube, CONTACT.instagram].filter(Boolean),
  parentOrganization: { "@id": `${SITE.url}/#organization` },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "무련은 어떤 단체인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "무련은 조선 24반 무예를 갑주 입고 대련하는 서울 수련 동호회입니다. 대학경당 계보를 잇고 있으며, 무예도보통지(1790)에 수록된 24가지 국방무예를 복원·수련합니다.",
      },
    },
    {
      "@type": "Question",
      name: "수련은 언제 어디서 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "서울에서 주말(토요일 오후 2시 또는 일요일 오전)에 수련합니다.",
      },
    },
    {
      "@type": "Question",
      name: "회비가 있나요? 초보자도 참여 가능한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "회비는 없습니다. 숙련도 요구도 없으며 누구나 참여할 수 있는 자율 수련 공동체입니다.",
      },
    },
    {
      "@type": "Question",
      name: "24반 무예란 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "조선 정조 때 『무예도보통지』(1790)에 수록된 24가지 국방무예로, 지상무예 18기와 마상무예 6기로 구성됩니다. 수원 화성 장용영 군사들이 수련한 실전 군영 무예입니다.",
      },
    },
    {
      "@type": "Question",
      name: "갑주 대련이 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "두정갑 방호구를 착용하고 실제 타격이 오가는 실전 대련입니다. 시연 위주의 타 단체들과 달리 무련의 차별화된 수련 방식입니다.",
      },
    },
    {
      "@type": "Question",
      name: "입회는 어떻게 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "현재 YouTube 채널 @muryeon 댓글 또는 메시지로 문의 가능합니다. 오픈채팅방은 준비 중입니다.",
      },
    },
  ],
};

// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`light ${fontSans.variable} ${fontSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.classList.add('theme-' + theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://static.llami.net/widget-v1.css"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE.name} RSS`}
          href="/feed.xml"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/ort.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.19/dist/bundle.min.js"
          strategy="lazyOnload"
        />
        <Script type="module" id="llami-chat-widget" strategy="lazyOnload">
          {`
            import { initialize, run } from "https://static.llami.net/widget-v1.js";
            run("9afddf76-2d21-422c-a4fc-a369fcf21d09");
          `}
        </Script>
        <script
          id="org-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          id="website-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          id="faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <script
          id="localbusiness-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <meta name="naver-site-verification" content="2cce48a339c16bb7335a20dc643ac93bcb8efe9a" />
        <meta name="google-site-verification" content="atTkk_hkH8HFattE-OcHmpSNTwwRphdqaaHZKsuwOuk" />
      </head>
      <body>
        <Providers>
        <ThemeProvider>
          <VantaBackground>
            <AppShell>{children}</AppShell>
          </VantaBackground>
        </ThemeProvider>
        </Providers>
        <Analytics />
        <WebVitals />
      </body>
    </html>
  );
}
