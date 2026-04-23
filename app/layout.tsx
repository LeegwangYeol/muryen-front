import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
// NOTE: root layout is a Server Component. We cannot use `dynamic(..., { ssr:false })` here.
// VantaBackground itself is a client component, so importing it directly is fine.
import VantaBackground from "./component/vanta-main-background";
import { ThemeProvider } from "./context/theme-context";
import { Providers } from "./providers";
import { AppShell } from "@/components/layout/app-shell";
import { SITE, KEYWORDS, CONTACT } from "@/lib/contact";

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
  alternates: { canonical: "/" },
  icons: {
    icon: "/images/icon/muryeon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
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
        url: "/images/announce/gumiAllone.webp",
        alt: "무련 24반 무예",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | 24반 무예 · 갑주 대련`,
    description: SITE.description,
    images: ["/images/announce/gumiAllone.webp"],
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
    <html lang="ko" className="light" suppressHydrationWarning>
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
        <Script
          id="org-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <Script
          id="website-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        <Script
          id="faq-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
          }}
        />
      </head>
      <body>
        <Providers>
        <ThemeProvider>
          <VantaBackground>
            <AppShell>{children}</AppShell>
          </VantaBackground>
        </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
